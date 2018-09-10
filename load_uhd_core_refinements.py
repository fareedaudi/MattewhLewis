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
