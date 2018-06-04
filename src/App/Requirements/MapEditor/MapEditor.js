import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText
} from 'reactstrap';
import axios from 'axios';
import {ROOT_URL} from '../../../api';
import SavedMapViewer from './SavedMapViewer/SavedMapViewer';
import SavedMapEditor from './SavedMapEditor';
import {WithLogin} from '../../../contexts/LoginContext';

class MapEditorComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editMode:false,
            collaborators:[]
        }
    }

    componentDidMount(){
        this.getCollaborators();
    }

    componentWillUnmount(){
    }

    shouldComponentUpdate(nextProps,nextState){
        if([
            this.state === nextState,
            this.props.programs === nextProps.programs,
            this.props.login.state.loggedIn === nextProps.login.state.loggedIn,
            this.props.university === nextProps.university,
            this.props.savedMaps === nextProps.savedMaps
        ].every(x=>x)) {
            return false;}
         else {
        return true;
      }
    }


    componentWillReceiveProps(nextProps){
    }

    toggleEditMode = () => {
        this.setState({
            editMode:!this.state.editMode
        });
    }

    render(){
        var instructions = (this.state.editMode)?
            'Edit courses for degree components, below.':
            'View your saved maps below, or create a new map!';
        let loggedIn = this.props.login.state.loggedIn;
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
                        />
                        :
                        <SavedMapViewer
                            login={this.props.login} 
                            university={this.props.university}
                            programs={this.props.programs}
                            collaborators={this.state.collaborators}
                            toggleEditMode={this.toggleEditMode}
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

const MapEditor = WithLogin(MapEditorComponent);

export default MapEditor;