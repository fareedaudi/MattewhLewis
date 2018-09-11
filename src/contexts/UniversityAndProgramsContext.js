import React from 'react';

var UniversityAndProgramContext = React.createContext({});

export class UniversityContextProvider extends React.Component{
    constructor(){
        super();
        this.state = {
            universities:[],
            selectedUniversity:{},
        }
        this.loadUniversities = this.loadUniversities.bind(this);
        this.selectUniversity = this.selectUniversity.bind(this);
    }

    componentDidMount(){
        this.loadUniversities();
    }

    loadUniversities(){
        fetch(
            `${ROOT_URL}/api/universities`,
        ).then(
            response = response.json()
        ).then(
            universities => {
                this.setState({
                    universities:universities
                });
            }
        )
    }

    selectUniversity(university){
        this.setState({
            university:university
        });
    }

    render(){
        return(
            <UniversityContext.Provider value={{
                state:this.state,
                actions:{
                    selectUniversity:this.selectUniversity
                }
            }}>
                {this.props.children}
            </UniversityContext.Provider>
        )
    }
}

export default UniversityContext;