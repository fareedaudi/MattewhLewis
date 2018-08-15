import React from 'react';
import axios from 'axios';
import {ROOT_URL} from '../api';
import { WithLoginStatus } from './LoginContext';
import {PropTypes} from 'prop-types';

var SavedMapsContext = React.createContext();

class SavedMapsContextProviderComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            savedMaps:[],
            newSavedMaps:[]
        }
        this.mapActionHandlers = {
            deleteMap:this.deleteMap,
            shareMap:this.shareMap,
            approveMap:this.approveMap,
            getSavedMaps:this.getSavedMaps,
            saveMap:this.saveMap,
            getNewSavedMaps:this.getNewSavedMaps
        }
    }

    deleteMap = (map_id) => {
        var token = sessionStorage.getItem('jwtToken');
        axios.post(
            `${ROOT_URL}/delete_map`, {token, map_id}
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

    saveMap = (mapData) => {
        var token = sessionStorage.getItem('jwtToken');
        console.log('Map Saved!');
        axios.post(
            `${ROOT_URL}/save_map`, {token,mapData}
        ).then(
            response => response.data
        ).then(
            result => {
                if(result.mapSaved){
                    this.getSavedMaps();
                }
            }
        )
    }

    shareMap = (map_id,newMapCollaborators) => {
        var token = sessionStorage.getItem('jwtToken');
        axios.post(
            `${ROOT_URL}/update_collaborators`, {token,map_id,newMapCollaborators}
        ).then(
            response => response.data
        ).then(
            result => {
                if(result.collaboratorsUpdated){
                    this.getSavedMaps();
                }
            }
        );
    }

    approveMap = () => {

    }

    componentWillReceiveProps(nextProps){
        if(!this.props.loggedIn && nextProps.loggedIn){
            this.getSavedMaps();
            this.getNewSavedMaps();
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
    
        })
    }

    getNewSavedMaps = () => {
        var token = sessionStorage.getItem('jwtToken');
        const Authorization = `Bearer ${token}`;
        axios.get(
            `${ROOT_URL}/api/maps`,{headers: {Authorization}}
        )
        .then(response => response.data)
        .then(({maps}) => this.setState({newSavedMaps:maps}));
    }

    render(){
        return (
        <SavedMapsContext.Provider value={{savedMaps:this.state.savedMaps,mapActionHandlers:this.mapActionHandlers,newSavedMaps:this.state.newSavedMaps}}>
            {this.props.children}
        </SavedMapsContext.Provider>
        )
    }
}

const SavedMapsContextProvider = WithLoginStatus(SavedMapsContextProviderComponent);
export default SavedMapsContextProvider;


export function ProvideSavedMapContext(Component){
    return class extends React.Component{
        render(){
            return (
                <SavedMapsContextProvider>
                    <Component {...this.props}/>
                </SavedMapsContextProvider>
            )
        }
    }
}


export function WithSavedMaps(SavedMapsConsumer){
    return class extends React.Component{
        render(){
            return (
                <SavedMapsContext.Consumer>
                    {
                        (savedMapsContext) => (
                            <SavedMapsConsumer savedMaps={savedMapsContext.savedMaps} newSavedMaps={savedMapsContext.newSavedMaps} {...this.props}/>
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

SavedMapsContextProviderComponent.propTypes = {
    loggedIn:PropTypes.bool.isRequired
}