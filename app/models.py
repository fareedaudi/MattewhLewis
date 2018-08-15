# -*- coding: utf-8 -*-

"""
SJC Degree Mapping Toolkit
~~~~~~~~~~~~~~~~~~~~~~

:copyright: (c) 2017-2018 by San Jacinto College
:license: unspecificed

This file contains the object models to allow the application to communicate
with the database.

"""
from app import app, db, login
from flask_login import UserMixin
from flask import json
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer
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

components_programs = db.Table(
    'components_programs', 
    db.Column('program_id', db.ForeignKey('program.id'), primary_key=True),
    db.Column('component_id', db.ForeignKey('component.id'), primary_key=True)
    )

components_courses = db.Table(
    'components_courses',
    db.Column('course_id', db.ForeignKey('course.id'), primary_key=True),
    db.Column('component_id', db.ForeignKey('component.id'), primary_key=True)
)

requirements_courses = db.Table(
    'requirements_courses',
    db.Column('course_id', db.ForeignKey('course.id'), primary_key=True),
    db.Column('requirement_id', db.ForeignKey('requirement.id'), primary_key=True)
)

requirements_programs = db.Table(
    'requirements_programs',
    db.Column('program_id', db.ForeignKey('program.id'), primary_key=True),
    db.Column('requirement_id', db.ForeignKey('requirement.id'), primary_key=True)
)

components_requirements = db.Table(
    'components_requirements',
    db.Column('component_id', db.ForeignKey('component.id'), primary_key=True),
    db.Column('requirement_id', db.ForeignKey('requirement.id'), primary_key=True)
)

users_maps = db.Table(
    'users_maps', 
    db.Column('user_id', db.ForeignKey('user.id'), primary_key=True),
    db.Column('map_id', db.ForeignKey('map.id'), primary_key=True)
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
    components = db.relationship(
        "Component", 
        secondary=components_courses,
        back_populates="courses")
    requirements = db.relationship(
        "Requirement",
        secondary=requirements_courses,
        back_populates="courses"
    )
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

    components = db.relationship(
        "Component", 
        secondary=components_programs,
        back_populates="programs"
        )

    requirements = db.relationship(
        "Requirement",
        secondary=requirements_programs,
        back_populates="programs"
    )
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


class Component(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    prog_id = db.Column(db.Integer, db.ForeignKey('program.id'))
    name = db.Column(db.String(250), nullable=False)
    courses = db.relationship(
        "Course", 
        secondary=components_courses, 
        back_populates="components")
    programs = db.relationship(
        "Program",
        secondary=components_programs,
        back_populates="components")
    requirements = db.relationship(
        "Requirement",
        secondary=components_requirements,
        back_populates="components"
    )

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

class Requirement(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    name = db.Column(db.String(250), nullable=False)
    comp_id = db.Column(db.Integer, db.ForeignKey('component.id'))
    courses = db.relationship(
        "Course",
        secondary=requirements_courses,
        back_populates="requirements"
    )
    programs = db.relationship(
        "Program",
        secondary=requirements_programs,
        back_populates="requirements"
    )
    components = db.relationship(
        "Component",
        secondary=components_requirements,
        back_populates="requirements"
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

class User(UserMixin,db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    maps = db.relationship(
        "Map", 
        secondary=users_maps,
        back_populates="users"
        )
    new_maps = db.relationship(
        "NewMap",
        secondary=users_new_maps,
        back_populates="users"
    )
    
    def generate_auth_token(self,expiration=10*60):
        s = Serializer(app.config['SECRET_KEY'])
        return s.dumps({ 'id': self.id })
        
    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token
        user = User.query.get(data['id'])
        return user

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

class AssociateDegree(db.Model):
    __tablename__ = "associate_degree"
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(255))
    type_ = db.Column(db.String(255))

class Map(db.Model):
    __tablename__ = "map"
    id = db.Column(db.Integer, primary_key=True)
    map_name = db.Column(db.String(255), nullable=True)
    assoc_id = db.Column(db.Integer)
    prog_id = db.Column(db.Integer, db.ForeignKey('program.id'))
    univ_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    comm_010_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    comm_010_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    math_020 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    sci_030_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    sci_030_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    phil_040 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    arts_050 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    hist_060_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    hist_060_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    gov_070_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    gov_070_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    soc_080 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    comp_090_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    comp_090_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    oral_090 = db.Column(db.Integer) # Hacky
    phys = db.Column(db.Integer) # and temporary.
    inst_opt_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    inst_opt_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    trans_1 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    trans_2 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    trans_3 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    trans_4 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    trans_5 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
    trans_6 = db.Column(db.Integer, db.ForeignKey('SJC.id'))
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
    component_areas = {
        'Communication (6 hours)':['comm_010_1','comm_010_2'],
        'Mathematics (3 hours)':['math_020'],
        'Life and Physical Sciences (8 hours)':['sci_030_1','sci_030_2'],
        'Language, Philosophy, and Culture (3 hours)':['phil_040'],
        'Creative Arts (3 hours)':['arts_050'],
        'American History (6 hours)':['hist_060_1','hist_060_2'],
        'Government/Political Science (6 hours)':['gov_070_1','gov_070_2'],
        'Social and Behavioral Sciences (3 hours)':['soc_080'],
        'Oral Communication (3 hours)':['oral_090'],
        'Physical Education Activity (1 hour)':['phys'],
        'Institutional Option (6 hours)':['inst_opt_1','inst_opt_2'],
        'Transfer Path (12 hours)':[f'trans_{i}' for i in range(1,5)]
    }
    
    def get_dict(self):
        dict_ = self.__dict__
        dict_.pop('_sa_instance_state',None)
        for key in dict_:
            self.empty_dict[key] = dict_[key]
        return self.empty_dict
    users = db.relationship(
        "User", 
        secondary=users_maps,
        back_populates="maps"
        )