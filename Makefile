UHD_ID = 3
UH_ID = 2

stops_general_make:
	touch test_file

load_uhd_program_data:
	source env/bin/activate; \
	python load_uhd_program_data.py data/uhd_program_data.csv;

load_uhd_TCCNS_data:
	source env/bin/activate; \
	python load_uhd_TCCNS_data.py data/TCCNS_crosstab.csv

load_uhd_program_links:
	source env/bin/activate; \
	python load_uhd_program_links.py data/uhd_name_link_table.csv;

load_uhd_core_requirements:
	source env/bin/activate; \
	python load_uhd_core_data.py;

data/uhd_program_name_core_defaults.csv: data/uhd_slug_name_table.csv data/UHD_core_refinement_data.csv
	source env/bin/activate; \
	csvjoin data/uhd_slug_name_table.csv data/UHD_core_refinement_data.csv -c "program_slug" | \
	csvcut -c"program_name","core_defaults" | \ 
	uniq > data/uhd_program_name_core_defaults.csv;

revise_uhd_core:
	source env/bin/activate; \
	python get_core_rubric_json.py $(UHD_ID) | \
	python processors/revise_uhd_core.py data/uhd_program_name_core_defaults.csv;


load_uh_programs:
	source env/bin/activate; \
	python 

load_associate_degrees:
	source env/bin/activate; \
	csvcut -c"assoc_id,assoc_name" data/associate_degrees.csv | uniq | python processing/load_associates_degrees.py

