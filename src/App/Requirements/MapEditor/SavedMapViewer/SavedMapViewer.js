import React from 'react';
import { CardText, ListGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import SavedMapTile from './SavedMapTile/SavedMapTile';
import CreateMapTile from './CreateMapTile/CreateMapTile';

export default class SavedMapViewer extends React.Component{
        render(){
            console.log(this.props.newSavedMaps);
            return (
                <div>
                <CardText id="map-editor">
                </CardText>
                    <h6>Saved Maps:</h6>
                    <h6>{this.props.university.university_name}</h6>
                    <ListGroup>
                        {this.props.newSavedMaps.filter(savedMap => savedMap.univ_id === this.props.university.university_id).map(
                            (savedMap) => (
                                <SavedMapTile 
                                    key={savedMap.name+savedMap.id} 
                                    id={String(savedMap.id)} 
                                    name={savedMap.name} 
                                    progId={savedMap.prog_id}
                                    login={this.props.login}
                                    toggleEditMode={this.props.toggleEditMode}
                                    setMapToEdit={this.props.setMapToEdit}
                                    getSelectedProgramAndSetState={this.props.getSelectedProgramAndSetState}
                                    map={savedMap}
                                    collaborators={this.props.collaborators}
                                />  
                            )
                        )}
                        <CreateMapTile 
                            university={this.props.university}
                            programs={this.props.programs} 
                            login={this.props.login}
                            collaborators={this.props.collaborators}
                            associateDegrees={this.props.associateDegrees}
                            setAssociateDegree={this.props.setAssociateDegree}
                            />
                    </ListGroup>
                    </div>
            )
        }
    }

    SavedMapViewer.propTypes = {
        login:PropTypes.object.isRequired,
        university:PropTypes.object.isRequired,
        programs:PropTypes.array.isRequired,
        collaborators:PropTypes.array.isRequired,
        toggleEditMode:PropTypes.func.isRequired,
        setMapToEdit:PropTypes.func.isRequired,
        getSelectedProgramAndSetState:PropTypes.func.isRequired,
        savedMaps:PropTypes.array.isRequired
    }