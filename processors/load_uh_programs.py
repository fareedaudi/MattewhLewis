import os, sys, csv

# Allow me to import from a directory two levels up.
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir)))

from app.models import db,Program

PROGRAM_LINK_FILE = sys.argv[-1]
UH_ID = 2
PROGRAM_NAME_INDEX = 0
PROGRAM_LINK_INDEX = 1

reader = csv.reader(open(PROGRAM_LINK_FILE,'r'),delimiter='|')

for row in reader:
    program_name = row[PROGRAM_NAME_INDEX]
    program_link = row[PROGRAM_LINK_INDEX]
    print(program_name)
    print(program_link)
    program = Program(
        name=program_name,
        univ_id=UH_ID,
        link=program_link
    )
    db.session.add(program)
    db.session.commit()