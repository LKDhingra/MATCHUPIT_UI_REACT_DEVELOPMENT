import React from 'react'
import './Shared.css'

const ChatLoader = () => {
    return (
        <div id='ChatLoader' className="text-center">
            <div className="chatLoader">
                <img src={require('../../images/icons/loader.gif')} className="fit-layout" alt="" />
            </div>
        </div>
    )
}

export default ChatLoader;