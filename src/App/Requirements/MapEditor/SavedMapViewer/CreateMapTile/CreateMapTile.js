import React from 'react';
import {ListGroupItem} from 'reactstrap';
import CreateMapModal from './CreateMapModal';
import axios from 'axios';
import PropTypes from 'prop-types';
import {ROOT_URL} from '../../../../../api';
import {WithMapActionHandlers} from '../../../../../contexts/SavedMapsContext';

class CreateMapTileComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            createMapModalOpen:false,
        }
        this.toggleCreateMapModal = (ev) => {ev.preventDefault();this.setState({createMapModalOpen:!this.state.createMapModalOpen});};
        this.createMapHandler = this.createMapHandler.bind(this);
    }

    createMapHandler(mapState){
        console.log({mapState});
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
                            this.props.mapActionHandlers.getSavedMaps(this.props.university.university_id);
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
                    login={this.props.login}
                    associateDegrees={this.props.associateDegrees}
                    setAssociateDegree={this.props.setAssociateDegree}
                    />
            </div>
            );
        }
    }

CreateMapTileComponent.propTypes = {
    university:PropTypes.object.isRequired,
    programs:PropTypes.array.isRequired,
    login:PropTypes.object.isRequired,
    collaborators:PropTypes.array.isRequired,
    mapActionHandlers:PropTypes.object.isRequired
}

const CreateMapTile = WithMapActionHandlers(CreateMapTileComponent);
export default CreateMapTile;