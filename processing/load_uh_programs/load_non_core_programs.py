import sys,os,csv
# Monkeypatch: Allow me to import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir,os.pardir)))

import json
from pprint import pprint
from application.models import db,Course,SJC,Program,ProgramComponent,ProgramComponentRequirement

TCCNS_JSON_URI = './data/TCCNS.json'
NON_CORE_COURSES_JSON_URI = './processing/load_uh_programs/non_core_courses.json'
UNIV_NAME = 'University of Houston'
PROGRAM_DATA_URI = './data/UH_program_data_final.csv'
UNIV_ID = 2

UH_course_map = json.load(open(TCCNS_JSON_URI,'r'))[UNIV_NAME]
non_core_courses = set(json.load(open(NON_CORE_COURSES_JSON_URI,'r')))
reader = csv.DictReader(open(PROGRAM_DATA_URI,'r'),delimiter="|")

def get_program(univ_id,name):
    prog = Program.query.filter_by(univ_id=univ_id,name=name).first()
    if(not prog):
        raise ValueError(f'{name} not found in programs.')
    return prog

def get_SJC_course(rubric,number):
    course = SJC.query.filter_by(rubric=rubric,number=number).first()
    if(not course):
        raise ValueError(f'No such SJC course! {rubric} {number}')
    return course

def get_or_create_course(univ_id,rubric,number,name):
    course = Course.query.filter_by(univ_id=UNIV_ID,rubric=rubric,number=number).first()
    if(course):
        return course
    print('Creating course...')
    course = Course(
        univ_id=UNIV_ID,
        name=name,
        rubric=rubric,
        number=number
    )
    try:
        sjc_course = UH_course_map[rubric][number]['sjc_course']
    except:
        print('No SJC course found!')
        course.sjc = False
        db.session.add(course)
        db.session.commit()
        return course
    sjc_rubric = sjc_course['rubric']
    sjc_number = sjc_course['number']
    try:
        sjc_course = get_SJC_course(sjc_rubric,sjc_number)
    except ValueError as v:
        print(v)
        course.SJC = False
        db.session.add(course)
        db.session.commit()
        return course
    course.sjc = True
    course.sjc_id = sjc_course.id
    db.session.add(course)
    db.session.commit()
    return course

def get_or_create_component(univ_id,prog_id,name):
    comp = ProgramComponent.query.filter_by(univ_id=univ_id,prog_id=prog_id,name=name).first()
    if(comp):
        return comp
    print('Creating component...')
    comp = ProgramComponent(
        univ_id=univ_id,
        prog_id=prog_id,
        name=name
    )
    db.session.add(comp)
    db.session.commit()
    return comp

def get_or_create_requirement(univ_id,prog_id,prog_comp_id,name):
    req = ProgramComponentRequirement.query.filter_by(univ_id=univ_id,prog_id=prog_id,prog_comp_id=prog_comp_id,name=name).first()
    if(req):
        return req
    print('Creating requirement...')
    req = ProgramComponentRequirement(
        univ_id=univ_id,
        prog_id=prog_id,
        prog_comp_id=prog_comp_id,
        name=name
    )
    db.session.add(req)
    db.session.commit()
    return req

def load_program_data():
    for row in reader:
        rubric = row['course_rubric']
        number = row['course_number']
        name = row['course_name']
        program_name = row['program_name']
        requirement_name = row['requirement']
        print(requirement_name)
        component_name = row['component']
        if(rubric+number in non_core_courses):
            course = get_or_create_course(UNIV_ID,rubric,number,name)
        prog = get_program(UNIV_ID,program_name)
        comp = get_or_create_component(UNIV_ID,prog.id,component_name)
        req = get_or_create_requirement(UNIV_ID,prog.id,comp.id,requirement_name)
        if(course not in req.courses):
            req.courses.append(course)
            db.session.commit()
load_program_data()