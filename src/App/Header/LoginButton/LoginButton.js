import React from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';
import {WithLogin} from '../../../contexts/LoginContext';
import LoginModal from './LoginModal';


class LoginButtonComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal:false,
        };
        this.toggle = () => {this.setState({modal:!this.state.modal})};
        this.loginHandler = (credentials) => {props.login.actions.loginFromCredentials(credentials); this.toggle();};
        this.logoutHandler = props.login.actions.logout.bind(this);
    }

    shouldComponentUpdate(nextProps,nextState){
        if(((this.state === nextState) && (this.props.login.state.loggedIn === nextProps.login.state.loggedIn))){
            return false;
        } else {
            return true;
        }
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

LoginButtonComponent.propTypes = {
    login:PropTypes.object.isRequired
}

const LoginButton = WithLogin(LoginButtonComponent);

export default LoginButton;

