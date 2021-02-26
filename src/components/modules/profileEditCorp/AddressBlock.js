import React from 'react';

class AddressBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            countryO: { value: this.props.countryO, err: '' },
            stateO: { value: this.props.stateO, err: '' },
            cityO: { value: this.props.cityO, err: '' },
            zipcodeO: { value: this.props.zipcodeO, err: '' },
            addressO: { value: this.props.addressO, err: '' }
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.certiName !== prevProps.certiName) {
            this.setState({
                countryO: { value: this.props.countryO, err: '' },
                stateO: { value: this.props.stateO, err: '' },
                cityO: { value: this.props.cityO, err: '' },
                zipcodeO: { value: this.props.zipcodeO, err: '' },
                addressO: { value: this.props.addressO, err: '' }
            })
        }
    }
    updateValue = (e) => {
        this.props.isEdited.call()
        e.target.classList.remove('error-input')
        switch (e.target.name) {
            case "countryO": this.setState({ countryO: { value: e.target.value, err: '' } }); break
            case "stateO": this.setState({ stateO: { value: e.target.value, err: '' } }); break
            case "cityO": this.setState({ cityO: { value: e.target.value, err: '' } }); break
            case "zipcodeO": this.setState({ zipcodeO: { value: e.target.value, err: '' } }); break
            case "addressO": this.setState({ addressO: { value: e.target.value, err: '' } }); break
            default: break
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col-xs-11">
                    <div className="row">
                        <div className="col-sm-7">
                            <span className="input-label">Address Line</span>
                            <input name='addressO' className="general-input" type="text" value={this.state.addressO.value} onChange={this.updateValue} />
                        </div>
                        <div className="col-sm-5">
                            <span className="input-label">City/Region</span><span className='mandate'> *</span>
                            <input name='cityO' className="general-input" type="text" value={this.state.cityO.value} onChange={this.updateValue} />
                        </div>
                        <div className="col-sm-5">
                            <span className="input-label">State/Province</span><span className='mandate'> *</span>
                            <input name='stateO' className="general-input" type="text" value={this.state.stateO.value} onChange={this.updateValue} />
                        </div>
                        <div className="col-sm-5">
                            <span className="input-label">Country</span><span className='mandate'> *</span>
                            <input name='countryO' className="general-input" type="text" value={this.state.countryO.value} onChange={this.updateValue} />
                        </div>
                        <div className="col-sm-2">
                            <span className="input-label">Zip/Post Code</span><span className='mandate'> *</span>
                            <input maxLength={6} name='zipcodeO' className="general-input" type="text" value={this.state.zipcodeO.value} onChange={this.updateValue} />
                        </div>
                    </div>
                </div>
                <div className="col-xs-1">
                    <span className="input-label empty"> </span>
                    <span className="fa fa-trash-o" onClick={this.props.ifDeleted}></span>
                </div>
            </div>
        )
    }
}

export default AddressBlock