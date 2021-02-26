import React from 'react'
import './Shared.css'

const Toggle = (props) => {
    return (
        <span>
            <label className="switch">
                <input type="checkbox" name={props.name} defaultChecked={props.isChecked} onChange={props.onChange}/>
                <span className="slider round"></span>
            </label>
            <span className="switch-text">{props.isChecked?props.contentChecked:props.contentUnchecked}</span>
        </span>
    )
}

export default Toggle;