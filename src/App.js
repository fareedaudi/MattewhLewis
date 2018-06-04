import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderUI from './containers/HeaderUI.js';
import Footer from './components/Footer.js';
import HomePage from './containers/HomePage';
import RequirementsPage from './containers/Requirements/RequirementsPage';
import {UNIVERSITIES_URL} from './api';
import {WithLogin} from './contexts/LoginContext';
import {WithSavedMaps} from './contexts/SavedMapsContext';

const Header = WithLogin(HeaderUI);
const Requirements = WithSavedMaps(RequirementsPage);

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      universities:[],
      selectedUniversityId:-1,
    };
  }

  componentDidMount(){
    this.loadUniversitiesIntoState();
  }

  onUniversitySelection = (ev) => {
    let selectedUniversityId = ev.target.value;
    this.setState({selectedUniversityId});
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
    
    let universities = this.state.universities;
    let selectedUniversityId = this.state.selectedUniversityId;
    let university = universities.filter((univ)=>(String(univ.university_id)===selectedUniversityId))[0];
    return (
      <div>
        <Header universities={this.state.universities} selectionHandler={this.onUniversitySelection}/>
        {selectedUniversityId !== -1?
          <Requirements university={university}/>
        :
          <HomePage/>
        }}   
        <Footer/>
      </div>
    )
  }



} 

export default App;
