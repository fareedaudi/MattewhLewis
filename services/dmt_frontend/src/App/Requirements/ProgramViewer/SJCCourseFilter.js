import React from 'react';
import PropTypes from 'prop-types';

const SJCCourseFilter = (props) => (
    <div id="SJC-course-filter">
        <input 
            type="checkbox" 
            checked={props.showSJCCourses}
            onChange={props.toggle} 
        />
        &nbsp;Show SJC Courses
    </div>
);

SJCCourseFilter.propTypes = {
    showSJCCourses:PropTypes.bool.isRequired,
    toggle:PropTypes.func.isRequired
}

export default SJCCourseFilter;