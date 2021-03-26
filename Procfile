release: python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py migrate --run-syncdb
web: gunicorn backend.wsgi --log-file gunicorn_log.txt