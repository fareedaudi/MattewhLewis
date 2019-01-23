import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const MapTableHeader = ({ header, handlers, sortKey, filterValues }) => {
  let { setSortKey, clearFilters, changeFilters, selectAllFilters } = handlers;
  return (
    <th key={header.key}>
      <MapHeaderText {...{ sortKey, setSortKey, header }} /> &nbsp;
      {header.filterBy && (
        <MapFilterButton
          {...{
            filterValues,
            header,
            clearFilters,
            changeFilters,
            selectAllFilters
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

const MapFilterButton = ({
  filterValues,
  header,
  clearFilters,
  changeFilter,
  selectAllFilters
}) => {
  let style = {
    filterButton: {
      color: filterValues.length ? "green" : "black",
      fontSize: "10px",
      cursor: "pointer"
    },
    dropDownMenu: {
      height: "auto",
      overflowY: "scroll"
    }
  };

  let onClick = () => {
    console.log("Handler clicked!", filterValues);
  };

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        tag="span"
        className="fa fa-filter"
        style={style.filterButton}
      />
      <DropdownMenu style={style.dropDownMenu}>
        <DropdownItem disable>
          <a href="" onClick={clearFilters}>
            Clear All
          </a>
          &nbsp;|&nbsp;
          <a href="" onClick={selectAllFilters}>
            Select All
          </a>
        </DropdownItem>
        {[1, 2, 3, 4].map(i => (
          <DropdownItem disabled key={i}>
            <input type="checkbox" />
            &nbsp;Test
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default MapTableHeader;
