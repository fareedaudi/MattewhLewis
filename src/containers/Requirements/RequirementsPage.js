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
            university:{},
            programs:[]
        }
    }

    componentDidMount(){
        let univ_id = this.props.match.params.univ_id;
        this.fetchUniversityProgramsAndUpdateState(univ_id);
        if(this.props.universities.length > 0){
            this.setState({
                university:this.props.universities.filter((univ)=>(String(univ.university_id) === univ_id))[0]
            });
        }
    }

    componentWillReceiveProps(nextProps){
        let univ_id = nextProps.match.params.univ_id;
        this.fetchUniversityProgramsAndUpdateState(univ_id);
        this.setState({
            university:nextProps.universities.filter((univ)=>(String(univ.university_id) === univ_id))[0]
        });
        
    }

    render(){
        const Requirements = WithLogin(RequirementsCard);
        const Editor = WithLogin(EditorCard);
        return(
            <Container style={{paddingTop:'100px'}}>
                <Row>
                    <Col xs="8">
                        <Requirements 
                            university={this.state.university} 
                            programs={this.state.programs}
                        />
                    </Col>
                    <Col xs="4">
                        <Editor universities={this.props.universities} programs={this.state.programs}/>
                    </Col>
                </Row>
            </Container>
        )
    }

    fetchUniversityProgramsAndUpdateState(univ_id){
        fetch(
            `${ROOT_URL}/programs_by_university/${univ_id}`,
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
    universities: PropTypes.array,
}