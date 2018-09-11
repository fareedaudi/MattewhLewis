from flask import render_template, redirect, url_for, request, json, session
from sqlalchemy import and_
from application import application
from application.models import db,University,Program,Component,Course,SJC,User,Map,Core,CoreRequirement,CoreComponent,NewMap,MapRequirement,AssociateDegree,CourseSlot,CourseNote
from flask_login import current_user, login_user, logout_user
from flask_restful import Resource,Api
from slugify import slugify
import json as JSON
from functools import reduce
from pprint import pprint

api = Api(application)

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
        universities = db.session.query(University).order_by(University.name).all()
        universities_list = [
            {k:v for k,v in zip(
                ('university_id','university_name'),
                (university.id,university.name)
            )} for university in universities
        ]
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

@application.route('/reqs_by_program/<int:prog_id>')
def reqs_by_program(prog_id):
    program = db.session.query(Program).get(prog_id)
    return JSON.dumps({
        k:v for k,v in zip(
            ('program_link','program_id','program_name','requirements'),
            (program.link,program.id,program.name,[
                {
                    k:v for k,v in zip(
                        ('requirement_id','requirement_name','requirement_code','courses'),
                        (requirement.id,requirement.name,requirement.code,[
                            {
                                k:v for k,v in zip(
                                    ('course_id','course_rubric','course_number','course_name','sjc_course'),
                                    (course.id,course.rubric,course.number,course.name,{
                                        k:v for k,v in zip(
                                            ('sjc_id','sjc_rubric','sjc_number','sjc_name'),
                                            (db.session.query(SJC).get(course.sjc_id).id,
                                            db.session.query(SJC).get(course.sjc_id).rubric,
                                            db.session.query(SJC).get(course.sjc_id).number,
                                            db.session.query(SJC).get(course.sjc_id).name
                                        ))
                                    } if course.sjc else None)
                                )
                            }
                        for course in requirement.courses])
                    )
                }    
            for requirement in program.core_requirements]))
    })

@application.route('/requirements_by_program/<int:prog_id>')
def requirements_by_program(prog_id):
    program = db.session.query(Program).get(prog_id)
    return JSON.dumps({
        k:v for k,v in zip(
            ('program_link','program_id','program_name','program_components'),
            (program.link,program.id,program.name, [
                {
                    k:v for k,v in zip(
                        ('prog_comp_id','prog_comp_name','prog_comp_hours','requirements'),
                        (prog_comp.id,prog_comp.name,prog_comp.hours,[
                            {
                                k:v for k,v in zip(
                                    ('prog_comp_req_id','prog_comp_req_name','prog_comp_req_hours','prog_comp_req_code','courses'),
                                    (prog_comp_req.id,prog_comp_req.name,prog_comp_req.hours,prog_comp_req.code,[
                                        {
                                            k:v for k,v in zip(
                                                ('course_id','course_rubric','course_number','course_name','sjc_course'),
                                                (course.id,course.rubric,course.number,course.name, {
                                                    k:v for k,v in zip(
                                                        ('sjc_id','sjc_rubric','sjc_number','sjc_name'),
                                                        (db.session.query(SJC).get(course.sjc_id).id,
                                                        db.session.query(SJC).get(course.sjc_id).rubric,
                                                        db.session.query(SJC).get(course.sjc_id).number,
                                                        db.session.query(SJC).get(course.sjc_id).name
                                                        )
                                                    )
                                                 } if course.sjc else None )
                                            )
                                        } for course in prog_comp_req.courses
                                    ])
                                )
                            } for prog_comp_req in prog_comp.requirements
                        ])
                    )
                } for prog_comp in program.program_components
            ])
        )
    })

class MapsByUserId(Resource):
    def get(self,user_id):
        maps = db.session.query(Map).filter_by(user_id=user_id).all()
        return [get_dict(map_) for map_ in maps]



@application.route('/maps_by_user',methods=['GET'])
def maps_by_user():
    user_id = request.args.get('userId')
    if(user_id):
        user = db.session.query(User).get(user_id)
        maps = [map_ for map_ in db.session.query(Map).all() if user in map_.users]
        return JSON.dumps([get_dict(map_) for map_ in maps])
    else:
        return 'No params',404

@application.route('/sjc_courses',methods=['GET'])
def sjc_courses():
    sjc_courses_objects = db.session.query(SJC).all()
    return JSON.dumps([get_object_dict(map_) for map_ in sjc_courses_objects])

@application.route('/login',methods=['POST'])
def login():
    form_data = json.loads(request.data)
    email = form_data['loginEmail']
    password = form_data['loginPassword']
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return json.jsonify({
            "logged_in":False,
            "email":None}),401
    all_maps = db.session.query(Map).all()
    user_maps = [map_ for map_ in all_maps if user in map_.users]
    token = user.generate_auth_token().decode('ascii')
    return json.jsonify({
        'loggedIn':True,
        'userId':user.id,
        'userEmail':user.email,
        'token':token,
})



@application.route('/load_login_data',methods=['POST'])
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


@application.route('/logout',methods=['GET'])   
def logout():
    return 'check console'


@application.route('/delete_map',methods=['POST'])
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


@application.route('/create_map',methods=['POST'])
def create_map():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        map_data = form_data['mapState']
        new_map = Map(
            user_id=user.id,
            univ_id=map_data['selectedUniversityId'],
            map_name=map_data['newMapName'],
            prog_id=map_data['selectedProgramId'],
            assoc_id=map_data['selectedAssociateDegree']
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

@application.route('/update_collaborators',methods=['POST'])
def update_collaborators():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        map_id = form_data['map_id']
        newMapCollaborators = form_data['newMapCollaborators']
        map_ = db.session.query(Map).get(map_id)
        for old_collaborator in map_.users:
            if (old_collaborator != user) and (old_collaborator.email not in newMapCollaborators):
                map_.users.remove(old_collaborator)
        for email in newMapCollaborators:
            collaborator = db.session.query(User).filter(User.email==email).first()
            if collaborator not in map_.users:
                map_.users.append(collaborator)
        db.session.commit()
        return json.jsonify({
            'collaboratorsUpdated':True
        })
    return '',401
            
@application.route('/save_map',methods=['POST'])
def save_map():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        map_data = form_data['mapData']
        map_id = map_data['id']
        map_ = db.session.query(Map).get(map_id)
        if(map_):
            map_name = map_data['name']
            component_areas = map_data['componentAreas']
            if(map_.map_name != map_name):
                map_.map_name=map_name
                db.session.commit()
            for field,course_id in component_areas.items():
                if(course_id != -1):
                    setattr(map_,field,course_id)
                    db.session.commit()
                else:
                    pass
            return json.jsonify({
                'mapSaved':True
            })
    else:
        return '',401

@application.route('/user_emails',methods=['GET'])
def user_emails():
    users = db.session.query(User).all()
    user_emails = [user.email for user in users]
    return JSON.dumps(user_emails)

@application.route('/degree_components',methods=['GET'])
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

@application.route('/saved_maps_by_user',methods=['POST'])
def saved_maps_by_user():
    user = None
    form_data = json.loads(request.data)
    token = form_data['token']
    if(token != None):
        user = User.verify_auth_token(token)
    if(user):
        all_maps = db.session.query(Map).all()
        user_saved_maps = [appify_map(map_) for map_ in all_maps if user in map_.users]
        return JSON.dumps(user_saved_maps)
    return 'Error!',401

def appify_map(map_):
    components = Map.component_areas
    univ_name = db.session.query(University).get(map_.univ_id).name
    prog_name = db.session.query(Program).get(map_.prog_id).name
    return {
        'id':map_.id,
        'name':map_.map_name,
        'univ_id':map_.univ_id,
        'univ_name':univ_name,
        'user_id':map_.user_id,
        'prog_id':map_.prog_id,
        'assoc_id':map_.assoc_id,
        'prog_name':prog_name,
        'users':[
            {
                'id':id,
                'email':db.session.query(User).get(int(id)).email
            } for id in get_dict(map_)['users']
        ],
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

@application.route('/get_core/<int:univ_id>')
def get_core(univ_id):
    core = {}
    univ = db.session.query(University).get(univ_id)
    if(not univ):
        return 'Error!',404
    core_requirements = db.session.query(CoreRequirement).filter(CoreRequirement.univ_id==univ_id).all()
    return JSON.dumps([
        {
            k:v for k,v in zip(
                ('core_req_id','core_req_name','core_req_univ_id','core_req_code','courses'),
                (core_req.id,core_req.name,core_req.univ_id,core_req.code,[
                    {
                        k:v for k,v in zip(
                            ('course_id','course_rubric','course_number','course_name','sjc_course'),
                            (course.id,course.rubric,course.number,course.name,{
                                        k:v for k,v in zip(
                                            ('sjc_id','sjc_rubric','sjc_number','sjc_name'),
                                            (db.session.query(SJC).get(course.sjc_id).id,
                                            db.session.query(SJC).get(course.sjc_id).rubric,
                                            db.session.query(SJC).get(course.sjc_id).number,
                                            db.session.query(SJC).get(course.sjc_id).name
                                        ))
                                    } if course.sjc else None)
                        )
                    } for course in core_req.courses
                ])
            ) for cor_req in core_requirements
        } for core_req in core_requirements
    ])

def courseify(course):
    course_dict = {
        'id':course.id,
        'rubric':course.rubric,
        'number':course.number,
        'name':course.name,
        'hours':course.hours
    }
    sjc = {}
    if(course.sjc_id):
        SJC_course = db.session.query(SJC).get(course.sjc_id)
        sjc = {
            'sjc_id':SJC_course.id,
            'sjc_name':SJC_course.name,
            'sjc_rubric':SJC_course.rubric,
            'sjc_number':SJC_course.number,
            'sjc_hours':SJC_course.hours
        }
    course_dict['sjc_course'] = sjc
    return course_dict


def add_requirement(acc,nextItem): # No longer in use.
    core_component_id = nextItem.id
    component_details = get_component_details(core_component_id)
    code = component_details['code']
    if(code not in acc):
        acc[code] = {**component_details,'courses':[]}
    course_details = get_course_details(nextItem.course_id)
    acc[code]['courses'].append(course_details)
    return acc


def get_component_details(core_component_id): # No longer in use
    core_component = db.session.query(CoreComponent).filter(CoreComponent.id==core_component_id).first()
    return get_object_dict(core_component)

def get_course_details(course_id):
    course = db.session.query(Course).filter(Course.id==course_id).first()
    return get_object_dict(course)

def get_object_dict(sqlalchemy_object):
    dict_ = sqlalchemy_object.__dict__
    dict_.pop('_sa_instance_state',None)
    return dict_


general_associates_degree = {
    '010':{
        'name':'Communication',
        'hours':'6'
    },
    '020':{
        'name':'Mathematics',
        'hours':'3'
    },
    '030':{
        'name':'Life and Physical Sciences',
        'hours':'8'
    },
    '040':{
        'name':'Language, Philosophy, and Culture',
        'hours':'3'
    },
    '050':{
        'name':'Creative Arts',
        'hours':'3'
    },
    '060':{
        'name':'American History',
        'hours':'6'
    },
    '070':{
        'name':'Government/Political Science',
        'hours':'6'
    },
    '080':{
        'name':'Social and Behavioral Sciences',
        'hours':'3'
    },
    'inst':{
        'name':'Institutional Option',
        'hours':'6'
    },
    '090':{
        'name':'Component Area Option',
        'hours':'4'
    },
    'trans':{
        'name':'Transfer Path',
        'hours':'12'
    }
}

def get_program(prog_id):
    program = db.session.query(Program).get(prog_id)
    return {
        k:v for k,v in zip(
            ('program_link','program_id','program_name','program_components'),
            (program.link,program.id,program.name, [
                {
                    k:v for k,v in zip(
                        ('prog_comp_id','prog_comp_name','prog_comp_hours','requirements'),
                        (prog_comp.id,prog_comp.name,prog_comp.hours,[
                            {
                                k:v for k,v in zip(
                                    ('prog_comp_req_id','prog_comp_req_name','prog_comp_req_hours','prog_comp_req_code','courses'),
                                    (prog_comp_req.id,prog_comp_req.name,prog_comp_req.hours,prog_comp_req.code,[
                                        {
                                            k:v for k,v in zip(
                                                ('sjc_id','sjc_rubric','sjc_number','sjc_name'),
                                                (
                                                    db.session.query(SJC).get(course.sjc_id).id,
                                                    db.session.query(SJC).get(course.sjc_id).rubric,
                                                    db.session.query(SJC).get(course.sjc_id).number,
                                                    db.session.query(SJC).get(course.sjc_id).name
                                                )
                                            )
                                        } for course in prog_comp_req.courses if course.sjc
                                    ])
                                )
                            } for prog_comp_req in prog_comp.requirements
                        ])
                    )
                } for prog_comp in program.program_components
            ])
        )
    }


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
    pprint(courses_by_code)
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
    if(code not in ('inst','090','trans')):
        applicable_courses = program_courses.get(code) or []
        for course_obj in applicable_courses:
            course = db.session.query(SJC).get(course_obj['sjc_id'])
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
    for code,info in general_associates_degree.items():
        new_req = create_new_requirement(map_.id,code,info,program_courses)
        map_.requirements.append(new_req)
        applicable_courses = program_courses.get(code) or []
        for course_obj in applicable_courses:
            course = db.session.query(SJC).get(course_obj['sjc_id'])
            if(course not in map_.applicable_courses):
                map_.applicable_courses.append(course)
    other_courses = program_courses.get('100') or []
    for course_object in other_courses:
        course = db.session.query(SJC).get(course_object['sjc_id'])
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
            sjc_id = course_obj.get('sjc_id')
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
        'maps':[
            {
                k:v for k,v in zip(
                    (
                        'id',
                        'name',
                        'assoc_id',
                        'assoc_name',
                        'prog_id',
                        'prog_name',
                        'univ_id',
                        'univ_name',
                        'user_id',
                        'create_at',
                        'users',
                        'applicable_courses',
                        'requirements',
                        'users'
                        ),
                    (
                        map_.id,
                        map_.name,
                        map_.assoc_id,
                        db.session.query(AssociateDegree).get(map_.assoc_id).name,
                        map_.prog_id,
                        db.session.query(Program).get(map_.prog_id).name,
                        map_.univ_id,
                        db.session.query(University).get(map_.univ_id).name,
                        map_.user_id,
                        map_.created_at,
                        [
                            {
                                k:v for k,v in zip(
                                    ('id','email'),
                                    (user.id,user.email)
                                )
                            }
                        for user in map_.users],
                        [
                            {
                                k:v for k,v in zip(
                                    ('id','rubric','name','number','hours'),
                                    (course.id,course.rubric,course.number,course.name,course.hours)
                                )
                            }
                        for course in map_.applicable_courses
                        ],
                        [
                        {
                            k:v for k,v in zip(
                                (
                                    'id',
                                    'name',
                                    'map_id',
                                    'code',
                                    'hours',
                                    'default_courses',
                                    'course_slots'
                                ),
                                (
                                    req.id,
                                    req.name,
                                    req.map_id,
                                    req.code,
                                    req.hours,
                                    [
                                        {
                                            k:v for k,v in zip(
                                                ('id','rubric','name','number','hours'),
                                                (course.id,course.rubric,course.name,course.number,course.hours)
                                            )
                                        }
                                    for course in req.default_courses
                                    ],
                                    [
                                        {
                                            k:v for k,v in zip(
                                                ('id','name','req_id','course','note'),
                                                (slot.id,slot.name,slot.req_id,
                                                {
                                                    'id':db.session.query(SJC).get(slot.course_id).id,
                                                    'name':db.session.query(SJC).get(slot.course_id).name,
                                                    'rubric':db.session.query(SJC).get(slot.course_id).rubric,
                                                    'number':db.session.query(SJC).get(slot.course_id).number,
                                                    'hours':db.session.query(SJC).get(slot.course_id).hours
                                                } if slot.course_id else {},
                                                {
                                                    'id':slot.note[0].id,
                                                    'text':slot.note[0].text,
                                                    'applicable':slot.note[0].applicable,
                                                    'slot_id':slot.note[0].slot_id,
                                                    'course_id':slot.note[0].course_id,
                                                    'prog_id':slot.note[0].prog_id
                                                } if slot.note else {}
                                                )
                                            )
                                        }
                                    for slot in req.course_slots],
                                )
                            )
                        }
                    for req in map_.requirements],
                    [
                        {   
                            'id':user.id,
                            'email':user.email
                        } for user in map_.users
                    ]+[{'id':user.id,'email':user.email}])
                )
            }
        for map_ in maps]
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