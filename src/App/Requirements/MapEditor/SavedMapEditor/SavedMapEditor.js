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

export default class SavedMapEditor extends React.Component{
    
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

    componentWillUnmount(){
        this.props.toggleEditModeOff();
    }

    render(){
        console.log('selecedProgram: ',this.props.selectedProgram);
        let {name, components, prog_id} = this.props.savedMapToEdit;
        return (
            <div>
                <MapForm savedMapToEdit={this.props.savedMapToEdit} selectedProgram={this.props.selectedProgram}/>
                <Button color="secondary" onClick={this.props.toggleEditMode}>Close</Button>
            </div>
        )
    }
}

SavedMapEditor.propTypes = {
    toggleEditMode:PropTypes.func.isRequired,
    savedMapToEdit:PropTypes.object.isRequired
}