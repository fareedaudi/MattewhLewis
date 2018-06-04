import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';

export default class LoginModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginEmail:'',
            loginPassword:''
        }
        this.updatePassword = (ev) => this.setState({loginPassword:ev.target.value});
        this.updateEmail = (ev) => this.setState({loginEmail:ev.target.value});
        this.handleSubmit = () => {this.props.loginHandler(this.state);}
    }

    render(){
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
                <ModalHeader toggle={this.props.toggle}>Please Login</ModalHeader>
                <ModalBody>
                <form id="login">
                <div className="form-group row">
                    <div className="col-sm-10">
                    <input className="form-control" type="email" placeholder="Email" value={this.state.loginEmail} onChange={this.updateEmail}/>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10">
                    <input className="form-control" type="password" placeholder="Password" value={this.state.loginPassword} onChange={this.updatePassword}/>
                    </div>
                </div>
                </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggle}>Close</Button>
                    <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }
}