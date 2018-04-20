import React from 'react';

var UniversityContext = React.createContext({});

export class UniversityContextProvider extends React.Component{
    constructor(props){
        super(props);
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
            'http://localhost:8000/universities',
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