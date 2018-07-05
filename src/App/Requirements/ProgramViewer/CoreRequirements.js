import React from 'react';
import {Container} from 'reactstrap';
import {PropTypes} from 'prop-types';

export default class CoreRequirements extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let coreRequirements = this.props.coreRequirements;
        let {university_name} = this.props.university;
        return (
        <Container>
            <h5>{`Core Requirements for ${university_name}`}</h5>
            {
                Object.keys(coreRequirements).map(
                    req => (
                        <ul>
                            <h5>Component Area: {req}</h5>
                            {
                                coreRequirements[req].map(
                                    course => (
                                        <li>
                                            {course.rubric} {course.number} - {course.name}
                                        </li>
                                    )
                                )
                            }
                        </ul>
                    )
                )
            }
        </Container>
        )

    }
}

CoreRequirements.propTypes = {
    university:PropTypes.object.isRequired
}