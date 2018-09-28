from flask import render_template, redirect, url_for, request, json,send_file
from application import application
from application.models import db,University,Program,Course,SJC,User,Core,CoreRequirement,CoreComponent,NewMap,MapRequirement,AssociateDegree,CourseSlot,CourseNote
import json as JSON
from slugify import slugify
from functools import reduce
from pprint import pprint
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
env = Environment(loader=FileSystemLoader('./data'))
export_template = env.get_template("map_export_template.html")

@application.route('/api/universities',methods=["GET"])
def get_universities():
    return JSON.dumps([univ.get_object() for univ in University.get_universities()])

@application.route('/api/programs_by_university/<int:univ_id>')
def get_programs(univ_id):
    programs = Program.get_programs_by_univ_id(univ_id)
    return JSON.dumps([program.get_meta_object() for program in programs])

@application.route('/api/requirements_by_program/<int:prog_id>')
def requirements_by_program(prog_id):
    return JSON.dumps(Program.query.get(prog_id).get_object())

@application.route('/api/sjc_courses',methods=['GET'])
def sjc_courses():
    return JSON.dumps([crs.get_object() for crs in SJC.get_all_sjc_courses()])

@application.route('/api/login',methods=['POST'])
def login():
    try:
        form_data = JSON.loads(request.data)
        email = form_data['loginEmail']
        password = form_data['loginPassword']
    except:
        return '',400
    user,token = User.login_user(email,password)
    if(not user):
        return '',401
    return JSON.dumps({
        'loggedIn':True,
        'userId':user.id,
        'userEmail':user.email,
        'token':token,
    }),200

@application.route('/api/load_login_data',methods=['POST'])
def load_login_data():
    try:
        user = None
        form_data = json.loads(request.data)
        token = form_data['token']
    except:
        return '',400
    if(token != None):
        user = User.verify_auth_token(token)
    if(not user):
        return json.jsonify({
            'loggedIn':False
        }),401
    token = user.generate_auth_token().decode('ascii')
    return json.jsonify({
        'loggedIn':True,
        'userId':user.id,
        'userEmail':user.email,
        'token':token,
    }),200

@application.route('/api/user_emails',methods=['GET'])
def user_emails():
    users = User.query.all()
    return JSON.dumps([user.get_email() for user in users])

def get_program(prog_id):
    program = Program.query.get(prog_id)
    return program.get_object()

def get_courses_by_code(PROG_ID):
    program = get_program(PROG_ID)

    program_name = program['program_name']
    program_link = program['program_link']
    program_components = program['program_components']

    courses_by_code = dict()

    for comp in program_components:
        reqs = comp['requirements']
        for req in reqs:
            code = req['prog_comp_req_code']
            if(not code):
                code = '100'
            courses = req['courses']
            courses_by_code[code] = courses_by_code[code]+courses if courses_by_code.get(code) else courses
    return courses_by_code


def create_new_requirement(map_id,code,info,program_courses):
    name = info['name']
    hours = info['hours']
    new_req = MapRequirement(
        name=info['name'],
        code = code,
        map_id = map_id,
        hours = info['hours']
    )
    try:
        db.session.add(new_req)
        db.session.commit()
    except:
        pass
    if(code not in ('inst','trans')):
        applicable_courses = program_courses.get(code) or []
        for course_obj in applicable_courses:
            course = db.session.query(SJC).get(course_obj['id'])
            new_req.default_courses.append(course)
    if(code == 'inst'):
        for id in SJC_ids_for_comp_area:
            sjc_course = SJC.query.get(id)
            new_req.default_courses.append(sjc_course)
    no_slots = int(hours)//3
    for i in range(no_slots):
        slot_name = slugify(new_req.name)+"-"+str(i)
        slot = CourseSlot(name=slot_name,req_id=new_req.id)
        db.session.add(slot)
    db.session.commit()
    return new_req

def add_users(map_,user_emails):
    user = User.query.get(map_.user_id)
    for email in user_emails:
        if(email == user.email):
            continue
        user = db.session.query(User).filter(User.email==email).first()
        if(not user):
            return
        map_.users.append(user)
    db.session.commit()

SJC_ids_for_comp_area = [132,37,253]

def add_requirements(map_,program_courses):
    consummable_program_courses = program_courses.copy()
    for code,info in NewMap.general_associates_degree.items():
        new_req = create_new_requirement(map_.id,code,info,program_courses)
        map_.requirements.append(new_req)
        applicable_courses = consummable_program_courses.pop(code,None) or []
        for course_obj in applicable_courses:
            course = db.session.query(SJC).get(course_obj['id'])
            if(course not in map_.applicable_courses):
                map_.applicable_courses.append(course)
    other_courses = []
    for code in consummable_program_courses:
        other_courses += consummable_program_courses[code]
    for course_object in other_courses:
        course = db.session.query(SJC).get(course_object['id'])
        if(course not in map_.applicable_courses):
            map_.applicable_courses.append(course)
    trans_req = MapRequirement.query.filter_by(map_id=map_.id,code='trans').first()
    if(not trans_req):
        raise ValueError('Something went wrong finding the trans requiremnet!')
    trans_req.default_courses = map_.applicable_courses.copy()
    comp_req = MapRequirement.query.filter_by(map_id=map_.id,code='090').first()
    if(not comp_req):
        raise ValueError('Something went wrong finding the comp requiremnet!')
    for code in program_courses:
        for course_obj in program_courses.get(code):
            if code in ['trans','inst','100']:
                continue
            sjc_id = course_obj.get('id')
            if(not sjc_id):
                continue
            sjc_course = SJC.query.get(sjc_id)
            if(not sjc_course):
                raise ValueError('Something went wrong finding SJC course!')
            if(sjc_course not in comp_req.default_courses):
                comp_req.default_courses.append(sjc_course)
    db.session.commit()

def initialize_new_map(name,assoc_id,prog_id,univ_id,user_id,created_at,collaborators):
    map_ = NewMap(
        name=name,
        assoc_id=assoc_id,
        prog_id=prog_id,
        univ_id=univ_id,
        user_id=user_id,
        created_at=created_at
    )
    user = User.query.get(user_id)
    map_.users.append(user)
    db.session.add(map_)
    db.session.commit()
    program_courses = get_courses_by_code(prog_id)
    add_requirements(map_,program_courses)
    add_users(map_,collaborators)

def get_user_from_token(request):
    user = None
    label,token = request.headers['Authorization'].split(' ')
    if(label=="Bearer" and token):
        user = User.verify_auth_token(token)
    return user

def create_new_map(request):
    user = get_user_from_token(request)
    if(not user):
        return 'Error!',401
    form_data = JSON.loads(request.data)
    name=form_data['newMapName']
    assoc_id = form_data['selectedAssociateDegree']
    prog_id = form_data['selectedProgramId']
    univ_id = form_data['selectedUniversityId']
    user_id = user.id
    created_at = ''
    collaborators = form_data['newMapCollaborators']
    initialize_new_map(name,assoc_id,prog_id,univ_id,user_id,created_at,collaborators)
    return 'Success!',200
    

def get_maps_(request):
    user = get_user_from_token(request)
    if(not user):
        return 'Error',401
    user_id = user.id
    user_created_maps = NewMap.query.filter(NewMap.user_id == user.id).all()
    all_maps = NewMap.query.all()
    maps = [map_ for map_ in all_maps if user in map_.users]
    maps_data = JSON.dumps({
        'maps':[map_.get_object() for map_ in maps]   
    })
    return application.response_class(
        response = maps_data,
        status=200,
        mimetype="application/json"
    )
    
def delete_map_(id,request):
    user = get_user_from_token(request)
    if(not user):
        return 'error',401
    map_id = id
    if(not map_id):
        return 'Error',400
    map_to_delete = db.session.query(NewMap).get(map_id)
    if(not map_to_delete):
        return 'Error',404
    try:
        db.session.delete(map_to_delete)
        db.session.commit()
    except:
        return 'Error',500
    return 'Success!',200

def update_map_(id,request):
    # Authenticate
    user = get_user_from_token(request)
    if(not user):
        return 'error',401
    
    #Fetch map to update
    map_to_edit = db.session.query(NewMap).get(id)
    if(not map_to_edit):
        return 'Error',404

    map_data = JSON.loads(request.data)

    # Update name
    new_map_name = map_data['name']
    if(map_to_edit.name != new_map_name):
        map_to_edit.name = new_map_name

    #Update requirements
    requirements_objects = map_data['requirements']
    for req_obj in requirements_objects:
        req = db.session.query(MapRequirement).get(req_obj['id'])
        if(not req):
            return 'Error',500
        
        #Update course_slots
        course_slot_objects = req_obj['course_slots']
        for course_slot_obj in course_slot_objects:
            if(course_slot_obj['course']):
                course_slot = db.session.query(CourseSlot).get(course_slot_obj['id'])
                if(not course_slot):
                    return 'Error',500
                course_id = course_slot_obj['course']['id']
                if(course_slot.course_id != course_id):
                    course_slot.course_id = course_id
                if(course_slot_obj['note']):
                    note_obj = course_slot_obj['note']
                    if(course_slot.note): # Note existed previously; just needs an update.
                        note = course_slot.note[0]
                        note.text = note_obj.get('text') or ''
                        note.applicable = note_obj.get('applicable') or False
                        note.course_id = course_id
                        print('Note updated!')
                    else: # Note did not previously exist; create new note.
                        note = CourseNote(
                            text = note_obj.get('text') or '',
                            applicable = note_obj.get('applicable') or False,
                            course_id = course_id,
                            prog_id = map_to_edit.prog_id,
                            slot_id = course_slot.id
                        )
                        db.session.add(note)
                        print('Note created!')

        #Update users
    map_to_edit.users = []
    for new_user_obj in map_data['users']:
        new_user = db.session.query(User).get(new_user_obj['id'])
        map_to_edit.users.append(new_user)
        
    db.session.commit()
    return '',200
    

maps_handlers = {
    'POST':create_new_map,
    'GET':get_maps_,
    'DELETE':delete_map_,
    'PATCH':update_map_
}

def get_users(request):
    user = get_user_from_token(request)
    if(not user):
        return 'Error',401
    user_data = JSON.dumps({
        'users':[
            {
                'id':user.id,
                'email':user.email
            } for user in db.session.query(User).all()
        ]
    })
    return application.response_class(
        response=user_data,
        status=200,
        mimetype="application/json"
    )

users_handlers = {
    'GET':get_users
}

def create_pdf_of_map(map_,user):
    map_dict = map_.get_object()
    template_vars = {
        'map_name':map_dict['name'],
        'univ_name':map_dict['univ_name'],
        'prog_name':map_dict['prog_name'],
        'assoc_name':map_dict['assoc_name'],
        'requirements':map_dict['requirements']
    }
    html_out = export_template.render(template_vars)
    HTML(string=html_out).write_pdf("report.pdf",stylesheets=["./data/style.css"])
    return None

@application.route('/api/maps',methods=['POST','GET'])
def GET_POST_maps():
    handler = maps_handlers[request.method]
    return handler(request)

@application.route('/api/maps/<int:id>', methods=['DELETE','PATCH'])
def DELETE_PATCH_maps(id):
    handler = maps_handlers[request.method]
    return handler(id,request)

@application.route('/api/users', methods=['GET'])
def GET_users():
    handler = users_handlers[request.method]
    return handler(request)

@application.route('/api/report/<int:map_id>',methods=['GET'])
def get_pdf(map_id):
    user = get_user_from_token(request)
    if not user:
        return 'Error',401
    map_ = NewMap.query.get(map_id)
    if not map:
        return 'Error',404
    create_pdf_of_map(map_,user)
    FILE_PATH = '../report.pdf'
    return send_file(FILE_PATH,attachment_filename="report1.pdf",mimetype="application/pdf")