import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header/Header';
import Footer from './Footer';
import HomePage from './HomePage';
import Requirements from './Requirements/Requirements';
import {UNIVERSITIES_URL} from '../api';
import LoginContextProvider from '../contexts/LoginContext';
import SavedMapsContextProvider from '../contexts/SavedMapsContext';


class AppComponent extends React.Component{
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

const TopContextProvider = (Component) => {
    return class extends React.Component{
        render(){
            return (
                <LoginContextProvider>
                    <SavedMapsContextProvider>
                        <Component {...this.props}/>
                    </SavedMapsContextProvider>
                </LoginContextProvider>
            );
        }
    }
}

const App = TopContextProvider(AppComponent);

export default App;