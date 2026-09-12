# AWS S3 and CloudWatch Configuration Guide

This guide outlines setup for **AWS S3** (restaurant banners and food item photos) and **AWS CloudWatch** (live application performance logs and monitoring).

---

## 1. AWS S3 Bucket Setup

### Step 1: Create Bucket
- **Bucket Name**: `foodhub-restaurant-assets` (or your globally unique name).
- **Region**: Same as EC2 and RDS (e.g., `us-east-1`).
- **Object Ownership**: ACLs enabled.
- **Block Public Access**: Uncheck "Block all public access" to allow publicly viewable food imagery.

### Step 2: Bucket CORS Policy
Under **Permissions** ➔ **Cross-origin resource sharing (CORS)**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## 2. AWS CloudWatch Monitoring

### CloudWatch Log Group
- **Log Group Name**: `/foodhub/api-logs`
- **Retention**: 14 days or 30 days.

### Automated Metrics Monitored
FastAPI's built-in `CloudWatchMonitoringMiddleware` automatically logs:
1. HTTP Method (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).
2. Endpoint URL path.
3. Response HTTP status code (2xx, 4xx, 5xx).
4. Request latency in milliseconds (`latency_ms`).

### Metric Filter Examples
- **HTTP 5xx Server Errors**:
  `{ $.status_code >= 500 }`
- **High Latency Alert (> 1000ms)**:
  `{ $.latency_ms > 1000 }`

---

## 3. Dedicated IAM Policy for App Instance

Attach this policy to the EC2 IAM Instance Profile:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3FoodImagesAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:PutObjectAcl",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::foodhub-restaurant-assets",
        "arn:aws:s3:::foodhub-restaurant-assets/*"
      ]
    },
    {
      "Sid": "CloudWatchLogsAccess",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/foodhub/*"
    }
  ]
}
```
