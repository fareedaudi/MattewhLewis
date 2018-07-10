import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {ROOT_URL} from '../../../../api';
import MapForm from './MapForm';
import {WithMapActionHandlers} from '../../../../contexts/SavedMapsContext';

class SavedMapEditorComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            mapId:this.props.savedMapToEdit.id
        }
    }

    componentDidMount(){
        this.getComponentsFromServer();
    }

    getComponentsFromServer = () => {
        axios.get(
            `${ROOT_URL}/degree_components`
        ).then(
            response => response.data
        ).then(
            components => {this.setState({components});}
        );
    }

    handleSaveMap = (mapData) => {
        this.props.mapActionHandlers.saveMap(mapData);
    }

    componentWillUnmount(){
        this.props.toggleEditModeOff();
    }

    render(){
        return (
                <MapForm 
                    key={this.state.mapId}
                    savedMapToEdit={this.props.savedMapToEdit} 
                    selectedProgram={this.props.selectedProgram}
                    coreRequirements={this.props.coreRequirements}
                    handleClose={this.props.toggleEditMode}
                    handleSave={this.handleSaveMap}
                    login={this.props.login}
                />
        )
    }
}

SavedMapEditorComponent.propTypes = {
    toggleEditMode:PropTypes.func.isRequired,
    savedMapToEdit:PropTypes.object.isRequired
}

const SavedMapEditor = WithMapActionHandlers(SavedMapEditorComponent);

export default SavedMapEditor;