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
        return [get_dict(map) for map in maps]

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
    print(type(user.id))
    return json.jsonify({
        'loggedIn':True,
        'userId':user.id,
        'userEmail':user.email,
        'token':user.generate_auth_token().decode('ascii')
    })


@app.route('/load_login_data',methods=['POST'])
def load_login_data():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        return json.jsonify({
            'loggedIn':True,
            'userId':user.id,
            'userEmail':user.email,
            'token':token
        })
    else:
        return json.jsonify({
            'loggedIn':False
        })


@app.route('/logout',methods=['GET'])   
def logout():
    return 'check console'

api.add_resource(Universities,'/universities')
api.add_resource(ProgramsByUniv,'/programs_by_university/<int:univ_id>')
api.add_resource(RequirementsByProgram,'/requirements_by_program/<int:prog_id>')
api.add_resource(MapsByUserId,'/maps_by_user_id/<int:user_id>')