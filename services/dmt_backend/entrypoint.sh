#!/bin/sh

echo "Waiting for mysql..."

while ! nc -z database 33060; do
    sleep 0.1
done

echo "MySQL started"

uwsgi --http 0.0.0.0:5000 --file /api/run.py --processes 1 --threads 8