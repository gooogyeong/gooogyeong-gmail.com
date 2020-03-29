import React from "react";
import "../App.css";
//import TopBar from "./TopBar";
import { Router, Route, Link } from "react-router-dom";
import { createBrowserHistory as createHistory } from "history";
import HomePage from "./HomePage";
import TextEditor from "./TextEditor";
const history = createHistory();
function App() {
  return (
    <div className="App">
      <Router history={history}>
        {/* <TopBar /> */}
        <Route path="/" exact component={HomePage} />
      </Router>
    </div>
  );
}
export default App;

// import React, { Component } from "react";
// import ReactDOM from "react-dom";

// import ImageEditor from "./ImageEditor";
// import ImageEditor2 from "./ImageEditor2";

// class App extends Component {
//   render() {
//     return <ImageEditor />;
//   }
// }
// export default App;
