import React from "react";
import getMapData from "../api";

const trimEmail = email => email.split("@")[0];

const uiMapping = [
  { key: "name", displayName: "Map Name", sortBy: true, filterBy: true },
  {
    key: "univ_name",
    displayName: "University Name",
    sortBy: true,
    filterBy: true
  },
  {
    key: "prog_name",
    displayName: "Transfer Program",
    sortBy: true,
    filterBy: true
  },
  {
    key: "assoc_name",
    displayName: "Associate's Degree",
    sortBy: true,
    filterBy: true
  },
  {
    key: "user_email",
    displayName: "Owner",
    sortBy: true,
    filterBy: true,
    formatFunc: trimEmail
  },
  {
    key: "total_credits",
    displayName: "Total Credits",
    sortBy: true,
    filterBy: false
  },
  {
    key: "applicable_credits",
    displayName: "Applicable Credits",
    sortBy: true,
    filterBy: false
  },
  {
    key: "applicability",
    displayName: "Applicability Rating",
    sortBy: true,
    filterBy: false
  }
];

const blankFilterState = {};
uiMapping.forEach(({ key, filterBy }) => {
  if (filterBy) blankFilterState[key] = [];
});

class MapsProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: [],
      filters: blankFilterState,
      loaded: false,
      sortKey: "name",
      invertSort: false
    };
  }

  componentDidMount() {
    getMapData().then(maps => this.setState({ maps, loaded: true }));
  }

  getFilterFunction = filters => {
    return map => {
      let filterResult = true;
      for (let attr in filters) {
        filters[attr].forEach(
          value => (filterResult = filterResult && map[attr] === value)
        );
      }
      return filterResult;
    };
  };

  getSortFunction = sortKey => {
    let result = this.state.invertSort ? -1 : 1;
    return (map1, map2) => {
      if (map1[sortKey] > map2[sortKey]) return result;
      else if (map1[sortKey] === map2[sortKey]) return 0;
      else return -1 * result;
    };
  };

  // API for passing through props

  setSortKey = newSortKey => {
    let { sortKey, invertSort } = this.state;
    if (newSortKey === sortKey) {
      invertSort = !invertSort;
    } else {
      invertSort = false;
    }
    this.setState({ sortKey: newSortKey, invertSort });
  };

  changeFilter = ev => {
    ev.preventDefault();
    console.log("Change filter!");
  };

  clearFilters = ev => {
    ev.preventDefault();
    console.log("Clear filter!");
  };

  selectAllFilters = ev => {
    ev.preventDefault();
    console.log("Select all filter!");
  };

  handlers = {
    setSortKey: this.setSortKey,
    changeFilter: this.changeFilter,
    clearFilters: this.clearFilters,
    selectAllFilters: this.selectAllFilters
  };

  render() {
    let { maps, filters, loaded, sortKey } = this.state;
    let filterFunction = this.getFilterFunction(filters);
    let sortFunction = this.getSortFunction(sortKey);
    let visibleMaps = maps.filter(filterFunction).sort(sortFunction);

    return (
      <div>
        {this.props.render({
          maps: visibleMaps,
          loaded,
          uiMapping,
          handlers: this.handlers,
          sortKey,
          filters: this.state.filters
        })}
      </div>
    );
  }
}

export default MapsProvider;
