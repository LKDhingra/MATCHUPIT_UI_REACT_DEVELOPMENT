import React from 'react'
import { S_YEAR, E_YEAR, MONTHS } from '../../../utils/constants'

class EducationBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            degree: { value: this.props.degree, err: '' },
            institute: { value: this.props.institute, err: '' },
            special: { value: this.props.special, err: '' },
            eduStartM: { value: this.props.eduStartM, err: '' },
            eduStartY: { value: this.props.eduStartY, err: '' },
            eduEndM: { value: this.props.eduEndM, err: '' },
            eduEndY: { value: this.props.eduEndY, err: '' },
            activities: { value: this.props.activities, err: '' },
            societies: { value: this.props.societies, err: '' },
            dateErr: false
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.degree !== prevProps.degree) {
            this.setState({
                degree: { value: this.props.degree, err: '' },
                institute: { value: this.props.institute, err: '' },
                special: { value: this.props.special, err: '' },
                eduStartM: { value: this.props.eduStartM, err: '' },
                eduStartY: { value: this.props.eduStartY, err: '' },
                eduEndM: { value: this.props.eduEndM, err: '' },
                eduEndY: { value: this.props.eduEndY, err: '' },
                activities: { value: this.props.activities, err: '' },
                societies: { value: this.props.societies, err: '' }
            })
        }
    }
    updateValue = (e) => {
        this.props.isEdited.call()
        e.target.classList.remove('error-input')
        switch (e.target.name) {
            case "degree": {
                this.setState({ degree: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "institute": {
                this.setState({ institute: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "special": {
                this.setState({ special: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "eduStartM": this.setState({ eduStartM: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break
            case "eduEndM": this.setState({ eduEndM: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break
            case "eduStartY": this.setState({ eduStartY: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break
            case "eduEndY": this.setState({ eduEndY: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break
            case "activities": this.setState({ activities: { value: e.target.value, err: '' }}); break
            case "societies": this.setState({ societies: { value: e.target.value, err: '' }}); break
            default: break
        }
    }
    validateStartEnd = () => {
        this.setState({ dateErr: false }, () => {
            if (this.state.eduEndY.value < this.state.eduStartY.value) {
                this.setState({ dateErr: true })
            } else if (this.state.eduEndY.value === this.state.eduStartY.value) {
                if (MONTHS.indexOf(this.state.eduEndM.value) < MONTHS.indexOf(this.state.eduStartM.value)) {
                    this.setState({ dateErr: true })
                }
            }
        })
    }
    render() {
        let years = []
        for (let i = S_YEAR; i <= E_YEAR; i++) {
            years.push(i)
        }
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-sm-4">
                                <span className="input-label">School Name</span><span className='mandate'> *</span>
                                <input name="institute" className="general-input" type="text" value={this.state.institute.value} onChange={this.updateValue} />
                            </div>
                            <div className="col-sm-4">
                                <span className="input-label">Degree</span><span className='mandate'> *</span>
                                <input name="degree" className="general-input" type="text" value={this.state.degree.value} onChange={this.updateValue} />
                            </div>
                            <div className="col-sm-4">
                                <span className="input-label">Major</span><span className='mandate'> *</span>
                                <input name="special" className="general-input" type="text" value={this.state.special.value} onChange={this.updateValue} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <span className="input-label">Start Month</span><span className='mandate'> *</span>
                                        <select className="general-input" name="eduStartM" value={this.state.eduStartM.value} onChange={this.updateValue}>
                                            {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <span className="input-label">Start Year</span><span className='mandate'> *</span>
                                        <select className="general-input" name="eduStartY" value={this.state.eduStartY.value} onChange={this.updateValue}>
                                            {years.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <span className="input-label">End Month</span><span className='mandate'> *</span>
                                        <select className="general-input" name="eduEndM" value={this.state.eduEndM.value || MONTHS[11]} onChange={this.updateValue}>
                                            {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-sm-6">
                                        <span className="input-label">End Year</span><span className='mandate'> *</span>
                                        <select className="general-input" name="eduEndY" value={this.state.eduEndY.value || years[years.length - 1]} onChange={this.updateValue}>
                                            {years.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <span className="input-label">Activities &amp; Societies</span>
                                        <textarea name="activities" className="general-input" type="text" rows="5" value={this.state.activities.value} onChange={this.updateValue} />
                                    </div>
                                    <div className="col-sm-6">
                                        <span className="input-label">Accomplishments</span>
                                        <textarea name="societies" className="general-input" type="text" rows="5" value={this.state.societies.value} onChange={this.updateValue} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                {this.state.dateErr && <p className="block-error">*End Date Cannot be less than Start Date</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EducationBlock
