import csv
from app.models import db, University, Course, Core, ACGM, SJC

CORE_CURRICULUM_CSV_FILE_LOCATION = './core_curriculum.csv'
with open(CORE_CURRICULUM_CSV_FILE_LOCATION,'r') as CSV_FILE:
    reader = csv.reader(CSV_FILE)
    print(reader.__next__())
    for (comp_code,rubric,number,TCCNS_rubric,TCCNS_number,course_name,SCH,FICE,school_name) in reader:
        comp_code = '0'+str(comp_code)
        FICE = '0'*(6-len(str(FICE)))+str(FICE)
        if(TCCNS_rubric == '.'):
            TCCNS_rubric = ''
        univ = db.session.query(University).filter(University.name==school_name).first()
        if(univ):
            if(not univ.FICE):
                univ.FICE = FICE
                db.session.commit()
        else:
            univ = University(
                name=school_name,
                FICE=FICE
            )
            db.session.add(univ)
            db.session.commit()
            print('University created!')
        course = db.session.query(Course).filter(Course.rubric==rubric).filter(Course.number==number).filter(Course.univ_id==univ.id).first()
        if(not course):
            course = Course(
                name=course_name,
                univ_id=univ.id,
                rubric=rubric,
                number=number,
                hours=SCH
                )
            if(TCCNS_rubric):
                ACGM_course = db.session.query(ACGM).filter(ACGM.rubric==TCCNS_rubric).filter(ACGM.number==TCCNS_number).first()
                if(ACGM_course):
                    course.acgm = True
                    course.acgm_id = ACGM_course.id
                    print('Linked to ACGM!')
                SJC_course = db.session.query(SJC).filter(SJC.rubric==TCCNS_rubric).filter(SJC.number==TCCNS_number).first()
                if(SJC_course):
                    course.sjc = True
                    course.sjc_id = SJC_course.id
                    print('Linked to SJC!')
            db.session.add(course)
            db.session.commit()
            print('Course created!')
        core_ = Core(
            component_code=comp_code,
            univ_id=univ.id,
            course_id=course.id
        )
        db.session.add(core_)
        db.session.commit()
        print('Core created!')
            
        

        