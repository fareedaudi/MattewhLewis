import React from 'react';
import {Container,Jumbotron} from 'reactstrap';

const HomePage = () =>
    (
        <Container float="true" style={{paddingTop:'70px'}}>
            <Jumbotron style={{textAlign:"center", marginTop:"35px"}}>
            <h1>Pathway Mapping Toolkit</h1>
            <p>
            A resource for navigating transfer between San Jacinto College and its partner institutions.
            </p>
            </Jumbotron>
        </Container>
    )


export default HomePage;