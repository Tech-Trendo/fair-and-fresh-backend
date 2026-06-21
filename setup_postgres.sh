#!/bin/bash
set -e

echo "1. Installing PostgreSQL..."
sudo dnf install -y postgresql-server postgresql-contrib

if [ ! -f /var/lib/pgsql/data/PG_VERSION ]; then
  echo "2. Initializing PostgreSQL Database Cluster..."
  sudo postgresql-setup --initdb
fi

echo "3. Starting and enabling PostgreSQL service..."
sudo systemctl enable --now postgresql

echo "4. Creating PostgreSQL user and database (using peer auth)..."
sudo -u postgres psql -c "CREATE USER faf_user WITH PASSWORD 'faf_password';" || echo "User faf_user may already exist."
sudo -u postgres psql -c "CREATE DATABASE fair_and_fresh OWNER faf_user;" || echo "Database fair_and_fresh may already exist."
sudo -u postgres psql -c "ALTER USER faf_user CREATEDB;"

echo "5. Configuring host TCP connections in pg_hba.conf to use md5..."
# Replace ident with md5 on host lines to allow Prisma/Drizzle to connect with password over localhost TCP
sudo sed -i '/host/s/ident/md5/g' /var/lib/pgsql/data/pg_hba.conf

echo "6. Restarting PostgreSQL to apply connection settings..."
sudo systemctl restart postgresql

echo "🎉 Local PostgreSQL Setup Complete!"
