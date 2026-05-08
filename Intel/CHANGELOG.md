# Project Changelog

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