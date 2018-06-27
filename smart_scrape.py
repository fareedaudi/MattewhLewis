import csv
from app.models import db,Course,CoreRequirement,CoreComponent,Program,ProgramCoreRequirement,OtherComponent,ProgramOtherRequirement

def get_or_create_prog_core_req(prog_id,code,name):
    prog_core_reqs = db.session.query(ProgramCoreRequirement).filter(ProgramCoreRequirement.prog_id==prog_id,ProgramCoreRequirement.code==code).all()
    prog_core_req = list(filter(lambda req:req.name==name,prog_core_reqs))
    if(not prog_core_req):
        prog_core_req = ProgramCoreRequirement(
            name=name,
            code=code,
            prog_id=prog_id
        )
        db.session.add(prog_core_req)
        db.session.commit()
    else:
        prog_core_req = prog_core_req[0]
    return prog_core_req

def add_and_commit(row_object):
    db.session.add(row_object)
    db.session.commit()

CURRICULUM_FILE = open('./UHCL_program_data-csv.csv','r')
missing_programs = set()
univ_id = 1
all_core_requirements = db.session.query(CoreRequirement).filter(CoreRequirement.univ_id==univ_id).all()

reader = csv.DictReader(CURRICULUM_FILE)

for dict_ in reader:
    degree_name = dict_['degree_name'] # Accounting B.S.
    course_rubric = dict_['course_rubric'] # ACCT
    course_number = dict_['course_number'] # 2301
    course_name = dict_['course_name']  # Principles of... 
    other_component_name = dict_['other_component_name'] # College Core Requirements
    other_component_hours = dict_['other_component_hours'] # ''
    course = db.session.query(Course).filter(Course.rubric==course_rubric,Course.number==course_number,Course.univ_id==univ_id).first()
    program = db.session.query(Program).filter(Program.name==degree_name,Program.univ_id==univ_id).first()
    if(not program):
        missing_programs.add(degree_name)
        continue
    core_requirements = list(filter(lambda x:course in x.courses,all_core_requirements))
    if(core_requirements):
        for req in core_requirements:
            if(req.name==''):
                req.name=other_component_name
            prog_core_req = get_or_create_prog_core_req(program.id,req.code,req.name)
            prog_core_req.courses.append(course)
            print(f'Core course {course.rubric} {course.number} added the program core for {program.name}')
    else:
        prog_core_req = get_or_create_prog_core_req(program.id,'',other_component_name)
        prog_core_req.courses.append(course)
        print(f'Non core course {course.rubric} {course.number} added to program for {program.name}')
            
