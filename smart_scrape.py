import csv
from app.models import db,Course,CoreRequirement,CoreComponent,Program,ProgramCoreRequirement,OtherComponent,ProgramOtherRequirement,ProgramComponent,ProgramComponentRequirement

seen_core_courses = {}

def add_and_commit(row_object):
    db.session.add(row_object)
    db.session.commit()

def get_or_create_prog_comp(univ_id,prog_id,name,component_hours):
    prog_comp = db.session.query(ProgramComponent).filter(
        ProgramComponent.univ_id==univ_id,
        ProgramComponent.prog_id==prog_id,
        ProgramComponent.name==name
        ).first()
    if(not prog_comp):
        prog_comp = ProgramComponent(
            univ_id=univ_id,
            prog_id=prog_id,
            name=name,
            hours=component_hours
        )
        add_and_commit(prog_comp)
    return prog_comp


def get_or_create_prog_comp_req_from_code(univ_id,prog_id,prog_comp_id,name,code,hours):
    code_name_map = {
        '010':'Communication',
        '020':'Mathematics',
        '030':'Life and Physical Sciences',
        '040':'Language, Philosophy and Culture',
        '050':'Creative Arts',
        '060':'American History',
        '070':'Government/Political Science',
        '080':'Social and Behavioral Sciences',
        '090':'Component Area Option'
    }
    new_name = code_name_map[code] if (code in code_name_map) else 'Component Area Option'
    new_code = code if (code in code_name_map) else '090'
    prog_comp_req = db.session.query(ProgramComponentRequirement).filter(
        ProgramComponentRequirement.univ_id==univ_id,
        ProgramComponentRequirement.prog_id==prog_id,
        ProgramComponentRequirement.prog_comp_id==prog_comp_id,
        ProgramComponentRequirement.code==code
    ).first()
    if(not prog_comp_req):
        prog_comp_req = ProgramComponentRequirement(
            univ_id=univ_id,
            prog_id=prog_id,
            prog_comp_id=prog_comp_id,
            name=new_name,
            code=new_code,
            hours=hours
        )
        add_and_commit(prog_comp_req)
    return prog_comp_req


def get_or_create_prog_comp_req_from_name(univ_id,prog_id,prog_comp_id,name,code,hours):
    new_name,new_code = name,'100'
    prog_comp_req = db.session.query(ProgramComponentRequirement).filter(
        ProgramComponentRequirement.univ_id==univ_id,
        ProgramComponentRequirement.prog_id==prog_id,
        ProgramComponentRequirement.prog_comp_id==prog_comp_id,
        ProgramComponentRequirement.name==name
    ).first()
    if(not prog_comp_req):
        prog_comp_req = ProgramComponentRequirement(
            univ_id=univ_id,
            prog_id=prog_id,
            prog_comp_id=prog_comp_id,
            name=new_name,
            code=new_code,
            hours=hours
        )
        add_and_commit(prog_comp_req)
    return prog_comp_req


def get_or_create_prog_comp_req(univ_id,prog_id,course_id,prog_comp_id,name,code,hours):
    code_dict = seen_core_courses.get(prog_id)
    if(code_dict):
        seen_courses = code_dict.get(code)
        if(seen_courses):
            course_seen = course_id in seen_courses
            if(course_seen):
                prog_comp_req = get_or_create_prog_comp_req_from_name(univ_id,prog_id,prog_comp_id,name,code,hours)
            else:
                seen_courses.append(course_id)
                prog_comp_req = get_or_create_prog_comp_req_from_code(univ_id,prog_id,prog_comp_id,name,code,hours)
        else:
            prog_comp_req = get_or_create_prog_comp_req_from_code(univ_id,prog_id,prog_comp_id,name,code,hours)
            code_dict[code] = [course_id]
    else:
        prog_comp_req = get_or_create_prog_comp_req_from_code(univ_id,prog_id,prog_comp_id,name,code,hours)
        seen_core_courses[prog_id] = {
            code:[course_id]
        }
    print(seen_core_courses)
    return prog_comp_req

CURRICULUM_FILE = open('./UHCL_program_data_reqs.csv','r')
missing_programs = set()
univ_id = 1
all_core_requirements = db.session.query(CoreRequirement).filter(CoreRequirement.univ_id==univ_id).all()

reader = csv.DictReader(CURRICULUM_FILE)

for dict_ in reader:
    degree_name = dict_['degree_name'] # Accounting B.S.
    course_rubric = dict_['course_rubric'] # ACCT
    course_number = dict_['course_number'] # 2301
    course_name = dict_['course_name']  # Principles of... 
    component_name = dict_['component_name'] # University Core Requirements
    component_hours = dict_['component_hours'] # 42 hours
    requirement_name = dict_['requirement_name'] # Communication
    requirement_hours = dict_['requirement_hours'] # 6 hours
    course = db.session.query(Course).filter(Course.rubric==course_rubric,Course.number==course_number,Course.univ_id==univ_id).first()
    program = db.session.query(Program).filter(Program.name==degree_name,Program.univ_id==univ_id).first()
    if(not program):
        missing_programs.add(degree_name)
        continue

    # Get or create program component 
    prog_comp = get_or_create_prog_comp(univ_id,program.id,component_name,component_hours)

    # Determine if course belongs to core requirements
    core_requirements = list(filter(lambda x:course in x.courses,all_core_requirements)) # Find all core reqs containing this course
    if(core_requirements): # Is this a core requirement?
        for req in core_requirements:
            prog_comp_req = get_or_create_prog_comp_req(univ_id,program.id,course.id,prog_comp.id,requirement_name,req.code,requirement_hours)
            prog_comp.requirements.append(prog_comp_req)
            prog_comp_req.courses.append(course)
            print(f'Core course {course.rubric} {course.number} added the program core for {program.name}')
    else:
        prog_comp_req = get_or_create_prog_comp_req_from_name(univ_id,program.id,prog_comp.id,requirement_name,req.code,requirement_hours)
        prog_comp.requirements.append(prog_comp_req)
        prog_comp_req.courses.append(course)
        print(f'Non core course {course.rubric} {course.number} added to program for {program.name}')
            