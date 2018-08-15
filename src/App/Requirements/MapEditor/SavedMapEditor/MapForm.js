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
        let savedMapToEdit = this.props.savedMapToEdit;
        this.state = {
            savedMapToEdit,
            altCourseModalOpen:false,
            altCourseModalField:''
        };
    }

    componentDidMount(){
        let savedMapToEdit = this.props.savedMapToEdit;
        this.setState({savedMapToEdit});
    }

    handleNameChange = ({target:{value}}) => {
        this.setState({savedMapToEdit:{ ...this.state.savedMapToEdit, name:value }});
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

    saveMapLocally = (mapData) => {
        let saveId = this.props.login.state.userEmail+this.props.savedMapToEdit.id;
        localStorage.setItem(saveId,mapData);
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
        /*
        window.onbeforeunload = () => {
            sessionStorage.setItem('prevMapState',JSON.stringify(this.state));
        }
        */
        let {id,univ_name,prog_name,assoc_name,requirements} = this.state.savedMapToEdit;
        let name = this.state.savedMapToEdit.name;
        let courseSelectionFields = requirements.map(
            requirement => (
                    <FormGroup key={"formgroup"+requirement.name}>
                        <Label><strong>{`${requirement.name} (${requirement.hours} hours)`}</strong></Label>
                        {requirement.course_slots.map(
                            slot => {
                                return (<div key={slot.name}>
                                    <Input 
                                        key={slot.name} 
                                        type={"select"}
                                        value={slot.course?slot.course.id:"-1"}
                                        invalid={true}
                                        onChange={()=>(1)}
                                    >
                                    <option value={"-1"}>Please select a course.</option>
                                    {
                                        requirement.default_courses.map(
                                            course => {
                                                return(<option value={course.id}>{course.rubric} {course.number} - {course.name}</option>)
                                            }
                                        )
                                    }
                                    <option value={"-2"}>Select alternative course.</option>
                                    </Input>
                                    <FormFeedback invalid={true}>Selected course may not apply to this degree.</FormFeedback>
                                    </div>
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
                    <Input key={"map_name"} type="text" value={name} onChange={this.handleNameChange}/>
                </FormGroup>
                <hr/>
                {courseSelectionFields}
            </Form>
            <Form>
                <FormGroup>
                    <Button className="btn-sm" color="secondary" onClick={this.props.handleClose}>Close</Button>
                    <Button className="btn-sm" color="primary" onClick={()=>this.props.handleSave()}>Save</Button>
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