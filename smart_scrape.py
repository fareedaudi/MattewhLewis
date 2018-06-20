import csv
from app.models import db,Course,CoreRequirement,CoreComponent,Program,ProgramCoreRequirement

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
    if(core_requirement):
        
print(missing_programs)