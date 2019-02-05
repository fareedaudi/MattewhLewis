#!/bin/sh

echo "Waiting for mysql..."

while ! nc -z database 33060; do
    sleep 0.1
done

echo "MySQL started"

python run.py