import os
import logging
from logging.handlers import TimedRotatingFileHandler
from app.core.config import settings

def setup_logging():
    logger = logging.getLogger("bourbonhub")
    
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        # Standard console output
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

        if settings.ENVIRONMENT == "development":
            # In development, keep file logs retaining only 1 day of logs
            log_dir = "logs"
            os.makedirs(log_dir, exist_ok=True)
            log_file = os.path.join(log_dir, "development.log")
            
            # when="midnight" rotates at midnight, backupCount=1 keeps 1 older file (1 day)
            file_handler = TimedRotatingFileHandler(
                filename=log_file,
                when="midnight",
                interval=1,
                backupCount=1,
                encoding='utf-8'
            )
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
            logger.info("Configured development file logging (1-day retention)")
        else:
            # Production or other environments might have different logging rules
            pass

    return logger

logger = setup_logging()
