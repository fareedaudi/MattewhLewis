import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';
import PropTypes from 'prop-types';

export default class LoginModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginEmail:'',
            loginPassword:'',
            loggingIn:false,
            badCredentialsError:false,
            otherError:false,
            loggedIn:false
        }
        this.updatePassword = (ev) => this.setState({loginPassword:ev.target.value});
        this.updateEmail = (ev) => this.setState({loginEmail:ev.target.value});
    }

    handleSubmit = () => {
        this.setState({
            loggingIn:true,
            badCredentialsError:false,
            otherError:false,
            loggedIn:false
        });
        this.props.loginHandler(this.state).then(
            ()=>{
                this.setState({
                    loggingIn:false,
                    loggedIn:true
                });
                this.timer = setTimeout(
                    ()=>{
                        this.setState({
                            loggedIn:false
                        });
                        this.props.toggle();
                    },500
                );
            }
        ).catch(
            error=>{
                if(error.response){
                    if(error.response.status===401){
                        this.setState({
                            loggingIn:false,
                            badCredentialsError:true
                        });
                    }
                } else {
                    this.setState({
                        loggingIn:false,
                        otherError:true
                    });
                }
            }
    )
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
                    {
                        this.state.badCredentialsError?<span style={{color:'red'}}>Bad login credentials. Try again.</span>:null
                    }
                    {
                        this.state.otherError?<span style={{color:'red'}}>Something went wrong... Try again!</span>:null
                    }
                    {
                        this.state.loggedIn?<span style={{color:'green'}}>Logged in!</span>:null
                    }
                    {
                        this.state.loggingIn?<span style={{color:'green'}}>Logging in...</span>:null
                    }
                    <Button color="secondary" onClick={this.props.toggle}>Close</Button>
                    <Button color="primary" onClick={this.handleSubmit}>Submit</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

LoginModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    loginHandler: PropTypes.func.isRequired
}