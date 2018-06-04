import React from 'react';
import {Tooltip} from 'reactstrap';


export default class MapActionButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen:false
        }
        this.FAClassMap = {
            approve:{
                faClass:'fa fa-paper-plane',
                tooltipText:'Submit for approval.'
            },
            share:{
                faClass:'fa fa-share-alt',
                tooltipText:'Share with collaborators.'
            },
            delete:{
                faClass:'fa fa-trash',
                tooltipText:'Delete map.'
            }
        }
        this.myRef = React.createRef();
        this.toggle = () => {this.setState({tooltipOpen:!this.state.tooltipOpen});};
    }

    render(){
        let buttonId = this.props.type + this.props.map_id;
        var style = {
            cursor:"pointer",
            color:(this.props.activated)?"green":"black"
        }
        return (
            <span>
                <span 
                    className={this.FAClassMap[this.props.type].faClass} 
                    style={style}
                    id={buttonId}
                    onClick={this.props.handler}
                />
                <Tooltip 
                    placement="top" 
                    isOpen={this.state.tooltipOpen} 
                    target={buttonId}
                    toggle={this.toggle}
                > {this.FAClassMap[this.props.type].tooltipText}</Tooltip>
            </span>
      );
    }
}