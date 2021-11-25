import React from 'react'

/*
 * En ruta i brädet, används både av tetrominos och bakgrunden.
*/
class Square extends React.Component {
  render() {
    let squareStyle = {
      left: this.props.x * 27,
      top: this.props.y * 27,
      backgroundColor: this.props.color,
    };

    return (
      <div className={"Square " + this.props.className} style={squareStyle}></div>
    )
  }
}

export default Square