from app.models import db,CoreComponent

component_code_map = {
    '010':{
        'name':'Communication',
        'hours':6,
        'code':'010'
    },
    '020':{
        'name':'Mathematics',
        'hours':3,
        'code':'020'
    },
    '030':{
        'name':'Life and Physical Sciences',
        'hours':6,
        'code':'030'
    },
    '040':{
        'name':'Language, Philosphy, and Culture',
        'hours':3,
        'code':'040'
    },
    '050':{
        'name':'Creative Arts',
        'hours':3,
        'code':'050'
    },
    '060':{
        'name':'American History',
        'hours':6,
        'code':'060'
    },
    '070':{
        'name':'Government/Political Science',
        'hours':6,
        'code':'070'
    },
    '080':{
        'name':'Social and Behavioral Sciences',
        'hours':3,
        'code':'080'
    }
}

'''
for code,dict_ in component_code_map.items():
    name = dict_['name']
    hours = dict_['hours']
    core_component = CoreComponent(name=name,hours=hours,code=code)
    db.session.add(core_component)

db.session.commit()
'''

core_component = CoreComponent(
    name="Component Area Option",
    hours=6,
    code='090'
    )

db.session.add(core_component)
db.session.commit()
