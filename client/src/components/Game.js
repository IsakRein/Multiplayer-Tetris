import React, { Fragment } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket"

import Tetromino from "./Tetromino"
import Square from "./Square"
import Title from "./Title";
import PopUp from "./PopUp"

/*
 * Renderar spelet och sköter logiken. Connectar till websocketen, skickar och tar emot meddelanden.
*/

class Game extends React.Component {
  constructor(props) {
    super(props);
    //this.client = new W3CWebSocket('ws://188.151.133.65:8000')
    this.client = new W3CWebSocket('ws://' + this.props.serverIp + ':' + this.props.serverPort);
    document.addEventListener('keydown', this.onKeyDown, false);

    this.emptyGrid = [];
    for (var i = 0; i < 20; i++) {
      var row = []
      for (var j = 0; j < 10; j++) {
        row[j] = "#ebebeb";
      }
      this.emptyGrid[i] = row;
    }
    this.emptyGridCopy = JSON.parse(JSON.stringify(this.emptyGrid));

    this.allowedMoves = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp",
      "Space"];

    this.state = {
      connected: false,

      id: 0,
      opponentId: null,

      username: this.props.username,
      opponentName: "",

      score: 0,
      opponentScore: 0,

      currentTetromino: null,
      opponentTetromino: null,

      oldTetrominos: [],
      opponentOldTetrominos: [],

      oldTetrominos2: this.emptyGrid,
      opponentOldTetrominos2: this.emptyGridCopy,

      loser: undefined,
    }

    this.props.setRedirect(false);
  }

  resetState() {
    this.setState({
      opponentId: null,

      username: this.props.username,
      opponentName: "",

      score: 0,
      opponentScore: 0,

      currentTetromino: null,
      opponentTetromino: null,

      oldTetrominos: [],
      opponentOldTetrominos: [],

      oldTetrominos2: this.emptyGrid,
      opponentOldTetrominos2: this.emptyGridCopy,
      loser: undefined,
    })
  }

  componentDidMount() {
    this.client.onopen = () => {
      this.setState({ connected: true })
    }

    this.client.onclose = () => {
      this.setState({ connected: false })
    }

    this.client.onmessage = (message) => {
      message = JSON.parse(message.data);

      this.handleMessage(message);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
    this.sendMessage("disconnect", "");
  }

  onKeyDown = function (event) {
    if (this.allowedMoves.includes(event.code)) {
      this.sendMessage("move", event.code);
    }
  }.bind(this)


  handleMessage(message) {
    switch (message.type) {
      case "connect":
        this.setState({
          id: message.value
        })
        this.sendMessage("username", this.state.username);
        break;
      case "disconnect":
        this.resetState()
        break;
      case "matched":
        this.setState({
          opponentId: message.value.id,
          opponentName: message.value.username
        })
        break;
      case "move":
        if (message.value.userId === this.state.id) {
          this.setState(prevState => ({
            currentTetromino: {
              ...prevState.currentTetromino,
              x: message.value.x,
              y: message.value.y
            }
          }))
        }
        else if (message.value.userId === this.state.opponentId) {
          this.setState(prevState => ({
            opponentTetromino: {
              ...prevState.opponentTetromino,
              x: message.value.x,
              y: message.value.y
            }
          }))
        }
        break;
      case "newTetromino":
        if (message.value.userId === this.state.id) {
          this.updateOldTetrominos(message);
        }
        else if (message.value.userId === this.state.opponentId) {
          this.updateOpponentOldTetrominos(message);
        }
        break;
      case "rotate":
        console.log(message.value.tetromino.pieces);
        if (message.value.userId === this.state.id) {
          this.setState(prevState => ({
            currentTetromino: {
              ...prevState.currentTetromino,
              pieces: message.value.tetromino.pieces,
            }
          }))
        }
        else if (message.value.userId === this.state.opponentId) {
          this.setState(prevState => ({
            opponentTetromino: {
              ...prevState.opponentTetromino,
              pieces: message.value.tetromino.pieces,
            }
          }))
        }
        break;
      case "updateBoard":
        if (message.value.userId === this.state.id) {
          this.setState({
            oldTetrominos2: message.value.oldBlockPositions,
          })
        }
        else if (message.value.userId === this.state.opponentId) {
          this.setState({
            opponentOldTetrominos2: message.value.oldBlockPositions,
          })
        }
        break;
      case "gameover":
        this.setState({ loser: message.value })
        break;
      case "score":
        if (message.value.userId === this.state.id) {
          this.setState({ score: message.value.score })
        }
        else if (message.value.userId === this.state.opponentId) {
          this.setState({ opponentScore: message.value.score })
        }
      default:
        console.log("Bad Request")
        break;
    }
  }

  sendMessage(type, value) {

    let message = {
      type: type,
      id: this.state.id,
      value: value
    }

    this.client.send(JSON.stringify(message));

    console.log(message);
  }

  updateOldTetrominos(message) {
    if (this.state.currentTetromino) {
      var newArray = JSON.parse(JSON.stringify(this.state.oldTetrominos2));
      var absoluteX = this.state.currentTetromino.x;
      var absoluteY = this.state.currentTetromino.y;
      for (var i = 0; i < this.state.currentTetromino.pieces.length; i++) {
        var x = this.state.currentTetromino.pieces[i][0] + absoluteX;
        var y = this.state.currentTetromino.pieces[i][1] + absoluteY;
        var safeCoordinate = this.ensureValidPositions(x, y);

        newArray[safeCoordinate[1]][safeCoordinate[0]] =
          this.state.currentTetromino.color;
      }
      this.setState({
        oldTetrominos2: newArray,
      })
    }
    this.setState({
      currentTetromino: message.value.tetromino,
    })
  }

  updateOpponentOldTetrominos(message) {
    if (this.state.opponentTetromino) {
      var newArray = JSON.parse(JSON.stringify(this.state.opponentOldTetrominos2));
      var absoluteX = this.state.opponentTetromino.x;
      var absoluteY = this.state.opponentTetromino.y;
      for (var i = 0; i < this.state.opponentTetromino.pieces.length; i++) {
        var x = this.state.opponentTetromino.pieces[i][0] + absoluteX;
        var y = this.state.opponentTetromino.pieces[i][1] + absoluteY;
        var safeCoordinate = this.ensureValidPositions(x, y);

        newArray[safeCoordinate[1]][safeCoordinate[0]] =
          this.state.opponentTetromino.color;
      }
      this.setState({
        opponentOldTetrominos2: newArray,
      })
    }

    this.setState({
      opponentTetromino: message.value.tetromino,
    })
  }

  ensureValidPositions(x, y) {
    var coordinate = [];
    var width = 10;
    var height = 20;
    if (x < 0) {
      x = 0;
    }
    else if (x >= width) {
      x = 9;
    }
    if (y < 0) {
      y = 0;
    }
    else if (y >= height) {
      y = 19;
    }
    coordinate.push(x);
    coordinate.push(y);
    return coordinate;
  }

  renderConnecting() {
    return (
      <div className="info-text">
        <h1>Can't connect to server...</h1>
        <h3>Try to refresh the page...</h3>
      </div>
    )
  }

  renderQueue() {
    return (
      <div className="info-text">
        <h1>Current id: {this.state.id}</h1>
        <h2>In queue...</h2>
      </div>
    )
  }

  renderGame() {
    const boardContainerStyle = {
      width: this.props.squareSize * this.props.columns + "px",
      height: this.props.squareSize * this.props.rows + "px"
    }

    const renderBoard = (map) => {
      let squares = [];

      for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 10; j++) {
          squares.push(<Square
            key={i + ";" + j}
            className={'square'}
            x={j}
            y={i}
            color={map[i][j]}
          />);
        }
      }
      return squares;
    }

    const renderPlayerBoard = () => {
      return (
        <div className="board">
          <h1>{this.state.username} (you)</h1>
          <div className="game-container">
            <div style={boardContainerStyle} className="square-container" >
              {renderBoard(this.state.oldTetrominos2, this.state.currentTetromino)}
              <Tetromino
                tetromino={this.state.currentTetromino}
              />
            </div>
          </div>
        </div>
      )
    }

    const renderInfoScreen = () => {
      return (<div className="infoscreen">
        <div className="board side info">
          <div className="score-container">
            <div className="name">{this.state.username}</div>
            <div className="score">{this.state.score}</div>
          </div>
          <div className="score-container">
            <div className="name">{this.state.opponentName}</div>
            <div className="score">{this.state.opponentScore}</div>
          </div>
        </div>

        <div className="board side opponent">
          <h1>{this.state.opponentName}</h1>
          <div className="game-container">
            <div style={boardContainerStyle} className="square-container" >
              {renderBoard(this.state.opponentOldTetrominos2)}
              <Tetromino
                tetromino={this.state.opponentTetromino}
              />
            </div>
          </div>
        </div>
      </div>)
    }

    return (
      <Fragment>
        <Title />
        <div className="game">
          {renderPlayerBoard()}
          {renderInfoScreen()}
        </div>
      </Fragment>
    );
  }

  renderPopUp() {
    return (
      <PopUp
        header={this.state.loser === this.state.id ? "You lost!" : "You won!"}
        subheader={
          this.state.loser === this.state.id ?
            this.state.opponentName + " won with " + this.state.opponentScore + " points." :
            "You won over " + this.state.opponentName + " with " + this.state.score + " points."
        }
        url="/"
        buttonText="Play Again"
        buttonFunction={() => { this.props.setRedirect(true) }}
      />
    )
  }

  render() {
    return (
      <Fragment>
        <div className="background"></div>
        <div className="content">
          {
            this.state.connected ?
              ((this.state.currentTetromino && this.state.opponentTetromino && this.state.opponentId) ?
                this.renderGame() :
                this.renderQueue()
              ) :
              this.renderConnecting()
          }
        </div>
        {this.state.loser && this.renderPopUp()}
      </Fragment>
    )
  }
}


export default Game