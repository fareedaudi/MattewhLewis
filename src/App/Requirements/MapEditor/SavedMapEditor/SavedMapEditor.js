import React from 'react';
import PropTypes from 'prop-types';
import MapForm from './MapForm';
import {WithMapActionHandlers} from '../../../../contexts/SavedMapsContext';

class SavedMapEditorComponent extends React.Component{

    handleSaveMap = (mapData) => {
        return this.props.mapActionHandlers.saveMap(mapData);
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
                    mapSaved={this.props.mapSaved}
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