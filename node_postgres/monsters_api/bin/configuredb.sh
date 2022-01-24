#!/bin/bash

export PGPASSWORD="node_password"

database="monstersdb"

echo "Configuring database: $database"

dropdb -U node_user monstersdb

createdb -U node_user monstersdb

psql -U node_user monstersdb < /workspace/tutorial_postgresql/node_postgres/monsters_api/bin/sql/monsters.sql

echo "$database configured"

