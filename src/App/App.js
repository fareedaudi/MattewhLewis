import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header/Header';
import Footer from './Footer';
import HomePage from './HomePage';
import Requirements from './Requirements/Requirements';
import LoginContextProvider from '../contexts/LoginContext';
import SavedMapsContextProvider from '../contexts/SavedMapsContext';
import {ROOT_URL} from '../api';
import {withFetching,UNIVERSITIES_URL} from '../api';


class AppComponent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedUniversityId:-1,
      coreRequirements:{}
    };
  }

  onUniversitySelection = (ev) => {
    let selectedUniversityId = ev.target.value;
    if(selectedUniversityId !== this.state.selectedUniversityId){
      this.setState({selectedUniversityId});
    this.fetchCoreRequirements(selectedUniversityId);
    }
  }

  fetchCoreRequirements = (universityId) => {
    fetch(
      `${ROOT_URL}/get_core/${universityId}`
    ).then(response => response.json()).then(
      coreRequirements => {
        this.setState({coreRequirements});
      }
    )
  }

  render(){
    let universities = this.props.data;
    let selectedUniversityId = this.state.selectedUniversityId;
    let university = universities.filter((univ)=>(String(univ.university_id)===selectedUniversityId))[0];
    return (
      <div>
        <Header universities={universities} selectionHandler={this.onUniversitySelection}/>
        
        {selectedUniversityId !== -1?
          <Requirements university={university} coreRequirements={this.state.coreRequirements}/>
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

const AppWithFetching = withFetching(UNIVERSITIES_URL,[])(AppComponent);

const App = TopContextProvider(AppWithFetching);

export default App;