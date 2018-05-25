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
    FormFeedback,
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Typeahead} from 'react-bootstrap-typeahead';
import {ROOT_URL} from '../../api';



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
                        <SavedMaps 
                            login={this.props.login} 
                            university={this.props.university}
                            programs={this.props.programs}
                            collaborators={this.state.collaborators}
                            toggleEditMode={this.toggleEditMode}
                            getSelectedProgramAndSetState={this.props.getSelectedProgramAndSetState}
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

    getSavedMaps = (univId) => {
        let userId = this.props.login.state.userId;
        if(this.props.login.state.loggedIn){
            fetch(
                `http://localhost:5000/maps?userId=${userId}&univId=${univId}`
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

    componentDidMount(){
        this.getSavedMaps(this.props.university.university_id);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.university !== nextProps.university){
            this.getSavedMaps(nextProps.university.university_id);
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

/*    shouldComponentUpdate(nextProps,nextState){
        if(this.state.savedMaps !== nextState.savedMaps){
            return true;
        } else {
            return false;
        }

    } */

    render(){
        return (
            <div>
            <CardText id="map-editor">
            </CardText>
                <h6>Saved Maps:</h6>
                <h6>{this.props.university.university_name}</h6>
                <ListGroup>
                    {this.state.savedMaps.map(
                        (savedMap) => (
                            <SavedMapTile 
                                key={Math.random()} 
                                id={String(savedMap.id)} 
                                name={savedMap.map_name} 
                                progId={savedMap.prog_id}
                                mapActionHandlers={this.mapActionHandlers}
                                login={this.props.login}
                                toggleEditMode={this.props.toggleEditMode}
                                getSelectedProgramAndSetState={this.props.getSelectedProgramAndSetState}
                                />
                        )
                    )}
                    <CreateMapTile 
                        university={this.props.university}
                        programs={this.props.programs} 
                        login={this.props.login}
                        getSavedMaps={this.getSavedMaps}
                        collaborators={this.props.collaborators}/>
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
        this.props.login.actions.makeRecentlyActive();
        this.toggleDeleteModal();
        this.props.mapActionHandlers.deleteMap(map_id);
    }

    launchMapEditor = (ev) => {
        ev.preventDefault();
        this.props.toggleEditMode();

    }

    render(){
        var shareMap, approveMap;
        ({shareMap, approveMap} = this.props.mapActionHandlers);
        return (<div className="saved-map-tile">
            <ListGroupItem className="justify-content-between d-flex">
                <a id={this.props.id} href="" onClick={this.launchMapEditor} style={{maxWidth:"200px"}}>{this.props.name}</a>
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

    createMapHandler(mapState){
        if(this.validMap(mapState)){
            let token = sessionStorage.getItem('jwtToken');
            this.props.login.actions.makeRecentlyActive();
            axios.post(
                `${ROOT_URL}/create_map`, {mapState,token}
                ).then(
                    response => {
                        if(response.data.mapCreated){
                            this.setState({
                                createMapModalOpen:!this.state.createMapModalOpen
                            });
                            this.props.getSavedMaps();
                        }
                    }
            )
        } else {
            console.log("errah!");
        }
    }

    validMap = (mapState) => {
        if(mapState.selectedProgramId === -1){
            return false;
        } else {
            return true;
        }
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
                <CreateMapModal 
                    isOpen={isOpen} 
                    toggle={toggle} 
                    handler={handler} 
                    university={this.props.university}
                    programs={this.props.programs}
                    collaborators={this.props.collaborators}
                    login={this.props.login}/>
            </div>
            );
        }
    }

    class CreateMapModal extends React.Component{

        constructor(props){
            super(props);
            this.defaultState = {
                selectedProgramId:-1,
                selectedUniversityId:this.props.university.university_id,
                newMapName:'',
                newMapCollaborators:[],
                selected:[]
            }
            this.state = this.defaultState;
        }

        openClose = (ev) => {
            this.setState(this.defaultState);
            this.props.toggle(ev);
        }

        handleProgramSelection = (ev) => {
            let selectedProgramId = Number(ev.target.value);
            this.setState({
                selectedProgramId
            });
        }

        handleNameChange = (ev) => {
            let newMapName = ev.target.value;
            this.setState({
                newMapName
            });
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

        createMapHandler = (mapState) => {
            if(mapState.selectedProgramId!==-1){
                this.props.handler(mapState);
                this.setState(this.defaultState);
            }
        }

        render(){
            let modalState = this.state;
            return (
                <Modal isOpen={this.props.isOpen} toggle={this.openClose} className={this.props.className}>
                    <ModalHeader toggle={this.openClose}>Create new degree map.</ModalHeader>
                    <ModalBody>
                    <Label for="mapName">Transfer Institution</Label>
                    <h6>{this.props.university.university_name}</h6>
                    <Form>
                        <FormGroup>
                            <Label for="program">Program</Label>
                            <Input 
                                type="select" 
                                name="program" 
                                id="program" 
                                placeholder="Please select a program." 
                                value={this.state.selectedProgramId}
                                onChange={this.handleProgramSelection}
                            >
                                <option value="-1">Please select a program.</option>
                                {this.props.programs.map(
                                    program => <option key={program.program_id} value={program.program_id}>{program.program_name}</option>
                                    )
                                }
                            </Input>
                            <FormText>To what program are you aligning this map?</FormText>
                            <FormFeedback>You did good!</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="mapName">Name</Label>
                            <Input 
                                type="text" 
                                name="name" 
                                id="mapName" 
                                placeholder="E.g., German Basket Weaving Specialization"
                                value={this.state.newMapName}
                                onChange={this.handleNameChange}
                            />
                            <FormText>Pick something specific.</FormText>
                        </FormGroup>
                        <FormGroup>
                            <Label for="collaborators">Collaborators</Label>
                            <Typeahead 
                                type="text"
                                name="collaborators"
                                id="collaborators"
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
                        <Button color="danger" onClick={()=>this.createMapHandler(modalState)}>Submit</Button>
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