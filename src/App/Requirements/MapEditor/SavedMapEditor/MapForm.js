import React from 'react';
import {
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Button,
    Label,
    FormFeedback
} from 'reactstrap';
import PropTypes from 'prop-types';
import { WithSJCCourses } from '../../../../contexts/SJCCourseContext';
import AlternativeCourseModal from './AlternativeCourseModal';
import NoteModal from './NoteModal';

const isObjNotEmpty = (obj) => !!Object.keys(obj).length;

export class MapFormComponent extends React.Component{
    constructor(props){
        super(props);
        let savedMapToEdit = this.props.savedMapToEdit;
        let {name,requirements} = savedMapToEdit;
        this.alreadySelected = new Set();
        let {courseSlots,optionsByReqId} = requirements.reduce(
            ({courseSlots,optionsByReqId},req)=> {
                optionsByReqId[req.id] = [];
                let idsOfCoursesAddedToOptions = new Set();
            
                // Create selectionFields for default_courses.
                req.default_courses.forEach(
                    course => {
                        optionsByReqId[req.id].push(course)
                        idsOfCoursesAddedToOptions.add(course.id);
                    }
                )
                
                // Create courseSlots for state; add additional courses to selectionFields, if not already present.
                req.course_slots.forEach(
                    course_slot => {
                        courseSlots[course_slot.name] = course_slot.course
                        if(course_slot.course.id){
                            this.alreadySelected.add(String(course_slot.course.id))
                        }
                        if(Object.keys(course_slot.course).length && (!idsOfCoursesAddedToOptions.has(course_slot.course.id))){
                            optionsByReqId[req.id].push(course_slot.course);
                            idsOfCoursesAddedToOptions.add(course_slot.course.id);
                        }
                    }
                )
                return {courseSlots,optionsByReqId};
            },{courseSlots:{},optionsByReqId:{}}
        );
        this.optionsByReqId = optionsByReqId;
        this.state = {
            name,
            courseSlots,
            altCourseModalOpen:false,
            altCourseModalReqId:'',
            altCourseModalSlotId:'',
            savedMapToEdit,
            noteModalOpen:false,
            noteModalNote:{},
            noteModalCourse:{},
            noteModalSlot:{},
            savingMap:false,
            saveError:false,
            saved:false

        };
        this.applicableCourseIds = new Set(this.state.savedMapToEdit.applicable_courses.map(course=>String(course.id)));
        this.applicableCourseIds.add("-1"); // Unspecified courses are "applicable."
    }

    launchNoteModal = (slot) => {
        let {note,course} = slot;
        this.setState({
            noteModalNote:note,
            noteModalCourse:course,
            noteModalOpen:true,
            noteModalSlot:slot
        });
    }

    editNote = ({id,req_id,note}) => {
        let requirement = this.state.savedMapToEdit.requirements.filter(req=>req.id===req_id)[0];
        let slot = requirement.course_slots.filter(slot=>slot.id===id)[0];
        slot.note=note;
        this.forceUpdate();
    }

    isCourseNotSelectable = ({id}) => {
        return this.alreadySelected.has(String(id));
    }

    isCourseNotApplicable = ({id}) => {
        if(!id){
            return null;
        }
        return !this.applicableCourseIds.has(String(id));
    }

    isCourseApplicable = ({id}) => {
        if(!id) {
            return null;
        }
        return this.applicableCourseIds.has(String(id));
    }

    handleNameChange = ({target:{value}}) => {
        this.setState({
            name:value,
            savedMapToEdit:{
                ...this.state.savedMapToEdit,
                name:value
            }
        });
    }

    toggleAltCourseModal = () => {
        this.setState({
            altCourseModalOpen:!this.state.altCourseModalOpen
        });
    }

    toggleNoteModal = () => {
        this.setState({
            noteModalOpen:!this.state.noteModalOpen
        });
    }

    createCourseModal = (fieldName) => {
        this.setState({
            altCourseModalField:fieldName,
            altCourseModalOpen:true
        });
    }

    getSelectionFromModal = (reqId,slotId,course,note) => {

        let requirement = this.state.savedMapToEdit.requirements.filter(req=>req.id===reqId)[0];
        let slot = requirement.course_slots.filter(slot=>slot.id===slotId)[0];
        let slotName = slot.name;
        if(course.id){
            this.alreadySelected.add(String(course.id));
        }
        let prevSelection = this.state.courseSlots[slotName];
        if(prevSelection.id){
            this.alreadySelected.delete(String(prevSelection.id));
        }
        this.setState(prevState => ({
            ...prevState,
            courseSlots:{
                ...this.state.courseSlots,
                [slotName]:course
            }
        }),()=>{
            slot.course = course
            if(isObjNotEmpty(note)){
                slot.note = note;
            }
            this.forceUpdate();
        });
        let coursePresent = !!this.optionsByReqId[reqId].filter(elem=>elem.id == course.id).length;
        if(!coursePresent){
            this.optionsByReqId[reqId].push(course);
        }
        
    }

    cleanCourses = (sjcCourses) => {
        sjcCourses.forEach(
            course=>{
                let number = course.number;
                course.number = number.substring(0,1)+'4'+number.substring(2)
                let parenStuff = course.name.match(/\(\S+\)/);
                if(parenStuff){
                    course.name=course.name.substring(0,parenStuff.index)
                }
            }
        )
        return sjcCourses;
    }

    saveMapLocally = (mapData) => {
        let saveId = this.props.login.state.userEmail+this.props.savedMapToEdit.id;
        localStorage.setItem(saveId,mapData);
    }

    sortByRubricThenNumber = (course1,course2) => {
        if(course1.rubric>course2.rubric){
            return 1;
        } else if(course1.rubric===course2.rubric){
            if(course1.number>course2.number){
                return 1;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    }

    handleCourseSelection = (reqId,slotId,slotName,selectedCourse) => {
        let formerSelection = this.state.courseSlots[slotName];
        let {default_courses} = this.state.savedMapToEdit.requirements.filter(req=>req.id===reqId)[0];
        
        let formerSelectionNotInDefault = !default_courses.filter(def_course=>def_course.id === formerSelection.id).length;
        let newSelectionNotInDefault = !default_courses.filter(def_course=>String(def_course.id) === String(selectedCourse.id)).length;
        if(formerSelectionNotInDefault){
            // Remove former selection from optionsByReqId
            this.optionsByReqId[reqId] = this.optionsByReqId[reqId].filter(course=>course.id !== formerSelection.id);
            if(newSelectionNotInDefault){
                // Add new selection to optionsByReqId
                this.optionsByReqId[reqId].push(selectedCourse);
            }
        }


        // Insert new selection into optionsByReq[reqId]

        if(selectedCourse.id){
            this.alreadySelected.add(String(selectedCourse.id));
        }
        if(formerSelection.id){
            this.alreadySelected.delete(String(formerSelection.id));
        }
        this.setState(
            prevState => ({
                ...prevState,
                courseSlots: {
                    ...prevState.courseSlots,
                    [slotName]:selectedCourse
                }
            }),
            () => {
                // Hacky way to deal with the fact that I am using a poorly nested data structure in state.
                let req = this.state.savedMapToEdit.requirements.filter(req=>req.id===reqId)[0];
                let slot = req.course_slots.filter(slot=>slot.id===slotId)[0];
                slot.course = selectedCourse;
                this.forceUpdate();
            }
        );
    }

    initializeAltCourseModal = (reqId,slotId) => {
        this.setState({
            altCourseModalReqId:reqId,
            altCourseModalSlotId:slotId,
            altCourseModalOpen:!this.state.altCourseModalOpen
        });
    }

    saveMapHandler = (savedMapToEdit) => {
        this.setState({
            savingMap:true,
            saveError:false,
            saved:false
        });
        this.props.handleSave(savedMapToEdit).then(
            ()=> {
                this.timer = setTimeout(_ => {
                    this.setState({
                        savingMap: false,
                        saved:true
                    },
                        _ => {
                            this.timer = setTimeout(_ => {
                                this.setState({saved:false});
                            },1500);
                        }
                    );
                    this.props.mapSaved();
                    }, 500);
                }
        ).catch(
            (e)=>{
                this.setState({
                    savingMap:false,
                    saveError:true
                });
            }
        );
    }
    
    addHandler = (reqId,nextNumber) => {
        let requirement = this.state.savedMapToEdit.requirements.filter(req=>req.id===reqId)[0];
        let slotName = `component-area-option-${nextNumber}`;
        let newSlot = {
            id:null,
            name:slotName,
            req_id:reqId,
            course:{},
            note:{}
        };
        requirement.course_slots.push(newSlot);
        this.props.mapSaved();
        this.setState({
            ...this.state,
            courseSlots:{
                ...this.state.courseSlots,
                [slotName]:{}
            }
        });
    }

    render(){
        /*
        window.onbeforeunload = () => {
            sessionStorage.setItem('prevMapState',JSON.stringify(this.state));
        }
        */
        let {univ_name,prog_name,assoc_name,requirements} = this.state.savedMapToEdit;
        let totalHours = 0;
        let courseSelectionFields = requirements.map(
            requirement => {
                let reqId = requirement.id;
                let requirementFromSavedMap = this.state.savedMapToEdit.requirements.filter(req=>req.id===reqId)[0];
                let reqHours = requirementFromSavedMap.course_slots.reduce(
                    (reqHours,course_slot)=>{
                        return reqHours + (course_slot.course.hours || 0);
                    },0);
                totalHours += reqHours;
                return (
                    <FormGroup key={"formgroup"+requirement.name}>
                        <Label><strong>{`${requirement.name} (${reqHours} out of ${requirement.hours} hours)`}</strong></Label>
                        {requirement.course_slots.map(
                            slot => {
                                let course = this.state.courseSlots[slot.name] || {};
                                let notePresent = isObjNotEmpty(slot.note);
                                let noteColor = notePresent?'black':'gray';
                                return (<div key={slot.name}>
                                    <InputGroup>
        
                                    <Input
                                        
                                        //style={{width:'90%'}}
                                        key={slot.name}
                                        type={"select"}
                                        value={isObjNotEmpty(course)?course.id:"-1"}
                                        valid={this.isCourseApplicable(course)}
                                        invalid={this.isCourseNotApplicable(course)}
                                        onChange={
                                            ({target:{value}})=>{
                                                if(value === "-2"){
                                                    this.initializeAltCourseModal(requirement.id,slot.id);
                                                    return;
                                                } 
                                                let name = slot.name;
                                                let course = this.optionsByReqId[requirement.id].filter(def_course=>String(def_course.id)===value)[0] || {};
                                                this.handleCourseSelection(requirement.id,slot.id,name,course);
                                                }
                                            }
                                    >
                                    <option value={"-1"}>Please select a course.</option>
                                    {
                                        this.optionsByReqId[requirement.id].filter(course=>isObjNotEmpty(course)).map(
                                            (course,i)=><option key={slot.name + course.id} value={course.id} disabled={this.isCourseNotSelectable(course)}>{course.rubric} {course.number} - {course.name}</option>
                                        )
                                    }
                                    <option value={"-2"}>Select alternative course.</option>
                                    </Input>
                                     {
                                         isObjNotEmpty(slot.course)?
                                         <InputGroupAddon addonType="append">
                                            <span className="fa fa-sticky-note" style={{color:noteColor,cursor:'pointer',opacity:.5}} onClick={()=>{this.launchNoteModal(slot)}}></span>
                                        </InputGroupAddon>:
                                        null
                                     }
                                     <FormFeedback valid>The above course applies to the selected transfer program.</FormFeedback>
                                     <FormFeedback invalid>The above course may not be applicable to the selected transfer program.</FormFeedback>
                                    
                                    </InputGroup>
                                    
                                    <FormFeedback invalid={true}>Selected course may not apply to this degree.</FormFeedback>
                                    </div>
                                    )
                            }
                        )}
                        {requirement.name.includes("Component") || requirement.name.includes("Transfer")?<a href="#" onClick={(e)=>{e.preventDefault();this.addHandler(requirement.id,requirement.course_slots.length);}}>Add Course Slot</a>:null}
                    </FormGroup>
                );}
        );
        return (
        <div>
            <Form>
                <FormGroup>
                    <label><strong>Transfer University:</strong></label>
                    <Input key={"univ_name"} type="text" value={univ_name} disabled/>
                </FormGroup>
                <hr/>
                <FormGroup>
                    <label><strong>SJC Associate Degree:</strong></label>
                    <Input key={"associate_degree"} type="text" value={assoc_name} disabled/>
                </FormGroup>
                <FormGroup>
                    <label><strong>Transfer Program:</strong></label>
                    <Input key={"prog_name"} type="text" value={prog_name} disabled/>
                </FormGroup>
                <FormGroup>
                    <label><strong>Pathway Map Name:</strong></label>
                    <Input key={"map_name"} type="text" value={this.state.name} onChange={this.handleNameChange}/>
                </FormGroup>
                <hr/>
                {courseSelectionFields}
                <h6>Total hours selected: {totalHours}</h6>
            </Form>
            <Form>
                <FormGroup>
                    <Button className="btn-sm" color="secondary" onClick={this.props.handleClose}>Close</Button>
                    <Button className="btn-sm" color="primary" onClick={()=>this.saveMapHandler(this.state.savedMapToEdit)}>Save</Button>
                    {
                        this.state.savingMap?<span style={{color:"green"}}>&nbsp;&nbsp;&nbsp;Saving...</span>:null
                    }
                    {
                        this.state.saveError?<span style={{color:"red"}}>&nbsp;&nbsp;&nbsp;Something went wrong. Try again!</span>:null
                    }
                    {
                        this.state.saved?<span style={{color:"green"}}>&nbsp;&nbsp;&nbsp;Saved!</span>:null
                    }
                </FormGroup>
            </Form>
            <AlternativeCourseModal
                isOpen={this.state.altCourseModalOpen}
                toggle={this.toggleAltCourseModal}
                SJCCourses={this.props.SJCCourses}
                reqId={this.state.altCourseModalReqId}
                slotId={this.state.altCourseModalSlotId}
                getSelectionFromModal={this.getSelectionFromModal}
                progId={this.state.savedMapToEdit.prog_id}
            />
            <NoteModal
                isOpen={this.state.noteModalOpen}
                toggle={this.toggleNoteModal}
                noteModalNote={this.state.noteModalNote}
                noteModalCourse={this.state.noteModalCourse}
                editNote={this.editNote}
                slot = {this.state.noteModalSlot}

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