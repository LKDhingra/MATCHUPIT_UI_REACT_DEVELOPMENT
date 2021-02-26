import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer id="mit-footer">
            <div className="mit-copyright">
                <div className="container">
                    <div className="mit-row d-flex align-items-center">                        
                        <div className="col-sm-12 col-md-2 col-lg-2 text-center">
                            <Link to="/" className="logo-default">
                              <img src={require("../../../images/icons/logo_white.png")} alt="logo" width="105" />
                            </Link>
                        </div>

                        <div className="col-sm-12 col-md-2 col-lg-2 text-center">
                            <p> © 2020 MatchupIT</p>
                        </div>
                        
                        <div className="col-sm-12 col-md-5 col-lg-5 text-center">
                            <ul className="mit-pipe-list mb-0">
                                <li className="mb-0"><Link to="/about-us">About Us</Link></li>
                                <li className="mb-0"><Link to="/terms-conditions">Terms & Conditions</Link></li>
                                <li className="mb-0"><Link to="/privacy-policy">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 text-center">
                            <ul className="mit-social mit-social-list mit-styled-social .clearfix mb-0">
                                <li className="mb-0">
                                    <a target="_blank" href="https://www.linkedin.com/company/matchupit/">
                                      <img src={require("../../../images/icons/in.png")} alt="linkedin" width="25" />
                                    </a>
                                </li>
                                <li className="mb-0">
                                    <a target="_blank" href="https://www.facebook.com/matchupIT/">
                                      <img src={require("../../../images/icons/fb.png")} alt="facebook" width="25" />
                                    </a>
                                </li>
                                <li className="mb-0">
                                    <a target="_blank" href="https://twitter.com/MatchupIT">
                                      <img src={require("../../../images/icons/tw.png")} alt="twitter" width="25" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer