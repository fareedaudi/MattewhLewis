import React from 'react';
import PropTypes from 'prop-types';

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


ProgramSelector.propTypes = {
    programs:PropTypes.array.isRequired,
    selectedProgramId:PropTypes.string.isRequired,
    handleSelection:PropTypes.func.isRequired
}

export default ProgramSelector;