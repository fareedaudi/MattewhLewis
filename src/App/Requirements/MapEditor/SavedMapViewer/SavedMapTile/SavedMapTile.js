import React from 'react';
import {ListGroupItem} from 'reactstrap';
import PropTypes from 'prop-types';
import MapActionButton from './MapActionButton';
import DeleteMapModal from './DeleteMapModal';
import {WithMapActionHandlers} from '../../../../../contexts/SavedMapsContext';
import AddColaboratorsModal from './AddCollaboratorsModal';

class SavedMapTileComponent extends React.Component{
        
    constructor(props){
        super(props);
        this.state = {
            deleteMapModalOpen:false,
            addCollaboratorsModalOpen:false
        }
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.deleteMap = this.deleteMap.bind(this);
        this.shareMap = this.shareMap.bind(this);
    }

    toggleDeleteModal(){
        this.setState({
            deleteMapModalOpen:!this.state.deleteMapModalOpen
        });
    }

    toggleCollaboratorsModal = () => {
        this.setState({
            addCollaboratorsModalOpen:!this.state.addCollaboratorsModalOpen
        });
    }

    deleteMap(map_id){
        this.props.login.actions.makeRecentlyActive();
        this.toggleDeleteModal();
        this.props.mapActionHandlers.deleteMap(map_id);
    }

    shareMap(map){
        this.props.login.actions.makeRecentlyActive();
        this.toggleCollaboratorsModal();
        this.props.mapActionHandlers.shareMap(map);
    }

    launchMapEditor = (ev) => {
        ev.preventDefault();
        this.props.toggleEditMode();
        this.props.getSelectedProgramAndSetState(this.props.progId);
        this.props.setMapToEdit(this.props.id);
    }

    render(){
        console.log(this.props.map);
        let {approveMap} = this.props.mapActionHandlers;
        return (<div className="saved-map-tile">
            <ListGroupItem className="justify-content-between d-flex">
                <a id={this.props.id} href="" onClick={this.launchMapEditor} style={{maxWidth:"200px"}}>{this.props.name}</a>
                <span className="pull-right">
                    <MapActionButton type="approve" map_id={this.props.id} handler={approveMap}/>&nbsp;&nbsp;
                    <MapActionButton type="share" activated={this.props.map.users.length>1} map_id={this.props.id} handler={this.toggleCollaboratorsModal}/>&nbsp;&nbsp;
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
            <AddColaboratorsModal
                isOpen={this.state.addCollaboratorsModalOpen}
                toggle={this.toggleCollaboratorsModal}
                map_name={this.props.name}
                handler={this.shareMap}
                map_id={this.props.id}
                map={this.props.map}
                login={this.props.login}
                collaborators={this.props.collaborators}
            />
            </div>
        )
    }
}

SavedMapTileComponent.propTypes = {
    id:PropTypes.string.isRequired,
    name:PropTypes.string.isRequired,
    progId:PropTypes.number.isRequired,
    login:PropTypes.object.isRequired,
    toggleEditMode:PropTypes.func.isRequired,
    setMapToEdit:PropTypes.func.isRequired,
    getSelectedProgramAndSetState:PropTypes.func.isRequired,
    map:PropTypes.object.isRequired,
    mapActionHandlers:PropTypes.object.isRequired,
    collaborators:PropTypes.array.isRequired
}

const SavedMapTile = WithMapActionHandlers(SavedMapTileComponent);

export default SavedMapTile;