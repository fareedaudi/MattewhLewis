import React from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import {ROOT_URL} from '../../../../api';
import MapForm from './MapForm';
import {WithMapActionHandlers} from '../../../../contexts/SavedMapsContext';

class SavedMapEditorComponent extends React.Component{
    
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.getComponentsFromServer();
    }

    componentWillReceiveProps(nextProps){
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
        let {saveMap} = this.props.mapActionHandlers;
        let {name, components, prog_id} = this.props.savedMapToEdit;
        return (
                <MapForm 
                    savedMapToEdit={this.props.savedMapToEdit} 
                    selectedProgram={this.props.selectedProgram}
                    coreRequirements={this.props.coreRequirements}
                    handleClose={this.props.toggleEditMode}
                    handleSave={this.handleSaveMap}
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