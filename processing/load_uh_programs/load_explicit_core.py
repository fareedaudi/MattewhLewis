import sys,os,csv
# Monkeypatch: Allow me to import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir,os.pardir)))

import csv, json
from application.models import db,Program,University,Course,ProgramComponent,ProgramComponentRequirement


UH_PROGRAM_DATA_URI = './data/UH_program_data_final.csv'
UH_ID = 2
CORE_COMPONENT_NAME = 'University Core Requirements'


reader = csv.DictReader(open(UH_PROGRAM_DATA_URI),delimiter="|")

def get_program_by_name(name):
    prog = Program.query.filter_by(name=name).first()
    if(not prog):
        raise ValueError(f'No program by the name "{name}" could be found!')
    return prog

def get_university_by_id(id):
    u = University.query.get(id)
    if(not u):
        raise ValueError(f'No such university with id: {UH_ID}')
    return u

def get_course_by_univ_rubric_number(univ_id,rubric,number):
    course = Course.query.filter_by(univ_id=univ_id,rubric=rubric,number=number).first()
    if(not course):
        raise ValueError(f'No core course! {rubric} {number}')
    return course

def get_or_create_core_component(prog):
    comp = ProgramComponent.query.filter_by(prog_id=prog.id).first()
    if(not comp):
        comp = ProgramComponent(
            univ_id=UH_ID,
            prog_id=prog.id,
            name=CORE_COMPONENT_NAME
            )
        db.session.add(comp)
        db.session.commit()
    return comp

def get_program_core_requirement_by_name(comp,name):
    req = ProgramComponentRequirement.query.filter_by(prog_comp_id=comp.id,name=name).first()
    if(not req):
        raise ValueError('No requirement by this name?')
    return req


programs_with_cores = {}

def parse_program_data_to_core():
    for row in reader:
        rubric = row['course_rubric']
        number = row['course_number']
        program_name = row['program_name']
        requirement_name = row['requirement']
        component_name = row['component']
        try:
            prog = get_program_by_name(program_name)
            univ = get_university_by_id(UH_ID)
            course = get_course_by_univ_rubric_number(UH_ID,rubric,number)
            comp = get_or_create_core_component(prog)
        except ValueError as v:
            # sys.stdout.write(v.__repr__()+'\n')
            continue
        if(not programs_with_cores.get(prog.id)):
            programs_with_cores[prog.id] = {}
        for core_req in univ.core_requirements:
            if(course in core_req.courses):
                req = get_program_core_requirement_by_name(comp,core_req.name)
                if(req.id not in programs_with_cores[prog.id]):
                    programs_with_cores[prog.id][req.id] = {
                        'req_name':req.name,
                        'req_id':req.id
                    }
                if(course not in req.courses):
                    req.courses.append(course)
    with open('./processing/load_uh_programs/affected_cores.json','w') as f:
        json.dump(programs_with_cores,f)
    db.session.commit()


parse_program_data_to_core()
    