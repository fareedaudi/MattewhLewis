import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import {ROOT_URL} from '../../api';
import SavedMapViewer from '../../App/Requirements/Editor/SavedMapViewer/SavedMapViewer';

export default class EditorCard extends React.Component{
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
                        <MapEditor
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


class MapEditor extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            comm_010_1:-1,
            comm_010_2:-1,
            math_020:-1,
            sci_030_1:-1,
            sci_030_2:-1,
            phil_040:-1,
            arts_050:-1,
            hist_060_1:-1,
            hist_060_2:-1,
            gov_070_1:-1,
            gov_070_2:-1,
            soc_080:-1,
            comp_090_1:-1,
            comp_090_2:-1,
            inst_op_1:-1,
            inst_op_2:-1,
            trans_1:-1,
            trans_2:-1,
            trans_3:-1,
            trans_4:-1,
            trans_5:-1,
            trans_6:-1,
            components:[]
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

    render(){
        return (
            <div>
            <h6>Map Editor</h6>
            <Form>
                {this.state.components.map(
                    (component) => 
                    <FormGroup key={component.name}>
                    <Label>{component.name}</Label>
                    {component.fields.map(
                        (field) =>
                        <Input type="select" key={field}/>
                    )}
                    </FormGroup>
                )}
            </Form>
            <Button color="secondary" onClick={this.props.toggleEditMode}>Close</Button>
            </div>
        )
    }
}



EditorCard.propTypes = {
    login: PropTypes.object,
    programs: PropTypes.array.isRequired
}