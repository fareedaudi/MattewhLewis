import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {LoginContextProvider, WithLoginStatus} from './contexts/LoginContext';
import {SavedMapsContextProvider} from './contexts/SavedMapsContext';

const SavedMapsContextProv = WithLoginStatus(SavedMapsContextProvider);

ReactDOM.render(
    <LoginContextProvider>
        <SavedMapsContextProv>
            <App/>
        </SavedMapsContextProv>
    </LoginContextProvider>, document.getElementById('root'));
