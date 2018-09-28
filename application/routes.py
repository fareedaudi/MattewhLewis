from flask import render_template, redirect, url_for, request, json,send_file
from application import application
from application.models import db,University,Program,Course,SJC,User,Core,CoreRequirement,CoreComponent,NewMap,MapRequirement,AssociateDegree,CourseSlot,CourseNote
import json as JSON
from slugify import slugify
from functools import reduce
from pprint import pprint

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
    program_courses = Program.get_courses_by_code(prog_id)
    map_._add_requirements(program_courses)
    map_._add_users(collaborators)

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
    map_to_edit.update_map(map_data)
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
    map_.create_pdf_of_map()
    FILE_PATH = '../report.pdf'
    return send_file(FILE_PATH,attachment_filename="report1.pdf",mimetype="application/pdf")