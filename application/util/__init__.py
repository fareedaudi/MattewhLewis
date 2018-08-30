import sys,os

COUNT = 1
    
def parent_dir_generator():
    FILE_PATH = os.path.abspath(__file__)
    parent_directory = FILE_PATH
    parent_folder = os.path.basename(parent_directory)
    while(parent_folder):
        parent_directory = os.path.abspath(os.path.join(parent_directory,os.pardir))
        parent_folder = os.path.basename(parent_directory)
        yield parent_folder


def no_steps_up_to_desired_folder(ascendant_folder):
    count = 0
    for thing in parent_dir_generator():
        if(thing != ascendant_folder):
            count += 1 
        else:
            break
    return count


def get_path_to_ascendant_folder(ascendant_folder):
    PATH_TO_FOLDER = os.path.abspath(os.path.join(os.getcwd(),*[os.pardir]*no_steps_up_to_desired_folder(ascendant_folder)))
    return PATH_TO_FOLDER

# Export me!
def allow_import_from_ascendant_module(ascendant_module_name):
    sys.path.append(get_path_to_ascendant_folder(ascendant_module_name))