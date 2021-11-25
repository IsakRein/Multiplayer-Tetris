import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import WebFont from 'webfontloader';

// sidor
import Home from "./components/Home"
import Game from "./components/Game"

/*
 * Parent-komponent till hela programmet, sköter vilka components som ska instantieras.
*/
class App extends React.Component {
  constructor(props) {
    super(props);

    WebFont.load({
      google: {
        families: [
          'Montserrat: 400,700,900',
        ]
      }
    });

    this.state = {
      username: "",
      redirect: null
    }

    this.setUserName = this.setUserName.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
  }

  setUserName(username) {
    this.setState({
      username: username,
      redirect: true
    })
  }

  setRedirect(value) {
    this.setState({
      redirect: value
    })
  }

  render() {
    return (
      <BrowserRouter className>
        <Switch>
          <Route push exact path='/'>
            {
              this.state.redirect
                ? <Redirect push to={"/play"} />
                : <Home username = {this.state.username} setUserName={this.setUserName} />
            }
          </Route>
          <Route exact path='/play'>
            {
              this.state.username === ""
                ? (<Redirect to="/" />)
                : (<Game
                  serverIp={this.props.serverIp}
                  serverPort={this.props.serverPort}
                  username={this.state.username}
                  setRedirect={this.setRedirect}
                  squareSize={27}
                  rows={20}
                  columns={10}
                />)
            }
          </Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
