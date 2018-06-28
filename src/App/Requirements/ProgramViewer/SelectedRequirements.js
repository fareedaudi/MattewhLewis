import React from 'react';
import {Container} from 'reactstrap';
import PropTypes from 'prop-types';

const SelectedRequirements = (props) => {
    var programName = props.program.program_name;
    var programLink = props.program.program_link;
    var requirements = props.program.requirements || [];
    var showSJCCourses = props.showSJCCourses;
    return (
        <div id="selected-requirements">
            <hr/>
            <Container className="selected-requirements">
                <h5><a href={programLink} style={{float:"left"}} target="_blank">{programName}</a></h5>
                <br/>
                {requirements.map((requirement,i) => (
                    <div className="degreeComponent" key={i}>
                        <h6 className="mb-1" key={i}><strong>{requirement.requirement_name}</strong></h6>
                        <ul className="requirementList">
                            {requirement.courses.map((course,i) => (
                                <div className="degreeRequirement" key={'requirementList'+i}>
                                    {(course.sjc_course && showSJCCourses)?
                                        <li className="requirementItem" key={'requirementItem'+i}  style={{color:'green'}}>
                                            {course.sjc_course.sjc_rubric} {course.sjc_course.sjc_number} - {course.sjc_course.sjc_name}
                                        </li>:
                                        <li className="requirementItem" key={'requirementItem'+i}>
                                            {course.course_rubric} {course.course_number} - {course.course_name}
                                        </li>
                                    }
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