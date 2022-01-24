#!/bin/bash
database="monstersdb"

echo "Configuring database: $database"

dropdb monstersdb

createdb monstersdb

psql monstersdb < /workspace/tutorial_postgresql/node_postgres/monsters_api/bin/sql/monsters.sql

echo "$database configured"

