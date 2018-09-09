import sys,os

# Monkeypatch: Allow me to import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir,os.pardir)))

import csv
from application.models import db,University,Program,ProgramComponent,ProgramComponentRequirement

UH_PROGRAM_LINKS_URI = './data/uh_program_links.csv'
UH_ID = 2
CORE_COMPONENT_NAME = 'University Core Requirements'

reader = csv.reader(open(UH_PROGRAM_LINKS_URI),delimiter="|")

def get_university_by_id(id):
    u = University.query.get(id)
    if(not u):
        raise ValueError(f'No such university with id: {UH_ID}')
    return u

def get_or_create_core_component(prog):
    comp = ProgramComponent.query.filter_by(prog_id=prog.id).first()
    if(not comp):
        print('Creating comp!')
        comp = ProgramComponent(
            univ_id=UH_ID,
            prog_id=prog.id,
            name=CORE_COMPONENT_NAME
            )
        db.session.add(comp)
        db.session.commit()
    return comp

def get_or_create_program_requirement(comp,core_req):
    req = ProgramComponentRequirement.query.filter_by(
        univ_id=UH_ID,
        prog_id=comp.prog_id,
        prog_comp_id=comp.id,
        name=core_req.name,
        code=core_req.code
    ).first()
    if(not req):
        print('creating req!')
        req = ProgramComponentRequirement(
            univ_id=UH_ID,
            prog_id=comp.prog_id,
            prog_comp_id=comp.id,
            name=core_req.name,
            code=core_req.code
        )
        db.session.add(req)
        db.session.commit()
    return req

for row in reader:
    name = row[0]
    prog = Program.query.filter_by(name=name).first()
    comp = get_or_create_core_component(prog)
    univ = get_university_by_id(UH_ID)
    for core_req in univ.core_requirements:
        req = get_or_create_program_requirement(comp,core_req)