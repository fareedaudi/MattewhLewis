import React from "react";
import axios from "axios";

export default class LoginContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: "",
      userEmail: "",
      token: null
    };
  }

  loadLoginData(token) {}
}
