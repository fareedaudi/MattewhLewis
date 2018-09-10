import csv
from app.models import db,Program,ProgramComponent,ProgramComponentRequirement,CoreRequirement

SLUG_NAME_TABLE = 'data/uhd_slug_name_table.csv'
CORE_REFINEMENT_TABLE = 'data/UHD_core_refinement_data.csv'
UHD_ID = 3

PROGRAM_SLUG_KEY = 'program_slug'
PROGRAM_NAME_KEY = 'program_name'
CORE_DEFAULTS_KEY = 'core_defaults'

def add_and_commit(row_object):
    db.session.add(row_object)
    db.session.commit()

def get_or_create_prog_core_component(prog_id):
    comp_name = "University Core Requirement"
    prog_core_component = db.session.query(ProgramComponent).filter(
        ProgramComponent.name==comp_name,
        ProgramComponent.univ_id==UHD_ID,
        ProgramComponent.prog_id==prog_id
    ).first()
    if(not prog_core_component):
        prog_core_component = ProgramComponent(
            univ_id=UHD_ID,
            prog_id=prog_id,
            name=comp_name,
            hours=42
        )
        add_and_commit(prog_core_component)
    return prog_core_component

def get_or_create_prog_core_requirement(prog_id,prog_comp_id,name,code):
    prog_core_requirement = db.session.query(ProgramComponentRequirement).filter(
        ProgramComponentRequirement.univ_id==UHD_ID,
        ProgramComponentRequirement.prog_id==prog_id,
        ProgramComponentRequirement.prog_comp_id==prog_comp_id,
        ProgramComponentRequirement.name==name,
        ProgramComponentRequirement.code==code
    ).first()
    if(not prog_core_requirement):
        prog_core_requirement = ProgramComponentRequirement(
            univ_id=UHD_ID,
            prog_id=prog_id,
            prog_comp_id=prog_comp_id,
            name=name,
            code=code
        )
        add_and_commit(prog_core_requirement)
    return prog_core_requirement

def create_slug_name_dict():
    slug_name_dict = dict()
    reader = csv.DictReader(open(SLUG_NAME_TABLE,'r'))
    for row_dict in reader:
        program_slug = row_dict[PROGRAM_SLUG_KEY]
        program_name = row_dict[PROGRAM_NAME_KEY]
        slug_name_dict[program_slug] = program_name
    return slug_name_dict

def create_refinement_list_dict():
    slug_name_dict = create_slug_name_dict()
    refinement_list_dict = dict()
    reader = csv.DictReader(open(CORE_REFINEMENT_TABLE,'r'))
    for row_dict in reader:
        refinement_list = list()
        program_slug = row_dict[PROGRAM_SLUG_KEY]
        program_name = slug_name_dict[program_slug]
        core_defaults_string = row_dict[CORE_DEFAULTS_KEY]
        if(core_defaults_string != ''):
            core_defaults_list = core_defaults_string.split(',')
            for course in core_defaults_list:
                rubric,number = course.split(' ')
                refinement_list.append({'rubric':rubric,'number':number})
            refinement_list_dict[program_name] = refinement_list
    return refinement_list_dict



refinement_list_dict=create_refinement_list_dict()

uhd_programs = db.session.query(Program).filter(
    Program.univ_id==UHD_ID
).all()

uhd_core_requirements = db.session.query(CoreRequirement).filter(
    CoreRequirement.univ_id==3
).all()

for program in uhd_programs:
    program_core_component = get_or_create_prog_core_component(program.id)
    for core_req in uhd_core_requirements:
        program_core_requirement = get_or_create_prog_core_requirement(program.id,program_core_component.id,core_req.name,core_req.code)
        program_core_requirement.courses = core_req.courses
        db.session.commit()