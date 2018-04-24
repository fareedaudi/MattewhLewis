import React from 'react';
import axios from 'axios';

var LoginContext = React.createContext();

export class LoginContextProvider extends React.Component{
    constructor(){
        super();
        this.state = {
            loggedIn:false,
            userId:'',
            userEmail:'',
            token:null,
        }
        this.loadLoginData = this.loadLoginData.bind(this);
        this.updateLoginData = this.updateLoginData.bind(this);
        this.loginFromCredentials = this.loginFromCredentials.bind(this);
        this.logout = this.logout.bind(this);
    }
    
    componentDidMount(){
        var token = sessionStorage.getItem('jwtToken');
        if(token !== null){
            this.loadLoginData(token);
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
                        this.setState( {
                            loggedIn:loginDetails.loggedIn,
                            userId:loginDetails.userId,
                            userEmail:loginDetails.userEmail,
                            token:token
                        });
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
               response => response.data
            ).then(
                (loginDetails) => {
                    if(loginDetails.loggedIn){
                        this.updateLoginData(loginDetails);
                    }
                    
                }
            );
    }

    logout(){
        this.updateLoginData({
            loggedIn:false,
            userId:null,
            userEmail:'',
            token:null,
        });
    }

    render(){
        return(
        <LoginContext.Provider value={{
            state:this.state,
            actions:{
                loadLoginData:this.loadLoginData,
                updateLoginData:this.updateLoginData,
                loginFromCredentials:this.loginFromCredentials,
                logout:this.logout
            }
        }}>
            {this.props.children}
        </LoginContext.Provider>
        )
    }
}

export default LoginContext;