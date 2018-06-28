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
        console.log({componentAreas});
        
        this.state = {
            mapName:name,
            dateCreated:'',
            componentAreas,
        };
        this.selectedIds = new Set();
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
        let previousSelectionId = this.state.componentAreas[fieldName];
        if(String(previousSelectionId) !== '-1'){
            this.selectedIds.delete(previousSelectionId);
        }
        this.selectedIds.add(value);
        fieldObj[fieldName] = value;
        this.setState({
            componentAreas:{...this.state.componentAreas,...fieldObj}
        });
        console.log(this.selectedIds);
        console.log(fieldObj);
    }

    getCoursesByCode = () => {
        let {program_id, requirements} = this.props.selectedProgram;
        if(program_id !== -1){
            var coursesByCode = requirements.reduce(
                (coursesByCode,requirement) => {
                    let code = requirement.requirement_code;
                    if(code.includes('09') || code===""){
                        if(code !== '090'){
                            code = '100';
                        }
                    }
                    let sjcCourses = requirement.courses.filter(course => !!course.sjc_course).map(course => course.sjc_course)
                    if(coursesByCode[code]){
                        coursesByCode[code] = [...coursesByCode[code],...sjcCourses]
                    } else {
                        coursesByCode[code] = sjcCourses;
                    }
                    return coursesByCode;
                },{}
            );
            return coursesByCode;
        }
        return {};
    }



    getCoursesFromComponentArea = (coursesByCode,compArea) => {
        let code = compArea.match(/0\d0/);
        if(coursesByCode==={}){
            return [];
        } else if(code) {
            code = code[0];
            return coursesByCode[code] || [];
        } else {
            code='100';
            console.log(coursesByCode['100']);
            return coursesByCode[code] || [];
        }
        
    }

    sortByRubricThenNumber = (course1,course2) => {
        if(course1.sjc_rubric>course2.sjc_rubric){
            return 1;
        } else if(course1.sjc_rubric===course2.sjc_rubric){
            if(course1.sjc_number>course2.sjc_number){
                return 1;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }

    render(){
        window.onbeforeunload = () => {
            sessionStorage.setItem('prevMapState',JSON.stringify(this.state));
            console.log(this.state);
        }
        let coursesByCode = this.getCoursesByCode();
        console.log({coursesByCode})
        let {name,univ_name,prog_name,components} = this.props.savedMapToEdit;
        let courseSelectionFields = components.map(
            component => (
                    <FormGroup key={"formgroup"+component.comp_name}>
                        <Label>{component.comp_name}</Label>
                        {component.fields.map(
                            field => <Input 
                                        key={field.name} 
                                        type={"select"}
                                        value={this.state.componentAreas[field.name]}
                                        onChange={(ev) => {this.handleCourseSelection(field.name,ev)}}
                                    >
                                    <option value={"-1"}>Please select a course.</option>
                                        {
                                            this.getCoursesFromComponentArea(coursesByCode,field.name)
                                            .sort(this.sortByRubricThenNumber)
                                            .map(
                                                course => <option value={course.sjc_id} disabled={this.selectedIds.has(String(course.sjc_id))}>{course.sjc_rubric} {course.sjc_number} - {course.sjc_name}</option>
                                            )
                                        }
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