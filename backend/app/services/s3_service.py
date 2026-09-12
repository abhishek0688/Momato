import os
import uuid
from typing import Optional
from app.config import settings

# Attempt boto3 import
try:
    import boto3
    from botocore.exceptions import BotoCoreError, ClientError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False

class S3Service:
    def __init__(self):
        self.bucket_name = settings.AWS_S3_BUCKET_NAME
        self.region = settings.AWS_REGION
        self.client = None

        # Check if AWS credentials look configured (non-mock)
        if (
            BOTO3_AVAILABLE and
            settings.AWS_ACCESS_KEY_ID != "mock-aws-access-key" and
            settings.AWS_SECRET_ACCESS_KEY != "mock-aws-secret-key"
        ):
            try:
                self.client = boto3.client(
                    "s3",
                    region_name=self.region,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                )
            except Exception as e:
                print(f"[AWS S3] Init fallback: {e}")

    def upload_file(self, file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        """Uploads a file to AWS S3 or saves locally for development."""
        unique_filename = f"{uuid.uuid4().hex}_{filename}"

        if self.client:
            try:
                self.client.put_object(
                    Bucket=self.bucket_name,
                    Key=f"uploads/{unique_filename}",
                    Body=file_bytes,
                    ContentType=content_type,
                    ACL="public-read"
                )
                return f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/uploads/{unique_filename}"
            except Exception as e:
                print(f"[AWS S3] Upload failed, falling back: {e}")

        # Local fallback simulation: Store in backend/uploads directory
        upload_dir = os.path.join(os.getcwd(), "backend", "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        local_path = os.path.join(upload_dir, unique_filename)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        
        # Return static mount path
        return f"/uploads/{unique_filename}"

s3_service = S3Service()
