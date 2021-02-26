import React from 'react'
import './Shared.css'

const Loader = () => {
    return (
        <div id='Loader'>
            <div className="loader-holder">
                <img src={require('../../images/icons/loader.gif')} alt="" />
            </div>
        </div>
    )
}

export default Loader;