import os, sys, json, csv, pprint

# Allow me to import from a directory two levels up.
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir)))

from app.models import db,Program,ProgramComponent,Course

CORE_RUBRIC_DICT = json.load(sys.stdin)
UHD_REFINEMENT_FILE_NAME = sys.argv[-1]
PROGRAM_NAME_INDEX = 0
CORE_DEFAULTS_INDEX = 1
UHD_ID = 3

reader = csv.reader(open(UHD_REFINEMENT_FILE_NAME,'r'))
reader.__next__() # Burn header row

def parse_core_defaults(core_defaults_string):
    core_defaults_list = core_defaults_string.split(',')
    core_defaults = []
    for core_default in core_defaults_list:
        rubric,number = core_default.split(' ')
        core_defaults.append({'rubric':rubric,'number':number})
    return core_defaults

def get_core_requirement_alterations(program_core,core_defaults):
    core_requirement_alterations = dict()
    for course in core_defaults:
        rubric = course['rubric']
        number = course['number']
        code = CORE_RUBRIC_DICT.get(rubric)
        if(not code):
            print(f'No code found for rubric:{rubric}!')
            continue
        core_requirements = [
            requirement for requirement in program_core.requirements if requirement.code==code]
        if(not core_requirements):
            print(f'No requirement found for code: {code}')
        core_requirement = core_requirements[0]
        course = db.session.query(Course).filter(
            Course.rubric==rubric,
            Course.number==number,
            Course.univ_id==UHD_ID
        ).first()
        if(not course):
            print(f'No UHD course found for {rubric} {number}')
            continue
        alterations = core_requirement_alterations.get(core_requirement.id)
        if(not alterations):
            core_requirement_alterations[core_requirement.id] = {
                'requirement':core_requirement,
                'alterations':[course]
            }
        else:
            core_requirement_alterations[core_requirement.id]['alterations'].append(course)
    return core_requirement_alterations



for row in reader:
    program_name = row[PROGRAM_NAME_INDEX]
    core_defaults_string = row[CORE_DEFAULTS_INDEX]
    if(core_defaults_string == ''):
        continue
    core_defaults = parse_core_defaults(core_defaults_string)
    program = db.session.query(Program).filter(
        Program.name==program_name,
        Program.univ_id==UHD_ID
    ).first()
    if(not program):
        print(f'{program_name} not found!')
        continue
    program_core = db.session.query(ProgramComponent).filter(
        ProgramComponent.name=="University Core Requirement",
        ProgramComponent.prog_id==program.id,
        ProgramComponent.univ_id==UHD_ID
    ).first()
    if(not program_core):
        print(f'University Core Requirements for {program.name} not found!')
    core_requirement_alterations = get_core_requirement_alterations(program_core,core_defaults)
    for req_id,alteration in core_requirement_alterations.items():
        core_requirement = alteration['requirement']
        core_requirement.courses = alteration['alterations']
        db.session.commit()

    


        
        

