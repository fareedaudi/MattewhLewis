import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {ROOT_URL} from '../../../../api';
import MapForm from './MapForm';
import {WithMapActionHandlers} from '../../../../contexts/SavedMapsContext';

class SavedMapEditorComponent extends React.Component{

    componentDidMount(){
        this.getComponentsFromServer();
    }

    getComponentsFromServer = () => {
        axios.get(
            `${ROOT_URL}/api/degree_components`
        ).then(
            response => response.data
        ).then(
            components => {this.setState({components});}
        );
    }

    handleSaveMap = (mapData) => {
        this.props.mapActionHandlers.saveMap(mapData);
        this.props.mapActionHandlers.getSavedMaps();
    }

    componentWillUnmount(){
        this.props.toggleEditModeOff();
    }

    render(){
        console.log(this.props.savedMapToEdit);
        return (
                <MapForm 
                    savedMapToEdit={this.props.savedMapToEdit} 
                    selectedProgram={this.props.selectedProgram}
                    coreRequirements={this.props.coreRequirements}
                    handleClose={this.props.toggleEditMode}
                    handleSave={this.handleSaveMap}
                    login={this.props.login}
                    associateDegrees={this.props.associateDegrees}
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