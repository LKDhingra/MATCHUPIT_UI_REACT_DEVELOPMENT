import React from 'react';
import {  S_YEAR, E_YEAR, MONTHS } from '../../../utils/constants';
import Radio from '../../shared/Radio';

class BoardExpBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            boardType: { value: this.props.boardType, err: '' },
            boardName: { value: this.props.boardName, err: '' },
            boardStartM: { value: this.props.boardStartM, err: '' },
            boardEndM: { value: this.props.boardEndM, err: '' },
            boardStartY: { value: this.props.boardStartY, err: '' },
            boardEndY: { value: this.props.boardEndY, err: '' },
            stillMember: { value: this.props.stillMember, err: '' },
            dateErr: false
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.boardName !== prevProps.boardName) {
            this.setState({
                boardType: { value: this.props.boardType, err: '' },
                boardName: { value: this.props.boardName, err: '' },
                boardStartM: { value: this.props.boardStartM, err: '' },
                boardEndM: { value: this.props.boardEndM, err: '' },
                boardStartY: { value: this.props.boardStartY, err: '' },
                boardEndY: { value: this.props.boardEndY, err: '' },
                stillMember: { value: this.props.stillMember, err: '' }
            })
        }
    }

    updateValue = (e) => {
        this.props.isEdited.call()
        e.target.classList.remove('error-input')
        e.target.closest('.accordion__item').classList.remove('err-in-acc')
        switch (e.target.name) {
            case "boardName": { this.setState({ boardName: { value: e.target.value, err: '' } }); break }
            case "boardStartM": this.setState({ boardStartM: { value: e.target.value, err: '' } },()=>this.validateStartEnd.call()); break
            case "boardEndM": this.setState({ boardEndM: { value: e.target.value, err: '' } },()=>this.validateStartEnd.call()); break
            case "boardStartY": this.setState({ boardStartY: { value: e.target.value, err: '' } },()=>this.validateStartEnd.call()); break
            case "boardEndY": this.setState({ boardEndY: { value: e.target.value, err: '' } },()=>this.validateStartEnd.call()); break
            case "boardType": this.setState({ boardType: { value: e.target.value, err: '' } }); break
            default: break
        }
    }
    validateStartEnd = () => {
        this.setState({ dateErr: false }, () => {
            if (this.state.boardEndY.value < this.state.boardStartY.value) {
                this.setState({ dateErr: true })
            } else if (this.state.boardEndY.value === this.state.boardStartY.value) {
                if (MONTHS.indexOf(this.state.boardEndM.value) < MONTHS.indexOf(this.state.boardStartM.value)) {
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
            <>
                <div className="row">
                    <div className="col-sm-3">
                        <span className="input-label">Board Name</span><span className='mandate'> *</span>
                        <input name='boardName' className="general-input" type="text" value={this.state.boardName.value} onChange={this.updateValue} />
                    </div>
                    <div className="col-sm-3">
                        <span className="input-label">Board Type</span><span className='mandate'> *</span>
                        <select className="general-input" name="boardType" value={this.state.boardType.value} onChange={this.updateValue}>
                            <option value="-1">Select Type</option>
                            <option value="Non Profit">Non Profit</option>
                            <option value="Advisory">Advisory</option>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <span className="input-label" style={{ marginTop: '45px' }}>Currently a member here?</span><span className='mandate'> *</span>
                        <span className="in-box-board" datavalue={this.state.stillMember ? this.state.stillMember.toString() : 'false'}>
                            <span onClick={() => this.setState({ stillMember: false }, () => this.setState({ boardEndM: { value: this.props.WEendM, err: '' }, boardEndY: { value: this.props.boardEndY, err: '' } }))}><Radio content="NO" name={`stillMember${this.props.unique}`} selected={this.state.stillMember === false} /></span>
                            <span onClick={() => this.setState({ stillMember: true }, () => this.setState({ boardEndM: { value: MONTHS[11], err: '' }, boardEndY: { value: years[years.length - 1], err: '' } }))}><Radio content="YES" name={`stillMember${this.props.unique}`} selected={this.state.stillMember} /></span>
                        </span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <span className="input-label">Start Month</span><span className='mandate'> *</span>
                                <select className="general-input" name="boardStartM" value={this.state.boardStartM.value} onChange={this.updateValue}>
                                    {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <span className="input-label">Start Year</span><span className='mandate'> *</span>
                                <select className="general-input" name="boardStartY" value={this.state.boardStartY.value} onChange={this.updateValue}>
                                    {years.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        {this.state.stillMember ?
                            <div className="row">
                                <div className="col-sm-12">
                                    <span className="input-label">End Date</span><span className='mandate'> *</span>
                                    <div style={{ marginTop: '6px' }}>Currently Member</div>
                                    <input name="boardEndM" style={{ display: 'none' }} type="text" defaultValue={"December"} />
                                    <input name="boardEndY" style={{ display: 'none' }} type="text" defaultValue={new Date().getFullYear()} />
                                </div>
                            </div> :
                            <div className="row">
                                <div className="col-sm-6">
                                    <span className="input-label">End Month</span><span className='mandate'> *</span>
                                    <select className="general-input" name="boardEndM" value={this.state.boardEndM.value || MONTHS[11]} onChange={this.updateValue}>
                                        {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <span className="input-label">End Year</span><span className='mandate'> *</span>
                                    <select className="general-input" name="boardEndY" value={this.state.boardEndY.value || years[years.length - 1]} onChange={this.updateValue}>
                                        {years.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {this.state.dateErr && <p className="block-error">*End Date Cannot be less than Start Date</p>}
                    </div>
                </div>
            </>
        )
    }
}

export default BoardExpBlock