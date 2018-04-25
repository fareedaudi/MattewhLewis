import React from 'react';
import {Button,Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap';
import PropTypes from 'prop-types';


export default class LoginUI extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal:false,
        };
        this.toggle = () => {this.setState({modal:!this.state.modal})};
        this.loginHandler = (credentials) => {props.login.actions.loginFromCredentials(credentials); this.toggle();};
        this.logoutHandler = props.login.actions.logout.bind(this);
    }

    render(){
        return(
            (!this.props.login.state.loggedIn)?
            <div>
                <Button color="primary" className="btn-sm" onClick={this.toggle}>Login</Button>
                <LoginModal isOpen={this.state.modal} toggle={this.toggle} loginHandler={this.loginHandler}/>
            </div>:
            <div>
                {this.props.login.state.userEmail}{' '}
                <Button color="danger" className="btn-sm" onClick={this.logoutHandler}>Logout</Button>
            </div>
        )
    }
}

class LoginModal extends React.Component{
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


LoginUI.propTypes = {
    login: PropTypes.object
}

LoginModal.propTypes = {
    loginHanlder: PropTypes.func,
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    className: PropTypes.string
}