import React from 'react';
import {
    Container,
    Card,
    CardHeader,
    CardBody,
    CardText,
} from 'reactstrap';
import PropTypes from 'prop-types';

export default class RequirementsCard extends React.Component{
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
        return(
            <Card>
                <CardHeader>
                    <h4>Program Requirements: {this.props.university.university_name}</h4>
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

const ProgramSelector = (props) => (
    <div id="program-selector">
        <select 
            className="custom-select w-75" 
            onChange={props.handleSelection}
            value={props.selectedProgramId}
        >
            <option value="-1">Please select a program.</option>
            {props.programs.map((obj) =>
                (
                    <option value={obj.program_id} key={obj.program_id}>{obj.program_name}</option>
                )
            )}
        </select>
    </div>);

const SJCCourseFilter = (props) => (
    <div id="SJC-course-filter">
        <input 
            type="checkbox" 
            checked={props.showSJCCourses}
            onChange={props.toggle} 
        />
        &nbsp;Show SJC Courses
    </div>);

const SelectedRequirements = (props) => {
    var programName = props.program.program_name;
    var programLink = props.program.program_link;
    var components = props.program.components || [];
    var showSJCCourses = props.showSJCCourses;

    return (
        <div id="selected-requirements">
            <hr/>
            <Container className="selected-requirements">
                <h5><a href={programLink} style={{float:"left"}} target="_blank">{programName}</a></h5>
                <br/>
                {components.map((component,i) => (
                    <div className="degreeComponent" key={i}>
                        <h6 className="mb-1" key={i}><strong>{component.component_name}</strong></h6>
                        <ul className="requirementList">
                            {component.requirements.map((requirement,i) => (
                                <div className="degreeRequirement" key={'requirementList'+i}>
                                    <li className="requirementItem" key={'requirementItem'+i}>
                                        {requirement.requirement_name}
                                    </li>
                                    <ul className="courseList" key={'courseList'+i}>
                                        {requirement.courses.map((course,i) => {
                                            if(course.sjc_course && showSJCCourses){
                                                return (
                                                    <li className="courseRequirement" key={'SJCcourseItem'+i} style={{color:"green"}}>
                                                        {course.sjc_course.sjc_rubric} {course.sjc_course.sjc_number} - {course.sjc_course.sjc_name}
                                                    </li>
                                                )
                                            } else{
                                                return (
                                                    <li className="courseRequirement" key={'courseItem'+i}>
                                                        {course.course_rubric} {course.course_number} - {course.course_name}
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
                </Container>
        </div>
    )

};

RequirementsCard.propTypes = {
    university: PropTypes.object
}

ProgramSelector.propTypes = {
    programs: PropTypes.array,
    selectedProgramId: PropTypes.string,
    handleSelection: PropTypes.func
}

SJCCourseFilter.propTypes = {
    showSJCCourses: PropTypes.bool,
    toggle: PropTypes.func
}

SelectedRequirements.propTypes = {
    selectedRequirements: PropTypes.object,
    showSJCCourses: PropTypes.bool
}