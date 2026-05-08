# Marketing Agency App - Development Roadmap & Architecture

## Project Overview
An internal application designed for a marketing agency managing a large volume of multimedia assets securely.
- **Max Users:** 20
- **Storage Need:** ~109 GB (primarily multimedia, plus text/metadata)
- **Key Features:** Close security/authentication, multimedia cloud storage, database for text data, social media scraping capabilities.

---

## Architecture Segmentation (3 Clear Zones)

### 1. UI (Frontend)
The user interface designed for agency staff to manage assets, view scraped data, and administer accounts.
- **Tech Stack:** React (Next.js) or Vue (Nuxt).
- **Features:** Dashboard, Secure Login/RBAC (Role-Based Access Control), Media Viewer, Scraping configuration portal.
- **Security:** JWT-based authentication, strict route guards.

### 2. Backend (API & Workers)
The backend is split into two distinct environments to ensure the application remains fast for users while handling heavy processing tasks in the background. 

- **Tech Stack:** Python (FastAPI). *Python is highly recommended due to its unmatched ecosystem for heavy web scraping and data processing.*

**A. Main API Service (The Intermediary & Traffic Cop)**
- **Purpose:** This is the primary interface for your frontend. It must remain fast and responsive at all times. It should never do heavy lifting (like scraping) directly.
- **Responsibilities:** 
  - Resolves API requests from the frontend (Dashboard queries, User Management).
  - Verifies user authentication and enforces Role-Based Access Control.
  - Generates secure, short-lived "pre-signed URLs" giving users temporary, direct access to view or upload 109GB+ multimedia stored in the cloud (so the API itself isn't bogged down transferring huge files).
  - Receives scraping instructions from the user and pushes them into a task queue for the workers to handle asynchronously.

**B. Worker Environment (The Heavy Lifters)**
- **Purpose:** A completely separate compute environment dedicated solely to background jobs that run over long periods. Separating this from the Main API guarantees the user experience never freezes when a 3-hour scraping task is running.
- **Tools used:** Celery (task manager) paired with Redis (message broker), running headless browsers (Playwright) or parsers.
- **Responsibilities:**
  - Constantly monitors the Redis queue for new tasks scheduled by the Main API.
  - Executes social media scraping workflows (navigating platforms, aggregating texts, downloading posts).
  - Processes and formats scraped data.
  - Automatically saves scraped text securely into the main Database and pushes downloaded media straight into your secure Cloud Storage, then notifies the Main API that the task is complete.

### 3. Databases & Storage
Where data rests securely.
- **Text & Metadata DB:** PostgreSQL. Highly relational, secure, and easily handles text files, configurations, client data, and user roles.
- **Multimedia Storage:** Object Storage like AWS S3, Google Cloud Storage, or Cloudflare R2.
- **Queue/Cache DB:** Redis (to handle background worker task queues for the scrapers).

---

## Workflow Diagram

```mermaid
graph TD
    %% Zone 1: UI
    subgraph Zone 1: UI Frontend
        User[Agency User] -->|HTTPS| Frontend(Next.js Dashboard)
    end

    %% Zone 2: Backend
    subgraph Zone 2: Backend Services
        Frontend <-->|REST/GraphQL/JWT| MainAPI(FastAPI Main Server)
        MainAPI -.->|Queue Jobs| TaskQueue(Redis)
        TaskQueue -.->|Process Jobs| ScrapingWorkers(Celery / Python Scrapers)
        ScrapingWorkers -->|HTTPS/Web| SocialMedia[Social Media Platforms]
    end

    %% Zone 3: Databases & Storage
    subgraph Zone 3: Data & Storage
        MainAPI <-->|SQL/SSL| RDB[(PostgreSQL - Text & Users)]
        MainAPI <-->|Pre-signed URLs| ObjStorage[(AWS S3 - 109GB Multimedia)]
        ScrapingWorkers -->|Save Text Data| RDB
        ScrapingWorkers -->|Save Media| ObjStorage
    end
```

---

## Tech Stack Analysis & Pricing (Monthly Estimate)

| Component | Recommended Tool | Rationale | Estimated Pricing (Monthly) |
| :--- | :--- | :--- | :--- |
| **Frontend Hosting** | Google Firebase Hosting | Excellent security, easy CI/CD, and very generous free tier for low traffic (max 20 users). | $0 |
| **Backend API Hosting**| AWS ECS / DigitalOcean | Dedicated instances for reliable API uptime. | ~$20 - $40 |
| **Worker Environment** | Dedicated EC2 / Droplet| Scraping can be memory/CPU intensive. Separate from API. | ~$20 - $40 |
| **Database** | Supabase, Managed RDS| High security, automated backups for Postgres. | ~$25 - $50 |
| **Object Storage**| AWS S3 / Cloudflare R2 | S3: ~$2.50 for 109GB storage + bandwidth. Cloudflare R2 is slightly cheaper for egress. | ~$5 - $15 |
| **Security/Auth** | Auth0 or AWS Cognito | Managed identity layer, free for < 20 users. | $0 |
| **Task Queue** | Managed Redis / Upstash | Essential for async scraping. | $0 - $10 |
| **Total Estimate** | | | **~$70 - $175 / month** |

---

## Development Roadmap (AI Reference Checklist)

- [ ] **Phase 1: Foundation & Infrastructure**
  - [x] Initialize frontend repository (Next.js/React).
  - [x] Initialize backend repository (FastAPI/Node).
  - [ ] Provision AWS S3 bucket and Database.
  - [ ] Setup Authentication (Cognito/Auth0) for max 20 users.
- [ ] **Phase 2: Backend API & Storage Integration**
  - [ ] Develop database schema for Users, Text records, and Media references.
  - [ ] Implement secure upload/download API endpoints (S3 Pre-signed URLs).
- [ ] **Phase 3: Scraping Engine (Workers)**
  - [ ] Setup Redis and background worker structure (Celery).
  - [ ] Develop initial scraping script for target social media.
  - [ ] Build pipeline to save scraped text to DB and media to S3.
- [ ] **Phase 4: Frontend Development**
  - [ ] Build Authentication UI.
  - [ ] Build Dashboard for text data and media gallery.
  - [ ] Build control panel for scraping jobs (Trigger / Status check).
- [ ] **Phase 5: Security Auditing & Deployment**
  - [ ] Enforce IAM rules, DB access controls, and API rate limiting.
  - [ ] Finalize CI/CD pipeline and launch.

---

## Frontend Changelog & Added Features Summary

**May 2026 - Phase 1 & UI Mockup Phase**

* **May 1, 2026:**
  * **Setup:** Initialized Next.js frontend repository with Tailwind CSS and global styling.
  * **Core Navigation & Views:** Built mockups for Login (`/`), Main Dashboard wrapper (`/dashboard`), Alta form insertion (`/dashboard/alta`), and Propuesta scrolling table (`/dashboard/propuesta`).
  * **Dashboard Modularity:** Created reusable widgets such as `StatsModule` and an interactive `MediaGallery` configured to play MP4 media correctly on user hover.
  * **User Management UI:** Configured a `UserDropdown` element linked to a Tab-based logic settings page (`/dashboard/userdetails`), cleanly alternating between "Profile" and "Settings" parameters, resolving synchronous layout bugs.
  * **Versioning:** Initialized and populated the `AthenasProjectFirst` Git branch.

* **May 4, 2026:**
  * **UX Animations:** Overhauled the Login page button trigger to suspend direct routing, instead firing a highly customized 2200ms pouring whisky glass CSS animation. 
  * Enlarged the glass styling and meticulously placed animated, layered ice cubes to simulate liquid filling up while adhering seamlessly to the established monochromatic black-and-white color palette.
  * **Networking Integration:** Implemented custom Next.js `fetchFromAPI` module routing environment variables to directly contact backend database for full-stack compatibility.
  * **Authentication UX:** Added a text toggle helper ("Show/Hide") on the password property and hardwired frontend login submission state to the backend `/auth/login` endpoint preserving the Bourbon pour animation sequence asynchronously.

* **May 5, 2026:**
  * **System Analytics Dashboard:** Scaffolded a comprehensive metrics view inside the Master Override `/dashboard/admin` layout.
  * **Hardware & Storage Tracking:** Created a 4-column metric grid UI dynamically tracking Database Objects, S3 Cloud Storage limits (featuring a CSS glowing segmented progress bar), Worker Status queues, and FastAPI Latency.
  * **Security Visualization:** Configured an "Active Authentication Sessions" table to monitor distributed JWT lifecycle states, session origin formats, and real-time user uptimes to actively govern concurrency.
  * **User Operations:** Fully activated the internal "Edit User" mechanism bridging `handleUpdateUser` PUT requests through a targeted React UI modal mapping dynamically to local states and Python schemas natively.

* **May 8, 2026:**
  * **System Logs UI:** Engineered a live system logging console interface inside the Master Override settings page (`/dashboard/admin/page.tsx`).
  * **Architectural Simulation:** Hardcoded a full mock readout stream of simulated `logger.py` background events, including FastAPI API intercept formats (`[HTTP]`), Celery worker connections to Redis, background S3 bandwidth capacity `[WARN]` throttling flags, and auth events cleanly structured inside a `.bg-black` monospace terminal window.
  

---

## Backend Changelog & Added Features Summary

**May 2026 - Phase 2 & API Development Phase**

* **May 5, 2026:**
  * **Authentication Upgrade:** Deprecated placeholder mock authentication in favor of active JWT (JSON Web Token) generation (`app/core/security.py`). Cryptographically hashed passwords with `passlib[bcrypt]` and deployed `get_current_user` local token decoding dependencies. Connected real frontend header arrays securely to backend authorization scopes natively.
  * **Infrastructure Setup:** Created `docker-compose.yml` to orchestrate local PostgreSQL 15 and Redis 7 containers. This ensures environment consistency and enables an easy switch between development and production configurations.
  * **Environment Configuration:** Configured Pydantic-based `Settings` (`app/core/config.py`) relying on a `.env` file for managing dynamic `DATABASE_URL` strings and application environments.
  * **API Foundation:** Structured a foundational FastAPI project (`app/main.py`) with SQLAlchemy connection pooling (`app/db/database.py`).
  * **User Operations (CRUD):** 
    * Built SQLAlchemy ORM models (`app/models/user.py`) defining table schema strictly.
    * Configured matching Pydantic schemas (`app/schemas/user.py`) mapping precise request payloads and hiding sensitive attributes in responses.
    * Implemented repository database methods (`app/crud/user.py`) simulating hashed credentials.
    * Wired up RESTful router endpoints (`app/api/endpoints/users.py`) for comprehensive creation, retrieval, updates, and deletion.
  * **CORS Connectivity:** Spliced frontend origins to FastAPI resolving standard React cross-origin fetch rejections.
  * **Authentication Operations:** Scaffolded `/auth/login` protocol, resolving local user requests and throwing proper HTTP 401s for misspellings.
  * **System Bootstrapping:** Drafted `seed_superuser.py` configuration automating baseline DB creation for `mrwizard`.
  * **Logging Service Module:** Orchestrated logging environment conditionals dynamically retaining logs for just 1 day strictly in the `development` deployment layer.
