const TetrominoColors = {
    I: "#04EFF1",
    J: "#1A00F0",
    L: "#F09F00",
    O: "#f0b208",
    S: "#04EF01",
    T: "#A000F1",
    Z: "#F00101"
}

class Tetromino {
    constructor(color, pieces) {
        this.color = color;
        this.pieces = pieces;
        id++;
        this.id = id;
    }

    rotate() {
        if (this.color !== TetrominoColors.O) {
            for (var i = 0; i < this.pieces.length; i++) {
                const x = this.pieces[i][0];
                const y = this.pieces[i][1];

                this.pieces[i][0] = -y;
                this.pieces[i][1] = x;
            }
        }
    }
}

id = 0;

const Tetrominos = new Map();

Tetrominos[TetrominoColors.I] = {
    color: TetrominoColors.I,
    pieces: [
        [0, -1],
        [0, 0],
        [0, 1],
        [0, 2]
    ]
}
Tetrominos[TetrominoColors.J] = {
    color: TetrominoColors.J,
    pieces: [
        [-1, 1],
        [-1, 0],
        [0, 0],
        [1, 0]
    ]
}
Tetrominos[TetrominoColors.L] = {
    color: TetrominoColors.L,
    pieces: [
        [1, 1],
        [1, 0],
        [0, 0],
        [-1, 0]
    ]
}
Tetrominos[TetrominoColors.O] = {
    color: TetrominoColors.O,
    pieces: [
        [-1, 1],
        [-1, 0],
        [0, 1],
        [0, 0]
    ]
}
Tetrominos[TetrominoColors.S] = {
    color: TetrominoColors.S,
    pieces: [
        [0, 1],
        [1, 1],
        [-1, 0],
        [0, 0]
    ]
}
Tetrominos[TetrominoColors.T] = {
    color: TetrominoColors.T,
    pieces: [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, 0]
    ]
}
Tetrominos[TetrominoColors.T] = {
    color: TetrominoColors.T,
    pieces: [
        [-1, 1],
        [0, 1],
        [0, 0],
        [1, 0]
    ]
}

function getTetromino(key) {
    const tetromino = Tetrominos[key];
    const tetrominoObj = new Tetromino(tetromino.color, tetromino.pieces);
    return tetrominoObj;
}

function getRandomTetromino() {
    var keys = Object.keys(Tetrominos);

    var random_index = keys.length * Math.random() << 0
    return getTetromino(keys[random_index]);
}

exports.getTetromino = getTetromino;
exports.getRandomTetromino = getRandomTetromino;
