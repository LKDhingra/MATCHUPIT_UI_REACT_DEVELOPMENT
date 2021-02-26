import React from 'react';
import parse from 'html-react-parser';

export default class MoreToggle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            more: false,
            text: props.text,
            actual:false
        }
    }
    toggleAbout = () => {
        this.setState({ more: !this.state.more })
    }
    componentDidMount() {
        let h = document.getElementsByClassName('about-holder')[0].offsetHeight
        this.setState({
            more: h>51,
            actual: h>51,
        })
    }
    render() {
        return (
            <>
                <div className="about-holder" style={this.state.more ? { height: '40px' } : { height: 'auto' }}>{parse(this.state.text)}</div>
                {this.state.actual && <button onClick={this.toggleAbout} className="more-less">view {this.state.more ? 'more' : 'less'}..</button>}
            </>
        );
    }
}