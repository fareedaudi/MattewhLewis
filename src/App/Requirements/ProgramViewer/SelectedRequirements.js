import React from 'react';
import {Container} from 'reactstrap';
import PropTypes from 'prop-types';

const SelectedRequirements = (props) => {
    let {program_name,program_link,program_components} = props.program;
    let showSJCCourses = props.showSJCCourses;
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 375;
    return (
        <div id="selected-requirements">
            <hr/>
            <Container className="selected-requirements" style={{maxHeight:h,overflowY:'scroll'}}>
                <h5><a href={program_link} style={{float:"left"}} target="_blank">{program_name}</a></h5>
                <br/>
                {program_components.map((component,i) => (
                    <div className="degreeComponent" key={i}>
                        <h6 className="mb-1" key={i}><strong>{component.prog_comp_name}</strong></h6>
                        <ul>
                            {
                                component.requirements.map(
                                    (requirement,i) => {
                                        let name = requirement.prog_comp_req_name;
                                        let junkAtEnd = requirement.prog_comp_req_name.match(/\d/);
                                        if(junkAtEnd){
                                            name = name.substring(0,junkAtEnd.index);
                                        }
                                        return(
                                        <li key={i}>
                                        {name   }
                                        <ul>
                                            {requirement.courses.map(
                                                (course,i) =>
                                                    {
                                                        if(course.sjc_course && showSJCCourses){
                                                            return <li key={i} style={{color:'green'}}>{course.sjc_course.sjc_rubric} {course.sjc_course.sjc_number} - {course.sjc_course.sjc_name}</li>
                                                        } else {
                                                            return <li key={i}>{course.course_rubric} {course.course_number} - {course.course_name}</li>
                                                        }
                                                        
                                                    }
                                                        
                                                )
                                            }
                                        </ul>
                                        
                                        
                                        </li>)
                                    }
                                )
                            }
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