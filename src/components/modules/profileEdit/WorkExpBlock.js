import React from 'react'
import Radio from '../../shared/Radio'
import { MONTHS, S_YEAR, E_YEAR } from '../../../utils/constants'
import ReactQuill from 'react-quill';

class WorkExpBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orgNames: { value: this.props.orgNames, err: '' },
            designations: { value: this.props.designations, err: '' },
            jobTitles: { value: this.props.jobTitles || '-1', err: '' },
            role: { value: this.props.role || '-1', err: '' },
            industry: { value: this.props.industry || '-1', err: '' },
            skillsP: { value: this.props.skillsP, err: '' },
            skillsO: { value: this.props.skillsO, err: '' },
            allSkills: this.props.dropdowns.skills||[],
            allSkillsOri: this.props.dropdowns.skills||[],
            allIndustries: this.props.dropdowns.industries||[],
            allFunctions: this.props.dropdowns.functions||[],
            selectedRoles: [],
            rnrs: { value: this.props.rnrs, err: '' },
            startM: { value: this.props.WEstartM, err: '' },
            endM: { value: this.props.WEendM, err: '' },
            startY: { value: this.props.WEstartY, err: '' },
            endY: { value: this.props.WEendY, err: '' },
            showSkillP: false,
            showSkillO: false,
            tillDate: this.props.WEendY==="Currently Working"||this.props.tillDate,
            dateErr: false,
            empType: {value: this.props.empType, err:''}
        }
    }
    componentDidMount() {
        this.setState({ selectedRoles: this.state.jobTitles.value.length ? this.state.allFunctions.find(i => i.name === this.state.jobTitles.value) ? this.state.allFunctions.find(i => i.name === this.state.jobTitles.value).roles : [] : [] })
    }
    componentDidUpdate(prevProps) {
        if (this.props.orgNames !== prevProps.orgNames) {
            this.setState({
                orgNames: { value: this.props.orgNames, err: '' },
                designations: { value: this.props.designations, err: '' },
                jobTitles: { value: this.props.jobTitles, err: '' },
                role: { value: this.props.role, err: '' },
                industry: { value: this.props.industry, err: '' },
                skillsP: { value: this.props.skillsP, err: '' },
                skillsO: { value: this.props.skillsO, err: '' },
                rnrs: { value: this.props.rnrs, err: '' },
                startM: { value: this.props.WEstartM, err: '' },
                endM: { value: this.props.WEendM, err: '' },
                startY: { value: this.props.WEstartY, err: '' },
                endY: { value: this.props.WEendY, err: '' },
                tillDate: this.props.tillDate,
                empType: {value: this.props.empType, err: '' }
            })
        }
    }
    updateValue = (e) => {
        this.props.isEdited.call()
        e.target.classList.remove('error-input')
        switch (e.target.name) {
            case "orgNames": {
                this.setState({ orgNames: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "designations": {
                this.setState({ designations: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "jobTitles": {
                this.setState({
                    jobTitles: { value: e.target.value, err: '' },
                    role: { value: '-1', err: '' },
                    showSkillP:false, showSkillO:false
                }, () => 
                this.setState({ selectedRoles: this.state.allFunctions.find(i => i.name === this.state.jobTitles.value) ? this.state.allFunctions.find(i => i.name === this.state.jobTitles.value).roles : [] }))
                e.target.closest('.accordion__item').classList.remove('err-in-acc'); break}
            case "role": {
                this.setState({ role: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc'); 
                break
            }
            case "industry": {
                this.setState({ industry: { value: e.target.value, err: '' }})
                e.target.closest('.accordion__item').classList.remove('err-in-acc')
                break
            }
            case "WEstartM": {
                this.setState({ startM: { value: e.target.value, err: '' }}, () => 
                this.validateStartEnd.call())
                break
            }
            case "WEendM": {this.setState({ endM: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break}
            case "WEstartY": {this.setState({ startY: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break}
            case "WEendY": {this.setState({ endY: { value: e.target.value, err: '' }}, () => this.validateStartEnd.call()); break}
            case "empType": {this.setState({ empType: { value: e.target.value, err: '' }}); break}
            default: break
        }
    }
    removeSkillsOnly=(list,e)=>{
        this.props.isEdited.call()
        let skill = e.target.getAttribute('dataval')
        e.stopPropagation();
        let stateValue = this.state.skillsP.value
        if(list==='p'){
            stateValue.splice(this.state.skillsP.value.indexOf(skill), 1)
            this.setState({ skillsP: { value: stateValue, err: '' }});
        }else{
            stateValue.splice(this.state.skillsO.value.indexOf(skill), 1)
            this.setState({ skillsO: { value: stateValue, err: '' }});
        }
    }
    addRemoveSkills = (e) => {
        this.props.isEdited.call()
        e.target.closest('.accordion__item').classList.remove('err-in-acc')
        e.target.parentElement.parentElement.parentElement.previousSibling.classList.remove('error-input')
        if (e.target.name === 'selectedSkillsP') {
            if (e.target.checked) {
                let stateValue = [...this.state.skillsP.value, e.target.value]
                this.setState({ skillsP: { value: stateValue, err: '' }});
            } else {
                let stateValue = this.state.skillsP.value
                stateValue.splice(this.state.skillsP.value.indexOf(e.target.value), 1)
                this.setState({ skillsP: { value: stateValue, err: '' }});
            }
        }
        if (e.target.name === 'selectedSkillsO') {
            if (e.target.checked) {
                let stateValue = [...this.state.skillsO.value, e.target.value]
                this.setState({ skillsO: { value: stateValue, err: '' }});
            } else {
                let stateValue = this.state.skillsO.value
                stateValue.splice(this.state.skillsO.value.indexOf(e.target.value), 1)
                this.setState({ skillsO: { value: stateValue, err: '' }});
            }
        }
    }
    showList = (type,e) => {
        if(e.target.getBoundingClientRect().top>345){
            document.getElementsByClassName('auto-scroller')[0].scrollTo(0, 500)
        }
        if (type === 'p') {
            if(this.state.jobTitles.value==='-1'){
                this.setState({ showSkillP: !this.state.showSkillP, showSkillO: false, allSkills: this.props.dropdowns.skills, allSkillsOri: this.props.dropdowns.skills })
            }else{
                let selectedFunc = this.state.jobTitles.value
                let skillsList = this.state.allFunctions.find(i=>i.name===selectedFunc).primarySkills
                this.setState({ showSkillP: !this.state.showSkillP, showSkillO: false, allSkills: skillsList, allSkillsOri: skillsList })
            }
                
        } else if (type === 'o') {
            this.setState({ showSkillO: !this.state.showSkillO, showSkillP: false, allSkills: this.props.dropdowns.skills, allSkillsOri: this.props.dropdowns.skills })
        }
    }
    closeList = () => {
        this.setState({ showSkillP: false, showSkillO: false, allSkills: this.props.dropdowns.skills, allSkillsOri: this.props.dropdowns.skills })
    }
    searchByFilter = (e) => {
        let filter = e.target.value.toUpperCase();
        const currList = this.state.allSkillsOri;
        this.setState({
            allSkills: currList.filter(item => item.toUpperCase().includes(filter))
        })
    }
    validateStartEnd = () => {
        this.setState({ dateErr: false }, () => {
            if (this.state.endY.value < this.state.startY.value) {
                this.setState({ dateErr: true })
            } else if (this.state.endY.value === this.state.startY.value) {
                if (MONTHS.indexOf(this.state.endM.value) < MONTHS.indexOf(this.state.startM.value)) {
                    this.setState({ dateErr: true })
                }
            }
        })
    }
    handleResponChange=(value)=>{
        this.setState({ rnrs: { value: value, err: '' }})
    }
    render() {
        let years = []
        for (let i = S_YEAR; i <= E_YEAR; i++) {
            years.push(i)
        }
        return (
            <>
                <div id="workexp" className="row">
                    <div className="col-xs-12">
                        <span className="input-label" style={{ marginTop: '10px' }}>Currently working here?</span><span className='mandate'> *</span>
                        <span className="in-box-work" datavalue={this.state.tillDate?this.state.tillDate.toString():'false'}>
                            <span onClick={() => this.setState({ tillDate: false }, ()=>this.setState({endM: { value: this.props.WEendM, err: '' }, endY: { value: this.props.WEendY, err: '' }}))}><Radio content="NO" name={`tillDate${this.props.unique}`} selected={this.state.tillDate === false} /></span>
                            <span onClick={() => this.setState({ tillDate: true }, ()=>this.setState({endM : { value: MONTHS[11], err: '' }, endY : { value: years[years.length-1], err: '' }}))}><Radio content="YES" name={`tillDate${this.props.unique}`} selected={this.state.tillDate} /></span>
                        </span>
                    </div>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-sm-4">
                                <span className="input-label">Company</span><span className='mandate'> *</span>
                                <input name="orgNames" className="general-input" type="text" value={this.state.orgNames.value} onChange={this.updateValue} />
                            </div>
                            <div className="col-sm-4">
                                <span className="input-label">Title</span><span className='mandate'> *</span>
                                <input name="designations" className="general-input" type="text" value={this.state.designations.value} onChange={this.updateValue} />
                            </div>
                            <div className="col-sm-4">
                                <span className="input-label">Employment Type</span>
                                <select name="empType" className="general-input" value={this.state.empType.value} onChange={this.updateValue}>
                                    <option value="-1">Select Type</option>
                                    <option value="ft">Full Time</option>
                                    <option value="pt">Part Time</option>
                                    <option value="ct">Contract</option>
                                    <option value="rt">Remote</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-3">
                                <span className="input-label">Start Month</span><span className='mandate'> *</span>
                                <select className="general-input" name="WEstartM" value={this.state.startM.value} onChange={this.updateValue}>
                                    {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="col-sm-3">
                                <span className="input-label">Start Year</span><span className='mandate'> *</span>
                                <select className="general-input" name="WEstartY" value={this.state.startY.value} onChange={this.updateValue}>
                                    {years.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            {this.state.tillDate ?
                                <div className="col-sm-6">
                                    <span className="input-label">End Date</span><span className='mandate'> *</span>
                                    <div style={{ marginTop: '6px' }}>Currently Working</div>
                                    <input name="WEendM" style={{ display: 'none' }} type="text" defaultValue={"December"} />
                                    <input name="WEendY" style={{ display: 'none' }} type="text" defaultValue={new Date().getFullYear()} />
                                </div>
                                :
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <span className="input-label">End Month</span><span className='mandate'> *</span>
                                            <select className="general-input" name="WEendM" value={this.state.endM.value || MONTHS[11]} onChange={this.updateValue}>
                                                {MONTHS.map((i) => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <span className="input-label">End Year</span><span className='mandate'> *</span>
                                            <select className="general-input" name="WEendY" value={this.state.endY.value || years[years.length - 1]} onChange={this.updateValue}>
                                                {years.map(i => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                {this.state.dateErr && <p className="block-error">*End Date Cannot be less than Start Date</p>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <span className="input-label">Description(Company &amp; Responsibilities)</span>
                                <ReactQuill name="rnrs" className='rnrs' onChange={this.handleResponChange} value={this.state.rnrs.value} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <span className="input-label">Industry</span><span className='mandate'> *</span>
                                <select name="industry" className="general-input" value={this.state.industry.value} onChange={this.updateValue}>
                                    <option value="-1">Select Industry</option>
                                    {this.state.allIndustries.map(i => (<option key={i} value={i}>{i}</option>))}
                                </select>
                            </div>
                            <div className="col-sm-4">
                                <span className="input-label">Functions</span><span className='mandate'> *</span>
                                <select name="jobTitles" className="general-input" value={this.state.jobTitles.value} onChange={this.updateValue}>
                                    <option value="-1">Select Function</option>
                                    {this.state.allFunctions.map(i => (<option key={i.name} value={i.name}>{i.name}</option>))}
                                </select>
                            </div>
                            <div className="col-sm-4">
                                <span className="input-label">Role</span><span className='mandate'> *</span>
                                <select name="role" className="general-input" value={this.state.role.value} onChange={this.updateValue}>
                                    <option value="-1">Select a Role</option>
                                    {this.state.selectedRoles.map(i => (<option key={i.name} value={i.name}>{i.name}</option>))}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <span className="input-label">Primary Skills Used</span><span className='mandate'> *</span>
                                <div style={{ position: "relative" }}>
                                    <div className="skills-holder skillsP general-input" name="skillsP" onClick={this.showList.bind(this, 'p')}>
                                        <ul>
                                            {this.state.skillsP.value.map(i => <li key={i}>{`${i} ,`}<span className="fa fa-times" dataval={i} onClick={this.removeSkillsOnly.bind(this,'p')}></span></li>)}
                                        </ul>
                                    </div>
                                    {this.state.showSkillP &&
                                        <span id="skillsPDrop">
                                            <input type='text' className='skill-search' onKeyUp={this.searchByFilter} autoFocus />
                                            <span className="list-close" onClick={this.closeList}>&times;</span>
                                            <ul className="all-skills-list">
                                                {this.state.allSkills.map(i => <li key={i}><input defaultChecked={this.state.skillsP.value.indexOf(i) > -1} name='selectedSkillsP' type='checkbox' onClick={this.addRemoveSkills} value={i} /> {i}</li>)}
                                            </ul>
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <span className="input-label">Other/Technical Skills Used</span>
                                <div style={{ position: "relative" }}>
                                    <div className="skills-holder skillsO general-input" name="skillsO" onClick={this.showList.bind(this, 'o')}>
                                        <ul>
                                            {this.state.skillsO.value.map(i => <li key={i}>{`${i} ,`}<span className="fa fa-times" dataval={i} onClick={this.removeSkillsOnly.bind(this,'o')}></span></li>)}
                                        </ul>
                                    </div>
                                    {this.state.showSkillO &&
                                        <span  id="skillsODrop">
                                            <input type='text' className='skill-search' onKeyUp={this.searchByFilter} autoFocus />
                                            <span className="list-close" onClick={this.closeList}>&times;</span>
                                            <ul className="all-skills-list">
                                                {this.state.allSkills.map(i => <li key={i}><input defaultChecked={this.state.skillsO.value.indexOf(i) > -1} name='selectedSkillsO' type='checkbox' onClick={this.addRemoveSkills} value={i} /> {i}</li>)}
                                            </ul>
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default WorkExpBlock
