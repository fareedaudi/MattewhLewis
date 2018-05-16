import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUI from './containers/HeaderUI.js';
import Footer from './components/Footer.js';
import {Route} from 'react-router-dom';
import HomePage from './containers/HomePage';
import RequirementsPage from './containers/Requirements/RequirementsPage';
import {UNIVERSITIES_URL} from './api';
import {WithLogin} from './contexts/LoginContext';


class App extends React.Component{
  constructor(){
    super();
    this.state = {
      universities:[]
    };
  }

  componentDidMount(){
    this.loadUniversitiesIntoState();
  }

  loadUniversitiesIntoState(){
    fetch(
      UNIVERSITIES_URL
    ).then(
      response => (response.json())
    ).then(
      universities => {
        this.setState(
          {
            universities
          }
        );
      }
    );
  }

  render(){
    const Header = WithLogin(HeaderUI);
    return (
      <div>
        <Header universities={this.state.universities}/>   
        <Route exact path="/" render={() => <HomePage/> }/>
        <Route exact path="/requirements/:univ_id" render={(props) => <RequirementsPage {...props} universities={this.state.universities}/>}/>
        <Footer/>
      </div>
    )
  }



} 

export default App;
