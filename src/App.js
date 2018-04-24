import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUI from './containers/HeaderUI.js';
import Footer from './components/Footer.js';
import {Switch, Route, BrowserRouter, withRouter} from 'react-router-dom';
import HomePage from './containers/HomePage';
import Requirements from './containers/Requirements';
import RequirementsPage from './containers/Requirements/RequirementsPage';
import {UNIVERSITIES_URL} from './api';


class App extends React.Component{
  constructor(){
    super();
    this.state = {
      universities:[],
      univNameMap:{}
    };
    this.loadUniversitiesIntoState();
  }

  
  componentDidMount(){
    // Get list of all universities
  }
  
  componentWillReceiveProps(nextProps){

  }

  shouldComponentUpdate(){
    return true;
  }

  render(){
    return (
      <div>
        <HeaderUI universities={this.state.universities}/>   
        <Route exact path="/" render={() => <HomePage/> }/>
        <Route exact path="/requirements/:univ_id" render={(props) => <RequirementsPage {...props} universities={this.state.universities}/>}/>
        <Footer/>
      </div>
    )
  }

  loadUniversitiesIntoState(){
    fetch(
      UNIVERSITIES_URL
    ).then(
      response => (response.json())
    ).then(
      univList => {
        var univNameMap = univList.reduce((obj,univ) => {
          var id = univ.university_id;
          var name = univ.university_name;
          obj[id]=name;
          return obj;
        },{});
        this.setState(
          {
            universities:univList
          }
        );
      }
    );
  }
} 

export default App;
