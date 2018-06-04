import React from 'react';
import {ListGroupItem} from 'reactstrap';
import MapActionButton from './MapActionButton';
import DeleteMapModal from './DeleteMapModal';
import {WithMapActionHandlers} from '../../../../../contexts/SavedMapsContext';

class SavedMapTileActionless extends React.Component{
        
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
        this.props.getSelectedProgramAndSetState(this.props.progId);
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

const SavedMapTile = WithMapActionHandlers(SavedMapTileActionless);

export default SavedMapTile;