import React from 'react';
import { CardText, ListGroup } from 'reactstrap';
import SavedMapTile from './SavedMapTile';
import CreateMapTile from './CreateMapTile';

export default class SavedMapViewer extends React.Component{
        render(){
            return (
                <div>
                <CardText id="map-editor">
                </CardText>
                    <h6>Saved Maps:</h6>
                    <h6>{this.props.university.university_name}</h6>
                    <ListGroup>
                        {this.props.savedMaps.filter(savedMap => savedMap.univ_id === this.props.university.university_id).map(
                            (savedMap) => (
                                <SavedMapTile 
                                    key={savedMap.name+savedMap.id} 
                                    id={String(savedMap.id)} 
                                    name={savedMap.name} 
                                    progId={savedMap.prog_id}
                                    login={this.props.login}
                                    toggleEditMode={this.props.toggleEditMode}
                                    getSelectedProgramAndSetState={this.props.getSelectedProgramAndSetState}
                                    map={savedMap}
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