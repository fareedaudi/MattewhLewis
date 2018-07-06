import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import {ROOT_URL} from '../../../api';
import SavedMapViewer from './SavedMapViewer/SavedMapViewer';
import SavedMapEditor from './SavedMapEditor/SavedMapEditor';
import {WithLogin} from '../../../contexts/LoginContext';

class MapEditorComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editMode:false,
            collaborators:[],
            mapToEdit:'-1'
        }
    }

    componentDidMount(){
        this.getCollaborators();
    }

    shouldComponentUpdate(nextProps,nextState){
        if([
            this.state === nextState,
            this.props.programs === nextProps.programs,
            this.props.login.state.loggedIn === nextProps.login.state.loggedIn,
            this.props.university === nextProps.university,
            this.props.savedMaps === nextProps.savedMaps,
            this.props.selectedProgram === nextProps.selectedProgram,
            this.props.coreRequirements === nextProps.coreRequirements
        ].every(x=>x)) {
            return false;}
         else {
        return true;
      }
    }

    toggleEditMode = () => {
        this.setState({
            editMode:!this.state.editMode
        });
    }

    setMapToEdit = (mapToEdit) => {
        this.setState({
            mapToEdit
        });
    }

    toggleEditModeOff = () => {
        this.setState({
            editMode:false
        });
    }

    render(){
        var instructions = (this.state.editMode)?
            'Edit courses for degree components, below.':
            'View your saved maps below, or create a new map!';
        let loggedIn = this.props.login.state.loggedIn;
        let savedMapToEdit = this.props.savedMaps.filter(
            savedMap=>String(savedMap.id)===this.state.mapToEdit)[0];
        return (
            <Card>
                <CardHeader>
                    <h4>Degree Map Editor</h4>
                </CardHeader>
                {loggedIn?
                    <CardBody>
                        <CardText>
                            {instructions}
                        </CardText>
                        {
                        this.state.editMode ?
                        <SavedMapEditor
                            toggleEditMode={this.toggleEditMode}
                            toggleEditModeOff={this.toggleEditModeOff}
                            savedMapToEdit={savedMapToEdit}
                            selectedProgram={this.props.selectedProgram}
                            coreRequirements={this.props.coreRequirements}
                        />
                        :
                        <SavedMapViewer
                            login={this.props.login} 
                            university={this.props.university}
                            programs={this.props.programs}
                            collaborators={this.state.collaborators}
                            toggleEditMode={this.toggleEditMode}
                            setMapToEdit={this.setMapToEdit}
                            getSelectedProgramAndSetState={this.props.getSelectedProgramAndSetState}
                            savedMaps={this.props.savedMaps}
                            />
                        }
                    </CardBody>
                    :
                    <CardBody>
                        <CardText>
                            Please login to view and edit maps. 
                        </CardText>
                    </CardBody>
                }
            </Card>
        )
    }

    getCollaborators = () => {
        axios.get(
            `${ROOT_URL}/user_emails`
        ).then(
            response => response.data
        ).then(
            collaborators => {
                this.setState({collaborators},
                ()=> {
                });
            }
        );
    }
}


MapEditorComponent.propTypes = {
    university:PropTypes.object.isRequired,
    programs:PropTypes.array.isRequired,
    selectedProgram:PropTypes.object.isRequired,
    savedMaps:PropTypes.array.isRequired,
    login:PropTypes.object.isRequired
}


const MapEditor = WithLogin(MapEditorComponent);

export default MapEditor;