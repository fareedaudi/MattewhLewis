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
    Button
} from 'reactstrap';
import PropTypes from 'prop-types';



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
                `http://localhost:8000/maps_by_user_id/${this.props.login.state.userId}`
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
        this.setState({
            savedMaps:this.state.savedMaps.filter((savedMap)=>(savedMap.id!==Number(map_id)))
        });
        // MAKE AUTHENTICATED AJAX CALL TO DELETE MAP
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
    }

    toggleDeleteModal(){
        this.setState({
            deleteMapModalOpen:!this.state.deleteMapModalOpen
        });
    }


    render(){
        var deleteMap, shareMap, approveMap;
        ({deleteMap, shareMap, approveMap} = this.props.mapActionHandlers);
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
                handler={deleteMap}
                map_id={this.props.id}
            />
            </div>
        )
    }
}

const CreateMapTile = (props) => (
    <ListGroupItem color="primary" tag="a" href="#" onClick={(ev)=>{ev.preventDefault();}}>
        <span className="fa fa-plus"/>&nbsp;&nbsp;Create a new map.
    </ListGroupItem>
);

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