#!/bin/bash

# Initialize the database
echo "Initializing Database..."
python -m intelx.utils.init_db

# Start the rq worker in the background
echo "Starting RQ worker..."
rq worker default --url ${REDIS_URL:-redis://redis:6379/0} &

# Start the web server (Gunicorn is recommended for production over flask run)
echo "Starting Gunicorn server on port 5000..."
exec gunicorn -w 8 -b 0.0.0.0:5000 --access-logfile - --error-logfile - --log-level info --capture-output intelx.utils.wsgi:application
