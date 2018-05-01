export const ROOT_URL = ''
export const UNIVERSITIES_URL = ROOT_URL + '/universities'

export function fetchUniversities(){
    var universities = fetch(
        UNIVERSITIES_URL
      ).then(
        response => response.json()
      );
    return universities;
}