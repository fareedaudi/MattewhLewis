import sys,os,csv,json

# Monkeypatch: Allow me to import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.abspath(__file__),os.pardir,os.pardir,os.pardir)))
from application.models import db,Program,University,CoreRequirement

UH_ID = 2

with open('./processing/load_uh_programs/affected_cores.json','r') as f:
    affected_data = json.load(f)

UH = University.query.get(UH_ID)

for prog in Program.query.filter_by(univ_id=UH_ID).all():
    for comp in prog.program_components:
        for req in comp.requirements:
            if(str(prog.id) in affected_data):
                print('program in affected_data')
                if(str(req.id) not in affected_data[str(prog.id)]):
                    core_req = CoreRequirement.query.filter_by(univ_id=UH_ID,code=req.code).first()
                    if(not core_req):
                        continue
                    req.courses = core_req.courses.copy()
                    req.name = req.name+' (default core; check website)'
                    db.session.commit()
            else:
                print('program not in affected data')
                core_req = CoreRequirement.query.filter_by(univ_id=UH_ID,code=req.code).first()
                if(not core_req):
                    continue
                req.courses = core_req.courses.copy()
                req.name = req.name+' (default core; check website)'
                db.session.commit()
    