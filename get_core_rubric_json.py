import sys, json
from app.models import db,CoreRequirement

UHD_ID = sys.argv[-1]

uhd_core_requirements = db.session.query(CoreRequirement).filter(
    CoreRequirement.univ_id==UHD_ID
).all()

core_rubric_dict = dict()
for req in uhd_core_requirements:
    for course in req.courses:
        code = core_rubric_dict.get(course.rubric)
        if(not code):
            if('09' not in req.code):
                core_rubric_dict[course.rubric]=req.code


sys.stdout.write(json.dumps(core_rubric_dict))