import csv, json
from pprint import pprint

TCCNS_crosstab_URI = './data/TCCNS_crosstab.csv'

reader = csv.reader(open(TCCNS_crosstab_URI,'r'))

header_row = reader.__next__()

TCCNS_dict = {}
institutions = header_row[3:]
for inst in institutions:
    TCCNS_dict[inst] = {}


reader = csv.DictReader(open(TCCNS_crosstab_URI,'r'))

for row in reader:
    for inst in TCCNS_dict:
        rubric_number = row[inst]
        if(not rubric_number):
            continue
        try:
            rubric,number = rubric_number.strip().split(" ")
        except:
            continue
        if(not TCCNS_dict[inst].get(rubric)):
            TCCNS_dict[inst][rubric]={}
        if(not TCCNS_dict[inst][rubric].get(number)):
            TCCNS_dict[inst][rubric][number] = {}
        acgm_rubric = row['Common Course Prefix']
        acgm_number = row['Common Course Number']
        acgm_name = row['Common Course Title']
        TCCNS_dict[inst][rubric][number]['acgm_course'] = {
            'rubric':acgm_rubric,
            'number':acgm_number,
            'name':acgm_name
        }
        sjc_rubric_number = row['San Jacinto College District']
        if(not sjc_rubric_number):
            continue
        try:
            sjc_rubric,sjc_number = sjc_rubric_number.split(" ")
        except:
            continue
        TCCNS_dict[inst][rubric][number]['sjc_course'] = {
            'rubric':sjc_rubric,
            'number':sjc_number
        }
    
json.dump(TCCNS_dict,open('./data/TCCNS.json','w'))
    
            
            
    
        