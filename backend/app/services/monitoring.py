import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings

# Configure basic structured logging
logger = logging.getLogger("foodhub_platform")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('{"time":"%(asctime)s", "level":"%(levelname)s", "message": %(message)s}')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Optionally attach AWS CloudWatch logs via watchtower if configured
try:
    import watchtower
    import boto3
    if (
        settings.AWS_ACCESS_KEY_ID != "mock-aws-access-key" and
        settings.AWS_SECRET_ACCESS_KEY != "mock-aws-secret-key"
    ):
        cw_client = boto3.client(
            "logs",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        cw_handler = watchtower.CloudWatchLogHandler(
            log_group=settings.AWS_CLOUDWATCH_LOG_GROUP,
            boto3_client=cw_client,
        )
        logger.addHandler(cw_handler)
except Exception:
    pass


class CloudWatchMonitoringMiddleware(BaseHTTPMiddleware):
    """Middleware that logs request telemetry compatible with AWS CloudWatch metrics."""
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # Structured log record
        log_payload = (
            f'{{"method": "{request.method}", '
            f'"path": "{request.url.path}", '
            f'"status_code": {response.status_code}, '
            f'"latency_ms": {process_time_ms}}}'
        )
        logger.info(log_payload)
        
        response.headers["X-Process-Time-Ms"] = str(process_time_ms)
        return response
