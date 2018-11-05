# -*- coding: utf-8 -*-

"""
SJC Degree Mapping Toolkit
~~~~~~~~~~~~~~~~~~~~~~

:copyright: (c) 2017-2018 by San Jacinto College
:license: unspecificed

This file contains the object models to allow the application to communicate
with the database.

"""
from application import application, db, login
from flask_login import UserMixin
from flask import json
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (JSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from slugify import slugify
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import datetime

env = Environment(loader=FileSystemLoader('./data'))
export_template = env.get_template("map_export_template.html")


@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class University(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250),nullable=False)
    is_university = db.Column(db.Boolean)
    FICE = db.Column(db.String(250))
    SJC_trans_imp = db.Column(db.Integer)
    def get_object(self):
        return {
            'university_id':self.id,
            'university_name':self.name
        }
    @staticmethod
    def get_universities():
        return __class__.query.all()
    def get_name(self):
        return self.name

course_programs = db.Table(
    'course_programs', 
    db.Column('program_id', db.ForeignKey('program.id'), primary_key=True),
    db.Column('course_id', db.ForeignKey('course.id'), primary_key=True)
    )

course_core_requirements = db.Table(
    'course_core_requirements', 
    db.Column('core_requirement_id', db.ForeignKey('core_requirement.id'), primary_key=True),
    db.Column('course_id', db.ForeignKey('course.id'), primary_key=True)
    )

course_program_core_requirements = db.Table(
    'course_program_core_requirements',
    db.Column('course_id',db.ForeignKey('course.id'), primary_key=True),
    db.Column('program_core_requirement_id',db.ForeignKey('program_core_requirement.id'),primary_key=True)
)

programs_sjc_courses = db.Table(
    'programs_sjc_courses', 
    db.Column('program_id', db.ForeignKey('program.id'), primary_key=True),
    db.Column('sjc_course_id', db.ForeignKey('SJC.id'), primary_key=True)
    )

users_new_maps = db.Table(
    'users_new_maps', 
    db.Column('user_id', db.ForeignKey('user.id'), primary_key=True),
    db.Column('map_id', db.ForeignKey('new_map.id'), primary_key=True)
    )

program_component_requirement_courses = db.Table(
    'program_component_requirement_courses',
    db.Column('prog_comp_req_id', db.ForeignKey('program_component_requirement.id'),primary_key=True),
    db.Column('course_id', db.ForeignKey('course.id'), primary_key=True)
)


selected_SJC = db.Table(
    'selected_SJC',
    db.Column('req_id', db.ForeignKey('map_requirement.id'),primary_key=True),
    db.Column('SJC_id', db.ForeignKey('SJC.id'), primary_key=True)
)

choices_SJC = db.Table(
    'choices_SJC',
    db.Column('req_id', db.ForeignKey('map_requirement.id'),primary_key=True),
    db.Column('SJC_id', db.ForeignKey('SJC.id'), primary_key=True)
)

applicable_SJC = db.Table(
    'applicable_SJC',
    db.Column('map_id', db.ForeignKey('new_map.id'),primary_key=True),
    db.Column('SJC_id', db.ForeignKey('SJC.id'), primary_key=True)
)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    name = db.Column(db.String(250),nullable=False)
    rubric = db.Column(db.String(250),nullable=False)
    number = db.Column(db.String(250),nullable=False)
    hours = db.Column(db.Integer, nullable=True)
    acgm = db.Column(db.Boolean, nullable=True)
    acgm_id = db.Column(db.Integer, db.ForeignKey('ACGM.id'))
    sjc = db.Column(db.Boolean, nullable=True)
    sjc_id = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    super_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    university = db.relationship("University", back_populates="courses")
    programs = db.relationship(
        "Program", 
        secondary=course_programs,
        back_populates="courses",)
    core_requirements = db.relationship(
        "CoreRequirement",
        secondary=course_core_requirements,
        back_populates="courses"
    )
    prerequisites = db.relationship("Course",post_update=True)
    program_core_requirements = db.relationship(
        "ProgramCoreRequirement",
        secondary=course_program_core_requirements,
        back_populates="courses"
    )
    program_component_requirement = db.relationship(
        "ProgramComponentRequirement",
        secondary=program_component_requirement_courses,
        back_populates="courses")
    def get_object(self):
        return {
            'id':self.id,
            'rubric':self.rubric,
            'number':self.number,
            'name':self.name,
            'sjc_course':SJC.query.get(self.sjc_id).get_object() if self.sjc else None
        }


University.courses = db.relationship("Course", order_by=Course.id, back_populates="university")

class Program(db.Model):
    __tablename__ = "program"
    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    name = db.Column(db.String(250),nullable=False)
    link = db.Column(db.String(250),nullable=True)
    courses = db.relationship(
        "Course", 
        secondary=course_programs, 
        back_populates="programs")
    sjc_courses = db.relationship(
        "SJC", 
        secondary=programs_sjc_courses, 
        back_populates="programs")
    core_requirements = db.relationship(
        "ProgramCoreRequirement",
        back_populates="program"
    )
    program_components = db.relationship(
        "ProgramComponent",
        back_populates="program"
    )
    def get_object(self):
        return {
            'program_link':self.link,
            'program_id':self.id,
            'program_name':self.name,
            'program_components':[
                prog_comp.get_object() for prog_comp in self.program_components
            ]
        }
    def get_meta_object(self):
        return {
            'program_id':self.id,
            'program_name':self.name
        }
    @staticmethod
    def get_programs_by_univ_id(univ_id):
        return Program.query.filter_by(univ_id=univ_id).all()
    def get_name(self):
        return self.name
    @staticmethod
    def get_courses_by_code(prog_id):
        prog = Program.query.get(prog_id)
        courses_by_code = dict()
        for comp in prog.program_components:
            for req in comp.requirements:
                code = req.code
                if(not code):
                    code='100'
                courses = req.courses.copy()
                courses = [course.get_object() for course in courses]
                courses_by_code[code] = courses_by_code[code] + courses if courses_by_code.get(code) else courses
        return courses_by_code

class ProgramComponent(db.Model):   
    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    prog_id = db.Column(db.Integer, db.ForeignKey('program.id'))
    name = db.Column(db.String(250), nullable=False)
    hours = db.Column(db.Integer)
    requirements = db.relationship(
        "ProgramComponentRequirement",
        back_populates="program_component"
    )
    program = db.relationship(
        "Program",
        back_populates="program_components"
    )
    def get_object(self):
        return {
            'prog_comp_id':self.id,
            'prog_comp_name':self.name,
            'prog_comp_hours':self.hours,
            'requirements':[
                prog_comp_req.get_object() for prog_comp_req in self.requirements
            ]
        }

class ProgramComponentRequirement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    prog_id = db.Column(db.Integer, db.ForeignKey('program.id'))
    prog_comp_id = db.Column(db.Integer, db.ForeignKey('program_component.id'))
    name = db.Column(db.String(250), nullable=False)
    code = db.Column(db.String(250))
    hours = db.Column(db.Integer)
    courses = db.relationship(
        "Course",
        secondary=program_component_requirement_courses,
        back_populates="program_component_requirement"
    )
    program_component = db.relationship(
        "ProgramComponent",
        back_populates="requirements"
    )
    def get_object(self):
        return {
            'prog_comp_req_id':self.id,
            'prog_comp_req_name':self.name,
            'prog_comp_req_hours':self.hours,
            'prog_comp_req_code':self.code,
            'courses':[
                course.get_object() for course in self.courses
            ]
        }

class ProgramCoreRequirement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250))
    code = db.Column(db.String(250))
    prog_id = db.Column(db.Integer(), db.ForeignKey('program.id'))
    program = db.relationship(
        "Program",
        back_populates="core_requirements"
    )
    courses = db.relationship(
        "Course",
        secondary=course_program_core_requirements,
        back_populates="program_core_requirements"
    )

class Core(db.Model): # DEPRECATED.
    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    component_code = db.Column(db.String(250))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    university = db.relationship("University", back_populates="core_courses")

University.core_courses = db.relationship("Core", order_by=Core.component_code, back_populates="university")

class CoreComponent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250))
    hours = db.Column(db.Integer())
    code = db.Column(db.String(250))

class OtherComponent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250))
    hours = db.Column(db.Integer())
    code = db.Column(db.String(250))
    univ_id = db.Column(db.Integer())
    prog_id = db.Column(db.Integer())
    
class CoreRequirement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250))
    univ_id = db.Column(db.Integer, db.ForeignKey(University.id))
    code = db.Column(db.String(250))
    courses = db.relationship(
        "Course", 
        secondary=course_core_requirements, 
        back_populates="core_requirements")
    university = db.relationship("University",back_populates="core_requirements")

University.core_requirements = db.relationship("CoreRequirement",order_by=CoreRequirement.id,back_populates="university")


class ProgramOtherRequirement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    other_component_id = db.Column(db.Integer, db.ForeignKey(OtherComponent.id))
    prog_id = db.Column(db.Integer, db.ForeignKey(Program.id))
    course_id = db.Column(db.Integer,db.ForeignKey(Course.id))


class ACGM(db.Model):
    __tablename__ = "ACGM"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    rubric = db.Column(db.String(250), nullable=False)
    number = db.Column(db.String(250), nullable=False)
    hours = db.Column(db.Integer, nullable=True)
    UHCL_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    SJC_id = db.Column(db.Integer, db.ForeignKey('SJC.id'))


class SJC(db.Model):
    __tablename__ = "SJC"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    rubric = db.Column(db.String(250), nullable=False)
    number = db.Column(db.String(250), nullable=False)
    hours = db.Column(db.Integer, nullable=True)
    UHCL_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    ACGM_id = db.Column(db.Integer, db.ForeignKey('ACGM.id'))
    programs = db.relationship(
        "Program", 
        secondary=programs_sjc_courses,
        back_populates="sjc_courses"
        )
    notes = db.relationship(
        'CourseNote'
    )
    def get_object(self):
        return {
            'id':self.id,
            'rubric':self.rubric,
            'number':self.number,
            'name':self.name,
            'hours':self.hours
        }
    @staticmethod
    def get_all_sjc_courses():
        return __class__.query.all()

class User(UserMixin,db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    new_maps = db.relationship(
        "NewMap",
        secondary=users_new_maps,
        back_populates="users"
    )
    
    def generate_auth_token(self):
        s = Serializer(application.config['SECRET_KEY'])
        return s.dumps({ 'id': self.id })
        
    @staticmethod
    def verify_auth_token(token):
        s = Serializer(application.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            print('Signature expired!')
            return None # valid token, but expired
        except BadSignature:
            print('Bad signature!')
            print(token)
            return None # invalid token
        user = User.query.get(data['id'])
        print(token)
        return user
    def get_email(self):
        return self.email
    @staticmethod
    def get_user_by_email(email):
        user = __class__.query.filter_by(email=email).first()
        return user
    @staticmethod
    def login_user(email,password):
        user = __class__.get_user_by_email(email)
        if(user is None or not user.check_password(password)):
            return None,None
        token = user.generate_auth_token().decode('ascii')
        return user,token
    def get_object(self):
        return {
            'id':self.id,
            'email':self.email
        }

    def set_password(self,password):
        self.password_hash = generate_password_hash(password)

    def check_password(self,password):
        return check_password_hash(self.password_hash,password)

    def __repr__(self):
        return '<User {}>'.format(self.email)


class NewMap(db.Model):
    __tablename__ = "new_map"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    assoc_id = db.Column(db.Integer)
    prog_id = db.Column(db.Integer, db.ForeignKey('program.id'))
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.Integer)
    requirements = db.relationship(
        "MapRequirement",
        back_populates="map_"
    )
    users = db.relationship(
        "User", 
        secondary=users_new_maps,
        back_populates="new_maps"
        )
    applicable_courses = db.relationship(
        "SJC",
        secondary=applicable_SJC
    )
    def _compute_applicability_rating(self):
        total_map_credits = 0
        total_applicable_credits = 0
        applicable_course_ids = set([course.id for course in self.applicable_courses])
        for req in self.requirements:
            default_course_ids = set([course.id for course in req.default_courses])
            if(req.code == 'inst'):
                default_course_ids = applicable_course_ids
            for course_slot in req.course_slots:
                if(course_slot.course_id):
                    sjc_course = SJC.query.get(course_slot.course_id)
                    hours = int(sjc_course.hours)
                    total_map_credits += hours
                if(course_slot.course_id in applicable_course_ids):
                    total_applicable_credits += hours
        if(not total_map_credits):
            return 0
        return 100*total_applicable_credits/total_map_credits
    def get_object(self):
        return {
            'id':self.id,
            'name':self.name,
            'assoc_id':self.assoc_id,
            'assoc_name':AssociateDegree.query.get(self.assoc_id).get_name() if AssociateDegree.query.get(self.assoc_id) else 'No associate degree selected',
            'prog_id':self.prog_id,
            'prog_name':Program.query.get(self.prog_id).get_name(),
            'univ_id':self.univ_id,
            'univ_name':University.query.get(self.univ_id).get_name(),
            'user_id':self.user_id,
            'create_at':self.created_at,
            'users':[user.get_object() for user in self.users],
            'applicable_courses':[course.get_object() for course in self.applicable_courses],
            'requirements':[req.get_object() for req in self.requirements],
            'user_email':User.query.get(self.user_id).email,
            'applicability':round(self._compute_applicability_rating(),1)
        }
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
            'hours':'6'
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
            'hours':'6'
        },
        'trans':{
            'name':'Transfer Path',
            'hours':'12'
        }
    }
    SJC_ids_for_comp_area = [132,37,253]
    def _add_users(self,user_emails):
        user = User.query.get(self.user_id)
        for email in user_emails:
            if(email == user.email):
                continue
            user = db.session.query(User).filter(User.email==email).first()
            if(not user):
                return
            self.users.append(user)
        db.session.commit()
    def _create_new_requirement(self,code,info,program_courses):
        name = info['name']
        hours = info['hours']
        new_req = MapRequirement(
            name=info['name'],
            code = code,
            map_id = self.id,
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
                if(not course_obj['sjc_course']):
                    continue
                sjc_id = course_obj['sjc_course'].get('id')
                if(not sjc_id):
                    continue
                course = SJC.query.get(course_obj['sjc_course']['id'])
                new_req.default_courses.append(course)
        if(code == 'inst'):
            for id in self.SJC_ids_for_comp_area:
                sjc_course = SJC.query.get(id)
                new_req.default_courses.append(sjc_course)
        no_slots = int(hours)//3
        for i in range(no_slots):
            slot_name = slugify(new_req.name)+"-"+str(i)
            slot = CourseSlot(name=slot_name,req_id=new_req.id)
            db.session.add(slot)
        db.session.commit()
        return new_req
    def _add_requirements(self,program_courses):
        consummable_program_courses = program_courses.copy()
        for code,info in NewMap.general_associates_degree.items():
            new_req = self._create_new_requirement(code,info,program_courses)
            self.requirements.append(new_req)
            applicable_courses = consummable_program_courses.pop(code,None) or []
            for course_obj in applicable_courses:
                if(not course_obj['sjc_course']):
                    continue
                sjc_id = course_obj['sjc_course'].get('id')
                if(not sjc_id):
                    continue
                course = db.session.query(SJC).get(course_obj['sjc_course']['id'])
                if(course not in self.applicable_courses):
                    self.applicable_courses.append(course)
        other_courses = []
        for code in consummable_program_courses:
            other_courses += consummable_program_courses[code]
        for course_object in other_courses:
            if(not course_object['sjc_course']):
                continue
            sjc_id = course_object['sjc_course'].get('id')
            if(not sjc_id):
                continue
            course = db.session.query(SJC).get(course_object['sjc_course']['id'])
            if(course not in self.applicable_courses):
                self.applicable_courses.append(course)
        trans_req = MapRequirement.query.filter_by(map_id=self.id,code='trans').first()
        if(not trans_req):
            raise ValueError('Something went wrong finding the trans requiremnet!')
        trans_req.default_courses = self.applicable_courses.copy()
        comp_req = MapRequirement.query.filter_by(map_id=self.id,code='090').first()
        if(not comp_req):
            raise ValueError('Something went wrong finding the comp requiremnet!')
        for code in program_courses:
            for course_obj in program_courses.get(code):
                if code in ['trans','inst','100']:
                    continue
                if(not course_obj['sjc_course']):
                    continue
                sjc_id = course_obj['sjc_course'].get('id')
                if(not sjc_id):
                    continue
                sjc_course = SJC.query.get(sjc_id)
                if(not sjc_course):
                    raise ValueError('Something went wrong finding SJC course!')
                if(sjc_course not in comp_req.default_courses):
                    comp_req.default_courses.append(sjc_course)
        db.session.commit()
    @staticmethod
    def initialize_new_map(name,assoc_id,prog_id,univ_id,user_id,created_at,collaborators):
        self = __init__(
            name=name,
            assoc_id=assoc_id,
            prog_id=prog_id,
            univ_id=univ_id,
            user_id=user_id,
            created_at=created_at
        )
        user = User.query.get(user_id)
        self.users.append(user)
        db.session.add(self)
        db.session.commit()
        program_courses = __class__._get_courses_by_code(prog_id)
        self._add_requirements(program_courses)
        self._add_users(collaborators)
    
    @staticmethod
    def _get_courses_by_code(PROG_ID):
        program = __class__._get_program(PROG_ID)

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
    def _get_program(prog_id):
        program = Program.query.get(prog_id)
        return program.get_object()
    def create_pdf_of_map(self):
        map_dict = self.get_object()
        template_vars = {
            'map_name':map_dict['name'],
            'univ_name':map_dict['univ_name'],
            'prog_name':map_dict['prog_name'],
            'assoc_name':map_dict['assoc_name'],
            'requirements':map_dict['requirements']
        }
        html_out = export_template.render(template_vars)
        file_name = f"report-{self.id}.pdf"
        HTML(string=html_out).write_pdf(f'./reports/{file_name}',stylesheets=["./data/style.css"])
        return file_name
    def update_map(self,map_data):
        self.name = map_data['name']
        requirements_objects = map_data['requirements']
        for req_obj in requirements_objects:
            req = MapRequirement.query.get(req_obj['id'])
            #Update course_slots
            course_slot_objects = req_obj['course_slots']
            for course_slot_obj in course_slot_objects:
                if(not course_slot_obj['id']):
                    course_slot = CourseSlot(
                        req_id=course_slot_obj['req_id'],
                        name=course_slot_obj['name']
                    )
                    db.session.add(course_slot)
                    db.session.commit()
                    course_slot_obj['id'] = course_slot.id
                course_slot = CourseSlot.query.get(course_slot_obj['id'])
                if(not len(course_slot_obj['course'])):
                    course_slot.course_id = None
                    if(course_slot.note):
                        note = course_slot.note[0]
                        db.session.delete(note)
                        db.session.commit()
                    continue
                print(course_slot_obj['course'])
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
                            prog_id = self.prog_id,
                            slot_id = course_slot.id
                        )
                        db.session.add(note)
                        print('Note created!')
        #Update users
        self.users = []
        for new_user_obj in map_data['users']:
            new_user = User.query.get(new_user_obj['id'])
            self.users.append(new_user)
        db.session.commit()
        

class MapRequirement(db.Model):
    __tablename__ = "map_requirement"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    map_id = db.Column(db.Integer,db.ForeignKey('new_map.id'))
    code = db.Column(db.String(255))
    hours = db.Column(db.Integer)
    type = db.Column(db.String(255))
    map_ = db.relationship(
        "NewMap",
        back_populates="requirements"
    )
    selected_courses = db.relationship(
        "SJC",
        secondary=selected_SJC
    )
    default_courses = db.relationship(
        "SJC",
        secondary=choices_SJC
    )
    course_slots = db.relationship(
        "CourseSlot"
    )
    def get_object(self):
        return {
            'id':self.id,
            'name':self.name,
            'map_id':self.map_id,
            'code':self.code,
            'hours':self.hours,
            'default_courses':[course.get_object() for course in self.default_courses],
            'course_slots':[slot.get_object() for slot in self.course_slots]
        }

class CourseSlot(db.Model):
    __tablename__ = "course_slot"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('SJC.id'), nullable=True)
    req_id = db.Column(db.Integer, db.ForeignKey('map_requirement.id'), nullable=False)
    requirement = db.relationship(
        "MapRequirement",
        back_populates="course_slots"
    )
    note = db.relationship(
        "CourseNote"
    )
    def get_object(self):
        return {
            'id':self.id,
            'name':self.name,
            'req_id':self.req_id,
            'course':SJC.query.get(self.course_id).get_object() if self.course_id else {},
            'note':self.note[0].get_object() if self.note else {}
        }

class CourseNote(db.Model):
    __tablename__ = "course_note"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(400))
    applicable = db.Column(db.Integer)
    slot_id = db.Column(db.Integer, db.ForeignKey('course_slot.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('SJC.id'),nullable=False)
    prog_id = db.Column(db.Integer, db.ForeignKey('program.id'),nullable=False)
    def get_object(self):
        return {
            'id':self.id,
            'text':self.text,
            'applicable':self.applicable,
            'slot_id':self.slot_id,
            'course_id':self.course_id,
            'prog_id':self.prog_id
        }


class AssociateDegree(db.Model):
    __tablename__ = "associate_degree"
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(255))
    type_ = db.Column(db.String(255))
    def get_name(self):
        return self.name
    def get_object(self):
        return {
            'id':self.id,
            'name':self.name
        }
