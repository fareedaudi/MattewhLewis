course = {
    'id': 3,
    'name': 'math!'
}

courses = [course]*3

list_ = {
    k:v for k,v in zip(('program_id','program_name','components'),(course['id'],course['name'],['test' for i in range(10)]))
    }

print(list_)