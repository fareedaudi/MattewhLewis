import axios from "axios";

export const URL_BASE = `${process.env.REACT_APP_DEPLOYMENT_URL ||
  "http://localhost"}/reports`;
export const API_URL = `${process.env.REACT_APP_DEPLOYMENT_URL ||
  "http://localhost"}/api`;

const getMapData = () => {
  return axios.get(`${API_URL}/all_maps`).then(response => response.data);
};

export default getMapData;
