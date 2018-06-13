import React from 'react';
import {
    Form,
    FormGroup,
    Input,
    FormFeedback,
    FormText,
    Button,
    Label
} from 'reactstrap';
import PropTypes from 'prop-types';
import {Prompt} from 'react-router-dom';

export default class MapForm extends React.Component{
    constructor(props){
        super(props);
        let {name, components} = this.props.savedMapToEdit;
        
        let componentAreas = components.reduce(
            (componentAreas,component) => {
                let extractedAreas = component.fields.reduce(
                    (extractedAreas,fieldObj) => {
                        extractedAreas[fieldObj.name] = (fieldObj.course.id | "-1");
                        return extractedAreas;
                    },
                    {}
                );
                componentAreas = {...componentAreas,...extractedAreas}
                return componentAreas;
            },
            {});
        
        this.state = {
            mapName:name,
            dateCreated:'',
            componentAreas
        };
        this.defaultCourseOptions = {
            comm_010:[
                {
                    id:17,
                    name:"Composition I",
                    rubric:"ENGL",
                    number:"1301"
                },
                {
                    id:18,
                    name:"Composition I(",
                    rubric:"ENGL",
                    number:"1302"
                }
            ],
            math_020:[
                {
                    id:42,
                    name:"Math for Business and Social Sciences",
                    rubric:"MATH",
                    number:"1324"
                }
            ],
            sci_030:[
                {
                    id:12,
                    name:"Biology for Science Majors I (lecture)",
                    rubric:"BIOL",
                    number:"1306"
                },
                {
                    id:13,
                    name:"Biology for Science Majors II (lecture)",
                    rubric:"BIOL",
                    number:"1307"
                },
                {
                    id:44,
                    name:"Anatomy & Physiology I (lecture)",
                    rubric:"BIOL",
                    number:"2301"
                },
                {
                    id:45,
                    name:"Anatomy & Physiology II (lecture)",
                    rubric:"BIOL",
                    number:"2302"
                }
            ],
            phil_040: [
                {
                    id:33,
                    name:"Introduction to the Humanities",
                    rubric:"HUMA",
                    number:"1301"
                },
            ]
        }
    }

    handleNameChange = ({target:{value}}) => {
        this.setState({mapName:value});
    }

    handleCourseSelection = (fieldName,{target:{value}}) => {
        if(value === "-2"){
            console.log(`Unconventional course selection for ${fieldName}!`);
            return;
        }
        let fieldObj = {};
        fieldObj[fieldName] = value
        this.setState({
            componentAreas:{...this.state.componentAreas,...fieldObj}
        });
    }

    componentDidUpdate(){
        let {program_id, components} = this.props.selectedProgram;
        if(program_id !== -1){
            let courses = components.reduce(
                (courses,component) => {
                    let coursesToAdd = component.requirements.reduce(
                        (coursesToAdd,requirement) => {
                            requirement.courses.forEach(
                                course => {
                                    if(course.sjc_course !== null){
                                        coursesToAdd.push(course.sjc_course);
                                    }
                                }
                            );
                            return coursesToAdd;
                        },[]
                    );
                    courses = [...courses,...coursesToAdd];
                    return courses;
                },[]
            );
            this.coursesByRubric = courses.reduce(
                (coursesByRubric,course) => {
                    if(coursesByRubric[course.sjc_rubric]){
                        coursesByRubric[course.sjc_rubric] = coursesByRubric[course.sjc_rubric].filter(crs => (crs.sjc_id !== course.sjc_id));
                        coursesByRubric[course.sjc_rubric].push(course);
                    } else {
                        coursesByRubric[course.sjc_rubric] = [course];
                    }
                    return coursesByRubric;
                }, {}
            );
            console.log(this.coursesByRubric);
        }
    }

    render(){
        window.onbeforeunload = () => {
            sessionStorage.setItem('prevMapState',JSON.stringify(this.state));
            console.log(this.state);
        }
        let {name,univ_name,prog_name,components} = this.props.savedMapToEdit;
        let courseSelectionFields = components.map(
            component => (
                    <FormGroup>
                        <Label>{component.comp_name}</Label>
                        {component.fields.map(
                            field => <Input 
                                        key={field.name} 
                                        type={"select"}
                                        value={this.state.componentAreas[field.name]}
                                        onChange={(ev) => {this.handleCourseSelection(field.name,ev)}}
                                    >
                                        <option value={"-1"}> Please select a course.</option>
                                        <option value={"1"}>ENGL 1301 Composition I</option>
                                        <option value={"2"}>ENGL 1302 Composition I</option>
                                        <option value={"-2"}>Select another course</option>
                                    </Input>
                        )}
                    </FormGroup>
                 )
        );
        return (
        <div>
            <Form>
                <FormGroup>
                    <label>Transfer University:</label>
                    <Input key={"univ_name"} type="text" value={univ_name} disabled/>
                </FormGroup>
                <FormGroup>
                    <label>Transfer Program:</label>
                    <Input key={"prog_name"} type="text" value={prog_name} disabled/>
                </FormGroup>
                <FormGroup>
                    <label>Map Name:</label>
                    <Input key={"map_name"} type="text" value={this.state.mapName} onChange={this.handleNameChange}/>
                </FormGroup>
                <hr/>
                {courseSelectionFields}
            </Form>
        </div>
        )
    }
}

MapForm.propTypes = {
    savedMapToEdit:PropTypes.object.isRequired
}