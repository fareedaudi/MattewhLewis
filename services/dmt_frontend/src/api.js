import React from 'react';
import axios from 'axios';
export const ROOT_URL = 'http://localhost';
export const UNIVERSITIES_URL = ROOT_URL + '/api/universities';
export const SAVED_MAPS_URL = ROOT_URL + '/saved_maps_by_user';

export const withFetching = (url,structure={}) => (Comp) => 
    class WithFetching extends React.Component{
        constructor(props){
            super(props);

            this.state = {
                data: structure,
                isLoading:false,
                error:null
            }
        }

        static get ROOT_URL(){
            return 'http://localhost:5000'
        };
        static get UNIVERSITIES_URL(){
            return '/universities';
        }
        static get SAVED_MAPS_URL(){ 
            return '/saved_maps_by_user';
        }

        componentDidMount(){
            this.setState({
                isLoading:true
            });
            fetch(url)
                .then(response => {
                    if(response.ok){
                        return response.json();
                    } else {
                        throw new Error('Something went wrong...');
                    }
                })
                .then(data => this.setState({data,isLoading:false}))
                .catch(error => this.setState({error,isLoading:false}));
        }
        render(){
            return <Comp {...this.props} {...this.state}/>;
        }
    }

export const getUsers = () => {
    let token = localStorage.getItem('PMTjwtToken');
    const Authorization = `Bearer ${token}`;
    return axios.get(
        `${ROOT_URL}/api/users`, {headers:{Authorization}}
    ).then( response => {
        if(response.status!==200){
            throw new Error('Error!');
        }
        return response.data
    });
}

export const getPrintableMap = (mapId,mapName) => {
    let token = localStorage.getItem('PMTjwtToken');
    const Authorization = `Bearer ${token}`;
    let url = `${ROOT_URL}/api/report/${mapId}/${Date.now()}`;
    return axios.get(
        url, 
        {
            headers:{Authorization},
            responseType:'blob'
        },
    ).then(
        response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${mapName}.pdf`);
            document.body.appendChild(link);
            link.click();
        }
    )
}

// GET /requirements_by_program

// GET /get_core

// GET /programs_by_university

// GET /maps

// GET /maps_by_user

// GET /sjc_courses

// POST /logout

// DELETE /delete_map

// PUT /create_map

// UPDATE /update_collaborats

// UPDATE /save_map

// GET /user_emails

// GET saved_maps_by_user

// GET /get_core/univ_id
