import sys,os,csv

# Monkeypatch: Allow me to import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir)))

from app.models import db,AssociateDegree


ID_HEADER = 'assoc_id'
NAME_HEADER = 'assoc_name'
DATA_FROM_STDIN = sys.stdin.read()
READER = csv.DictReader(DATA_FROM_STDIN.splitlines())

for row in READER:
    deg = AssociateDegree(id=row[ID_HEADER],name=row[NAME_HEADER])
    db.session.add(deg)
db.session.commit()