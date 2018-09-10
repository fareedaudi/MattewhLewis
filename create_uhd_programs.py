import sys
import csv
from pprint import pprint
from app.models import db,Program

SLUG_NAME_TABLE = sys.argv[-2]
CORE_REFINEMENT_TABLE = sys.argv[-1]
PROGRAM_SLUG_KEY = 'program_slug'
PROGRAM_NAME_KEY = 'program_name'
CORE_DEFAULTS_KEY = 'core_defaults'

UNIV_ID = 3

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

pprint(refinement_list_dict)