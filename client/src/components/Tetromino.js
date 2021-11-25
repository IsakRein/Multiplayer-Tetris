import React from "react";
import Square from "./Square"

/*
 * Tetromino-komponent, renderar en instans av tetromino-klassen från servern.
*/
function Tetromino(props) {
  const tetromino = props.tetromino;  
  
  const tetrominoStyle = {
    left: props.tetromino.x * 27,
    top: props.tetromino.y * 27
  }
 
  let squares = [];
  for (let i = 0; i < props.tetromino.pieces.length; i++) {
    let x = props.tetromino.pieces[i][0];
    let y = props.tetromino.pieces[i][1];

    squares.push(<Square
      key={x + ";" + y}
      className={"square"}
      x={x}
      y={y}
      color={tetromino.color}
    />);
  }
  return (
    <div className={"tetromino " + props.className} style={tetrominoStyle}>
      {squares}
    </div>
  );
}

export default Tetromino;