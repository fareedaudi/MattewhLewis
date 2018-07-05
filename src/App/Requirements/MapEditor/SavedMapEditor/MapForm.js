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
import { WithSJCCourses } from '../../../../contexts/SJCCourseContext';

export class MapFormComponent extends React.Component{
    constructor(props){
        super(props);
        let {name, components} = this.props.savedMapToEdit;
        let componentAreas = components.reduce(
            (componentAreas,component) => {
                let extractedAreas = component.fields.reduce(
                    (extractedAreas,fieldObj) => {
                        let field = fieldObj.name;
                        let course = fieldObj.course;
                        let id = course.id;
                        extractedAreas[field] = id || "-1";
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
            componentAreas,
            customCourseModalOpen:false,
        };
        this.selectedIds = new Set();
        for(let field in componentAreas){
            if(componentAreas[field] !== "-1"){
                this.selectedIds.add(String(componentAreas[field]));
            }
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
        let previousSelectionId = this.state.componentAreas[fieldName];
        if(String(previousSelectionId) !== '-1'){
            this.selectedIds.delete(previousSelectionId);
        }
        this.selectedIds.add(value);
        fieldObj[fieldName] = value;
        this.setState({
            componentAreas:{...this.state.componentAreas,...fieldObj}
        });
    }

    getCodeFromCompArea = (compArea) => {
        let code = compArea.match(/0\d0/);
        if(code){
            code = code[0];
        } else {
            code = '100';
        }
        return code;
    }

    getCoursesByCode = () => {
        let {program_id, requirements} = this.props.selectedProgram;
        if(program_id !== -1){
            var coursesByCode = requirements.reduce(
                (coursesByCode,requirement) => {
                    let code = requirement.requirement_code;
                    if(code.includes('09')){
                        code = '090';
                    }
                    if(code === ""){
                        code = '100';
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
            let componentAreas = this.state.componentAreas;
            for(var field in componentAreas){
                let courseId = componentAreas[field];
                if((courseId !== -1) && (courseId !== "-1")){
                    let courseIds = new Set();
                    let programCourses = this.getCoursesFromComponentArea(coursesByCode,field);
                    programCourses.forEach(
                        course=>courseIds.add(String(course.sjc_id)));
                    if(!courseIds.has(String(courseId))){
                        let course = this.props.SJCCourses.filter(course=>course.id===courseId);
                        if(course){
                            course = course[0];
                            var sjc_course = {
                                sjc_name:course.name,
                                sjc_id:course.id,
                                sjc_number:course.number,
                                sjc_rubric:course.rubric
                            };
                        }
                        let code = this.getCodeFromCompArea(field);
                        coursesByCode[code].push(sjc_course);
                        this.selectedIds.add(String(sjc_course.sjc_id));
                    }
                }
            }
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
        }
        let coursesByCode = this.getCoursesByCode();
        let {id,univ_name,prog_name,components} = this.props.savedMapToEdit;
        let {componentAreas} = this.state;
        let name = this.state.mapName;
        let mapData = {id,name,componentAreas};
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
                                                course => <option 
                                                            value={course.sjc_id} 
                                                            disabled={this.selectedIds.has(String(course.sjc_id))}
                                                        > 
                                                            {course.sjc_rubric} {course.sjc_number} - {course.sjc_name}
                                                        </option>
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
            <Button className="btn-sm" color="secondary" onClick={this.props.handleClose}>Close</Button>
            <Button className="btn-sm" color="primary" onClick={()=>this.props.handleSave(mapData)}>Save</Button>
        </div>
        )
    }
}

MapFormComponent.propTypes = {
    savedMapToEdit:PropTypes.object.isRequired
}

const MapForm = WithSJCCourses(MapFormComponent);

export default MapForm;