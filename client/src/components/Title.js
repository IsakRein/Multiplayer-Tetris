import React from 'react'


/*
 * Returnerar programmets logga som h1.
*/

function Title() {
  const colors = [
    "#04EFF1",
    "#F09F00",
    "#EFF008",
    "#04EF01",
    "#A000F1",
    "#F00101",
    "#1A00F0",
  ]

  const generateLogo = (text) => {
    var chars = []
    for (var i = 0; i < text.length; i++) {
      const style = { color: colors[i] }
      chars.push(<span key={i} style={style}>{text[i]}</span>)
    }
    return chars;
  }

  return (
    <div className="logo">
      <h1>{generateLogo("TETRIS")} FIGHT</h1>
    </div>
  )
}

export default Title
