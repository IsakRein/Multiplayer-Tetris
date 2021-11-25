const Tetromino = require("./Tetromino")

class Board {
  constructor(game, userId, width, height, delay) {
    this.game = game;
    this.userId = userId;
    this.width = width;
    this.numBlackRows = 0;
    this.timesInAddRow = 0;
    this.timesInNewTetronimo = 0;
    this.rowsToAdd = 0;

    this.height = height;
    this.oldBlockPositions = [];
    for (var i = 0; i < this.height; i++) {
      var row = []
      for (var j = 0; j < this.width; j++) {
        row[j] = "#ebebeb";
      }
      this.oldBlockPositions[i] = row;
    }
    this.delay = delay;

    this.movements = {
      "ArrowLeft": [-1, 0],
      "ArrowRight": [1, 0],
      "ArrowUp": [0, 0],
      "ArrowDown": [0, 1]
    };

    this.score = 0;

    this.scores = {
      0: 0,
      1: 4,
      2: 10,
      3: 30,
      4: 120,
    }

    this.gameactive = true;

    this.newTetromino();
    this.resetUpdate();
  }

  handleMessage(message) {
    if (message.type == "move") {
      if (this.gameactive) {
        if (message.value == "ArrowUp") {
          this.rotate();
        }
        else if (message.value == "Space") {
          this.spacePress();
        }
        else {
          var delta = this.movements[message.value];
          this.move(delta);
          this.sendPosition()
        }
      }
    }
    else if (message.type == "addRow") {
      this.rowsToAdd++;
    }
  }

  rotate() {
    this.tetromino.rotate();

    if (!this.checkCollision([0, 0])) {
      const value = {
        tetromino: this.tetromino,
        userId: this.userId
      };

      this.game.sendMessage("rotate", value);
    }
    else {
      for (var i = 0; i < 3; i++) {
        this.tetromino.rotate();
      }
    }
  }

  update() {
    if (this.gameactive) {
      const deltaMovement = [0, 1]
      this.move(deltaMovement);
      this.sendPosition();
    }
  }

  resetUpdate() {
    clearInterval(this.updateFunction);
    if (this.gameactive) {
      this.updateFunction = setInterval(() => { this.update() }, this.delay)
    }
  }

  setScore(lines) {
    if (lines > 0) {
      this.score += this.scores[lines];
      const message = {
        score: this.score,
        userId: this.userId
      };
      this.game.sendMessage("score", message);
      this.game.speedUp();
    }
  }

  move(deltaMovement) {
    const collision = this.checkCollision(deltaMovement);
    const movingDown = deltaMovement[1] > 0;

    // To prevent double move dowm
    if (movingDown) { this.resetUpdate(); }

    if (collision && movingDown) {
      this.newTetromino();
    }
    else if (!collision) {
      this.x += deltaMovement[0];
      this.y += deltaMovement[1];
    }
  }

  spacePress() {
    while (!this.checkCollision([0, 1])) {
      this.y += 1;
    }
    this.sendPosition();
    this.newTetromino();
  }

  sendPosition() {
    const message = {
      x: this.x,
      y: this.y,
      userId: this.userId
    };

    this.game.sendMessage("move", message);
  }

  newTetromino() {
    if (this.tetromino) {
      for (var i = 0; i < this.tetromino.pieces.length; i++) {
        let x = this.tetromino.pieces[i][0] + this.x;
        let y = this.tetromino.pieces[i][1] + this.y;
        this.oldBlockPositions[y][x] = this.tetromino.color;
      }
    }

    this.tetromino = Tetromino.getRandomTetromino();

    this.x = 4;
    this.y = -4;

    var collision = true;
    while (collision) {
      this.y += 1;
      collision = false;
      for (var i = 0; i < this.tetromino.pieces.length; i++) {
        let y = this.tetromino.pieces[i][1] + this.y;
        if (y < 0) {
          collision = true;
        }
      }
    }

    this.tetromino.x = this.x;
    this.tetromino.y = this.y;

    if (this.checkCollision([0, 0])) {
      this.game.sendMessage("gameover", this.userId);
      this.game.gameOver();

      console.log("gameover");
    }
    else {
      const value = {
        tetromino: this.tetromino,
        userId: this.userId
      };

      this.game.sendMessage("newTetromino", value);
      this.fullRows();

      //this.sendPosition();
      this.game.updateEntireBoard("updateBoard", this.userId, this.oldBlockPositions);
    }
    this.areThereRowsToAdd();
  }

  checkCollision(deltaMovement) {
    var collision = false;
    for (var i = 0; i < this.tetromino.pieces.length; i++) {
      let x = this.tetromino.pieces[i][0] + this.x + deltaMovement[0];
      let y = this.tetromino.pieces[i][1] + this.y + deltaMovement[1];

      if (
        x < 0 ||
        x >= this.width ||
        y < 0 ||
        y >= this.height
      ) {
        collision = true;
        return collision;
      }

      if (this.oldBlockPositions[y][x] != "#ebebeb") {
        return true;
      }
    }
    return collision;
  }

  fullRows() {
    var removedRows = 0;
    for (var i = 0; i < this.height; i++) {
      var counter = 0;
      for (var j = 0; j < this.width; j++) {
        if (this.oldBlockPositions[i][j] != "#ebebeb" &&
          this.oldBlockPositions[i][j] != "#000000") {
          counter++;
        }
      }
      if (counter == this.width) {
        if (this.numBlackRows > 0) {
          this.removeFullRow(i, false);
          this.removeFullRow(this.height - 1, false);
          this.numBlackRows--;
        }
        else {
          this.removeFullRow(i, true);
        }
        removedRows += 1;
      }
    }
    this.setScore(removedRows);
  }

  removeFullRow(y, sendLine) {
    for (var i = y; i >= 0; i--) {
      for (var j = 0; j < this.width; j++) {
        if (i == y) {
          this.oldBlockPositions[i][j] = "#ebebeb";
        }
        else {
          this.oldBlockPositions[i + 1][j] = this.oldBlockPositions[i][j];
        }
      }
    }
    this.game.updateEntireBoard("updateBoard", this.userId, this.oldBlockPositions);
    if (sendLine == true) {

      this.game.sendMessageToOtherBoard(this.userId, "addRow");
    }
  }

  areThereRowsToAdd(){
    while (this.rowsToAdd > 0){
      this.addRow();
      this.rowsToAdd--;
    }
  }

  addRow() {
    this.numBlackRows++;
    var copiedOldPositions = JSON.parse(JSON.stringify(this.oldBlockPositions));
    for (var i = this.height - 1; i > 0; i--) {
      for (var j = 0; j < this.height; j++) {
        if (i == this.height - 1) {
          this.oldBlockPositions[i][j] = "#000000";
        }
        else {
          this.oldBlockPositions[i][j] = copiedOldPositions[i + 1][j];
        }
      }
    }

    this.game.updateEntireBoard("updateBoard", this.userId, this.oldBlockPositions);
  }

}

module.exports = Board;