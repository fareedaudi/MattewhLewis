import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText,
    ListGroup,
    ListGroupItem,
    Tooltip
} from 'reactstrap';
import PropTypes from 'prop-types';


export default class EditorCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editMode:false,
            loggedIn:false,
            savedMaps:[
                {
                    map_id: 1,
                    map_name: "Matt's Map Has a Super Long Name",
                    map_univ_id: 1,
                    map_prog_id: 6,
                },
                {
                    map_id: 2,
                    map_name: "Chris' Map",
                    map_univ_id: 1,
                    map_prog_id: 14
                }
            ]
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
                        <SavedMaps savedMaps={this.state.savedMaps}/>
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

    render(){
        return (
            <div>
            <CardText id="map-editor">
            </CardText>
                <h6>Saved Maps</h6>
                <ListGroup>
                    {this.props.savedMaps.map(
                        (savedMap) => (
                            <SavedMapTile key={savedMap.map_id} id={String(savedMap.map_id)} name={savedMap.map_name}/>
                        )
                    )}
                    <CreateMapTile/>
                </ListGroup>
                </div>
        )
    }
}

class SavedMapTile extends React.Component{
    render(){
        return (
            <ListGroupItem className="justify-content-between d-flex">
                <a href="" onClick={(ev)=>{ev.preventDefault();}} style={{maxWidth:"200px"}}>{this.props.name}</a>
                <span className="pull-right">
                    <MapActionButton type="approve" map_id={this.props.id}/>&nbsp;&nbsp;
                    <MapActionButton type="share" activated={true} map_id={this.props.id}/>&nbsp;&nbsp;
                    <MapActionButton type="delete" map_id={this.props.id}/>
                </span>
            </ListGroupItem>
        )
    }
}

const CreateMapTile = (props) => (
    <ListGroupItem color="primary" tag="a" href="#">
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
                handler:null,
                tooltipText:'Submit for approval.'
            },
            share:{
                faClass:'fa fa-share-alt',
                handler:null,
                tooltipText:'Share with collaborators.'
            },
            delete:{
                faClass:'fa fa-trash',
                handler:null,
                tooltipText:'Delete map.'
            }
        }
        this.myRef = React.createRef();
        this.toggle = () => {this.setState({tooltipOpen:!this.state.tooltipOpen});};
    }

    render(){
        let buttonId = this.props.type + this.props.map_id
        return (
            <span>
                <span 
                    className={this.FAClassMap[this.props.type].faClass} 
                    style={
                        {
                            cursor:"pointer",
                            color:(this.props.activated)?"green":"black"
                        }
                    }
                    id={buttonId}
                    
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