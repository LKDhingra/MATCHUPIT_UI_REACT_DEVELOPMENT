import React from 'react'
import './Shared.css'

const Radio = (props) => {
    return (
        <label className="input-container">{props.content}<input id={props.id} type="radio" name={props.name} value={props.value} defaultChecked={props.selected} onChange={props.onChange}/>
            <span className="checkmark"></span>
        </label>
    )
}

export default Radio;