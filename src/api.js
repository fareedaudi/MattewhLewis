import axios from "axios";

const getMapData = () => {
  return axios.get("/test.json").then(response => response.data);
};

export default getMapData;
