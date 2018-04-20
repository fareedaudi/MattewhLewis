import React from 'react';
import {Container,Jumbotron} from 'reactstrap';

function HomePage(props){
    return (
        <Container float="true" style={{paddingTop:'70px'}}>
            <Jumbotron style={{textAlign:"center", marginTop:"35px"}}>
            <h1>Degree Mapping Toolkit</h1>
            <p>
            A resource for navigating transfer between San Jacinto College and its partner institutions.
            </p>
            </Jumbotron>
        </Container>
    )
}

export default HomePage;