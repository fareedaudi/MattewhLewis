import React from 'react';
import {Container, Col,Row} from 'reactstrap';
import RequirementsCard from './RequirementsCard';
import EditorCard from './EditorCard';
import {ROOT_URL} from '../../api';
import LoginContext from '../../contexts/LoginContext';


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
                university:this.props.universities.filter((univ)=>(univ.university_id == univ_id))[0]
            });
        }
    }

    componentWillReceiveProps(nextProps){
        let univ_id = nextProps.match.params.univ_id;
        this.fetchUniversityProgramsAndUpdateState(univ_id);
        this.setState({
            university:nextProps.universities.filter((univ)=>(univ.university_id == univ_id))[0]
        });
        
    }

    render(){
        return(
            <Container style={{paddingTop:'100px'}}>
                <Row>
                    <Col xs="8">
                        <RequirementsCard 
                            university={this.state.university} 
                            programs={this.state.programs}
                        />
                    </Col>
                    <Col xs="4">
                        <LoginContext.Consumer>
                            {
                                (login)=>(
                                    <EditorCard login={login}/>
                                )
                            }
                        </LoginContext.Consumer>
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

