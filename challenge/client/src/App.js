import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import Home from './Home';

import Viewers from './Viewers';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/viewer" component={Viewers} />
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
