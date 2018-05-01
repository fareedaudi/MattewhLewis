import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText,
    ListGroup,
    ListGroupItem,
    Tooltip,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    FormFeedback
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';



export default class EditorCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editMode:false,
            savedMaps:[]
        }
    }


    shouldComponentUpdate(nextProps,nextState){
        if([
            this.state === nextState,
            this.props.universities === nextProps.universities,
            this.props.programs === nextProps.programs,
            this.props.login.state.loggedIn === nextProps.login.state.loggedIn
        ].every((condition) => (condition))) {return false;}
         else {
        return true;
      }
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
                        <MapEditor/>:
                        <SavedMaps login={this.props.login}/>
                        }
                    </CardBody>:
                    <CardBody>
                        <CardText>
                            Please login to view and edit maps. 
                        </CardText>
                    </CardBody>
                }
            </Card>
        )
    }
}

class SavedMaps extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            savedMaps:[]
        }
        this.deleteMap = this.deleteMap.bind(this);
        this.shareMap = this.shareMap.bind(this);
        this.approveMap = this.approveMap.bind(this);
        this.mapActionHandlers = {
            deleteMap:this.deleteMap,
            shareMap:this.shareMap,
            approveMap:this.approveMap
        }
    }

    componentDidMount(){
        if(this.props.login.state.loggedIn){
            fetch(
                `http://localhost:5000/maps_by_user_id/${this.props.login.state.userId}`
            ).then(
                response => response.json()
            ).then(
                mapData => {
                    this.setState({
                        savedMaps:mapData
                    });
                }
            );
        }
    }

    deleteMap(map_id){
        var token = sessionStorage.getItem('jwtToken');
        axios.post(
            'http://localhost:5000/delete_map', {token, map_id}
            ).then(
               response => response.data
            ).then(
                (result) => {
                    console.log(result);
                    if(result.mapDeleted){
                        this.setState({
                            savedMaps:this.state.savedMaps.filter((savedMap)=>(savedMap.id!==Number(map_id)))
                        });
                    }
                }
            );
    }

    shareMap(map_id){
    }

    approveMap(map_id){
    }

    shouldComponentUpdate(nextProps,nextState){
        if(this.state.savedMaps !== nextState.savedMaps){
            return true;
        } else {
            return false;
        }

    }


    render(){
        return (
            <div>
            <CardText id="map-editor">
            </CardText>
                <h6>Saved Maps</h6>
                <ListGroup>
                    {this.state.savedMaps.map(
                        (savedMap) => (
                            <SavedMapTile key={Math.random()} id={String(savedMap.id)} name={savedMap.map_name} mapActionHandlers={this.mapActionHandlers}/>
                        )
                    )}
                    <CreateMapTile/>
                </ListGroup>
                </div>
        )
    }
}

class SavedMapTile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            deleteMapModalOpen:false,
        }
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.deleteMap = this.deleteMap.bind(this);
    }

    toggleDeleteModal(){
        this.setState({
            deleteMapModalOpen:!this.state.deleteMapModalOpen
        });
    }

    deleteMap(map_id){
        console.log("attempting delete!");
        this.toggleDeleteModal();
        this.props.mapActionHandlers.deleteMap(map_id);
    }


    render(){
        var shareMap, approveMap;
        ({shareMap, approveMap} = this.props.mapActionHandlers);
        return (<div className="saved-map-tile">
            <ListGroupItem className="justify-content-between d-flex">
                <a href="" onClick={(ev)=>{ev.preventDefault();}} style={{maxWidth:"200px"}}>{this.props.name}</a>
                <span className="pull-right">
                    <MapActionButton type="approve" map_id={this.props.id} handler={approveMap}/>&nbsp;&nbsp;
                    <MapActionButton type="share" activated={true} map_id={this.props.id} handler={shareMap}/>&nbsp;&nbsp;
                    <MapActionButton type="delete" map_id={this.props.id} handler={this.toggleDeleteModal}/>
                </span>
            </ListGroupItem>
            <DeleteMapModal
                isOpen={this.state.deleteMapModalOpen} 
                toggle={this.toggleDeleteModal}
                map_name={this.props.name}
                handler={() => {this.deleteMap(this.props.id);}}
                map_id={this.props.id}
            />
            </div>
        )
    }
}

class CreateMapTile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            createMapModalOpen:false,
        }
        this.toggleCreateMapModal = (ev) => {ev.preventDefault();this.setState({createMapModalOpen:!this.state.createMapModalOpen});};
        this.createMapHandler = this.createMapHandler.bind(this);
    }

    createMapHandler(){
        console.log('Map created!');
    }

    render(){
        var isOpen = this.state.createMapModalOpen;
        var toggle = this.toggleCreateMapModal;
        var handler = this.createMapHandler;
        return (
            <div id="create-map-modal">
                <ListGroupItem color="primary" tag="a" href="#" onClick={toggle}>
                    <span className="fa fa-plus"/>&nbsp;&nbsp;Create a new map.
                </ListGroupItem>
                <CreateMapModal isOpen={isOpen} toggle={toggle} handler={handler}/>
            </div>
            );
        }
    }

    class CreateMapModal extends React.Component{


        render(){
            return (
                    <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.props.toggle}>Create new degree map.</ModalHeader>
                        <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="transferInstitution">Transfer Institution</Label>
                                <Input type="select" name="transfer-institution" id="transferInstitution" placeholder="Please select a transfer institution." invalid={true}/>
                                <FormText>To what institution are you aligning this map?</FormText>
                                <FormFeedback>You did good!</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="program">Program</Label>
                                <Input type="select" name="program" id="program" placeholder="Please select a program."/>
                                <FormText>To what program are you aligning this map?</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="mapName">Name</Label>
                                <Input type="text" name="name" id="mapName" placeholder="E.g., German Basket Weaving Specialization"/>
                                <FormText>Pick something specific.</FormText>
                            </FormGroup>
                            <FormGroup>
                                <Label for="collaborators">Collaborators</Label>
                                <Input type="text" name="collaborators" id="collaborators" placeholder="E.g., matthew.lewis@sjcd.edu"/>
                                <FormText>Add some co-conspirators!</FormText>
                            </FormGroup>
                        </Form>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.props.toggle}>Close</Button>
                            <Button color="danger" onClick={this.props.handler}>Submit</Button>
                        </ModalFooter>
                    </Modal>
                );
            }
        }



class MapActionButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen:false
        }
        this.FAClassMap = {
            approve:{
                faClass:'fa fa-paper-plane',
                tooltipText:'Submit for approval.'
            },
            share:{
                faClass:'fa fa-share-alt',
                tooltipText:'Share with collaborators.'
            },
            delete:{
                faClass:'fa fa-trash',
                tooltipText:'Delete map.'
            }
        }
        this.myRef = React.createRef();
        this.toggle = () => {this.setState({tooltipOpen:!this.state.tooltipOpen});};
    }

    render(){
        let buttonId = this.props.type + this.props.map_id;
        var style = {
            cursor:"pointer",
            color:(this.props.activated)?"green":"black"
        }
        return (
            <span>
                <span 
                    className={this.FAClassMap[this.props.type].faClass} 
                    style={style}
                    id={buttonId}
                    onClick={this.props.handler}
                />
                <Tooltip 
                    placement="top" 
                    isOpen={this.state.tooltipOpen} 
                    target={buttonId}
                    toggle={this.toggle}
                > {this.FAClassMap[this.props.type].tooltipText}</Tooltip>
            </span>
      );
    }
}

const DeleteMapModal = (props) => (
    <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
        <ModalHeader toggle={props.toggle}>Delete <strong>{props.map_name}</strong>?</ModalHeader>
        <ModalBody>
        <p>This action is irreversible.</p>
        <p>Are you sure you want to delete this map?</p>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={props.toggle}>Close</Button>
            <Button color="danger" onClick={()=>{props.handler(props.map_id)}}>Let's Do This!</Button>
        </ModalFooter>
    </Modal>
);

class MapEditor extends React.Component{

    render(){
        return (
            <CardText id="map-editor">
                <h6>Map Editor</h6>
            </CardText>
        )
    }
}

EditorCard.propTypes = {
    login: PropTypes.object,
    universities: PropTypes.array.isRequired,
    programs: PropTypes.array.isRequired
}

SavedMaps.propTypes = {
    savedMaps: PropTypes.array
}

SavedMapTile.propTypes= {
    name: PropTypes.string,
    id: PropTypes.string
}

MapActionButton.propTypes = {
    type: PropTypes.string,
    map_id: PropTypes.string,
    activated: PropTypes.bool
}