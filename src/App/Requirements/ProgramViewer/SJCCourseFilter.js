import React from 'react';

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

export default SJCCourseFilter;