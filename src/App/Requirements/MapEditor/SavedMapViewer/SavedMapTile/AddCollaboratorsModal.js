import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Label,
    Form,
    FormGroup,
    FormText,
    ListGroup,
    ListGroupItem
    } from 'reactstrap';
import {Typeahead} from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';

class AddCollaboratorsModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newMapCollaborators:[],
            selected:[]
        }
    }

    openClose = () => {
        this.initializeCollaborators();
        this.props.toggle();
    }

    initializeCollaborators = () => {
        let prevCollaborators = this.props.map.users.reduce(
            (collaborators,collaboratorData) => {
                let newEmail = collaboratorData.email;
                if(newEmail !== this.props.login.state.userEmail){
                    collaborators.push(collaboratorData.email);
                }
                return collaborators;
            },[]);
        this.setState({newMapCollaborators:prevCollaborators});
    }

    componentDidMount(){
        let prevCollaborators = this.props.map.users.reduce(
            (collaborators,collaboratorData) => {
                let newEmail = collaboratorData.email;
                if(newEmail !== this.props.login.state.userEmail){
                    collaborators.push(collaboratorData.email);
                }
                return collaborators;
            },[]);
        this.setState({newMapCollaborators:prevCollaborators});
    }

    handleCollaboratorAdd = ([selectedCollaborator]) => {
        let currentCollaborators = this.state.newMapCollaborators;
        let isNewCollaborator = currentCollaborators.indexOf(selectedCollaborator) < 0;
        if(selectedCollaborator &&  isNewCollaborator){
            let newMapCollaborators = this.state.newMapCollaborators.concat(selectedCollaborator);
            this.setState({
                newMapCollaborators
            });
        }
        this.setState({selected:[]});
    }

    removeCollaborator = (ev) => {
        ev.preventDefault();
        let collaboratorToRemove = ev.target.parentElement.parentElement.getAttribute("id");
        let newMapCollaborators = this.state.newMapCollaborators.filter(
            collaborator => collaborator !== collaboratorToRemove
        );
        this.setState({newMapCollaborators});
    }



    render(){
        console.log(this.state.newMapCollaborators);
        return (
        <Modal isOpen={this.props.isOpen} toggle={this.openClose} className={this.props.className}>
            <ModalHeader toggle={this.openClose}>Map Collaborators.</ModalHeader>
            <ModalBody>
            <Label for="mapName"><strong>Map name:</strong></Label>
            <h6>{this.props.map_name}</h6>
                <Form>
                    <FormGroup>
                        <Label for="collaboratorsModal"><strong>Add collaborators</strong></Label>
                        <Typeahead 
                            type="text"
                            name="collaboratorsModal"
                            id="collaboratorsModal"
                            placeholder="E.g., matthew.lewis@sjcd.edu"
                            options={this.props.collaborators.filter(
                                collaborator => collaborator !== this.props.login.state.userEmail
                                )}
                            onChange={this.handleCollaboratorAdd}
                            selectHintOnEnter={true}
                            selected={this.state.selected}
                        />
                    <FormText>Add some co-conspirators!</FormText>
                    <ListGroup>
                        {this.state.newMapCollaborators.map(
                            (collaborator)=><ListGroupItem 
                                                key={collaborator} 
                                                id={collaborator}
                                                color="success"
                                                style={{padding: "3px 10px"}}
                                            >
                                                {collaborator}
                                                <button type="button" className="close" aria-label="Close" onClick={this.removeCollaborator}>
                                                    <span aria-hidden="true">×</span>
                                                </button>
                                            </ListGroupItem>
                        )}
                    </ListGroup>
                </FormGroup>
            </Form>
        </ModalBody>
        <ModalFooter>               
            <Button color="secondary" onClick={this.openClose}>Close</Button>
            <Button color="primary" onClick={()=>{this.props.handler(this.props.map_id,this.state.newMapCollaborators)}}>Update collaborators</Button>
        </ModalFooter>
    </Modal>    
);
    }
}
    

AddCollaboratorsModal.propTypes = {
    isOpen:PropTypes.bool.isRequired,
    toggle:PropTypes.func.isRequired,
    map_name:PropTypes.string.isRequired,
    handler:PropTypes.func.isRequired,
    map_id:PropTypes.string.isRequired
}

export default AddCollaboratorsModal;