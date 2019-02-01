import React from "react";
import getMapData from "../api";

const trimEmail = email => email.split("@")[0];

const uiMapping = [
  {
    key: "name",
    displayName: "Map Name",
    sortBy: true,
    filterBy: false,
    mapLauncher: true
  },
  {
    key: "univ_name",
    displayName: "University Name",
    sortBy: true,
    filterBy: true,
    mapLauncher: false
  },
  {
    key: "prog_name",
    displayName: "Transfer Program",
    sortBy: true,
    filterBy: true,
    mapLauncher: false
  },
  {
    key: "assoc_name",
    displayName: "Associate's Degree",
    sortBy: true,
    filterBy: true,
    mapLauncher: false
  },
  {
    key: "user_email",
    displayName: "Owner",
    sortBy: true,
    filterBy: true,
    formatFunc: trimEmail,
    mapLauncher: false
  },
  {
    key: "applicability",
    displayName: "Applicability Rating",
    sortBy: true,
    filterBy: false
  }
];

const blankFilterState = {};
const filterValuesByKey = {};
uiMapping.forEach(({ key, filterBy }) => {
  if (filterBy) blankFilterState[key] = [];
  if (filterBy) filterValuesByKey[key] = [];
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
    getMapData()
      .then(maps => {
        this.setState({ maps });
        return maps;
      })
      .then(maps => this.setFilterValuesByKey(maps))
      .then(_ =>
        this.setState({
          filters: JSON.parse(JSON.stringify(filterValuesByKey))
        })
      )
      .then(_ => this.forceUpdate())
      .then(_ => this.setState({ loaded: true }));
  }

  setFilterValuesByKey = maps => {
    maps.reduce((filterValuesByKey, map) => {
      for (let key in filterValuesByKey) {
        if (filterValuesByKey[key].indexOf(map[key]) === -1) {
          filterValuesByKey[key].push(map[key]);
        }
      }
      return filterValuesByKey;
    }, filterValuesByKey);
  };

  getFilterFunction = filters => {
    return map => {
      let filterResult = true;
      for (let attr in filters) {
        filterResult = filterResult && filters[attr].indexOf(map[attr]) >= 0;
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

  changeFilters = ({ key, value, checked }) => {
    // If checked == true, need to remove from filters.
    // If checked == false, need to add to filters.
    //if (checked) this.setState({});
    let prevFilters = this.state.filters[key];
    if (checked) {
      let filterIndex = prevFilters.indexOf(value);
      prevFilters.splice(filterIndex, 1);
      this.setState({
        filters: { ...this.state.filters, [key]: prevFilters }
      });
    } else {
      this.setState({
        filters: { ...this.state.filters, [key]: prevFilters.concat(value) }
      });
    }
  };

  clearFilters = ({ key }) => {
    this.setState({ filters: { ...this.state.filters, [key]: [] } });
  };

  selectAllFilters = ({ key }) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [key]: Array.from(filterValuesByKey[key])
      }
    });
  };

  handlers = {
    setSortKey: this.setSortKey,
    changeFilters: this.changeFilters,
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
          filters: this.state.filters,
          filterValuesByKey
        })}
      </div>
    );
  }
}

export default MapsProvider;
