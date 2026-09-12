#!/usr/bin/env bash
# ==============================================================================
# AWS EC2 Provisioning Script for FoodHub Delivery Platform
# Tested on Ubuntu 22.04 LTS (t3.medium or t3.large recommended)
# ==============================================================================

set -e

echo "=== 1. Updating System & Installing Essentials ==="
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release git ufw

echo "=== 2. Installing Docker & Docker Compose Plugin ==="
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable Docker without sudo
sudo usermod -aG docker $USER

echo "=== 3. Configuring UFW Firewall ==="
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

echo "=== 4. Setting up FoodHub Application Directory ==="
APP_DIR="/opt/foodhub"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo "=== EC2 Setup Complete! ==="
echo "Next steps:"
echo "1. Clone your repository into $APP_DIR"
echo "2. Copy .env.example to .env and configure AWS RDS, S3, and JWT secrets."
echo "3. Run: docker compose up -d --build"
