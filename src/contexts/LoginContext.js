import React from 'react';
import axios from 'axios';
import {Modal,ModalHeader,ModalBody,ModalFooter,Button} from 'reactstrap';

var LoginContext = React.createContext();

export class LoginContextProvider extends React.Component{
    constructor(){
        super();
        this.state = {
            loggedIn:false,
            userId:'',
            userEmail:'',
            token:null,
            timeRemaining:0,
            stayLoggedInModalOpen:false
        }
        this.loadLoginData = this.loadLoginData.bind(this);
        this.updateLoginData = this.updateLoginData.bind(this);
        this.loginFromCredentials = this.loginFromCredentials.bind(this);
        this.logout = this.logout.bind(this);
        this.tick = this.tick.bind(this);
        this.resetCountdown = this.resetCountdown.bind(this);
        this.externalLoadLoginData = this.externalLoadLoginData.bind(this);
        this.toggleStayLoggedInModal = this.toggleStayLoggedInModal.bind(this)
        this.stayLoggedInHandler = this.stayLoggedInHandler.bind(this);
    }
    
    componentDidMount(){
        var token = sessionStorage.getItem('jwtToken');
        if(token !== null){
            this.loadLoginData(token);
        }
    }

    externalLoadLoginData(){
        if(this.state.token){
            this.loadLoginData(this.state.token);
        }
        
    }

    loadLoginData(token){
        axios.post(
            'http://localhost:8000/load_login_data', {token}
            ).then(
               response => response.data
            ).then( 
                (loginDetails) => {
                    if(loginDetails){
                        if(loginDetails.loggedIn){
                            this.resetCountdown();
                        }
                        this.updateLoginData(loginDetails);
                    }
                }
            );
    }

    updateLoginData(loginDetails){
        this.setState({
            loggedIn:loginDetails.loggedIn,
            userId:loginDetails.userId,
            userEmail:loginDetails.userEmail,
            token:loginDetails.token
        });
        sessionStorage.setItem('jwtToken',loginDetails.token);
    }

    loginFromCredentials({loginEmail,loginPassword}){
        axios.post(
            'http://localhost:8000/login', {loginEmail,loginPassword}
            ).then(
               response => {
                   this.resetCountdown();
                   return response.data;
                }
            ).then(
                (loginDetails) => {
                    if(loginDetails.loggedIn){
                        this.updateLoginData(loginDetails);
                    }
                }
            );
    }

    resetCountdown(){
        clearInterval(this.timer);
        this.timer = setInterval(this.tick,1000);
        this.setState({
            timeRemaining:10*60
        });
    }

    tick(){
        this.setState({
            timeRemaining:this.state.timeRemaining - 1
        })
        if(this.state.timeRemaining<=0){
            this.logout();
        } else if(this.state.timeRemaining===30 && this.state.stayLoggedInModalOpen === false){
            this.toggleStayLoggedInModal();
        }
    }

    logout(){
        this.updateLoginData({
            loggedIn:false,
            userId:null,
            userEmail:'',
            token:null,
            timeRemaining:0
        });
        clearInterval(this.timer);
        if(this.state.stayLoggedInModalOpen){
            this.toggleStayLoggedInModal();
        }
    }

    toggleStayLoggedInModal(){
        this.setState({
            stayLoggedInModalOpen:!this.state.stayLoggedInModalOpen
        });
    }

    stayLoggedInHandler(){
        this.toggleStayLoggedInModal();
        this.externalLoadLoginData();
    }

    render(){
        return(
        <LoginContext.Provider value={{
            state:this.state,
            actions:{
                loadLoginData:this.externalLoadLoginData,
                updateLoginData:this.updateLoginData,
                loginFromCredentials:this.loginFromCredentials,
                logout:this.logout
            }
        }}>
            <StayLoggedInModal 
                isOpen={this.state.stayLoggedInModalOpen} 
                toggle={this.toggleStayLoggedInModal}
                timeRemaining={this.state.timeRemaining}
                stayLoggedInHandler={this.stayLoggedInHandler}
                />
            {this.props.children}
        </LoginContext.Provider>
        )
    }
}

const StayLoggedInModal = (props) => (
    <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
        <ModalHeader toggle={props.toggle}>Stay Logged In?</ModalHeader>
        <ModalBody>
            <p>
                {`You will be logged out in ${props.timeRemaining} seconds due to inactivity.`}
            </p>
            <p>
                Would you like to stay logged in?
            </p>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={props.toggle}>Nah.</Button>
            <Button color="primary" onClick={props.stayLoggedInHandler}>Yes, please.</Button>
        </ModalFooter>
    </Modal>
);
            
export function WithLogin(LoginConsumer){
    return class extends React.Component {
        render(){
            return (
                <LoginContext.Consumer>
                    {
                        (login) => (
                            <LoginConsumer login={login} {...this.props}/>
                        )
                    }
                </LoginContext.Consumer>
            )
        }
    }
}

export default LoginContext;