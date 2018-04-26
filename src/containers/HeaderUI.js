import React from 'react';
import { Link } from 'react-router-dom';
import {Container,Nav,NavItem,NavLink,Dropdown,DropdownToggle,DropdownItem,DropdownMenu} from 'reactstrap';
import LoginUI from '../containers/LoginUI';
import {WithLogin} from '../contexts/LoginContext';
import PropTypes from 'prop-types';




export default class HeaderUI extends React.Component {
  constructor(props){
    super(props);
    this.toggleProgram = this.toggleProgram.bind(this);
    this.toggleRequirement = this.toggleRequirement.bind(this);
    this.activateHome = this.activateHome.bind(this);
    this.activatePrograms = this.activatePrograms.bind(this);
    this.activateRequirements = this.activateRequirements.bind(this);
    this.state = {
      programDropdownOpen:false,
      requirementsDropdownOpen:false,
      homeActive:true,
      requirementsActive:false,
      programsActive:false
    }
  }

  shouldComponentUpdate(nextProps,nextState){
    if(this.state === nextState && this.props.universities === nextProps.universities) {return false;}
     else {
    return true;
  }
}

  activateHome(){
    this.setState({
      homeActive:true,
      requirementsActive:false,
      programsActive:false
    });
    this.props.login.actions.loadLoginData();
  }

  activatePrograms(){
    this.setState({
      homeActive:false,
      requirementsActive:false,
      programsActive:true
    });
    this.props.login.actions.loadLoginData();
  }

  activateRequirements(){
    this.setState({
      homeActive:false,
      requirementsActive:true,
      programsActive:false
    });
    this.props.login.actions.loadLoginData();
  }

  toggleProgram() {
    this.setState({
      programDropdownOpen: !this.state.programDropdownOpen
    })
  }

  toggleRequirement() {
    this.setState({
      requirementDropdownOpen: !this.state.requirementDropdownOpen
    })
  }

  render(){
    const LoginButton = WithLogin(LoginUI);
    console.log('Header updated!');
    return (
      <Container className="fixed-top" style={{paddingTop: '10px', background: 'rgba(255, 255, 255, 9.0)'}}>
      <h5>SJC Degree Mapping Toolkit</h5>
        <Nav tabs>
          <NavItem>
            <NavLink 
              className={this.state.homeActive?"active":""}
              tag={Link} // Hacky work-around for proper routing.
              to="/"
              onClick={this.activateHome}
              >
              Home
              </NavLink>
          </NavItem>
          
          <Dropdown nav isOpen={this.state.programDropdownOpen} toggle={this.toggleProgram}>
            <DropdownToggle className={this.state.requirementsActive?"active":""} nav caret>
              University Requirements
            </DropdownToggle>
            <DropdownMenu>
              {this.props.universities.map((obj) => (
                <DropdownItem 
                key={obj.university_id} 
                to={"/requirements/"+obj.university_id} 
                tag={Link}
                onClick={this.activateRequirements}
                >{obj.university_name}</DropdownItem>
                // Refreshes entire page, because router doesn't trigger re-rendering of components (for AJAX, etc.)
              ))}
            </DropdownMenu>
          </Dropdown>

        <Dropdown nav isOpen={this.state.requirementDropdownOpen} toggle={this.toggleRequirement}>
          <DropdownToggle className={this.state.programsActive?"active":""} nav caret>
            University Programs by SJC Course
          </DropdownToggle>
          <DropdownMenu>
            {this.props.universities.map((obj) => (
              <DropdownItem key={obj.university_id} onClick={this.activatePrograms}>{obj.university_name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>


        <NavItem className="ml-auto">
        <LoginButton/>
        </NavItem>
        </Nav>

        
      </Container>
    )
  }
}

HeaderUI.propTypes = {
  universities:PropTypes.array.isRequired
}