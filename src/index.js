import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {LoginContextProvider} from './contexts/LoginContext';


ReactDOM.render(
    <LoginContextProvider>
        <App/>
    </LoginContextProvider>, document.getElementById('root'));
