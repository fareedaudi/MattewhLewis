import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {WithLogin} from '../../../contexts/LoginContext';
import ProgramSelector from './ProgramSelector';
import SJCCourseFilter from './SJCCourseFilter';
import SelectedRequirements from './SelectedRequirements';

class ProgramViewerComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showSJCCourses:false,
        }
        this.handleProgramSelection = this.handleProgramSelection.bind(this);
        this.toggleSJCCourses = this.toggleSJCCourses.bind(this);
    }

    handleProgramSelection(ev){
        if(this.realSelection(ev)){
            this.props.getSelectedProgramDataAndSetState(ev.target.value);
        } else {
            this.props.resetSelectedProgram();
        }
        this.props.login.actions.makeRecentlyActive();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.university !== this.props.university){
            this.setState({
                showSJCCourses:false,
            });
            this.props.resetSelectedProgram();
        }
    }

    toggleSJCCourses(){
        this.setState({
            showSJCCourses:!this.state.showSJCCourses
        });
        this.props.login.actions.makeRecentlyActive();
    }

    realSelection(ev){
        return ev.target.value !== '-1'
    }

    render(){
        console.log(this.props.selectedProgram);
        return(
            <Card>
                <CardHeader>
                    <h4>Programs: {this.props.university.university_name}</h4>
                </CardHeader>
                <CardBody>
                    <CardText>
                        Use this tool to identify applicable SJC courses for a particular major.
                    </CardText>
                    <div style={{textAlign:'center'}}>
                        <ProgramSelector 
                            programs={this.props.programs}
                            selectedProgramId={String(this.props.selectedProgram.program_id)}
                            handleSelection={this.handleProgramSelection}
                        />
                        <SJCCourseFilter
                            showSJCCourses={this.state.showSJCCourses}
                            toggle={this.toggleSJCCourses}
                        />
                    </div>
                </CardBody>
                { String(this.props.selectedProgram.program_id) !== '-1' &&
                <SelectedRequirements 
                    program={this.props.selectedProgram}
                    showSJCCourses={this.state.showSJCCourses}
                />
                }
            </Card>
        )
    }

}

ProgramViewerComponent.propTypes = {
    university:PropTypes.object.isRequired,
    programs:PropTypes.array.isRequired,
    selectedProgram:PropTypes.object.isRequired,
    getSelectedProgramDataAndSetState:PropTypes.func.isRequired,
    resetSelectedProgram:PropTypes.func.isRequired
}

const ProgramViewer = WithLogin(ProgramViewerComponent);
export default ProgramViewer;





