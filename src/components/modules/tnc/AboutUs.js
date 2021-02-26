import React from 'react';
import './tnc.css';
import Navbar from '../../shared/navbar/Navbar';
import Footer from '../../shared/footer/Footer';

class AboutUs extends React.Component {
    render() {
        return (
            <div id="AboutUs">
                <Navbar />
                <div className="container" style={{ marginTop: '70px' }}>
                    <h1>About Matchup IT</h1>
                    <p>Welcome to matchup IT, the platform for connecting global IT Professionals with companies </p>
                    <br/>
                    <h1>Vision</h1>
                    <p>To become the go to social portal for every IT professional, where they can connect to people within the communities of their liking, increase their productivity and search for companies where they can potentially work.</p>
                    <p>To become the portal for companies to share their information, outline the use of technology in their business and search for IT talent for their technology needs.</p>
                    <br/>
                    <h1>Mission</h1>
                    <p>Matchup IT is a framework to directly connect IT professionals to companies.</p>
                    <br/>
                    <h1>How it all started?</h1>
                    <p>Matchup IT started in the basement of  its founder <strong>Lalit Dhingra</strong> who discussed the need for such platform with two of his colleagues who co- invested in building this platform. Matchup was launched on 15th August 2020.</p>
                </div>
                <Footer/>
            </div>
        )
    }

}

export default AboutUs