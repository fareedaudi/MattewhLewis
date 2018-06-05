import React from 'react';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import {ROOT_URL} from '../../../api';

export default class SavedMapEditor extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            comm_010_1:-1,
            comm_010_2:-1,
            math_020:-1,
            sci_030_1:-1,
            sci_030_2:-1,
            phil_040:-1,
            arts_050:-1,
            hist_060_1:-1,
            hist_060_2:-1,
            gov_070_1:-1,
            gov_070_2:-1,
            soc_080:-1,
            comp_090_1:-1,
            comp_090_2:-1,
            inst_op_1:-1,
            inst_op_2:-1,
            trans_1:-1,
            trans_2:-1,
            trans_3:-1,
            trans_4:-1,
            trans_5:-1,
            trans_6:-1,
            components:[]
        }
        console.log('Constructor called!')
    }

    componentDidMount(){
        this.getComponentsFromServer();
    }

    getComponentsFromServer = () => {
        axios.get(
            `${ROOT_URL}/degree_components`
        ).then(
            response => response.data
        ).then(
            components => {this.setState({components});}
        );
    }

    render(){
        console.log(this.props.savedMapToEdit);
        console.log(this.props.program);
        return (
            <div>
            <h5>Map Editor</h5>
            <Form>
                {this.state.components.map(
                    (component) => 
                    <FormGroup key={component.name}>
                    <Label>{component.name}</Label>
                    {component.fields.map(
                        (field) =>
                        <Input type="select" key={field}/>
                    )}
                    </FormGroup>
                )}
            </Form>
            <Button color="secondary" onClick={this.props.toggleEditMode}>Close</Button>
            </div>
        )
    }
}

SavedMapEditor.propTypes = {
    toggleEditMode:PropTypes.func.isRequired,
    savedMapToEdit:PropTypes.object.isRequired
}