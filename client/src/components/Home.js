import React, { Fragment } from 'react'
import "./Home.css"
import Title from "./Title"

/*
 * Renderar hemmenyn, där användaren kan välja namn. Username-statet lagras i app.js.
*/

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: props.username };
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.setUserName(this.state.username);
  }

  changeHandler = (event) => {
    this.setState({ username: event.target.value });
  }

  render() {
    return (
      <Fragment>
        <div className="background"></div>
        <div className="content">
          <Title />
          <div className="main-screen">
            <div className="main-screen-content">
              <form onSubmit={this.submitHandler}>
                <input
                  type='text'
                  placeholder="Enter your name:"
                  value={this.state.username}
                  onChange={this.changeHandler}
                />
              </form>
              <button
                className={this.state.username === "" ? "" : "active"}
                onClick={this.state.username === "" ? undefined : this.submitHandler}>
                Start Game
            </button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Home