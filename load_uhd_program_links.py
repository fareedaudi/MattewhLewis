import csv
import sys
from app.models import db,Program

UHD_PROGRAM_LINKS_CSV = sys.argv[-1]
UHD_ID = 3
PROG_NAME_KEY = 'program_name'
LINK_KEY = 'link'

reader = csv.DictReader(open(UHD_PROGRAM_LINKS_CSV,'r'))

for row_dict in reader:
    prog_name = row_dict[PROG_NAME_KEY]
    link = row_dict[LINK_KEY]
    program = db.session.query(Program).filter(
        Program.name==prog_name,
        Program.univ_id==UHD_ID
    ).first()
    if(not program):
        print(f'{prog_name} not found!')
        continue
    program.link = link
    print(f'{link} added to {prog_name}')
    db.session.commit()