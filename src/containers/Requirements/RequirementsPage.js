import React from 'react';
import {Container, Col,Row} from 'reactstrap';
import RequirementsCard from './RequirementsCard';
import EditorCard from './EditorCard';
import {ROOT_URL} from '../../api';
import PropTypes from 'prop-types';
import {WithLogin} from '../../contexts/LoginContext';

const Requirements = WithLogin(RequirementsCard);
const Editor = WithLogin(EditorCard);

export default class RequirementsPage extends React.Component{
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
            `${ROOT_URL}/requirements_by_program/${programId}`
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
        return(
            <Container style={{paddingTop:'100px'}}>
                <Row>
                    <Col xs="8">
                        <Requirements 
                            university={this.props.university} 
                            programs={this.state.programs}
                            selectedProgram={this.state.selectedProgram}
                            getSelectedProgramDataAndSetState={this.getSelectedProgramDataAndSetState}
                            resetSelectedProgram={this.resetSelectedProgram}
                        />
                    </Col>
                    <Col xs="4">
                        <Editor 
                            university={this.props.university} 
                            programs={this.state.programs}
                            selectedProgram={this.state.selectedProgram}
                            getSelectedProgramAndSetState={this.getSelectedProgramDataAndSetState}
                            savedMaps={this.props.savedMaps}
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

RequirementsPage.propTypes = {
    university: PropTypes.object,
}