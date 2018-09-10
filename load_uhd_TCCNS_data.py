import csv
import sys
from app.models import db,Course,SJC,ACGM

TCCNS_CSV = sys.argv[-1]
INDEX_OF_UHD_COLUMN = 114
UHD_ID = 3

reader = csv.DictReader(open(TCCNS_CSV,'r'))

for data_dict in reader:
    uhd_course_info = data_dict.get('University of Houston-Downtown')
    if(uhd_course_info):
        uhd_rubric,uhd_number = uhd_course_info.split(' ')
        acgm_rubric,acgm_number = data_dict['Common Course Prefix'],data_dict['Common Course Number']
        uhd_course = db.session.query(Course).filter(
            Course.rubric==uhd_rubric,
            Course.number==uhd_number,
            Course.univ_id==UHD_ID
        ).first()
        if(not uhd_course):
            print(f'No UHD course found?! {uhd_rubric} {uhd_number}')
            continue
        sjc_course = db.session.query(SJC).filter(
            SJC.rubric==acgm_rubric,
            SJC.number==acgm_number
        ).first()
        if(not sjc_course):
            print('No SJC course found?!')
            continue
        acgm_course = db.session.query(ACGM).filter(
            ACGM.rubric==acgm_rubric,
            ACGM.number==acgm_number
        ).first()
        if(not acgm_course):
            print('No ACGM course found?!')
            continue
        uhd_course.sjc = True
        uhd_course.sjc_id = sjc_course.id
        uhd_course.acgm = True
        uhd_course.acgm_id = acgm_course.id
        print(uhd_course.rubric,uhd_course.number,sjc_course.rubric,sjc_course.number)
        db.session.commit()

        

