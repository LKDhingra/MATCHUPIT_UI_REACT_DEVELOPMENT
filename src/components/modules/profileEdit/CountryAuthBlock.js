import React from 'react'
import DatepickerComponent from '../../shared/DatepickerComponent'

class CountryAuthBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countryName: { value: this.props.countryName, err: '' },
            authType: { value: this.props.authType, err: '' },
            sponsor: { value: this.props.sponsor, err: '' },
            expiry: { value: this.props.expiry, err: '' }
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.countryName !== prevProps.countryName) {
            this.setState({
                countryName: { value: this.props.countryName, err: '' },
                authType: { value: this.props.authType, err: '' },
                sponsor: { value: this.props.sponsor, err: '' },
                expiry: { value: this.props.expiry, err: '' }
            })
        }
    }
    updateValue = (e) => {
        this.props.isEdited.call()
        e.target.classList.remove('error-input')
        switch (e.target.name) {
            case "countryName": {
                this.setState({countryName: { value: e.target.value, err: '' }});
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "authType": {
                this.setState({authType: { value: e.target.value, err: ''} });
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "sponsor": {
                this.setState({sponsor: { value: e.target.value, err: ''} });
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "authExp":{ 
                this.setState({ expiry: { value: e.target.value, err: ''} });
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            default: break
        }
    }
    render() {
        return (
            <div className="country-auth-row row">
                <div className="col-sm-3">
                    <span className="input-label">Country Name</span><span className='mandate'> *</span>
                    <input name='countryName' className="general-input" type="text" value={this.state.countryName.value} onChange={this.updateValue} />
                </div>
                <div className="col-sm-3">
                    <span className="input-label">Authorization Type</span><span className='mandate'> *</span>
                    <input name='authType' className="general-input" type="text" value={this.state.authType.value} onChange={this.updateValue} />
                </div>
                <div className="col-sm-3">
                    <span className="input-label">Sponsored By</span>
                    <input name='sponsor' className="general-input" type="text" value={this.state.sponsor.value} onChange={this.updateValue} />
                </div>
                <div className="col-sm-3">
                    <span className="input-label">Expiration Date</span><span className='mandate'> *</span>
                    <DatepickerComponent date={this.state.expiry.value} name="authExp"/>
                </div>
            </div>
        )
    }
}

export default CountryAuthBlock