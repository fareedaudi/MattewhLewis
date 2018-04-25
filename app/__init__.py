from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
print(app.config)
login = LoginManager(app)
app.debug = True
CORS(app)
db = SQLAlchemy(app)
migrate = Migrate(app,db)

from app import routes, models