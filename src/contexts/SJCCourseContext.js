import React from 'react';
import {ROOT_URL} from '../api';

var SJCCourseContext = React.createContext({});

export default class SJCCourseContextProvider extends React.Component{
    constructor(){
        super();
        this.state = {
            SJCCourses:[],
        }
    }

    componentDidMount(){
        this.loadSJCCourses();
    }

    loadSJCCourses = () => {
        fetch(
            `${ROOT_URL}/sjc_courses`,
        ).then(
            response => response.json()
        ).then(
            SJCCourses => {
                this.setState({
                    SJCCourses:SJCCourses
                });
            }
        )
    }

    render(){
        return(
            <SJCCourseContext.Provider value={this.state.SJCCourses}>
                {this.props.children}
            </SJCCourseContext.Provider>
        )
    }
}

export function WithSJCCourses(SJCCoursesConsumer) {
    return class extends React.Component{
        render(){
            return (
                <SJCCourseContext.Consumer>
                    {
                        SJCCourses => (
                            <SJCCoursesConsumer SJCCourses={SJCCourses} {...this.props}/>
                        )
                    }
                </SJCCourseContext.Consumer>
            );
        }
    }
}