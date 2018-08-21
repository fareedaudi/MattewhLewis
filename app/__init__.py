from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
login = LoginManager(app)
app.debug = True
CORS(app,expose_headers='Authorization')
db = SQLAlchemy(app)
migrate = Migrate(app,db)

from app import routes, models