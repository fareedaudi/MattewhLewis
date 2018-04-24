import React from 'react';
import {
    Container,
    Card,
    CardHeader,
    CardBody,
    CardText,
} from 'reactstrap';
import {ROOT_URL} from '../../api';

export default class RequirementsCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedProgram:{},
            showSJCCourses:false,
            selectedProgramId:-1
        }
        this.handleProgramSelection = this.handleProgramSelection.bind(this);
        this.toggleSJCCourses = this.toggleSJCCourses.bind(this);
    }

    handleProgramSelection(ev){
        this.setSelectorToSelected(ev.target.value);
        if(this.realSelection(ev)){
            this.getSelectedProgramDataAndSetState(ev.target.value);
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.university !== this.props.university){
            this.setState({
                selectedProgram:{},
                showSJCCourses:false,
                selectedProgramId:-1
            });
        }
    }

    setSelectorToSelected(selectedProgramId){
        this.setState({
            selectedProgramId:selectedProgramId
        });
    }

    getSelectedProgramDataAndSetState(prog_id){
        fetch(
            `${ROOT_URL}/requirements_by_program/${prog_id}`
        ).then(
            response => response.json()
        ).then(
            programData => {
                this.setState({
                    selectedProgram:programData
                });
            }
        )
    }

    toggleSJCCourses(){
        this.setState({
            showSJCCourses:!this.state.showSJCCourses
        });
    }

    realSelection(ev){
        return ev.target.value !== -1
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
                            selectedProgramId={this.state.selectedProgramId}
                            handleSelection={this.handleProgramSelection} 
                        />
                        <SJCCourseFilter
                            showSJCCourses={this.state.showSJCCourses}
                            toggle={this.toggleSJCCourses}
                        />
                    </div>
                </CardBody>
                { this.state.selectedProgramId !== '-1' &&
                <SelectedRequirements 
                    program={this.state.selectedProgram}
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