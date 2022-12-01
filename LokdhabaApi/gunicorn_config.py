"""Gunicorn *production* config file"""

import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = "0.0.0.0:5000"
timeout = 60