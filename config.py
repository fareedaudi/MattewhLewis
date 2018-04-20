import os
BASEDIR = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    # SECRET_KEY is not currently in use, but may be necessary later to prevent XSS 
    # attacks if I start using more complicated web forms.
    SECRET_KEY = os.urandom(24)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASEDIR, 'transfer_experiment.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
