import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {LoginContextProvider} from './contexts/LoginContext';


ReactDOM.render(
    <BrowserRouter>
    <LoginContextProvider>
        <App/>
    </LoginContextProvider>
    </BrowserRouter>, document.getElementById('root'));
