import React from 'react';
import {
    Form,
    FormGroup,
    Input,
    Button,
    Label,
    FormFeedback
} from 'reactstrap';
import PropTypes from 'prop-types';
import { WithSJCCourses } from '../../../../contexts/SJCCourseContext';
import AlternativeCourseModal from './AlternativeCourseModal';

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
            altCourseModalOpen:false,
            altCourseModalField:''
        };
        this.selectedIds = new Set();
        for(let field in componentAreas){
            if(componentAreas[field] !== "-1"){
                this.selectedIds.add(String(componentAreas[field]));
            }
        }
        this.nonApplicableIds = new Set();
    }

    componentDidMount(){
        this.nonApplicableIds = new Set();
    }

    componentWillUnMount(){
        delete this.nonApplicableIds;
    }

    handleNameChange = ({target:{value}}) => {
        this.setState({mapName:value});
    }

    toggleAltCourseModal = () => {
        this.setState({
            altCourseModalOpen:!this.state.altCourseModalOpen
        });
    }

    createCourseModal = (fieldName) => {
        this.setState({
            altCourseModalField:fieldName,
            altCourseModalOpen:true
        });
    }

    getSelectionFromModal = (field,id) => {
        let fieldObj = {};
        fieldObj[field]=id;
        if(!this.selectedIds.has(String(id))){
            let prevId = this.state.componentAreas[field];
            if(prevId !== -1){
                this.selectedIds.delete(String(prevId));
                console.log(this.selectedIds);
            }
            this.setState({
                componentAreas:{...this.state.componentAreas,...fieldObj}
            });
        }
        
    }

    handleCourseSelection = (fieldName,{target:{value}}) => {
        if(value === "-2"){
            this.createCourseModal(fieldName);
            return;
        }
        let fieldObj = {};
        let previousSelectionId = this.state.componentAreas[fieldName];
        console.log(`Previously selected course id: ${previousSelectionId}`)
        if(String(previousSelectionId) !== '-1'){
            this.selectedIds.delete(String(previousSelectionId));
            console.log(this.selectedIds);
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

    cleanCourses = (sjcCourses) => {
        sjcCourses.forEach(
            course=>{
                let number = course.sjc_number;
                course.sjc_number = number.substring(0,1)+'4'+number.substring(2)
                let parenStuff = course.sjc_name.match(/\(\S+\)/);
                if(parenStuff){
                    course.sjc_name=course.sjc_name.substring(0,parenStuff.index)
                }
            }
        )
        return sjcCourses;
    }

    getCoursesByCode = () => {
        let {program_id, program_components} = this.props.selectedProgram;
        if(program_id !== -1){
            var coursesByCode = program_components.reduce(
                (coursesByCode,component) => {
                    let subCoursesByCode = component.requirements.reduce(
                        (subCoursesByCode,requirement) => {
                            let coursesToAdd = requirement.courses.filter(
                                    course => !!course.sjc_course
                                ).map(course => course.sjc_course);
                            let code = requirement.prog_comp_req_code;
                            if(subCoursesByCode[code]){
                                subCoursesByCode[code] = subCoursesByCode[code].concat(coursesToAdd);
                            } else {
                                subCoursesByCode[code] = coursesToAdd;
                            }
                            return subCoursesByCode;
                        },{}
                    );
                    for(let code in subCoursesByCode){
                        if(coursesByCode[code]){
                            coursesByCode[code] = coursesByCode[code].concat(subCoursesByCode[code]);
                        } else {
                            coursesByCode[code] = subCoursesByCode[code];
                        }
                    }
                    return coursesByCode;
                },{}
            );
            let {componentAreas} = this.state;
            for(let field in componentAreas){
                let courseId = componentAreas[field];
                if((courseId !== -1) && (courseId !== "-1")){
                    let courseIds = new Set();
                    let programCourses = this.getCoursesFromComponentArea(coursesByCode,field);
                    programCourses.forEach(
                        course=>courseIds.add(String(course.sjc_id)));
                    if(!courseIds.has(String(courseId))){
                        let course = this.props.SJCCourses.filter(course=>course.id===courseId);
                        if(course.length>0){
                            course = course[0];
                            this.nonApplicableIds.add(course.id);
                            var sjc_course = {
                                sjc_name:course.name,
                                sjc_id:course.id,
                                sjc_number:course.number,
                                sjc_rubric:course.rubric,
                                not_applicable:true
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

    saveMapLocally = (mapData) => {
        let saveId = this.props.login.state.userEmail+this.props.savedMapToEdit.id;
        localStorage.setItem(saveId,mapData);
    }

    getCoursesFromComponentArea = (coursesByCode,compArea) => {
        if(coursesByCode==={}){
            return [];
        }
        let code = compArea.match(/0\d0/);
        if(code) {
            code = code[0];
            return coursesByCode[code] || [];
        } else if(compArea.includes("inst_opt")){
            return [
                {
                    sjc_id:37,
                    sjc_rubric:'BCIS',
                    sjc_number:'1305',
                    sjc_name:'Business Computer Applications'
                },
                {
                    sjc_id:253,
                    sjc_rubric:'PSYC',
                    sjc_number:'1300',
                    sjc_name:'Learning Framework'
                },
                {
                    sjc_id:132,
                    sjc_rubric:'EDUC',
                    sjc_number:'1300',
                    sjc_name:'Learning Framework'
                }
            ];
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
        let saveId = this.props.login.state.userEmail+this.props.savedMapToEdit.id;
        console.log(localStorage.getItem(saveId));
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
                        <Label><strong>{component.comp_name}:</strong></Label>
                        {component.fields.map(
                            field => {
                                let courses = this.getCoursesFromComponentArea(coursesByCode,field.name);
                                return (<div key={field.name}><Input 
                                        key={field.name} 
                                        type={"select"}
                                        value={this.state.componentAreas[field.name]}
                                        onChange={(ev) => {this.handleCourseSelection(field.name,ev)}}
                                        invalid={this.nonApplicableIds.has(this.state.componentAreas[field.name])}
                                    >
                                    <option value={"-1"}>Please select a course.</option>
                                        {
                                            courses
                                            .sort(this.sortByRubricThenNumber)
                                            .map(
                                                course => <option
                                                            key={course.sjc_id} 
                                                            value={course.sjc_id} 
                                                            disabled={this.selectedIds.has(String(course.sjc_id))}
                                                        > 
                                                            {course.sjc_rubric} {course.sjc_number} - {course.sjc_name}
                                                        </option>
                                            )
                                        }
                                    <option value={"-2"}>Select alternative course.</option>
                                    </Input>
                                    <FormFeedback invalid={this.nonApplicableIds.has(this.state.componentAreas[field.name])}>Selected course may not apply to this degree.</FormFeedback></div>
                                    )
                            }
                        )}
                    </FormGroup>
                 )
        );
        return (
        <div>
            <Form>
                <FormGroup>
                    <label><strong>Transfer University:</strong></label>
                    <Input key={"univ_name"} type="text" value={univ_name} disabled/>
                </FormGroup>
                <FormGroup>
                    <label><strong>Transfer Program:</strong></label>
                    <Input key={"prog_name"} type="text" value={prog_name} disabled/>
                </FormGroup>
                <FormGroup>
                    <label><strong>Map Name:</strong></label>
                    <Input key={"map_name"} type="text" value={this.state.mapName} onChange={this.handleNameChange}/>
                </FormGroup>
                <hr/>
                {courseSelectionFields}
            </Form>
            <Form>
                <FormGroup>
                    <Button className="btn-sm" color="secondary" onClick={this.props.handleClose}>Close</Button>
                    <Button className="btn-sm" color="primary" onClick={()=>this.props.handleSave(mapData)}>Save</Button>
                </FormGroup>
            </Form>
            <AlternativeCourseModal
                isOpen={this.state.altCourseModalOpen}
                toggle={this.toggleAltCourseModal}
                SJCCourses={this.props.SJCCourses}
                field={this.state.altCourseModalField}
                getSelectionFromModal={this.getSelectionFromModal}
            />
        </div>
        )
    }
}

MapFormComponent.propTypes = {
    savedMapToEdit:PropTypes.object.isRequired
}

const MapForm = WithSJCCourses(MapFormComponent);

export default MapForm;