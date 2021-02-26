import React from 'react';
import "./HomePageStyle.css";
import Navbar from '../../shared/navbar/Navbar';
import Footer from '../../shared/footer/Footer';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      professionals: [
        {
          subtitle: "Enhance your value",
        },
        {
          subtitle: "Connect & share ideas",
        },
        {
          subtitle: "Let companies find you",
        },
      ],
      companies: [
        {
          subtitle: "Build your organization with genuine talent",
        },
        {
          subtitle: "Showcase your products & ideas",
        },
        {
          subtitle: "Find other companies of interest",
        },
      ],
    };
  }

  render() {
    return (
      <div className="clearfix">
        <Navbar />

        <section className="mit-section mit-py-100 bg-white">
          <div className="container">
            <div className="mit-row d-flex align-items-center">
              <div className="col-12 col-md-6 py-2">
                <h4 className="mit-title-h4 mb-1 mit-text-black font-weight-300">
                  Connecting
                </h4>
                <h4 className="mit-title-h4 font-weight-800">
                  IT Professionals & Companies
                </h4>
                <Link to="/signup">
                  <button className="btn mitbtn-outline-primary mt-4">
                    JOIN NOW
                  </button>
                </Link>
              </div>

              <div className="col-12 col-md-6 py-2">
                <div className="mit-pr-30">
                  <img
                    src={require("../../../images/banners/landing-page-1.png")}
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mit-section mit-py-100 bg-white">
          <div className="container">
            <div className="mit-row d-flex align-items-center">
              <div className="col-12 col-md-8 py-2">
                <div className="mit-pr-30">
                  <img
                    src={require("../../../images/banners/landing-page-2.png")}
                    alt="image"
                  />
                </div>
              </div>

              <div className="col-12 col-md-4 py-2">
                <h4 className="mit-title-h4 font-weight-800">Professionals</h4>
                <ul className="ml-4 list-disc">
                  {this.state.professionals.map((data) => {
                    return <li>{data.subtitle}</li>;
                  })}
                </ul>
                <Link to="/signup">
                  <button className="btn mitbtn-outline-primary mt-4">
                    CREATE YOUR PROFILE
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mit-section mit-py-100 bg-white">
          <div className="container">
            <div className="mit-row d-flex align-items-center">
              <div className="col-12 col-md-6 py-2">
                <h4 className="mit-title-h4 font-weight-800">Companies</h4>
                <ul className="ml-4 list-disc">
                  {this.state.companies.map((data) => {
                    return <li>{data.subtitle}</li>;
                  })}
                </ul>
                <Link to="/signup">
                  <button className="btn mitbtn-outline-primary mt-4">
                    BUILD YOUR NETWORK
                  </button>
                </Link>
              </div>

              <div className="col-12 col-md-6 py-2">
                <div className="mit-pr-30">
                  <img
                    src={require("../../../images/banners/landing-page-3.png")}
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mit-section mit-py-100 bg-white">
          <div className="container">
            <h4 className="mit-title-h4 text-center font-weight-800 pb-4">
              Subscriptions
            </h4>
            <div className="mit-row justify-content-md-center">
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-5">
                <div className="mit-pricing bg-dark-grey">
                  <div className="mit-pricing-heading">
                    <h4 className="mit-title-h4 font-weight-800">INDIVIDUAL</h4>
                  </div>

                  <div className="mit-pricing-body">
                    <ul className="mit-list-pricing mb-0 mit-text-primary">
                      <li>$ 6 / month</li>
                      <li>$ 60 / year</li>
                      <li className="mb-0 pb-0">
                        Includes 7 days <br /> free trial
                      </li>
                    </ul>
                    <Link to="/signup">
                      <button className="btn mitbtn-outline-primary btn-pricing">
                        SUBSCRIBE
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-5">
                <div className="mit-pricing bg-dark-grey">
                  <div className="mit-pricing-heading">
                    <h4 className="mit-title-h4 font-weight-800">CORPORATE</h4>
                  </div>

                  <div className="mit-pricing-body">
                    <ul className="mit-list-pricing mb-0 mit-text-primary">
                      <li>$ 195 / month</li>
                      <li>$ 2,000 / year</li>
                      <li className="mb-0 pb-0">
                        Includes 30 days <br /> free trial
                      </li>
                    </ul>
                    <Link to="/signup">
                      <button className="btn mitbtn-outline-primary btn-pricing">
                        SUBSCRIBE
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }
}

export default HomePage;
