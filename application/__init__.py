from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS

application = Flask(__name__)
application.config.from_object(Config)
login = LoginManager(application)
application.debug = True
CORS(application,expose_headers='Authorization')
db = SQLAlchemy(application)
migrate = Migrate(application,db)

from application import routes, models