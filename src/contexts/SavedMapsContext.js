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
        this.mapActionHandlers = {
            deleteMap:this.deleteMap,
            shareMap:this.shareMap,
            approveMap:this.approveMap
        }
    }

    deleteMap = (map_id) => {
        var token = sessionStorage.getItem('jwtToken');
        axios.post(
            'http://localhost:5000/delete_map', {token, map_id}
            ).then(
            response => response.data
            ).then(
                (result) => {
                    if(result.mapDeleted){
                        this.setState({
                            savedMaps:this.state.savedMaps.filter((savedMap)=>(savedMap.id!==Number(map_id)))
                        });
                    }
                }
            );
    }

    shareMap = () => {

    }

    approveMap = () => {

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
        <SavedMapsContext.Provider value={{savedMaps:this.state.savedMaps,mapActionHandlers:this.mapActionHandlers}}>
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
                        (savedMapsContext) => (
                            <SavedMapsConsumer savedMaps={savedMapsContext.savedMaps} {...this.props}/>
                        )
                    }
                </SavedMapsContext.Consumer>
            )
        }
    }
}

export function WithMapActionHandlers(SavedMapsConsumer){
    return class extends React.Component{
        render(){
            return (
                <SavedMapsContext.Consumer>
                    {
                        (savedMapsContext) => (
                            <SavedMapsConsumer mapActionHandlers={savedMapsContext.mapActionHandlers} {...this.props}/>
                        )
                    }
                </SavedMapsContext.Consumer>
            )
        }
    }
}