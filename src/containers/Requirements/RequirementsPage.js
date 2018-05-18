import React from 'react';
import {Container, Col,Row} from 'reactstrap';
import RequirementsCard from './RequirementsCard';
import EditorCard from './EditorCard';
import {ROOT_URL} from '../../api';
import PropTypes from 'prop-types';
import {WithLogin} from '../../contexts/LoginContext';


export default class RequirementsPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            university:this.props.university,
            programs:[],
        }
        this.renderCount = 0;
    }

    componentDidMount(){
        let universityId = this.props.university.university_id;
        this.fetchUniversityProgramsAndUpdateState(universityId);
    }

    static getDerivedStateFromProps(nextProps,prevState){
        if(prevState.university !== nextProps.university){
            return {
                programs:[]
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
        this.renderCount += 1;
        console.log(`RequirementsPage rendered ${this.renderCount} time with: `,this.state);
        const Requirements = WithLogin(RequirementsCard);
        const Editor = WithLogin(EditorCard);
        return(
            <Container style={{paddingTop:'100px'}}>
                <Row>
                    <Col xs="8">
                        <Requirements 
                            university={this.props.university} 
                            programs={this.state.programs}
                        />
                    </Col>
                    <Col xs="4">
                        <Editor 
                            university={this.props.university} 
                            programs={this.state.programs}/>
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