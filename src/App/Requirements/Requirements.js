import React from 'react';
import {Container, Col,Row} from 'reactstrap';
import PropTypes from 'prop-types';
import ProgramViewer from '../../App/Requirements/ProgramViewer/ProgramViewer';
import {ROOT_URL} from '../../api';
import MapEditor from '../../App/Requirements/MapEditor/MapEditor';
import { WithSavedMaps } from '../../contexts/SavedMapsContext';


class RequirementsComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            university:{},
            programs:[],
            selectedProgram:{
                program_id:-1
            }
        }
        this.renderCount = 0;
    }

    getSelectedProgramDataAndSetState = (programId) => {
        fetch(
            `${ROOT_URL}/reqs_by_program/${programId}`
        ).then(
            response => response.json()
        ).then(
            programData => {
                this.setState({
                    selectedProgram:programData
                });
            }
        );
    }

    fetchCoreRequirements = () => {
        fetch(
            `${ROOT_URL}/get_core/${this.props.university.university_id}`
        ).then(
            response => response.json()
        ).then(
            coreRequirements => {
            }
        )
    }

    resetSelectedProgram = () => {
        let selectedProgram = {
            program_id:-1,
        };
        this.setState({selectedProgram});
    } // Pass this in props

    componentDidMount(){
        let universityId = this.props.university.university_id;
        this.fetchUniversityProgramsAndUpdateState(universityId);
        this.setState({
            university:this.props.university
        });
    }

    static getDerivedStateFromProps(nextProps,prevState){
        if(prevState.university !== nextProps.university){
            return {
                programs:[],
                selectedProgram:{
                    program_id:-1.
                }
            }
        } else{
            return null;
        }
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.university !== prevProps.university){
            let universityId = this.props.university.university_id;
            this.fetchUniversityProgramsAndUpdateState(universityId);
        }
    }

    render(){
        let selectedProgram = this.state.selectedProgram;
        return(
            <Container style={{paddingTop:'100px'}}>
                <Row>
                    <Col xs="8">
                        <ProgramViewer 
                            university={this.props.university} 
                            programs={this.state.programs}
                            selectedProgram={this.state.selectedProgram}
                            getSelectedProgramDataAndSetState={this.getSelectedProgramDataAndSetState}
                            resetSelectedProgram={this.resetSelectedProgram}
                        />
                    </Col>
                    <Col xs="4">
                        <MapEditor 
                            university={this.props.university} 
                            programs={this.state.programs}
                            selectedProgram={this.state.selectedProgram}
                            getSelectedProgramAndSetState={this.getSelectedProgramDataAndSetState}
                            savedMaps={this.props.savedMaps}
                            coreRequirements={this.props.coreRequirements}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }

    fetchUniversityProgramsAndUpdateState(universityId){
        fetch(
            `${ROOT_URL}/programs_by_university/${universityId}`,
        ).then(
            response => response.json()
        ).then(
            programList => {
                this.setState({
                    programs:programList
                });
            }
        );
    }

}

RequirementsComponent.propTypes = {
    university:PropTypes.object.isRequired
}

const Requirements = WithSavedMaps(RequirementsComponent);

export default Requirements;