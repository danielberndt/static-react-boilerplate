import React from "react";
import {Miss, Match, Link} from "react-router";
import routeList from "routes!./pages/Home";

export default class App extends React.Component {

  componentDidMount() {
    console.log("routeList", routeList);
  }

  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/about/">About</Link>
        {routeList.map(({path, comp}) => (
          <Match pattern={path} exactly component={comp}/>
        ))}
        <Miss render={() => <div>no such page :(</div>}/>
      </div>
    );
  }
}