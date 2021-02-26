import React from 'react'
import './Shared.css'

const Checkbox = (props) => {
    return (
        <div className="text-left">
            <label className="check-container"><input type="checkbox" checked={props.selected} name="tnc" onChange={props.onChange}/>
                <span className="check-box"></span>
            </label>
            <span className="check-text">{props.text}</span>
        </div>
    )
}

export default Checkbox;