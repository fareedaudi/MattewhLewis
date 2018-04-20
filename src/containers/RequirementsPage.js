import React from 'react';
import {
    Container,
    Card,
    CardHeader,
    CardBody,
    CardText,
    Col,
    Row
} from 'reactstrap';

export default class RequirementsPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            university:{
                university_id:'3',
                university_name:"University of Houston Clear Lake"
            },
            programs:[
                {
                    program_id:2,
                    program_name:'PhD Welding'
                },
                {
                    program_id:3,
                    program_name:'MS Booty-ology'
                }
            ]
        }
    }

    render(){
        return(
            <Container style={{paddingTop:'100px'}}>
                <Row>
                    <Col xs="8">
                        <RequirementsCard 
                            university={this.state.university} 
                            programs={this.state.programs}
                        />
                    </Col>
                    <Col xs="4">
                        <EditorCard/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

class RequirementsCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedProgram:{
                "program_link": "https://catalog.uhcl.edu/current/undergraduate/degrees-and-programs/bachelors/biological-science-bs.aspx",
                "program_id": 4,
                "program_name": "Biological Science B.S.",
                "components": [
                    {
                        "component_id": 4,
                        "component_name": "University Core Requirements 42 Hours",
                        "requirements": [
                            {
                                "requirement_id": 4,
                                "requirement_name": "Communication 6 hours",
                                "courses": [
                                    {
                                        "course_id": 1,
                                        "course_rubric": "WRIT",
                                        "course_number": "1301",
                                        "course_name": "Composition I",
                                        "sjc_course": {
                                            "sjc_id": 135,
                                            "sjc_rubric": "ENGL",
                                            "sjc_number": "1301",
                                            "sjc_name": "Composition I"
                                        }
                                    },
                                    {
                                        "course_id": 2,
                                        "course_rubric": "WRIT",
                                        "course_number": "1302",
                                        "course_name": "Composition II",
                                        "sjc_course": {
                                            "sjc_id": 136,
                                            "sjc_rubric": "ENGL",
                                            "sjc_number": "1302",
                                            "sjc_name": "Composition II"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 16,
                                "requirement_name": "Mathematics 3 hours",
                                "courses": [
                                    {
                                        "course_id": 9,
                                        "course_rubric": "MATH",
                                        "course_number": "2413",
                                        "course_name": "Calculus I",
                                        "sjc_course": {
                                            "sjc_id": 207,
                                            "sjc_rubric": "MATH",
                                            "sjc_number": "2413",
                                            "sjc_name": "Calculus I"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 24,
                                "requirement_name": "Life and Physical Sciences 6 hours",
                                "courses": [
                                    {
                                        "course_id": 12,
                                        "course_rubric": "CHEM",
                                        "course_number": "1311",
                                        "course_name": "General Chemistry I",
                                        "sjc_course": {
                                            "sjc_id": 70,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1311",
                                            "sjc_name": "General Chemistry I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 15,
                                        "course_rubric": "CHEM",
                                        "course_number": "1312",
                                        "course_name": "General Chemistry II",
                                        "sjc_course": {
                                            "sjc_id": 71,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1312",
                                            "sjc_name": "General Chemistry II (lecture)"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 36,
                                "requirement_name": "Language, Philosophy and Culture 3 hours",
                                "courses": [
                                    {
                                        "course_id": 17,
                                        "course_rubric": "HUMN",
                                        "course_number": "1301",
                                        "course_name": "Humanities",
                                        "sjc_course": {
                                            "sjc_id": 193,
                                            "sjc_rubric": "HUMA",
                                            "sjc_number": "1301",
                                            "sjc_name": "Introduction to the Humanities I"
                                        }
                                    },
                                    {
                                        "course_id": 19,
                                        "course_rubric": "LITR",
                                        "course_number": "2341",
                                        "course_name": "Literature and Experience",
                                        "sjc_course": {
                                            "sjc_id": 145,
                                            "sjc_rubric": "ENGL",
                                            "sjc_number": "2341",
                                            "sjc_name": "Forms of Literature (1 semester course)"
                                        }
                                    },
                                    {
                                        "course_id": 21,
                                        "course_rubric": "PHIL",
                                        "course_number": "1301",
                                        "course_name": "Introduction to Philosophy",
                                        "sjc_course": {
                                            "sjc_id": 236,
                                            "sjc_rubric": "PHIL",
                                            "sjc_number": "1301",
                                            "sjc_name": "Introduction to Philosophy"
                                        }
                                    },
                                    {
                                        "course_id": 25,
                                        "course_rubric": "WGST",
                                        "course_number": "1301",
                                        "course_name": "Gender Matters: Introduction to Women's and Gender Studies",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 50,
                                "requirement_name": "Creative Arts 3 Hours",
                                "courses": [
                                    {
                                        "course_id": 29,
                                        "course_rubric": "ARTS",
                                        "course_number": "1303",
                                        "course_name": "World Art Survey I",
                                        "sjc_course": {
                                            "sjc_id": 15,
                                            "sjc_rubric": "ARTS",
                                            "sjc_number": "1303",
                                            "sjc_name": "Art History I (Prehistoric to the 14th Century)"
                                        }
                                    },
                                    {
                                        "course_id": 33,
                                        "course_rubric": "ARTS",
                                        "course_number": "1304",
                                        "course_name": "World Art Survey II",
                                        "sjc_course": {
                                            "sjc_id": 16,
                                            "sjc_rubric": "ARTS",
                                            "sjc_number": "1304",
                                            "sjc_name": "Art History II (14th Century to the Present)"
                                        }
                                    },
                                    {
                                        "course_id": 36,
                                        "course_rubric": "ARTS",
                                        "course_number": "2379",
                                        "course_name": "Arts and the Child",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 78,
                                "requirement_name": "American History 6 hours",
                                "courses": [
                                    {
                                        "course_id": 34,
                                        "course_rubric": "HIST",
                                        "course_number": "1301",
                                        "course_name": "United States History I",
                                        "sjc_course": {
                                            "sjc_id": 183,
                                            "sjc_rubric": "HIST",
                                            "sjc_number": "1301",
                                            "sjc_name": "United States History I"
                                        }
                                    },
                                    {
                                        "course_id": 41,
                                        "course_rubric": "HIST",
                                        "course_number": "1302",
                                        "course_name": "United States History II",
                                        "sjc_course": {
                                            "sjc_id": 184,
                                            "sjc_rubric": "HIST",
                                            "sjc_number": "1302",
                                            "sjc_name": "United States History II"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 93,
                                "requirement_name": "Government/ Political Science 6 hours",
                                "courses": [
                                    {
                                        "course_id": 44,
                                        "course_rubric": "POLS",
                                        "course_number": "2305",
                                        "course_name": "Federal Government",
                                        "sjc_course": {
                                            "sjc_id": 178,
                                            "sjc_rubric": "GOVT",
                                            "sjc_number": "2305",
                                            "sjc_name": "Federal Government (Federal Const & Topics)"
                                        }
                                    },
                                    {
                                        "course_id": 46,
                                        "course_rubric": "POLS",
                                        "course_number": "2306",
                                        "course_name": "Texas Government",
                                        "sjc_course": {
                                            "sjc_id": 179,
                                            "sjc_rubric": "GOVT",
                                            "sjc_number": "2306",
                                            "sjc_name": "Texas Government (Texas Const & Topics)"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 106,
                                "requirement_name": "Social and Behavioral Sciences 3 hours",
                                "courses": [
                                    {
                                        "course_id": 49,
                                        "course_rubric": "ANTH",
                                        "course_number": "2346",
                                        "course_name": "General Anthropology",
                                        "sjc_course": {
                                            "sjc_id": 12,
                                            "sjc_rubric": "ANTH",
                                            "sjc_number": "2346",
                                            "sjc_name": "General Anthropology"
                                        }
                                    },
                                    {
                                        "course_id": 51,
                                        "course_rubric": "CRIM",
                                        "course_number": "1301",
                                        "course_name": "Introduction to Criminal Justice",
                                        "sjc_course": {
                                            "sjc_id": 94,
                                            "sjc_rubric": "CRIJ",
                                            "sjc_number": "1301",
                                            "sjc_name": "Introduction to Criminal Justice"
                                        }
                                    },
                                    {
                                        "course_id": 53,
                                        "course_rubric": "ECON",
                                        "course_number": "2301",
                                        "course_name": "Principles of Macroeconomics",
                                        "sjc_course": {
                                            "sjc_id": 130,
                                            "sjc_rubric": "ECON",
                                            "sjc_number": "2301",
                                            "sjc_name": "Principles of Macroeconomics"
                                        }
                                    },
                                    {
                                        "course_id": 56,
                                        "course_rubric": "ECON",
                                        "course_number": "2302",
                                        "course_name": "Principles of Microeconomics",
                                        "sjc_course": {
                                            "sjc_id": 131,
                                            "sjc_rubric": "ECON",
                                            "sjc_number": "2302",
                                            "sjc_name": "Principles of Microeconomics"
                                        }
                                    },
                                    {
                                        "course_id": 59,
                                        "course_rubric": "GEOG",
                                        "course_number": "1303",
                                        "course_name": "World Regional Geography",
                                        "sjc_course": {
                                            "sjc_id": 161,
                                            "sjc_rubric": "GEOG",
                                            "sjc_number": "1303",
                                            "sjc_name": "World Regional Geography"
                                        }
                                    },
                                    {
                                        "course_id": 60,
                                        "course_rubric": "PSYC",
                                        "course_number": "2301",
                                        "course_name": "Introduction to Psychology",
                                        "sjc_course": {
                                            "sjc_id": 254,
                                            "sjc_rubric": "PSYC",
                                            "sjc_number": "2301",
                                            "sjc_name": "General Psychology"
                                        }
                                    },
                                    {
                                        "course_id": 62,
                                        "course_rubric": "SOCI",
                                        "course_number": "1301",
                                        "course_name": "Introduction to Sociology",
                                        "sjc_course": {
                                            "sjc_id": 270,
                                            "sjc_rubric": "SOCI",
                                            "sjc_number": "1301",
                                            "sjc_name": "Introductory Sociology"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 166,
                                "requirement_name": "Component Area Option 6 hours",
                                "courses": [
                                    {
                                        "course_id": 42,
                                        "course_rubric": "CHEM",
                                        "course_number": "1111",
                                        "course_name": "Laboratory for General Chemistry I",
                                        "sjc_course": {
                                            "sjc_id": 67,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1111",
                                            "sjc_name": "General Chemistry I (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 54,
                                        "course_rubric": "CHEM",
                                        "course_number": "1112",
                                        "course_name": "Laboratory for General Chemistry II",
                                        "sjc_course": {
                                            "sjc_id": 68,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1112",
                                            "sjc_name": "General Chemistry II (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 57,
                                        "course_rubric": "COMM",
                                        "course_number": "1315",
                                        "course_name": "Public Speaking",
                                        "sjc_course": {
                                            "sjc_id": 282,
                                            "sjc_rubric": "SPCH",
                                            "sjc_number": "1315",
                                            "sjc_name": "Public Speaking"
                                        }
                                    },
                                    {
                                        "course_id": 47,
                                        "course_rubric": "PSYC",
                                        "course_number": "1100",
                                        "course_name": "Learning Frameworks",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "component_id": 60,
                        "component_name": "Major and Elective Requirements 78 hours",
                        "requirements": [
                            {
                                "requirement_id": 213,
                                "requirement_name": "Core Courses",
                                "courses": [
                                    {
                                        "course_id": 65,
                                        "course_rubric": "BIOL",
                                        "course_number": "1106",
                                        "course_name": "Laboratory for Biology for Science Majors I",
                                        "sjc_course": {
                                            "sjc_id": 38,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "1106",
                                            "sjc_name": "Biology for Science Major I (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 67,
                                        "course_rubric": "BIOL",
                                        "course_number": "1107",
                                        "course_name": "Laboratory for Biology for Science Majors II",
                                        "sjc_course": {
                                            "sjc_id": 39,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "1107",
                                            "sjc_name": "Biology for Science Major II (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 14,
                                        "course_rubric": "BIOL",
                                        "course_number": "1306",
                                        "course_name": "Biology for Science Majors I",
                                        "sjc_course": {
                                            "sjc_id": 44,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "1306",
                                            "sjc_name": "Biology for Science Majors I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 16,
                                        "course_rubric": "BIOL",
                                        "course_number": "1307",
                                        "course_name": "Biology for Science Majors II",
                                        "sjc_course": {
                                            "sjc_id": 45,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "1307",
                                            "sjc_name": "Biology for Science Majors II (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 77,
                                        "course_rubric": "BIOL",
                                        "course_number": "3141",
                                        "course_name": "Laboratory for Molecular Genetics",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 81,
                                        "course_rubric": "BIOL",
                                        "course_number": "3341",
                                        "course_name": "Molecular Genetics",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 86,
                                        "course_rubric": "BIOL",
                                        "course_number": "4242",
                                        "course_name": "Laboratory for Biochemistry",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 90,
                                        "course_rubric": "BIOL",
                                        "course_number": "4278",
                                        "course_name": "Seminar in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 95,
                                        "course_rubric": "BIOL",
                                        "course_number": "4311",
                                        "course_name": "Ecology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 100,
                                        "course_rubric": "BIOL",
                                        "course_number": "4341",
                                        "course_name": "Biochemistry I",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 42,
                                        "course_rubric": "CHEM",
                                        "course_number": "1111",
                                        "course_name": "Laboratory for General Chemistry I",
                                        "sjc_course": {
                                            "sjc_id": 67,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1111",
                                            "sjc_name": "General Chemistry I (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 54,
                                        "course_rubric": "CHEM",
                                        "course_number": "1112",
                                        "course_name": "Laboratory for General Chemistry II",
                                        "sjc_course": {
                                            "sjc_id": 68,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1112",
                                            "sjc_name": "General Chemistry II (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 12,
                                        "course_rubric": "CHEM",
                                        "course_number": "1311",
                                        "course_name": "General Chemistry I",
                                        "sjc_course": {
                                            "sjc_id": 70,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1311",
                                            "sjc_name": "General Chemistry I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 15,
                                        "course_rubric": "CHEM",
                                        "course_number": "1312",
                                        "course_name": "General Chemistry II",
                                        "sjc_course": {
                                            "sjc_id": 71,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "1312",
                                            "sjc_name": "General Chemistry II (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 70,
                                        "course_rubric": "CHEM",
                                        "course_number": "2123",
                                        "course_name": "Laboratory for Organic Chemistry I",
                                        "sjc_course": {
                                            "sjc_id": 72,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "2123",
                                            "sjc_name": "Organic Chemistry I (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 91,
                                        "course_rubric": "CHEM",
                                        "course_number": "2125",
                                        "course_name": "Laboratory for Organic Chemistry II",
                                        "sjc_course": {
                                            "sjc_id": 73,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "2125",
                                            "sjc_name": "Organic Chemistry II (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 68,
                                        "course_rubric": "CHEM",
                                        "course_number": "2323",
                                        "course_name": "Organic Chemistry I",
                                        "sjc_course": {
                                            "sjc_id": 74,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "2323",
                                            "sjc_name": "Organic Chemistry I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 87,
                                        "course_rubric": "CHEM",
                                        "course_number": "2325",
                                        "course_name": "Organic Chemistry II",
                                        "sjc_course": {
                                            "sjc_id": 75,
                                            "sjc_rubric": "CHEM",
                                            "sjc_number": "2325",
                                            "sjc_name": "Organic Chemistry II (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 9,
                                        "course_rubric": "MATH",
                                        "course_number": "2413",
                                        "course_name": "Calculus I",
                                        "sjc_course": {
                                            "sjc_id": 207,
                                            "sjc_rubric": "MATH",
                                            "sjc_number": "2413",
                                            "sjc_name": "Calculus I"
                                        }
                                    },
                                    {
                                        "course_id": 156,
                                        "course_rubric": "PHYS",
                                        "course_number": "1101",
                                        "course_name": "Laboratory for College Physics I",
                                        "sjc_course": {
                                            "sjc_id": 241,
                                            "sjc_rubric": "PHYS",
                                            "sjc_number": "1101",
                                            "sjc_name": "College Physics I (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 167,
                                        "course_rubric": "PHYS",
                                        "course_number": "1102",
                                        "course_name": "Laboratory for College Physics II",
                                        "sjc_course": {
                                            "sjc_id": 242,
                                            "sjc_rubric": "PHYS",
                                            "sjc_number": "1102",
                                            "sjc_name": "College Physics II (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 50,
                                        "course_rubric": "PHYS",
                                        "course_number": "1301",
                                        "course_name": "College Physics I",
                                        "sjc_course": {
                                            "sjc_id": 245,
                                            "sjc_rubric": "PHYS",
                                            "sjc_number": "1301",
                                            "sjc_name": "College Physics I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 52,
                                        "course_rubric": "PHYS",
                                        "course_number": "1302",
                                        "course_name": "College Physics II",
                                        "sjc_course": {
                                            "sjc_id": 246,
                                            "sjc_rubric": "PHYS",
                                            "sjc_number": "1302",
                                            "sjc_name": "College Physics II (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 99,
                                        "course_rubric": "STAT",
                                        "course_number": "3308",
                                        "course_name": "Computational Statistics",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 108,
                                        "course_rubric": "WRIT",
                                        "course_number": "3315",
                                        "course_name": "Advanced Technical Writing",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "component_id": 106,
                        "component_name": "Specialization in Cell/Molecular/Biotechnology Requirements",
                        "requirements": [
                            {
                                "requirement_id": 543,
                                "requirement_name": "Specialization Requirements",
                                "courses": [
                                    {
                                        "course_id": 3,
                                        "course_rubric": "BIOL",
                                        "course_number": "2121",
                                        "course_name": "Laboratory for Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 55,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2121",
                                            "sjc_name": "Microbiology for Science Majors (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 5,
                                        "course_rubric": "BIOL",
                                        "course_number": "2321",
                                        "course_name": "Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 61,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2321",
                                            "sjc_name": "Microbiology for Science Majors I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 224,
                                        "course_rubric": "BIOL",
                                        "course_number": "4342",
                                        "course_name": "Biochemistry II",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 232,
                                        "course_rubric": "BIOL",
                                        "course_number": "4347",
                                        "course_name": "Cellular Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 241,
                                        "course_rubric": "BIOL",
                                        "course_number": "4348",
                                        "course_name": "Developmental Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 256,
                                        "course_rubric": "BIOL",
                                        "course_number": "4351",
                                        "course_name": "Molecular Biology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 628,
                                "requirement_name": "Specialization Requirements Courses 3 hours",
                                "courses": [
                                    {
                                        "course_id": 8,
                                        "course_rubric": "BIOL",
                                        "course_number": "4345",
                                        "course_name": "Human Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 207,
                                        "course_rubric": "BIOL",
                                        "course_number": "4344",
                                        "course_name": "Comparative Animal Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 201,
                                        "course_rubric": "BIOL",
                                        "course_number": "4343",
                                        "course_name": "Plant Physiology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 677,
                                "requirement_name": "Group 1:",
                                "courses": [
                                    {
                                        "course_id": 174,
                                        "course_rubric": "BIOL",
                                        "course_number": "3373",
                                        "course_name": "Human Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 181,
                                        "course_rubric": "BIOL",
                                        "course_number": "3173",
                                        "course_name": "Laboratory for Human Anatomy",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 704,
                                "requirement_name": "Group 2:",
                                "courses": [
                                    {
                                        "course_id": 145,
                                        "course_rubric": "BIOL",
                                        "course_number": "2428",
                                        "course_name": "Vertebrate Zoology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 714,
                                "requirement_name": "Group 3:",
                                "courses": [
                                    {
                                        "course_id": 152,
                                        "course_rubric": "BIOL",
                                        "course_number": "3313",
                                        "course_name": "Plant Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 161,
                                        "course_rubric": "BIOL",
                                        "course_number": "3113",
                                        "course_name": "Laboratory for Plant Anatomy",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 731,
                                "requirement_name": "Specialization Elective Courses 10 hours",
                                "courses": [
                                    {
                                        "course_id": 390,
                                        "course_rubric": "BIOL",
                                        "course_number": "4332",
                                        "course_name": "Histology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 134,
                                        "course_rubric": "BIOL",
                                        "course_number": "4346",
                                        "course_name": "Pathophysiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 426,
                                        "course_rubric": "BIOL",
                                        "course_number": "4252",
                                        "course_name": "Molecular Biology Laboratory",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 447,
                                        "course_rubric": "BIOL",
                                        "course_number": "4355",
                                        "course_name": "Tissue Culture",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 465,
                                        "course_rubric": "BIOL",
                                        "course_number": "4253",
                                        "course_name": "Laboratory for Biotechnology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 481,
                                        "course_rubric": "BIOL",
                                        "course_number": "4361",
                                        "course_name": "Immunology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 499,
                                        "course_rubric": "BIOL",
                                        "course_number": "4254",
                                        "course_name": "Laboratory for Eukaryotic Gene Expression",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 519,
                                        "course_rubric": "BIOL",
                                        "course_number": "4371",
                                        "course_name": "Cancer Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 420,
                                        "course_rubric": "BIOL",
                                        "course_number": "4189",
                                        "course_name": "Independent Study in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 563,
                                        "course_rubric": "BIOL",
                                        "course_number": "4291",
                                        "course_name": "Laboratory Topics in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 476,
                                        "course_rubric": "BIOL",
                                        "course_number": "4391",
                                        "course_name": "Selected Topics in the Biological Sciences",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "component_id": 202,
                        "component_name": "Specialization in Physiology/Pre-Health Specialization Requirements",
                        "requirements": [
                            {
                                "requirement_id": 829,
                                "requirement_name": "Specialization Requirements",
                                "courses": [
                                    {
                                        "course_id": 5,
                                        "course_rubric": "BIOL",
                                        "course_number": "2321",
                                        "course_name": "Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 61,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2321",
                                            "sjc_name": "Microbiology for Science Majors I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 3,
                                        "course_rubric": "BIOL",
                                        "course_number": "2121",
                                        "course_name": "Laboratory for Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 55,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2121",
                                            "sjc_name": "Microbiology for Science Majors (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 174,
                                        "course_rubric": "BIOL",
                                        "course_number": "3373",
                                        "course_name": "Human Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 181,
                                        "course_rubric": "BIOL",
                                        "course_number": "3173",
                                        "course_name": "Laboratory for Human Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 388,
                                        "course_rubric": "BIOL",
                                        "course_number": "4241",
                                        "course_name": "Laboratory for Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 224,
                                        "course_rubric": "BIOL",
                                        "course_number": "4342",
                                        "course_name": "Biochemistry II",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 8,
                                        "course_rubric": "BIOL",
                                        "course_number": "4345",
                                        "course_name": "Human Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 481,
                                        "course_rubric": "BIOL",
                                        "course_number": "4361",
                                        "course_name": "Immunology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 875,
                                "requirement_name": "Specialization Requirements Courses 3 hours",
                                "courses": [
                                    {
                                        "course_id": 232,
                                        "course_rubric": "BIOL",
                                        "course_number": "4347",
                                        "course_name": "Cellular Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 134,
                                        "course_rubric": "BIOL",
                                        "course_number": "4346",
                                        "course_name": "Pathophysiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 256,
                                        "course_rubric": "BIOL",
                                        "course_number": "4351",
                                        "course_name": "Molecular Biology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 887,
                                "requirement_name": "Specialization Elective Courses 11 hours",
                                "courses": [
                                    {
                                        "course_id": 390,
                                        "course_rubric": "BIOL",
                                        "course_number": "4332",
                                        "course_name": "Histology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 136,
                                        "course_rubric": "BIOL",
                                        "course_number": "3335",
                                        "course_name": "Epidemiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 680,
                                        "course_rubric": "BIOL",
                                        "course_number": "4325",
                                        "course_name": "Environmental Toxicology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 241,
                                        "course_rubric": "BIOL",
                                        "course_number": "4348",
                                        "course_name": "Developmental Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 465,
                                        "course_rubric": "BIOL",
                                        "course_number": "4253",
                                        "course_name": "Laboratory for Biotechnology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 519,
                                        "course_rubric": "BIOL",
                                        "course_number": "4371",
                                        "course_name": "Cancer Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 476,
                                        "course_rubric": "BIOL",
                                        "course_number": "4391",
                                        "course_name": "Selected Topics in the Biological Sciences",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 420,
                                        "course_rubric": "BIOL",
                                        "course_number": "4189",
                                        "course_name": "Independent Study in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 563,
                                        "course_rubric": "BIOL",
                                        "course_number": "4291",
                                        "course_name": "Laboratory Topics in Biology",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "component_id": 227,
                        "component_name": "Specialization in Ecology/Microbiology/Aquatic and Marine Biology Requirements",
                        "requirements": [
                            {
                                "requirement_id": 906,
                                "requirement_name": "Physiology",
                                "courses": [
                                    {
                                        "course_id": 201,
                                        "course_rubric": "BIOL",
                                        "course_number": "4343",
                                        "course_name": "Plant Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 207,
                                        "course_rubric": "BIOL",
                                        "course_number": "4344",
                                        "course_name": "Comparative Animal Physiology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 911,
                                "requirement_name": "Group 1:",
                                "courses": [
                                    {
                                        "course_id": 145,
                                        "course_rubric": "BIOL",
                                        "course_number": "2428",
                                        "course_name": "Vertebrate Zoology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 913,
                                "requirement_name": "Group 2:",
                                "courses": [
                                    {
                                        "course_id": 152,
                                        "course_rubric": "BIOL",
                                        "course_number": "3313",
                                        "course_name": "Plant Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 161,
                                        "course_rubric": "BIOL",
                                        "course_number": "3113",
                                        "course_name": "Laboratory for Plant Anatomy",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 918,
                                "requirement_name": "Microbiology and Lab",
                                "courses": [
                                    {
                                        "course_id": 5,
                                        "course_rubric": "BIOL",
                                        "course_number": "2321",
                                        "course_name": "Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 61,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2321",
                                            "sjc_name": "Microbiology for Science Majors I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 3,
                                        "course_rubric": "BIOL",
                                        "course_number": "2121",
                                        "course_name": "Laboratory for Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 55,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2121",
                                            "sjc_name": "Microbiology for Science Majors (lab)"
                                        }
                                    }
                                ]
                            },
                            {
                                "requirement_id": 921,
                                "requirement_name": "Environmental Biology",
                                "courses": [
                                    {
                                        "course_id": 114,
                                        "course_rubric": "BIOL",
                                        "course_number": "3333",
                                        "course_name": "Environmental Biology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 924,
                                "requirement_name": "Field Biology",
                                "courses": [
                                    {
                                        "course_id": 381,
                                        "course_rubric": "BIOL",
                                        "course_number": "4323",
                                        "course_name": "Field Biology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 926,
                                "requirement_name": "Specialization Courses6-7 hours",
                                "courses": [
                                    {
                                        "course_id": 119,
                                        "course_rubric": "BIOL",
                                        "course_number": "3311",
                                        "course_name": "Marine Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 680,
                                        "course_rubric": "BIOL",
                                        "course_number": "4325",
                                        "course_name": "Environmental Toxicology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 189,
                                        "course_rubric": "BIOL",
                                        "course_number": "4313",
                                        "course_name": "Biology of Fishes",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 198,
                                        "course_rubric": "BIOL",
                                        "course_number": "4113",
                                        "course_name": "Laboratory for Biology of Fishes",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 362,
                                        "course_rubric": "BIOL",
                                        "course_number": "4334",
                                        "course_name": "Environmental Microbiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 744,
                                        "course_rubric": "BIOL",
                                        "course_number": "4349",
                                        "course_name": "Plant Development",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 932,
                                "requirement_name": "Specialization Elective Courses 9-10 hours",
                                "courses": [
                                    {
                                        "course_id": 401,
                                        "course_rubric": "BIOL",
                                        "course_number": "4327",
                                        "course_name": "Plant Identification",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 136,
                                        "course_rubric": "BIOL",
                                        "course_number": "3335",
                                        "course_name": "Epidemiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 124,
                                        "course_rubric": "BIOL",
                                        "course_number": "4305",
                                        "course_name": "Ecology of the Amazon",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 481,
                                        "course_rubric": "BIOL",
                                        "course_number": "4361",
                                        "course_name": "Immunology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 232,
                                        "course_rubric": "BIOL",
                                        "course_number": "4347",
                                        "course_name": "Cellular Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 465,
                                        "course_rubric": "BIOL",
                                        "course_number": "4253",
                                        "course_name": "Laboratory for Biotechnology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 476,
                                        "course_rubric": "BIOL",
                                        "course_number": "4391",
                                        "course_name": "Selected Topics in the Biological Sciences",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 420,
                                        "course_rubric": "BIOL",
                                        "course_number": "4189",
                                        "course_name": "Independent Study in Biology",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "component_id": 232,
                        "component_name": "Specialization in Plant Biology Requirements",
                        "requirements": [
                            {
                                "requirement_id": 941,
                                "requirement_name": "Specialization Requirements",
                                "courses": [
                                    {
                                        "course_id": 152,
                                        "course_rubric": "BIOL",
                                        "course_number": "3313",
                                        "course_name": "Plant Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 161,
                                        "course_rubric": "BIOL",
                                        "course_number": "3113",
                                        "course_name": "Laboratory for Plant Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 201,
                                        "course_rubric": "BIOL",
                                        "course_number": "4343",
                                        "course_name": "Plant Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 224,
                                        "course_rubric": "BIOL",
                                        "course_number": "4342",
                                        "course_name": "Biochemistry II",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 232,
                                        "course_rubric": "BIOL",
                                        "course_number": "4347",
                                        "course_name": "Cellular Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 744,
                                        "course_rubric": "BIOL",
                                        "course_number": "4349",
                                        "course_name": "Plant Development",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 946,
                                "requirement_name": "Specialization Courses3 hours",
                                "courses": [
                                    {
                                        "course_id": 256,
                                        "course_rubric": "BIOL",
                                        "course_number": "4351",
                                        "course_name": "Molecular Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 401,
                                        "course_rubric": "BIOL",
                                        "course_number": "4327",
                                        "course_name": "Plant Identification",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 114,
                                        "course_rubric": "BIOL",
                                        "course_number": "3333",
                                        "course_name": "Environmental Biology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 950,
                                "requirement_name": "Specialization Elective Courses 14 hours",
                                "courses": [
                                    {
                                        "course_id": 499,
                                        "course_rubric": "BIOL",
                                        "course_number": "4254",
                                        "course_name": "Laboratory for Eukaryotic Gene Expression",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 744,
                                        "course_rubric": "BIOL",
                                        "course_number": "4349",
                                        "course_name": "Plant Development",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 426,
                                        "course_rubric": "BIOL",
                                        "course_number": "4252",
                                        "course_name": "Molecular Biology Laboratory",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 124,
                                        "course_rubric": "BIOL",
                                        "course_number": "4305",
                                        "course_name": "Ecology of the Amazon",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 420,
                                        "course_rubric": "BIOL",
                                        "course_number": "4189",
                                        "course_name": "Independent Study in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 563,
                                        "course_rubric": "BIOL",
                                        "course_number": "4291",
                                        "course_name": "Laboratory Topics in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 346,
                                        "course_rubric": "BIOL",
                                        "course_number": "4315",
                                        "course_name": "Biology Practicum",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 476,
                                        "course_rubric": "BIOL",
                                        "course_number": "4391",
                                        "course_name": "Selected Topics in the Biological Sciences",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "component_id": 233,
                        "component_name": "Specialization in Forensic Biology Requirements",
                        "requirements": [
                            {
                                "requirement_id": 955,
                                "requirement_name": "Specialization Requirements",
                                "courses": [
                                    {
                                        "course_id": 5,
                                        "course_rubric": "BIOL",
                                        "course_number": "2321",
                                        "course_name": "Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 61,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2321",
                                            "sjc_name": "Microbiology for Science Majors I (lecture)"
                                        }
                                    },
                                    {
                                        "course_id": 3,
                                        "course_rubric": "BIOL",
                                        "course_number": "2121",
                                        "course_name": "Laboratory for Microbiology for Science Majors",
                                        "sjc_course": {
                                            "sjc_id": 55,
                                            "sjc_rubric": "BIOL",
                                            "sjc_number": "2121",
                                            "sjc_name": "Microbiology for Science Majors (lab)"
                                        }
                                    },
                                    {
                                        "course_id": 174,
                                        "course_rubric": "BIOL",
                                        "course_number": "3373",
                                        "course_name": "Human Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 181,
                                        "course_rubric": "BIOL",
                                        "course_number": "3173",
                                        "course_name": "Laboratory for Human Anatomy",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 224,
                                        "course_rubric": "BIOL",
                                        "course_number": "4342",
                                        "course_name": "Biochemistry II",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 512,
                                        "course_rubric": "BIOL",
                                        "course_number": "4335",
                                        "course_name": "Forensic Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 680,
                                        "course_rubric": "BIOL",
                                        "course_number": "4325",
                                        "course_name": "Environmental Toxicology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 316,
                                        "course_rubric": "CHEM",
                                        "course_number": "4363",
                                        "course_name": "Forensic Chemistry",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 165,
                                        "course_rubric": "CHEM",
                                        "course_number": "4373",
                                        "course_name": "Quantitative Chemical Analysis",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 545,
                                        "course_rubric": "CRIM",
                                        "course_number": "4330",
                                        "course_name": "Criminal Investigation",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 959,
                                "requirement_name": "Additional Specialization Requirements",
                                "courses": [
                                    {
                                        "course_id": 207,
                                        "course_rubric": "BIOL",
                                        "course_number": "4344",
                                        "course_name": "Comparative Animal Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 8,
                                        "course_rubric": "BIOL",
                                        "course_number": "4345",
                                        "course_name": "Human Physiology",
                                        "sjc_course": null
                                    }
                                ]
                            },
                            {
                                "requirement_id": 960,
                                "requirement_name": "Specialization Elective Courses 4 hours",
                                "courses": [
                                    {
                                        "course_id": 232,
                                        "course_rubric": "BIOL",
                                        "course_number": "4347",
                                        "course_name": "Cellular Physiology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 791,
                                        "course_rubric": "LEGL",
                                        "course_number": "4365",
                                        "course_name": "Mock Trial",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 139,
                                        "course_rubric": "CHEM",
                                        "course_number": "4367",
                                        "course_name": "Instrumental Analysis",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 698,
                                        "course_rubric": "CRIM",
                                        "course_number": "4334",
                                        "course_name": "Criminal Law",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 793,
                                        "course_rubric": "CRIM",
                                        "course_number": "5338",
                                        "course_name": "Criminal Law",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 420,
                                        "course_rubric": "BIOL",
                                        "course_number": "4189",
                                        "course_name": "Independent Study in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 563,
                                        "course_rubric": "BIOL",
                                        "course_number": "4291",
                                        "course_name": "Laboratory Topics in Biology",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 346,
                                        "course_rubric": "BIOL",
                                        "course_number": "4315",
                                        "course_name": "Biology Practicum",
                                        "sjc_course": null
                                    },
                                    {
                                        "course_id": 476,
                                        "course_rubric": "BIOL",
                                        "course_number": "4391",
                                        "course_name": "Selected Topics in the Biological Sciences",
                                        "sjc_course": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            showSJCCourses:false,
            selectedProgramId:"-1"
        }
        this.handleProgramSelection = this.handleProgramSelection.bind(this);
        this.toggleSJCCourses = this.toggleSJCCourses.bind(this);
    }

    handleProgramSelection(ev){
        this.setState({
            selectedProgramId:ev.target.value
        });
    }

    toggleSJCCourses(){
        this.setState({
            showSJCCourses:!this.state.showSJCCourses
        });
    }

    render(){
        return(
            <Card>
                <CardHeader>
                    <h4>Program Requirements: {this.props.university.university_name}</h4>
                </CardHeader>
                <CardBody>
                    <CardText>
                        Use this tool to identify applicable SJC courses for a particular major.
                    </CardText>
                    <div style={{textAlign:'center'}}>
                        <ProgramSelector 
                            programs={this.props.programs}
                            selectedProgramId={this.state.selectedProgramId}
                            handleSelection={this.handleProgramSelection} 
                        />
                        <SJCCourseFilter
                            showSJCCourses={this.state.showSJCCourses}
                            toggle={this.toggleSJCCourses}
                        />
                    </div>
                </CardBody>
                { this.state.selectedProgramId !== '-1' &&
                <SelectedRequirements 
                    program={this.state.selectedProgram}
                    showSJCCourses={this.state.showSJCCourses}
                />
                }
            </Card>
        )
    }

}

const ProgramSelector = (props) => (
    <div id="program-selector">
        <select 
            className="custom-select w-75" 
            onChange={props.handleSelection}
            value={props.selectedProgramId}
        >
            <option value="-1">Please select a program.</option>
            {props.programs.map((obj) =>
                (
                    <option value={obj.program_id} key={obj.program_id}>{obj.program_name}</option>
                )
            )}
        </select>
    </div>);

const SJCCourseFilter = (props) => (
    <div id="SJC-course-filter">
        <input 
            type="checkbox" 
            checked={props.showSJCCourses}
            onChange={props.toggle} 
        />
        &nbsp;Show SJC Courses
    </div>);

const SelectedRequirements = (props) => {
    var programName = props.program.program_name;
    var programLink = props.program.program_link;
    var components = props.program.components || [];
    var showSJCCourses = props.showSJCCourses;
    return (
        <div id="selected-requirements">
            <hr/>
            <Container className="selected-requirements">
                <h5><a href={programLink} style={{float:"left"}} target="_blank">{programName}</a></h5>
                <br/>
                {components.map((component,i) => (
                    <div className="degreeComponent" key={i}>
                        <h6 className="mb-1" key={i}><strong>{component.component_name}</strong></h6>
                        <ul className="requirementList">
                            {component.requirements.map((requirement,i) => (
                                <div className="degreeRequirement" key={'requirementList'+i}>
                                    <li className="requirementItem" key={'requirementItem'+i}>
                                        {requirement.requirement_name}
                                    </li>
                                    <ul className="courseList" key={'courseList'+i}>
                                        {requirement.courses.map((course,i) => {
                                            if((course.sjc_course !== null)&&(showSJCCourses)){
                                                return (
                                                    <li className="courseRequirement" key={'SJCcourseItem'+i} style={{color:"green"}}>
                                                        {course.sjc_course.sjc_rubric} {course.sjc_course.sjc_number} - {course.sjc_course.sjc_name}
                                                    </li>
                                                )
                                            } else{
                                                return (
                                                    <li className="courseRequirement" key={'courseItem'+i}>
                                                        {course.course_rubric} {course.course_number} - {course.course_name}
                                                    </li>
                                                )
                                            }
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
                </Container>
        </div>
    )

};






class EditorCard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editMode:false
        }
    }

    render(){
        var instructions = (this.state.editMode)?
            'Edit courses for degree components, below.':
            'View/edit saved maps, below, or create a new map!';
        return (
            <Card>
                <CardHeader>
                    <h4>Degree Map Editor</h4>
                </CardHeader>
                <CardBody>
                    <CardText>
                        {instructions}
                    </CardText>
                    <EditorView/>
                </CardBody>
            </Card>
        )
    }
}

class EditorView extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div id="editor-view"></div>
    }
}
