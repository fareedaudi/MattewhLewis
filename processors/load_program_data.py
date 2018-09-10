import sys
import csv
from app.models import db,Program,ProgramComponent,ProgramComponentRequirement,Course

program_data_file = sys.argv[-2]
UNIV_ID = sys.argv[-1]

reader = csv.DictReader(open(program_data_file,'r'),delimiter='|')

def add_and_commit(row_object):
    db.session.add(row_object)
    db.session.commit()
    return True

def get_or_create_program(name):
    program = db.session.query(Program).filter(
        Program.name==name,
        Program.univ_id==UNIV_ID
        ).first()
    if(not program):
        print('Creating program...')
        program = Program(
            univ_id=UNIV_ID,
            name=name
        )
        add_and_commit(program)
    return program

def get_or_create_component(name,prog_id):
    component = db.session.query(ProgramComponent).filter(
        ProgramComponent.name==name,
        ProgramComponent.prog_id==prog_id,
        ProgramComponent.univ_id==UNIV_ID
        ).first()
    if(not component):
        print('Creating component...')
        component = ProgramComponent(
            name=name,
            prog_id=prog_id,
            univ_id=UNIV_ID
        )
        add_and_commit(component)
    return component

def get_or_create_requirement(name,prog_id,prog_comp_id,code='100'):
    requirement = db.session.query(ProgramComponentRequirement).filter(
        ProgramComponentRequirement.name==name,
        ProgramComponentRequirement.univ_id==UNIV_ID,
        ProgramComponentRequirement.prog_id==prog_id,
        ProgramComponentRequirement.prog_comp_id==prog_comp_id,
        ProgramComponentRequirement.code==code
    ).first()
    if(not requirement):
        requirement = ProgramComponentRequirement(
            name=name,
            univ_id=UNIV_ID,
            prog_id=prog_id,
            prog_comp_id=prog_comp_id,
            code=100
        )
        add_and_commit(component)
    return requirement

def get_or_create_course(rubric,number,name):
    course = db.session.query(Course).filter(
        Course.rubric==rubric,
        Course.number==number,
        Course.univ_id==UNIV_ID
    ).first()
    if(not course):
        print(f'Creating course...')
        course = Course(
            rubric=rubric,
            number=number,
            name=name,
            univ_id=UNIV_ID
        )
        add_and_commit()
    return course

for row in reader:
    program_slug = row['program_slug']
    program_name = row['program_name']
    course_name = row['name']
    course_number = row['number']
    course_rubric = row['rubric']
    component_name = row['component']
    requirement_name = row['requirement']
    program = get_or_create_program(program_name)
    component = get_or_create_component(component_name,program.id)
    requirement = get_or_create_requirement(requirement_name,program.id,component.id)
    if(requirement not in component.requirements):
        component.requirements.append(requirement)
        db.session.commit()
    course = get_or_create_course(course_rubric,course_number,course_name)
    if(course not in requirement.courses):
        requirement.courses.append(course)
        db.session.commit()

    