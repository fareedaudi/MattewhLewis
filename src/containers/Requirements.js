import React from 'react';
import {Container,Row,Col,Card,CardHeader,CardBody,CardText} from 'reactstrap';

export default class Requirements extends React.Component {
    constructor(props){
        super(props);
        this.defaultState = {
            programs:[],
            univNameMap:{},
            selectedProgram:"-1",
            showRequirements:false,
            programRequirements:{},
            showSJCCourses:false
        }
        this.state = {
            univ_id: props.match.params.univ_id,
            ...this.defaultState
        }
        this.handleProgramSelection = this.handleProgramSelection.bind(this);
        this.toggleSJC = this.toggleSJC.bind(this);
    }

    resetState(univ_id){
        this.setState({
            univ_id:univ_id,
            ...this.defaultState
        })
    }

    handleProgramSelection(ev){
        var selectedProgram = ev.target.value;
        var showRequirements = selectedProgram !== "-1";
        this.setState({
            selectedProgram:selectedProgram,
            showRequirements:(selectedProgram !== '-1')
        });
        if(showRequirements){
            fetch(
                'http://localhost:5000/requirements_by_program/'+selectedProgram
            ).then(
                response => response.json()
            ).then(
                programRequirements => {
                    this.setState({
                        programRequirements:programRequirements
                    });
                }
            )
        }

    }

    componentDidMount(){
        fetch(
            'http://localhost:5000/programs_by_university/'+this.state.univ_id
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

    toggleSJC(){
        this.setState({
            showSJCCourses:!this.state.showSJCCourses
        })
    }

    componentWillReceiveProps(nextProps){
        if(this.props.location.pathname !== nextProps.location.pathname){
            var univ_id = nextProps.match.params.univ_id;
            this.resetState(univ_id);
            fetch(
                'http://localhost:5000/programs_by_university/'+univ_id
            ).then(
                response => response.json()
            ).then(
                programList => {
                this.setState({
                    programs:programList,
                    univ_id:nextProps.match.params.univ_id
                });
            }
            );
        }
    }

    componentDidUpdate(){
    }

    render(){
        return (
            <Container style={{paddingTop:"100px"}} className="">
                <Row>
                    <Col xs="8">
                        <Card>
                            <CardHeader>
                                <h4>Program Requirements: {this.props.univNameMap[this.state.univ_id]}</h4>
                            </CardHeader>
                            <CardBody>
                                <CardText>
                                    Use this tool to identify applicable SJC courses for a particular major.
                                </CardText>
                                <div style={{textAlign:'center'}}>
                                <select defaultValue="-1" className="custom-select w-75" onChange={this.handleProgramSelection}>
                                    <option value="-1">Please select a program.</option>
                                    {this.state.programs.map((obj) =>
                                        (
                                            <option value={obj.program_id} key={obj.program_id}>{obj.program_name}</option>
                                        )
                                    )}
                                </select>
                                <br/>
                                <input type="checkbox" checked={this.state.showSJCCourses} onClick={this.toggleSJC}>
                                </input>&nbsp;Show SJC Courses
                                </div>
                                </CardBody> 
                                <SelectedRequirements selectedProgram={this.state.selectedProgram} programRequirements={this.state.programRequirements} showSJCCourses={this.state.showSJCCourses}/>
                        </Card>
                    </Col>
                    <Col xs="4">
                        <Card>
                            <CardHeader>
                                <h4>Degree Map Editor</h4>
                            </CardHeader>
                            <CardBody>
                                <p> Stuff!</p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

class SelectedRequirements extends React.Component{
    componentWillReceiveProps(nextProps){
    }
    render(){
        var programName = this.props.programRequirements.program_name;
        var programLink = this.props.programRequirements.program_link;
        var components = this.props.programRequirements.components || [];
        var showSJCCourses = this.props.showSJCCourses;
        return(
            <div>
                {this.props.selectedProgram !== "-1"?
                <div>
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
                                                if((course.sjc_course !== null)&&(showSJCCourses)){
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
                </div>:''
                }
            </div>    
        )
    }
}

