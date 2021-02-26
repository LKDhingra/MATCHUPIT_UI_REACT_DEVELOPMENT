import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header id="mit-header-global" className="fixed-top py-3">
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">                     
                    <div className="mit-header-left">                        
                        <Link to="/" className="logo-default">
                            <img src={require('../../../images/icons/logo.png')} alt="logo" width="150" />
                        </Link>                         
                        <Link to="/"  className="logo-alt">
                            <img src={require('../../../images/icons/logo.png')} alt="logo" width="150" />
                        </Link>                        
                    </div>

                    <div class="mit-header-right d-flex">
                        <Link to="/signin">
                            <button className="btn mitbtn-signin-btn shadow-none">
                                SIGN IN
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn mitbtn-outline-primary shadow-none ml-3">
                                SIGN UP
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar;