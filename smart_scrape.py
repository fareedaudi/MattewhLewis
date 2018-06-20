import csv
from app.models import db,Course,CoreRequirement,CoreComponent,Program

CURRICULUM_FILE = open('./UHCL_program_data.csv','r')
reader = csv.reader(CURRICULUM_FILE)
for degree_name,rubric_number,course_name,component_area,requirement_area,*_ in reader:
    rubric,number = rubric_number.split(" ")
    course = db.session.query(Course).filter(Course.rubric==rubric,Course.number==number).first()
    program = db.session.query(Program).filter(Program.name==degree_name).first()
    if(program):
        if(course):
            core_requirement = db.session.query(CoreRequirement).filter(CoreRequirement.course_id == course.id).first()
            if(core_requirement):
                core_component = db.session.query(CoreComponent).filter(CoreComponent.id == core_requirement.core_component_id).first()
                print(f'{rubric} {number} - {course_name} is a {core_component.name} requirement for {program.name}')
    else:
        print(f'No program: {degree_name}')
