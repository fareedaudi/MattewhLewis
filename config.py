import os
BASEDIR = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = 'Shhhh.'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASEDIR, 'transfer_experiment.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
