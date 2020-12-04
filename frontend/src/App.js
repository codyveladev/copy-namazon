import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';



import Login from './Components/pages/login'
import Home from './Components/pages/home'
import store from './Components/pages/store'

// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route exact path="/store" component={store}></Route>
          
        </Switch>
    </BrowserRouter>
  );
}

export default App;
