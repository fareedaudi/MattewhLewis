import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const MapTableHeader = ({
  header,
  handlers,
  sortKey,
  filteredValues,
  allFilterValues,
  testProp
}) => {
  let { setSortKey, clearFilters, changeFilters, selectAllFilters } = handlers;
  return (
    <th key={header.key}>
      <MapHeaderText {...{ sortKey, setSortKey, header }} /> &nbsp;
      {header.filterBy && (
        <MapFilterButton
          {...{
            filteredValues,
            header,
            clearFilters,
            changeFilters,
            selectAllFilters,
            allFilterValues
          }}
        />
      )}
    </th>
  );
};

const MapHeaderText = ({ sortKey, setSortKey, header }) => {
  let style = {
    color: sortKey === header.key ? "green" : "black",
    cursor: header.sortBy ? "pointer" : "text"
  };

  let onClick = () => {
    if (header.sortBy) {
      setSortKey(header.key);
    }
  };
  return (
    <span style={style} onClick={onClick}>
      {header.displayName}
    </span>
  );
};

export default MapTableHeader;

class MapFilterButton extends React.Component {
  style = {
    filterButton: {
      fontSize: "14px",
      cursor: "pointer"
    },
    dropDownMenu: {
      height: "auto",
      overflowY: "scroll"
    }
  };

  onChange = ({ key, value, checked }) => {
    this.props.changeFilters({ key, value, checked });
  };

  onClearFilters = ({ ev, key }) => {
    ev.preventDefault();
    this.props.clearFilters({ key });
  };

  onSelectAll = ({ ev, key }) => {
    ev.preventDefault();
    this.props.selectAllFilters({ key });
  };

  render() {
    let {
      filteredValues,
      header,
      clearFilters,
      changeFilters,
      selectAllFilters,
      allFilterValues
    } = this.props;
    let filterActivated = allFilterValues.length !== filteredValues.length;
    allFilterValues = Array.from(allFilterValues).sort();
    let filterState = this.props.allFilterValues.reduce((state, value) => {
      state[value] = this.props.filteredValues.indexOf(value) >= 0;
      return state;
    }, {});
    return (
      <UncontrolledDropdown style={{ display: "inline" }}>
        <DropdownToggle
          tag="span"
          className="fa fa-filter"
          style={{
            ...this.style.filterButton,
            color: filterActivated ? "green" : "black"
          }}
        />
        <DropdownMenu style={this.style.dropDownMenu}>
          <li className="dropdown-item">
            <a
              href="#"
              onClick={ev => this.onClearFilters({ ev, key: header.key })}
            >
              Clear All
            </a>
            &nbsp;|&nbsp;
            <a
              href="#"
              onClick={ev => this.onSelectAll({ ev, key: header.key })}
            >
              Select All
            </a>
          </li>
          {allFilterValues.map((value, i) => (
            <li
              style={{ cursor: "pointer" }}
              class="dropdown-item"
              key={value + i}
              onClick={_ =>
                this.onChange({
                  key: this.props.header.key,
                  value,
                  checked: filterState[value]
                })
              }
            >
              <input
                enabled
                type="checkbox"
                value={value}
                checked={filterState[value]}
              />
              &nbsp;{value}
            </li>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}
