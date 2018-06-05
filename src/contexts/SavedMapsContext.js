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
            savedMaps:[]
        }
        this.mapActionHandlers = {
            deleteMap:this.deleteMap,
            shareMap:this.shareMap,
            approveMap:this.approveMap,
            getSavedMaps:this.getSavedMaps
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
        if(!this.props.loggedIn && nextProps.loggedIn){
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

SavedMapsContextProviderComponent.propTypes = {
    loggedIn:PropTypes.bool.isRequired
}