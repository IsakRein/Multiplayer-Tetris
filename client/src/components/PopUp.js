import React from "react"
import "./PopUp.css"

/*
 * Renderar bakgrunden, har propsen: header, subheader och buttontext.
*/
function PopUp(props) {
  return (
    <div className="popup-container">
      <div className="popup-background">
        <h1>{props.header}</h1>
        <p>{props.subheader}</p>
        <a href="/play"><button className="active">{props.buttonText}</button></a>
      </div>
    </div>
  )
}

export default PopUp