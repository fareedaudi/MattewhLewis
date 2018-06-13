import React from 'react';
export const ROOT_URL = 'http://localhost:5000';
export const UNIVERSITIES_URL = ROOT_URL + '/universities';
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