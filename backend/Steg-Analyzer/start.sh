#!/bin/bash

# Initialize the database
echo "Initializing Database..."
python -m intelx.utils.init_db

# Start the rq worker in the background (optional)
if [ "${RQ_ENABLED:-1}" = "1" ]; then
	echo "Starting RQ worker..."
	rq worker default --url ${REDIS_URL:-redis://redis:6379/0} &
else
	echo "RQ worker disabled (RQ_ENABLED=0)"
fi

# Start the web server (Gunicorn is recommended for production over flask run)
echo "Starting Gunicorn server on port 5000..."
WORKERS=${GUNICORN_WORKERS:-1}
exec gunicorn -w ${WORKERS} -b 0.0.0.0:5000 --access-logfile - --error-logfile - --log-level info --capture-output intelx.utils.wsgi:application
