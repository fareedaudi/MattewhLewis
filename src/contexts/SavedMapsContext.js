import React from 'react';
import axios from 'axios';
import {ROOT_URL} from '../api';

var SavedMapsContext = React.createContext();

export class SavedMapsContextProvider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            savedMaps:[]
        }
    }

    componentDidMount(){
        this.getSavedMaps()
    }

    componentWillReceiveProps(nextProps){
        console.log('From componentWillReceiveProps',nextProps);
        if(!this.props.loggedIn && nextProps.loggedIn){
            console.log('savedmaps API called!');
            this.getSavedMaps();
        } else if(this.props.loggedIn && !nextProps.loggedIn){
            this.resetSavedMaps({});
        }
    }

    resetSavedMaps = () => {
        let savedMaps = [];
        this.setState({savedMaps});
    }

    getSavedMaps = () => {
        var token = sessionStorage.getItem('jwtToken');
        axios.post(
            `${ROOT_URL}/saved_maps_by_user`, {token}
        )
        .then(response=>response.data)
        .then(savedMaps=>{
            this.setState({savedMaps});
        }).catch((error)=>{
            console.log(sessionStorage.getItem('jwtToken'));
            console.log('API error',error);
    
        })
    }

    render(){
        return (
        <SavedMapsContext.Provider value={this.state}>
            {this.props.children}
        </SavedMapsContext.Provider>
        )
    }
}

export function WithSavedMaps(SavedMapsConsumer){
    return class extends React.Component{
        render(){
            return (
                <SavedMapsContext.Consumer>
                    {
                        (savedMaps) => (
                            <SavedMapsConsumer savedMaps={savedMaps} {...this.props}/>
                        )
                    }
                </SavedMapsContext.Consumer>
            )
        }
    }
}