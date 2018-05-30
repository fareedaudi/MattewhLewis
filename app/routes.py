from flask import render_template, redirect, url_for, request, json, session
from sqlalchemy import and_
from app import app
from app.models import db,University,Program,Component,Course,SJC,User,Map
from flask_login import current_user, login_user, logout_user
from flask_restful import Resource,Api
from pprint import pprint
import json as JSON

api = Api(app)

def get_dict(map_):
    empty_dict = {
        'id':'',
        'prog_id':'',
        'user_id':'',
        'comm_010_1':'',
        'comm_010_2':'',
        'math_020':'',
        'sci_030_1':'',
        'sci_030_2':'',
        'phil_040':'',
        'arts_050':'',
        'hist_060_1':'',
        'hist_060_2':'',
        'gov_070_1':'',
        'gov_070_2':'',
        'soc_080':'',
        'comp_090_1':'',
        'comp_090_2':'',
        'inst_opt_1':'',
        'inst_opt_2':'',
        'trans_1':'',
        'trans_2':'',
        'trans_3':'',
        'trans_4':'',
        'trans_5':'',
        'trans_6':''
    }
    dict_ = map_.__dict__
    dict_.pop('_sa_instance_state',None)
    users = dict_.pop('users',[])
    empty_dict['users']= []
    for user in users:
        empty_dict['users'].append(user.id)
    for key in dict_:
        empty_dict[key] = dict_[key]
    return empty_dict


class Universities(Resource):
    def get(self):
        universities = db.session.query(University).all()
        universities_list = [
            {k:v for k,v in zip(
                ('university_id','university_name'),
                (university.id,university.name)
            )} for university in universities
        ]
        pprint(universities_list)
        return universities_list

class ProgramsByUniv(Resource):
    def get(self,univ_id):
        programs = db.session.query(Program).filter_by(univ_id=univ_id).order_by(Program.name)
        return [
            {
                k:v for k,v in zip(
                    ('program_id','program_name'),
                    (program.id,program.name)
                )
            } for program in programs
        ]

class RequirementsByProgram(Resource):
    def get(self,prog_id):
        program = db.session.query(Program).filter_by(id=prog_id).first()
        return {
            k:v for k,v in zip(
                ('program_link',
                'program_id',
                'program_name',
                'components'),
                (program.link,
                program.id,
                program.name,
                [
                    {
                        k:v for k,v in zip(
                            ('component_id',
                            'component_name',
                            'requirements'),
                            (component.id,
                            component.name,
                            [
                                {
                                    k:v for k,v in zip(
                                        ('requirement_id',
                                        'requirement_name',
                                        'courses'),
                                        (requirement.id,
                                        requirement.name,
                                        [
                                            {
                                                k:v for k,v in zip(
                                                    ('course_id',
                                                    'course_rubric',
                                                    'course_number',
                                                    'course_name',
                                                    'sjc_course'),
                                                    (course.id,
                                                    course.rubric,
                                                    course.number,
                                                    course.name,
                                                    {
                                                        k:v for k,v in zip(
                                                            ('sjc_id',
                                                            'sjc_rubric',
                                                            'sjc_number',
                                                            'sjc_name'), 
                                                            (db.session.query(SJC).filter_by(id=course.sjc_id).first().id,
                                                             db.session.query(SJC).filter_by(id=course.sjc_id).first().rubric,
                                                             db.session.query(SJC).filter_by(id=course.sjc_id).first().number,
                                                             db.session.query(SJC).filter_by(id=course.sjc_id).first().name)
                                                        )
                                                    } if course.sjc else None)
                                                )
                                            } for course in requirement.courses
                                        ])
                                    )
                                } for requirement in component.requirements
                            ])
                        )
                    } for component in program.components
                    ]))
          }

class MapsByUserId(Resource):
    def get(self,user_id):
        maps = db.session.query(Map).filter_by(user_id=user_id).all()
        return [get_dict(map_) for map_ in maps]


@app.route('/maps',methods=['GET'])
def maps():
    user_id = request.args.get('userId')
    univ_id = request.args.get('univId')
    if(user_id and univ_id):
        user = db.session.query(User).get(user_id)
        univ_maps = db.session.query(Map).filter(Map.univ_id==univ_id)
        maps = [map_ for map_ in univ_maps if user in map_.users]
        return JSON.dumps([get_dict(map_) for map_ in maps])
    return 'No params',404

@app.route('/maps_by_user',methods=['GET'])
def maps_by_user():
    user_id = request.args.get('userId')
    if(user_id):
        user = db.session.query(User).get(user_id)
        maps = [map_ for map_ in db.session.query(Map).all() if user in map_.users]
        return JSON.dumps([get_dict(map_) for map_ in maps])
    else:
        return 'No params',404

@app.route('/login',methods=['POST'])
def login():
    form_data = json.loads(request.data)
    email = form_data['loginEmail']
    password = form_data['loginPassword']
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return json.jsonify({
            "logged_in":False,
            "email":None}),401
    else:
        all_maps = db.session.query(Map).all()
        user_maps = [map_ for map_ in all_maps if user in map_.users]
        return json.jsonify({
            'loggedIn':True,
            'userId':user.id,
            'userEmail':user.email,
            'token':user.generate_auth_token().decode('ascii'),
    })



@app.route('/load_login_data',methods=['POST'])
def load_login_data():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        all_maps = db.session.query(Map).all()
        user_maps = [map_ for map_ in all_maps if user in map_.users]
        token = user.generate_auth_token().decode('ascii')
        return json.jsonify({
            'loggedIn':True,
            'userId':user.id,
            'userEmail':user.email,
            'token':token,
        })
    else:
        return json.jsonify({
            'loggedIn':False
        })


@app.route('/logout',methods=['GET'])   
def logout():
    return 'check console'


@app.route('/delete_map',methods=['POST'])
def delete_map():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    map_id = form_data['map_id']
    if(token and map_id):
        user = User.verify_auth_token(token)
    if(user):
        map_ = db.session.query(Map).get(map_id)
        db.session.delete(map_)
        db.session.commit()
        return json.jsonify({
            'mapDeleted':True
        })
    else:
        return json.jsonify({
            'mapDeleted':False
        })


@app.route('/create_map',methods=['POST'])
def create_map():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        print('Map workin!')
        map_data = form_data['mapState']
        new_map = Map(
            user_id=user.id,
            univ_id=map_data['selectedUniversityId'],
            map_name=map_data['newMapName'],
            prog_id=map_data['selectedProgramId']
            )
        new_map.users.append(user)
        for collaborator in map_data['newMapCollaborators']:
            coll_user = db.session.query(User).filter(User.email==collaborator)[0]
            new_map.users.append(coll_user)
        db.session.add(new_map)
        db.session.commit()
        return json.jsonify({
            'mapCreated':True
        })
    return '',401

@app.route('/user_emails',methods=['GET'])
def user_emails():
    users = db.session.query(User).all()
    user_emails = [user.email for user in users]
    return JSON.dumps(user_emails)

@app.route('/degree_components',methods=['GET'])
def degree_components():
    components = Map.component_areas
    return JSON.dumps(
        [
            {
                'name':area,
                'fields':[field for field in components[area]]
            } for area in components
        ]
    )

api.add_resource(Universities,'/universities')
api.add_resource(ProgramsByUniv,'/programs_by_university/<int:univ_id>')
api.add_resource(RequirementsByProgram,'/requirements_by_program/<int:prog_id>')

@app.route('/saved_maps_by_user',methods=['POST'])
def saved_maps_by_user():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        if(token != None):
            user = User.verify_auth_token(token)
    if(user):
        all_maps = db.session.query(Map).all()
        user_saved_maps = [appify_map(map_) for map_ in all_maps if user in map_.users]
        return JSON.dumps(user_saved_maps)
    return 'Error!',401

def appify_map(map_):
    components = Map.component_areas
    return {
        'id':map_.id,
        'name':map_.map_name,
        'univ_id':map_.univ_id,
        'user_id':map_.user_id,
        'prog_id':map_.prog_id,
        'components':[
            {
                'comp_name':area,
                'fields':[
                    {
                        'name':field,
                        'course': {
                            'id':get_dict(map_)[field],
                            'name':'',
                            'rubric':'',
                            'number':''
                        }
                        
                    } for field in components[area]
                ]
            } for area in components
        ] 
    }