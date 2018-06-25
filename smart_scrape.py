import csv
from app.models import db,Course,CoreRequirement,CoreComponent,Program,ProgramCoreRequirement,OtherComponent,ProgramOtherRequirement

def get_or_create_other_component(other_component_name,other_component_hours,prog_id):
    other_component = db.session.query(OtherComponent).filter(OtherComponent.name==other_component_name,OtherComponent.prog_id==prog_id).first()
    if(not other_component):
        other_component = OtherComponent(
            name=other_component_name,
            hours=other_component_hours,
            univ_id=univ_id,
            prog_id=prog_id
        )
    return other_component

def add_and_commit(row_object):
    db.session.add(row_object)
    db.session.commit()

CURRICULUM_FILE = open('./UHCL_program_data-csv.csv','r')
missing_programs = set()
univ_id = 1

reader = csv.DictReader(CURRICULUM_FILE)

for dict_ in reader:
    degree_name = dict_['degree_name']
    course_rubric = dict_['course_rubric']
    course_number = dict_['course_number']
    course_name = dict_['course_name']
    other_component_name = dict_['other_component_name']
    other_component_hours = dict_['other_component_hours']
    course = db.session.query(Course).filter(Course.rubric==course_rubric,Course.number==course_number,Course.univ_id==univ_id).first()
    program = db.session.query(Program).filter(Program.name==degree_name,Program.univ_id==univ_id).first()
    if(not program):
        missing_programs.add(degree_name)
        continue
    core_requirement = db.session.query(CoreRequirement).filter(CoreRequirement.course_id==course.id).first()
    if(core_requirement and other_component_name=="University Core Requirements"):
        core_component = db.session.query(CoreComponent).filter(CoreComponent.id==core_requirement.core_component_id).first()
        program_core_requirement = ProgramCoreRequirement(
            core_component_id=core_component.id,
            prog_id=program.id,
            core_requirement_id=core_requirement.id
        )
        add_and_commit(program_core_requirement)
    elif(other_component_name=="University Core Requirements"):
        print('Weird, absent core. Probably an 09X')
    else:
        other_component = get_or_create_other_component(other_component_name,other_component_hours,program.id)
        add_and_commit(other_core_requirement)
        program_other_requirement = ProgramOtherRequirement(
            other_component_id=other_component.id,
            prog_id=program.id,
            course_id=course.id,
        )
        add_and_commit(program_other_requirement)


print(missing_programs)


