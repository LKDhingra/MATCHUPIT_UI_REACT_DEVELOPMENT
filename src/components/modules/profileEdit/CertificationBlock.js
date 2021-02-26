import React from 'react';
import { postCall } from '../../../utils/api.config';
import { FILE_UPLOAD, S_YEAR, E_YEAR, MONTHS } from '../../../utils/constants';
import ChatLoader from '../../shared/ChatLoader';
import { toast } from 'react-toastify';

class CertificationBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            certiName: { value: this.props.certiName, err: '' },
            certiEndM: { value: this.props.certiEndM, err: '' },
            certiEndY: { value: this.props.certiEndY, err: '' },
            certiUpload: { value: this.props.certiUpload, err: '' },
            isInnerLoading: false,
            dateErr: false
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.certiName !== prevProps.certiName) {
            this.setState({
                certiName: { value: this.props.certiName, err: '' },
                certiEndM: { value: this.props.certiEndM, err: '' },
                certiEndY: { value: this.props.certiEndY, err: '' },
                certiUpload: { value: this.props.certiUpload, err: '' }
            })
        }
    }
    
    updateValue = (e) => {
        this.props.isEdited.call()
        e.target.classList.remove('error-input')
        switch (e.target.name) {
            case "certiName": {
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                this.setState({ certiName: { value: e.target.value, err: '' }})
                break
            }
            case "certiEndM": this.setState({ certiEndM: { value: e.target.value, err: '' }}); break
            case "certiEndY": this.setState({ certiEndY: { value: e.target.value, err: '' }}); break
            case "certiUpload": this.setState({ certiUpload: { value: e.target.value, err: '' }}); break
            default: break
        }
    }
    uploadCertificate = (input) => {
        if (input.target.files && input.target.files[0]) {
            const formData = new FormData()
            formData.append('file', input.target.files[0])
            this.setState({ isInnerLoading: true })
            postCall(FILE_UPLOAD, formData, { sfn: this.postCertCopyUpload, efn: this.uploadFailed }, 'attachment')
        }
    }
    uploadFailed = () => {
        this.setState({ isInnerLoading: false })
        toast.error('Failed to upload certificate')
    }
    postCertCopyUpload = (data) => {
        this.props.isEdited.call()
        this.setState({ isInnerLoading: false, certiUpload: { value: data.fileUrl, err: '' }});
        toast.success('Certificate successfully uploaded')
    }
    render() {
        let years = []
        for (let i = S_YEAR; i <= E_YEAR; i++) {
            years.push(i)
        }
        return (
            <>
                <div className="row">
                    <div className="col-sm-5">
                        <span className="input-label">Certification Name</span><span className='mandate'> *</span>
                        <input name='certiName' className="general-input" type="text" value={this.state.certiName.value} onChange={this.updateValue} />
                    </div>
                    <div className="col-sm-7">
                        <div className="row">
                            <div className="col-xs-9">
                                <span className="input-label">Upload Cerificate</span>
                                <input className="general-input" type="file" onChange={this.uploadCertificate} accept="application/pdf, image/*" />
                            </div>
                            <div className="col-xs-3 text-center">
                                <span className="input-label"></span><br />
                                {this.state.isInnerLoading ? <div style={{ position: 'absolute', top: 0, left: '-6px' }}><ChatLoader /></div> : this.state.certiUpload.value ? <a href={this.state.certiUpload.value} rel="noopener noreferrer" target="_blank"><span style={{ marginTop: '22px' }} className="fa fa-file-pdf-o"></span></a> : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="row">
                            <div className="col-sm-6">
                                <span className="input-label">Month</span>
                                <select className="general-input" name="certiEndM" value={this.state.certiEndM.value} onChange={this.updateValue}>
                                    <option value={'Skip'}>{' '}</option>
                                    {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <span className="input-label">Year</span>
                                <select className="general-input" name="certiEndY" value={this.state.certiEndY.value} onChange={this.updateValue}>
                                    <option value={'Skip'}>{' '}</option>
                                    {years.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                        </div>
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

export default CertificationBlock