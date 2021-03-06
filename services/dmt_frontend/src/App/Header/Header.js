import React from 'react';
import {Container,Nav,NavItem,Dropdown,DropdownToggle,DropdownItem,DropdownMenu} from 'reactstrap';
import PropTypes from 'prop-types';
import LoginButton from './LoginButton/LoginButton';
import {WithLogin} from '../../contexts/LoginContext';



class HeaderComponent extends React.Component {
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
    this.props.login.actions.makeRecentlyActive();
  }

  activatePrograms(){
    this.setState({
      homeActive:false,
      requirementsActive:false,
      programsActive:true
    });
    this.props.login.actions.makeRecentlyActive();
  }

  activateRequirements(){
    this.setState({
      homeActive:false,
      requirementsActive:true,
      programsActive:false
    });
    this.props.login.actions.makeRecentlyActive();
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
    let uhcl = this.props.universities[0];
    let uh = this.props.universities[1];
    let uhd = this.props.universities[2];
    let tamu = this.props.universities[3];
    let shsu = this.props.universities[4];
    return (
      <Container className="fixed-top" style={{paddingTop: '10px', background: 'rgba(255, 255, 255, 9.0)'}}>
      <h5>SJC Pathway Mapping Toolkit</h5>
        <Nav tabs>
          <Dropdown nav isOpen={this.state.programDropdownOpen} toggle={this.toggleProgram}>
            <DropdownToggle nav caret className="active">
              Select a Transfer University
            </DropdownToggle>
            <DropdownMenu style={{maxHeight:"400px",overflowY:"scroll"}}>
            {uhcl?
              <DropdownItem 
                  key={uhcl.university_id} 
                  onClick={this.props.selectionHandler}
                  value={uhcl.university_id}
                >{uhcl.university_name}</DropdownItem>
              : null
            }
            {uh?
              <DropdownItem 
                  key={uh.university_id} 
                  onClick={this.props.selectionHandler}
                  value={uh.university_id}
                >{uh.university_name}</DropdownItem>
              : null
            }
            {uhd?
              <DropdownItem 
                  key={uhd.university_id} 
                  onClick={this.props.selectionHandler}
                  value={uhd.university_id}
                >{uhd.university_name}</DropdownItem>
              : null
            }
              {tamu||shsu?[tamu,shsu].map((obj) => (
                <DropdownItem 
                  key={obj.university_id} 
                  onClick={this.props.selectionHandler}
                  value={obj.university_id}
                  disabled  
                >{obj.university_name}</DropdownItem>
              ))
              :null
              }
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

const Header = WithLogin(HeaderComponent);

export default Header;

Header.propTypes = {
  universities:PropTypes.array.isRequired,
  selectionHandler:PropTypes.func.isRequired
}