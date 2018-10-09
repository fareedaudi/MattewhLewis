import os
BASEDIR = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY','test-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASEDIR, 'transfer_experiment.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    #DEBUG = False
    DEBUG = int(os.environ.get('FLASK_DEBUG',1))
    GMAIL_ADDRESS = os.environ.get('GMAIL_ADDRESS','')
    GMAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD','')