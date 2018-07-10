import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
    Button
} from 'reactstrap';

export default class AlternativeCourseModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rubric:'',
            number:'',
            apply:false,
            justification:''
        }
    }

    componentDidMount(){
        let rubricSet = this.props.SJCCourses.reduce(
            (rubricSet,course) => {
                rubricSet.add(course.rubric)
                return rubricSet;
            },new Set()
        );
        this.rubricOptions = [...rubricSet].map(
            rubric=><option key={rubric} value={rubric}>{rubric}</option>
        );
    }

    openClose = () => {
        this.resetModalState();
        this.props.toggle();
    }

    onSelectChange = ({target:{name,value}}) => {
        if(name==="rubric"){
            this.setState({number:''});
        }
        this.setState({[name]:value});
    }


    resetModalState = () => {
        this.setState({
            rubric:'',
            number:''
        })
    }

    handleSubmission = (rubric,number) => {
        let course = this.props.SJCCourses.filter(
            course=>(course.rubric===rubric)&&(course.number===number)
        );
        if(course.length>0){
            let id = course[0].id;
            this.props.getSelectionFromModal(this.props.field,id);
            this.resetModalState();
            this.props.toggle();
        }
    }

    render(){

        let numberOptions = !!this.state.rubric ?
            this.props.SJCCourses.filter(
                course=>course.rubric===this.state.rubric
            ).map(course=>
                <option key={this.state.rubric+course.number} value={course.number}>{course.number} - {course.name}</option>
            ) :
            null;
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.openClose}>
                <ModalHeader toggle={this.openClose}>
                    Select alternative course.
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="rubric">SJC Rubric</Label>
                            <Input 
                                type="select"
                                name="rubric"
                                id="rubric"
                                value={this.state.rubric}
                                onChange={this.onSelectChange}
                            >
                                <option value="">Please select a rubric.</option>
                                {this.rubricOptions}
                            </Input>
                            <Label for="number">SJC Number</Label>
                            <Input 
                                type="select"
                                name="number"
                                id="number"
                                value={this.state.number}
                                onChange={this.onSelectChange}
                                disabled={!this.state.rubric}
                            >
                                <option value="">Please select a course number.</option>
                                {numberOptions}
                            </Input>
                        </FormGroup>
                    </Form>       
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-sm" color="secondary" onClick={this.openClose}>Close</Button>
                    <Button className="btn-sm" color="primary" onClick={()=>this.handleSubmission(this.state.rubric,this.state.number)} disabled={!this.state.rubric || !this.state.number}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }
}