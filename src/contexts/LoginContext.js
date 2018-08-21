import React from 'react';
import axios from 'axios';
import {Modal,ModalHeader,ModalBody,ModalFooter,Button} from 'reactstrap';

var LoginContext = React.createContext();

var loginDuration = 600;

export default class LoginContextProvider extends React.Component{
    constructor(){
        super();
        this.state = {
            loggedIn:false,
            userId:'',
            userEmail:'',
            token:null,
            stayLoggedInModalOpen:false,
            recentlyActive:false,
            loggedInAt:0,
            countDown:0,
        }
        this.loadLoginData = this.loadLoginData.bind(this);
        this.updateLoginData = this.updateLoginData.bind(this);
        this.loginFromCredentials = this.loginFromCredentials.bind(this);
        this.logout = this.logout.bind(this);
        this.externalLoadLoginData = this.externalLoadLoginData.bind(this);
        this.toggleStayLoggedInModal = this.toggleStayLoggedInModal.bind(this)
        this.stayLoggedInHandler = this.stayLoggedInHandler.bind(this);
        this.makeRecentlyActive = this.makeRecentlyActive.bind(this);
        this.setTime = this.setTime.bind(this);
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
            'http://localhost:5000/load_login_data', {token}
            ).then(
               response => response.data
            ).then( 
                (loginDetails) => {
                    if(loginDetails){
                        if(loginDetails.loggedIn){
                            this.setTime();
                        }
                        this.updateLoginData(loginDetails);
                    }
                }
            );
    }

    

    updateLoginData(loginDetails){
        sessionStorage.setItem('jwtToken',loginDetails.token);
        this.setState({
            loggedIn:loginDetails.loggedIn,
            userId:loginDetails.userId,
            userEmail:loginDetails.userEmail,
            token:loginDetails.token
        });
    }

    loginFromCredentials({loginEmail,loginPassword}){
        axios.post(
            'http://localhost:5000/login', {loginEmail,loginPassword}
            ).then(
               response => {
                   this.setTime();
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

    setTime = () => {
        this.setState(
            {
                loggedInAt:Date.now()
            },
            () => {
                clearInterval(this.timer);
                this.timer = setInterval(this.tock,1000);
            }
        )

    }

    makeRecentlyActive(){
        if(!this.state.recentlyActive){
            this.setState({
                recentlyActive:true
            });
        }
    }

    tock = () => {
        let timeElapsed = Math.floor((Date.now() - this.state.loggedInAt)/1000);
        let timeRemaining = loginDuration - timeElapsed;
        if(timeRemaining < 0){
            this.logout();
        } else if(timeRemaining === 30 && !this.state.stayLoggedInModalOpen){
            if(this.state.recentlyActive){
                this.externalLoadLoginData();
            } else{
                this.setState({
                    countDown:30
                },
                this.toggleStayLoggedInModal
            );
            } 
        } else if(timeRemaining < 30){
            this.setState({
                countDown:timeRemaining
            });
        }
    }

    logout(){
        this.updateLoginData({
            loggedIn:false,
            userId:null,
            userEmail:'',
            token:null,
            loggedInAt:0
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

    dontStayLoggedInHandler(){
        this.setState({});
    }

    render(){
        let {loggedIn, userId, userEmail} = this.state;
        return(
        <LoginContext.Provider value={{
            state:{
                loggedIn,
                userId,
                userEmail
            },
            actions:{
                makeRecentlyActive:this.makeRecentlyActive,
                updateLoginData:this.updateLoginData,
                loginFromCredentials:this.loginFromCredentials,
                logout:this.logout
            }
        }}>
            <StayLoggedInModal 
                isOpen={this.state.stayLoggedInModalOpen} 
                toggle={this.toggleStayLoggedInModal}
                timeRemaining={this.state.countDown}
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
            <Button color="secondary" onClick={props.toggle}>No</Button>
            <Button color="primary" onClick={props.stayLoggedInHandler}>Yes, please</Button>
        </ModalFooter>
    </Modal>
);

export function ProvideLoginContext(Component){
    return class extends React.Component{
        render(){
            return (
                <LoginContextProvider>
                    <Component {...this.props}/>
                </LoginContextProvider>
            )
        }
    }
}
            
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


export function WithLoginStatus(LoginStateConsumer){
    return class extends React.Component {
        render(){
            return (
                <LoginContext.Consumer>
                    {
                        (login) => (
                            <LoginStateConsumer loggedIn={login.state.loggedIn} {...this.props}/>
                        )
                    }
                </LoginContext.Consumer>
            )
        }
    }
}