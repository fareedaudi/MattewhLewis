import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header/Header';
import Footer from './Footer';
import HomePage from './HomePage';
import Requirements from './Requirements/Requirements';
import LoginContextProvider from '../contexts/LoginContext';
import SavedMapsContextProvider from '../contexts/SavedMapsContext';
import SJCCourseContextProvider from '../contexts/SJCCourseContext';
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
    }
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
                      <SJCCourseContextProvider>
                          <Component {...this.props}/>
                        </SJCCourseContextProvider>
                    </SavedMapsContextProvider>
                </LoginContextProvider>
            );
        }
    }
}

const AppWithFetching = withFetching(UNIVERSITIES_URL,[])(AppComponent);

const App = TopContextProvider(AppWithFetching);

export default App;