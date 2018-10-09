from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS
import logging
from logging.config import dictConfig
from logging.handlers import SMTPHandler
'''
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})
'''

config_object = Config()

GMAIL_ADDRESS = config_object.GMAIL_ADDRESS
GMAIL_PASSWORD = config_object.GMAIL_PASSWORD

mail_handler = SMTPHandler(
    mailhost=("smtp.gmail.com",587),
    fromaddr=GMAIL_ADDRESS,
    toaddrs=['matthew.lewis@sjcd.edu'],
    subject='Application Error',
    credentials=(GMAIL_ADDRESS,GMAIL_PASSWORD),
    secure=()
)
mail_handler.setLevel(logging.ERROR)
mail_handler.setFormatter(logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s'
))

application = Flask(__name__)
application.config.from_object(Config)
application.logger.addHandler(mail_handler)
login = LoginManager(application)
CORS(application,expose_headers='Authorization')
db = SQLAlchemy(application)
migrate = Migrate(application,db)

from application import routes, models