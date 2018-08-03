import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardText
} from 'reactstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import {ROOT_URL} from '../../../api';
import SavedMapViewer from './SavedMapViewer/SavedMapViewer';
import SavedMapEditor from './SavedMapEditor/SavedMapEditor';
import {WithLogin} from '../../../contexts/LoginContext';

class MapEditorComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editMode:false,
            collaborators:[],
            mapToEdit:'-1',
            selectedProgram:{
                program_id:-1
            },
            associateDegreeId:'-1'
        }
        this.associateDegrees = {
            '1':{
                    name:'Associate of Arts, Business',
                    courses:[
                        {
                            sjc_id:1,
                            sjc_rubric:'ACCT',
                            sjc_number:'2301',
                            sjc_name:'Principles of Financial Accounting'
                        },
                        {
                            sjc_id:2,
                            sjc_rubric:'ACCT',
                            sjc_number:'2302',
                            sjc_name:'Principles of Managerial Accounting'
                        },
                        {
                            sjc_id:3,
                            sjc_rubric:'AGRI',
                            sjc_number:'1131',
                            sjc_name:'The Agricultural Industry',
                            not_applicable:true
                        },
                        {
                            sjc_id:4,
                            sjc_rubric:'AGRI',
                            sjc_number:'1309',
                            sjc_name:'Computers in Agriculture',
                            not_applicable:true
                        },
                        {
                            sjc_id:5,
                            sjc_rubric:'AGRI',
                            sjc_number:'1315',
                            sjc_name:'Horticulture',
                            not_applicable:true
                        },
                        {
                            sjc_id:6,
                            sjc_rubric:'AGRI',
                            sjc_number:'1319',
                            sjc_name:'Introduction to Animal Science',
                            not_applicable:true
                        },
                        {
                            sjc_id:7,
                            sjc_rubric:'AGRI',
                            sjc_number:'1407',
                            sjc_name:'Agronomy',
                            not_applicable:true
                        },
                        {
                            sjc_id:8,
                            sjc_rubric:'AGRI',
                            sjc_number:'2317',
                            sjc_name:'Introduction to Agricultural Economics',
                            not_applicable:true
                        },
                        {
                            sjc_id:9,
                            sjc_rubric:'AGRI',
                            sjc_number:'2321',
                            sjc_name:'Livestock Evaluation',
                            not_applicable:true
                        },
                        {
                            sjc_id:37,
                            sjc_rubric:'BCIS',
                            sjc_number:'1305',
                            sjc_name:'Business Computer Applications'
                        },
                        {
                            sjc_id:63,
                            sjc_rubric:'BUSI',
                            sjc_number:'1301',
                            sjc_name:'Business Principles'
                        },
                        {
                            sjc_id:64,
                            sjc_rubric:'BUSI',
                            sjc_number:'2301',
                            sjc_name:'Business Law'
                        },
                        {
                            sjc_id:65,
                            sjc_rubric:'BUSI',
                            sjc_number:'2304',
                            sjc_name:'Business Report Writing & Correspondence',
                            not_applicable:true
                        },
                        {
                            sjc_id:129,
                            sjc_rubric:'ECON',
                            sjc_number:'1301',
                            sjc_name:'Introduction to Economics',
                            not_applicable:true
                        },
                        {
                            sjc_id:130,
                            sjc_rubric:'ECON',
                            sjc_number:'2301',
                            sjc_name:'Principles of Macroeconomics'
                        },
                        {
                            sjc_id:131,
                            sjc_rubric:'ECON',
                            sjc_number:'2302',
                            sjc_name:'Principles of Microeconomics'
                        }
                    ]
                },
            '2':{
                    name:'Associate of Arts, Communication',
                    courses:[]
                },
            '3':{
                    name:'Associate of Arts, Fine Arts',
                    courses:[]
                },
            '4':{
                    name:'Associate of Arts, General Studies',
                    courses:[]
                },
            '5':{
                    name:'Associate of Arts, Kinesiology',
                    courses:[]
                },
            '6':{
                    name:'Associate of Arts, Social & Behavioral Sciences',
                    courses:[
                        {
                            sjc_id:10,
                            sjc_rubric:'ANTH',
                            sjc_number:'2301',
                            sjc_name:'Physical Anthropology',
                            not_applicable:true
                        },
                        {
                            sjc_id:11,
                            sjc_rubric:'ANTH',
                            sjc_number:'2302',
                            sjc_name:'Introduction to Archeology',
                            not_applicable:true
                        },
                        {
                            sjc_id:12,
                            sjc_rubric:'ANTH',
                            sjc_number:'2346',
                            sjc_name:'General Anthropology'
                        },
                        {
                            sjc_id:13,
                            sjc_rubric:'ANTH',
                            sjc_number:'2351',
                            sjc_name:'Cultural Anthropology',
                            not_applicable:true
                        },
                        {
                            sjc_id:94,
                            sjc_rubric:'CRIJ',
                            sjc_number:'1301',
                            sjc_name:'Introduction to Criminal Justice'
                        },
                        {
                            sjc_id:95,
                            sjc_rubric:'CRIJ',
                            sjc_number:'1306',
                            sjc_name:'Court Systems & Practices',
                            not_applicable:true
                        },
                        {
                            sjc_id:96,
                            sjc_rubric:'CRIJ',
                            sjc_number:'1307',
                            sjc_name:'Crime in America',
                            not_applicable:true
                        },
                        {
                            sjc_id:97,
                            sjc_rubric:'CRIJ',
                            sjc_number:'1310',
                            sjc_name:'Fundamentals of Criminal Justice Law',
                            not_applicable:true
                        },
                        {
                            sjc_id:98,
                            sjc_rubric:'CRIJ',
                            sjc_number:'1313',
                            sjc_name:'Juvenile Justice System',
                            not_applicable:true
                        },
                        {
                            sjc_id:99,
                            sjc_rubric:'CRIJ',
                            sjc_number:'2301',
                            sjc_name:'Community Resources in Corrections',
                            not_applicable:true
                        },
                        {
                            sjc_id:100,
                            sjc_rubric:'CRIJ',
                            sjc_number:'2313',
                            sjc_name:'Correctional Systems & Practices',
                            not_applicable:true
                        },
                        {
                            sjc_id:101,
                            sjc_rubric:'CRIJ',
                            sjc_number:'2314',
                            sjc_name:'Criminal Investigation',
                            not_applicable:true
                        },
                        {
                            sjc_id:102,
                            sjc_rubric:'CRIJ',
                            sjc_number:'2323',
                            sjc_name:'Legal Aspects of Law Enforcement',
                            not_applicable:true
                        },
                        {
                            sjc_id:103,
                            sjc_rubric:'CRIJ',
                            sjc_number:'2328',
                            sjc_name:'Police Systems & Practices',
                            not_applicable:true
                        },
                        {
                            sjc_id:159,
                            sjc_rubric:'GEOG',
                            sjc_number:'1301',
                            sjc_name:'Physical Geography',
                            not_applicable:true
                        },
                        {
                            sjc_id:160,
                            sjc_rubric:'GEOG',
                            sjc_number:'1302',
                            sjc_name:'Human Geography',
                            not_applicable:true
                        },
                        {
                            sjc_id:161,
                            sjc_rubric:'GEOG',
                            sjc_number:'1303',
                            sjc_name:'World Regional Geography'
                        },
                        {
                            sjc_id:176,
                            sjc_rubric:'GOVT',
                            sjc_number:'2017',
                            sjc_name:'Federal & Texas Government',
                            not_applicable:true
                        },
                        {
                            sjc_id:177,
                            sjc_rubric:'GOVT',
                            sjc_number:'2304',
                            sjc_name:'Introduction to Political Science',
                            not_applicable:true
                        },
                        {
                            sjc_id:178,
                            sjc_rubric:'GOVT',
                            sjc_number:'2305',
                            sjc_name:'Federal Government (Federal Const & Topics)',
                        },
                        {
                            sjc_id:179,
                            sjc_rubric:'GOVT',
                            sjc_number:'2306',
                            sjc_name:'Texas Government (Texas Const & Topics)',
                        },
                        {
                            sjc_id:180,
                            sjc_rubric:'GOVT',
                            sjc_number:'2311',
                            sjc_name:'Mexican-American Politics',
                            not_applicable:true
                        },
                        {
                            sjc_id:181,
                            sjc_rubric:'GOVT',
                            sjc_number:'2389',
                            sjc_name:'Academic Cooperative',
                            not_applicable:true
                        },
                        {
                            sjc_id:183,
                            sjc_rubric:'HIST',
                            sjc_number:'1301',
                            sjc_name:'United States History I',
                        },
                        {
                            sjc_id:184,
                            sjc_rubric:'HIST',
                            sjc_number:'1302',
                            sjc_name:'United States History II',
                        },
                        {
                            sjc_id:185,
                            sjc_rubric:'HIST',
                            sjc_number:'2301',
                            sjc_name:'Texas History',
                            not_applicable:true
                        },
                        {
                            sjc_id:186,
                            sjc_rubric:'HIST',
                            sjc_number:'2311',
                            sjc_name:'Western Civilization I',
                            not_applicable:true
                        },
                        {
                            sjc_id:187,
                            sjc_rubric:'HIST',
                            sjc_number:'2312',
                            sjc_name:'Western Civilization II',
                            not_applicable:true
                        },
                        {
                            sjc_id:188,
                            sjc_rubric:'HIST',
                            sjc_number:'2321',
                            sjc_name:'World Civilization I',
                            not_applicable:true
                        },
                        {
                            sjc_id:189,
                            sjc_rubric:'HIST',
                            sjc_number:'2322',
                            sjc_name:'World Civilization II',
                            not_applicable:true
                        },
                        {
                            sjc_id:190,
                            sjc_rubric:'HIST',
                            sjc_number:'2327',
                            sjc_name:'Mexican-American History I',
                            not_applicable:true
                        },
                        {
                            sjc_id:191,
                            sjc_rubric:'HIST',
                            sjc_number:'2328',
                            sjc_name:'Mexican-American History II',
                            not_applicable:true
                        },
                        {
                            sjc_id:192,
                            sjc_rubric:'HIST',
                            sjc_number:'2381',
                            sjc_name:'African-American History',
                            not_applicable:true
                        },
                        {
                            sjc_id:193,
                            sjc_rubric:'HUMA',
                            sjc_number:'1301',
                            sjc_name:'Introduction to the Humanities I'
                        },
                        {
                            sjc_id:194,
                            sjc_rubric:'HUMA',
                            sjc_number:'1305',
                            sjc_name:'Introduction to Mexican-American Studies',
                            not_applicable:true
                        },
                        {
                            sjc_id:195,
                            sjc_rubric:'HUMA',
                            sjc_number:'1311',
                            sjc_name:'Mexican-American Fine Arts Appreciation',
                            not_applicable:true
                        },
                        {
                            sjc_id:236,
                            sjc_rubric:'PHIL',
                            sjc_number:'1301',
                            sjc_name:'Introduction to Philosophy',
                            not_applicable:true
                        },
                        {
                            sjc_id:237,
                            sjc_rubric:'PHIL',
                            sjc_number:'1304',
                            sjc_name:'Introduction to World Religions',
                            not_applicable:true
                        },
                        {
                            sjc_id:238,
                            sjc_rubric:'PHIL',
                            sjc_number:'2303',
                            sjc_name:'Introduction to Formal Logic',
                            not_applicable:true
                        },
                        {
                            sjc_id:239,
                            sjc_rubric:'PHIL',
                            sjc_number:'2306',
                            sjc_name:'Introduction to Ethics',
                            not_applicable:true
                        },
                        {
                            sjc_id:240,
                            sjc_rubric:'PHIL',
                            sjc_number:'2307',
                            sjc_name:'Introduction to Social & Political Philosophy',
                            not_applicable:true
                        },
                        {
                            sjc_id:253,
                            sjc_rubric:'PSYC',
                            sjc_number:'1300',
                            sjc_name:'Learning Framework',
                            not_applicable:true
                        },
                        {
                            sjc_id:254,
                            sjc_rubric:'PSYC',
                            sjc_number:'2301',
                            sjc_name:'General Psychology',
                        },
                        {
                            sjc_id:255,
                            sjc_rubric:'PSYC',
                            sjc_number:'2306',
                            sjc_name:'Human Sexuality',
                            not_applicable:true
                        },
                        {
                            sjc_id:256,
                            sjc_rubric:'PSYC',
                            sjc_number:'2308',
                            sjc_name:'Child Psychology',
                            not_applicable:true
                        },
                        {
                            sjc_id:257,
                            sjc_rubric:'PSYC',
                            sjc_number:'2314',
                            sjc_name:'Lifespan Growth & Development',
                            not_applicable:true
                        },
                        {
                            sjc_id:258,
                            sjc_rubric:'PSYC',
                            sjc_number:'2315',
                            sjc_name:'Psychology of Adjustment',
                            not_applicable:true
                        },
                        {
                            sjc_id:259,
                            sjc_rubric:'PSYC',
                            sjc_number:'2317',
                            sjc_name:'Statistical Methods in Psychology',
                            not_applicable:true
                        },
                        {
                            sjc_id:260,
                            sjc_rubric:'PSYC',
                            sjc_number:'2319',
                            sjc_name:'Social Psychology',
                            not_applicable:true
                        },
                        {
                            sjc_id:270,
                            sjc_rubric:'SOCI',
                            sjc_number:'1301',
                            sjc_name:'Introductory Sociology',
                            not_applicable:true
                        },
                        {
                            sjc_id:271,
                            sjc_rubric:'SOCI',
                            sjc_number:'1306',
                            sjc_name:'Social Problems',
                            not_applicable:true
                        },
                        {
                            sjc_id:272,
                            sjc_rubric:'SOCI',
                            sjc_number:'2301',
                            sjc_name:'Marriage & the Family',
                            not_applicable:true
                        },
                        {
                            sjc_id:273,
                            sjc_rubric:'SOCI',
                            sjc_number:'2306',
                            sjc_name:'Human Sexuality',
                            not_applicable:true
                        },
                        {
                            sjc_id:274,
                            sjc_rubric:'SOCI',
                            sjc_number:'2319',
                            sjc_name:'Minority Studies',
                            not_applicable:true
                        },
                        {
                            sjc_id:275,
                            sjc_rubric:'SOCI',
                            sjc_number:'2336',
                            sjc_name:'Criminology',
                            not_applicable:true
                        }
                    ]
                },
            '7':{
                    name:'Associate of Arts in Teaching, EC-6',
                    courses:[]
                },
            '8':{
                    name:'Associate of Arts in Teaching, 4-8,EC-12',
                    courses:[]
                },
            '9':{
                    name:'Associate of Arts in Teaching, 8-12, EC-12',
                    courses:[]
                },
            '10':{
                    name:'Associate of Science, Computer Science',
                    courses:[
                        {
                            sjc_id:90,
                            sjc_rubric:'COSC',
                            sjc_number:'1336',
                            sjc_name:'Programming Fundamentals I',
                            not_applicable:true
                        },
                        {
                            sjc_id:91,
                            sjc_rubric:'COSC',
                            sjc_number:'1337',
                            sjc_name:'Programming Fundamentals II',
                            not_applicable:true
                        },
                        {
                            sjc_id:93,
                            sjc_rubric:'COSC',
                            sjc_number:'2336',
                            sjc_name:'Programming Fundamentals III'
                        },
                        {
                            sjc_id:92,
                            sjc_rubric:'COSC',
                            sjc_number:'2325',
                            sjc_name:'Computer Organization',
                            not_applicable:true
                        },
                        {
                            sjc_id:207,
                            sjc_rubric:'MATH',
                            sjc_number:'2413',
                            sjc_name:'Calculus I'
                        },
                        {
                            sjc_id:208,
                            sjc_rubric:'MATH',
                            sjc_number:'2414',
                            sjc_name:'Calculus II'
                        },
                        {
                            sjc_id:251,
                            sjc_rubric:'PHYS',
                            sjc_number:'2325',
                            sjc_name:'University Physics I (lecture)'
                        },
                        {
                            sjc_id:252,
                            sjc_rubric:'PHYS',
                            sjc_number:'2326',
                            sjc_name:'University Physics II (lecture)'
                        }
                    ]
                },
            '11':{
                    name:'Associate of Science, Life Science',
                    courses:[]
                },
            '12':{
                    name:'Associate of Science, Mathematics',
                    courses:[]
                },
            '13':{
                    name:'Associate of Science, Physical Sciences',
                    courses:[]
                }
        }
    }

    componentDidMount(){
        this.getCollaborators();
    }

    setAssociateDegree = ({target:{value}}) => {
        let associateDegreeId = value;
        this.setState({associateDegreeId});
    }


    getSelectedProgramAndSetState = (programId) => {
        this.props.getSelectedProgramData(programId,
            (selectedProgram)=>{
                this.setState({selectedProgram});
                this.props.setProgramInRequirement(selectedProgram);
            });

    }

    toggleEditMode = () => {
        this.setState({
            editMode:!this.state.editMode
        });
    }

    setMapToEdit = (mapToEdit) => {
        this.setState({
            mapToEdit
        });
    }

    toggleEditModeOff = () => {
        this.setState({
            editMode:false
        });
    }

    render(){
        let associateDegree = this.associateDegrees[this.state.associateDegreeId];
        var instructions = (this.state.editMode)?
            'Edit courses for degree components, below.':
            'View your saved maps below, or create a new map!';
        let loggedIn = this.props.login.state.loggedIn;
        let savedMapToEdit = this.props.savedMaps.filter(
            savedMap=>String(savedMap.id)===this.state.mapToEdit)[0];
        return (
            <Card>
                <CardHeader>
                    <h4>Pathway Map Editor</h4>
                </CardHeader>
                {loggedIn?
                    <CardBody>
                        <CardText>
                            {instructions}
                        </CardText>
                        {
                        this.state.editMode ?
                        <SavedMapEditor
                            key={this.state.editMode && savedMapToEdit.id}
                            toggleEditMode={this.toggleEditMode}
                            toggleEditModeOff={this.toggleEditModeOff}
                            savedMapToEdit={savedMapToEdit}
                            selectedProgram={this.props.selectedProgram}
                            coreRequirements={this.props.coreRequirements}
                            login={this.props.login}
                            associateDegrees={this.associateDegrees}
                            associateDegree={associateDegree}
                        />
                        :
                        <SavedMapViewer
                            login={this.props.login} 
                            university={this.props.university}
                            programs={this.props.programs}
                            collaborators={this.state.collaborators}
                            toggleEditMode={this.toggleEditMode}
                            setMapToEdit={this.setMapToEdit}
                            getSelectedProgramAndSetState={this.getSelectedProgramAndSetState}
                            savedMaps={this.props.savedMaps}
                            associateDegrees={this.associateDegrees}
                            setAssociateDegree={this.setAssociateDegree}
                            />
                        }
                    </CardBody>
                    :
                    <CardBody>
                        <CardText>
                            Please login to view and edit maps. 
                        </CardText>
                    </CardBody>
                }
            </Card>
        )
    }

    getCollaborators = () => {
        axios.get(
            `${ROOT_URL}/user_emails`
        ).then(
            response => response.data
        ).then(
            collaborators => {
                this.setState({collaborators},
                ()=> {
                });
            }
        );
    }
}


MapEditorComponent.propTypes = {
    university:PropTypes.object.isRequired,
    programs:PropTypes.array.isRequired,
    selectedProgram:PropTypes.object.isRequired,
    savedMaps:PropTypes.array.isRequired,
    login:PropTypes.object.isRequired
}


const MapEditor = WithLogin(MapEditorComponent);

export default MapEditor;