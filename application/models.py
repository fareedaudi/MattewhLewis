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
            'course_id':self.id,
            'course_rubric':self.rubric,
            'course_number':self.number,
            'course_name':self.name,
            'sjc_course':SJC.query.get(self.sjc_id).get_object() if self.sjc else None
        }


University.courses = db.relationship("Course", order_by=Course.id, back_populates="university")


class Program(db.Model):

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
    def get_object(self):
        return {
            'id':self.id,
            'name':self.name,
            'assoc_id':self.assoc_id,
            'assoc_name':AssociateDegree.query.get(self.assoc_id).get_name(),
            'prog_id':self.prog_id,
            'prog_name':Program.query.get(self.prog_id).get_name(),
            'univ_id':self.univ_id,
            'univ_name':University.query.get(self.univ_id).get_name(),
            'user_id':self.user_id,
            'create_at':self.created_at,
            'users':[user.get_object() for user in self.users],
            'applicable_courses':[course.get_object() for course in self.applicable_courses],
            'requirements':[req.get_object() for req in self.requirements]
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
            'hours':'6'
        },
        'trans':{
            'name':'Transfer Path',
            'hours':'12'
        }
    }
    

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
