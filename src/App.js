import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUI from './containers/HeaderUI.js';
import Footer from './components/Footer.js';
import {Route} from 'react-router-dom';
import HomePage from './containers/HomePage';
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
