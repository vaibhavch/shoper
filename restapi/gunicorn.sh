description "Gunicorn application server handling myproject"
start on runlevel [2345]
stop on runlevel [!2345]

respawn
setuid user
setgid www-data
chdir /home

exec gunicorn --workers 3 --bind 0.0.0.0:9000 app.wsgi:application
