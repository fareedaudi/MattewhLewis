from app.models import db, Map

map1 = {
    'user_id':1,
    'map_name':'Pre-Geology @ UHCL',
    'prog_id':4,
}

map2 = {
    'user_id':1,
    'map_name':'Pre-Dentistry @ UH',
    'prog_id':6,
}

map3 = {
    'user_id':1,
    'map_name':'Accounting @ UHD',
    'prog_id':1
}

for map in [map1,map2,map3]:
    db.session.add(Map(**map))

db.session.commit()