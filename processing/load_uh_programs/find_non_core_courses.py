import sys,os,csv
# Monkeypatch: Allow me to import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir,os.pardir)))

import csv, json
from pprint import pprint
from application.models import db,University,Course


UH_PROGRAM_DATA_URI = './data/UH_program_data_final.csv'
UH_ID = 2


reader = csv.DictReader(open(UH_PROGRAM_DATA_URI),delimiter="|")


def get_university_by_id(id):
    u = University.query.get(id)
    if(not u):
        raise ValueError(f'No such university with id: {UH_ID}')
    return u

def get_course_by_univ_rubric_number(univ_id,rubric,number):
    course = Course.query.filter_by(univ_id=univ_id,rubric=rubric,number=number).first()
    if(not course):
        raise ValueError(f'No core course! {rubric} {number}')
    return course


non_core_courses = []

def get_non_core_courses():
    for row in reader:
        rubric = row['course_rubric']
        number = row['course_number']
        try:
            course = get_course_by_univ_rubric_number(UH_ID,rubric,number)
        except ValueError as v:
            if(rubric+number not in non_core_courses):
                non_core_courses.append(rubric+number)
    pprint(non_core_courses)


get_non_core_courses()

with open('./processing/load_uh_programs/non_core_courses.json','w') as fp:
    json.dump(non_core_courses,fp)
    