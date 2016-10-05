import React from "react";

export default class Home extends React.Component {

  componentDidMount() {
    console.log("Mounted App");
  }

  render() {
    return (
      <div>
        This is home
      </div>
    );
  }
}