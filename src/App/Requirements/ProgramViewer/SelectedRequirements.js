import React from 'react';
import {Container} from 'reactstrap';
import PropTypes from 'prop-types';

const SelectedRequirements = (props) => {
    var programName = props.program.program_name;
    var programLink = props.program.program_link;
    var components = props.program.components || [];
    var showSJCCourses = props.showSJCCourses;
    console.log(props.program);
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

SelectedRequirements.propTypes = {
    program:PropTypes.object.isRequired,
    showSJCCourses:PropTypes.bool.isRequired
}

export default SelectedRequirements;