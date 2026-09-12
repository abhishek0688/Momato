# AWS RDS (PostgreSQL) Setup Guide for FoodHub

This guide details how to provision and connect an **AWS RDS PostgreSQL** instance with the FoodHub FastAPI backend.

---

## 1. Create RDS PostgreSQL Instance

1. Navigate to **AWS Console** ➔ **RDS** ➔ **Databases** ➔ **Create Database**.
2. **Database Engine**: Choose **PostgreSQL** (version 15.x or 16.x recommended).
3. **Template**: Choose **Production** or **Free tier** (db.t3.micro / db.t4g.micro for staging).
4. **Settings**:
   - **DB instance identifier**: `foodhub-postgres-prod`
   - **Master username**: `foodhub_admin`
   - **Master password**: Use a strong password (16+ chars).
5. **Instance Configuration**:
   - Class: `db.t3.small` (min 2 vCPU, 2GB RAM).
   - Storage: 20 GiB gp3 (enable storage autoscaling up to 100 GiB).
6. **Connectivity**:
   - **VPC**: Select your application VPC (same as EC2 instance).
   - **Public Access**: No (recommended for maximum security).
   - **VPC Security Group**: Create new `foodhub-rds-sg`.

---

## 2. Configure Security Group Rules

Allow inbound traffic on port `5432` only from the EC2 Security Group:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| PostgreSQL | TCP | 5432 | `sg-xxxxxxxx (EC2-SG)` | FastAPI Backend Access |

---

## 3. Database Connection String

Configure your `DATABASE_URL` in your production `.env` file or AWS Systems Manager Parameter Store:

```env
DATABASE_URL="postgresql://foodhub_admin:<PASSWORD>@foodhub-postgres-prod.xxxxxxxx.us-east-1.rds.amazonaws.com:5432/foodhub_db"
```

---

## 4. Initialization and Migration

Once connected, run the seed script to create initial schema and sample data:

```bash
python -m app.seed
```
