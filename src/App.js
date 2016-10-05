import React from "react";
import {Miss, Match} from "react-router";

export default class App extends React.Component {

  componentDidMount() {
    console.log("Mounted App");
  }

  render() {
    return (
      <div>
        <Match pattern="/hello" render={() => <div>Hello!</div>}/>
        <Match pattern="/world" render={() => <div>World!</div>}/>
        <Miss render={() => <div>no such page :(</div>}/>
      </div>
    );
  }
}