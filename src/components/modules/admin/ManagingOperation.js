import React from 'react';
import './Admin.css'
import { connect } from 'react-redux';
import { getCall, postCall } from '../../../utils/api.config';
import { INDUSTRY, ADMIN_MANAGE_UPDATE } from '../../../utils/constants';
import { toast } from 'react-toastify';
import 'react-responsive-modal/styles.css';
import ManageFunctionsRoles from './ManageFunctionsRoles';
import Loader from '../../shared/Loader';
import ManageFunctionsSkill from './ManageFunctionSkills'

const mapStateToProps = state => {
    return state
};

class ConnectedManagingOperation extends React.Component {
    constructor() {
        super();
        this.state = {
            industryOptions : [],
            skillOptions : [],
            functionOptions: [],
            fieldEdit:'IndustrySkills',
            initialIndustry:'',
            updatedIndustry: '',
            addIndustry: false,
            newIndustry: '',
            initialSkill:'',
            updatedSkill: '',
            addSkill: false,
            newSkill: '',
            deleteIconIndustry: false,
            deleteIconSkill: false,
            isLoading: true
        }
    }
    deleteIndustry = (industry) => {
        var delItem = industry.i
        var newOptions = [...this.state.industryOptions]
        var index = newOptions.indexOf(delItem)
        if(index!==-1){
            newOptions.splice(index, 1)
            this.setState({industryOptions: newOptions, deleteIconIndustry: false})
        }
    }
    onFocusIndustry = e => {
        this.setState({initialIndustry: e.target.getAttribute('name'), deleteIconIndustry: true, updatedIndustry: e.target.value})
    }
    handleChangeIndustry = e => {
        this.setState({updatedIndustry: e.target.value})
    }
    onBlurIndustry = () => {
        var { initialIndustry, updatedIndustry } = this.state
        if(updatedIndustry!==''){
            var newOptions = [...this.state.industryOptions]
            var updatedIndex = newOptions.indexOf(updatedIndustry)
            var initIndex = newOptions.indexOf(initialIndustry)
            if(updatedIndex===-1||updatedIndex===initIndex){
                newOptions[initIndex] = updatedIndustry
                this.setState({industryOptions: newOptions, deleteIconIndustry: false, updatedIndustry: ''})
            }
            else{
                toast.error('Industry Already Exists')
                this.setState({industryOptions: newOptions, deleteIconIndustry: false, updatedIndustry: initialIndustry})
            }
        }
        else{
            toast.error('Input cannot be Empty')
            this.setState({deleteIconIndustry: false})
        }
    }
    handleChangeAdd = (e) =>{
        var { name, value } = e.target
        this.setState({[name]: value})
    }
    onBlurAddIndustry = (e) => {
        var newElement = e.target.value
        if(newElement!==''){
            var index = this.state.industryOptions.indexOf(newElement)
            if(index===-1){
                this.setState({industryOptions : [newElement, ...this.state.industryOptions], addIndustry: false, newIndustry:''})
            }
            else{
                toast.error('Industry already exists')
                this.setState({newIndustry:''})
            }
        }
        else{
            toast.error('Input cannot be empty')
        }
    }
    deleteSkill = (skill) => {
        var delItem = skill.i
        var newOptions = [...this.state.skillOptions]
        var index = newOptions.indexOf(delItem)
        if(index!==-1){
            newOptions.splice(index, 1)
            this.setState({skillOptions: newOptions, deleteIconSkill: false})
        }
    }
    onFocusSkill = e => {
        this.setState({initialSkill: e.target.getAttribute('name'), deleteIconSkill: true, updatedSkill: e.target.value})
    }
    handleChangeSkill = e => {
        this.setState({updatedSkill: e.target.value})
    }
    onBlurSkill = () => {
        var { initialSkill, updatedSkill } = this.state
        if(updatedSkill!==''){
            var newOptions = [...this.state.skillOptions]
            var updatedindex = newOptions.indexOf(updatedSkill)
            var initIndex = newOptions.indexOf(initialSkill)
            if(updatedindex===-1||updatedindex===initIndex){
                newOptions[initIndex] = updatedSkill
                this.setState({skillOptions: newOptions, deleteIconSkill: false})
            }
            else{
                toast.error('Skill Already Exists')
                this.setState({skillOptions: newOptions, deleteIconSkill: false})
            }
        }
        else{
            this.setState({updatedSkill: initialSkill, deleteIconSkill: false})
        }
    }
    onBlurAddSkill = (e) => {
        var newElement = e.target.value
        if(newElement!==''){
            var skillOptions = [...this.state.skillOptions]
            for(let i=0; i<skillOptions.length; i++){
                skillOptions[i]= skillOptions[i].trim()
            }
            var index = skillOptions.indexOf(newElement)
            if(index===-1){
                this.setState({skillOptions : [newElement, ...this.state.skillOptions], addSkill: false, newSkill:''})
            }
            else{
                toast.error('Skill already exists')
                this.setState({newSkill:''})
            }
        }
        else{
            toast.error('Input cannot be empty')
        }
    }
    onSubmit = () => {
        let bodyIndustries = {
            schema: 'industries',
            payload: this.state.industryOptions
        }
        let bodySkills = {
            schema: 'skills',
            payload: this.state.skillOptions
        }
        postCall(ADMIN_MANAGE_UPDATE, bodyIndustries, { sfn: this.successIndustryUpdate, efn: this.errorUpdate })
        postCall(ADMIN_MANAGE_UPDATE, bodySkills, { sfn: this.successSkillsUpdate, efn: this.errorUpdate })
    }
    componentDidMount(){
        getCall(INDUSTRY, {}, { sfn: this.successIndustry, efn: this.errorIndustry })
    }
    successIndustry = (data) =>{
        this.setState({industryOptions: data.response.industries, skillOptions: data.response.skills,functionOptions: data.response.functions, isLoading: false})
    }
    successIndustryUpdate = () => {
        toast.success("Industries updated successfully.")
    }
    successSkillsUpdate = () => {
        toast.success("Skills updated successfully.")
    }
    errorIndustry = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    errorUpdate = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    render() {
        return (
            <div id="ManagingOperation">
                {this.state.isLoading&&<Loader/>}
                <ul className='nav nav-tabs nonMobile'>
                    <li className='active text-center'>
                        <a data-toggle="tab" onClick={()=>this.setState({fieldEdit: 'IndustrySkills'})}>Industry/Skills</a>
                    </li>
                    <li className='text-center'>
                        <a data-toggle="tab" onClick={()=>this.setState({fieldEdit: 'FunctionRole'})}>Functions/Roles</a>
                    </li>
                    <li className='text-center'>
                        <a data-toggle="tab" onClick={()=>this.setState({fieldEdit: 'FunctionSkills'})}>Functions/Primary Skills</a>
                    </li>
                </ul>
                <div className="dropdown mobileOnly text-right">
                    <button className="dropdown-toggle hamburger-menu" type="button" data-toggle="dropdown">
                    <span className="fa fa-bars"></span></button>
                    <div className="dropdown-menu">
                        <a data-toggle="tab"  onClick={()=>this.setState({fieldEdit: 'IndustrySkills'})}>Industry/Skills</a>
                        <hr/>
                        <a data-toggle="tab" onClick={()=>this.setState({fieldEdit: 'FunctionRole'})}>Functions/Roles</a>
                        <hr/>
                        <a data-toggle="tab" onClick={()=>this.setState({fieldEdit: 'FunctionSkills'})}>Functions/Primary Skills</a>
                    </div>
                </div>
                {this.state.fieldEdit==='IndustrySkills'&&
                <div>
                    <div className='row clearfix'>
                        <div className='col-sm-4'>
                            <div className='matchup-secs matchup-secs-update'>
                                <h3>Industries List</h3>
                                <div className='table-overflow'>
                                    <button className='btn-update' onClick={()=>this.setState({addIndustry: true})}><span className='fa fa-plus'></span></button>
                                    <table className='table table-bordered'>
                                        <tbody>
                                            {this.state.addIndustry&&
                                            <tr>
                                                <td>
                                                    <input className='general-input-noborder' value={this.state.newIndustry} name='newIndustry' autoFocus onBlur={this.onBlurAddIndustry} onChange={this.handleChangeAdd}/>
                                                    <button className='btn-add-delete' onClick={()=>this.setState({addIndustry:false})}><span className='fa fa-trash-o'></span></button>
                                                </td>
                                            </tr>
                                            }
                                            {this.state.industryOptions.map((i, index)=>
                                            <tr key={index} className='inputfocus'>
                                                <td>
                                                    <input className='general-input-noborder' defaultValue={i} name={i} onFocus={this.onFocusIndustry} onBlur={this.onBlurIndustry} onChange={this.handleChangeIndustry}/>
                                                    <button className='btn-delete' onClick={()=>this.deleteIndustry({i})}><span className='fa fa-trash-o'></span></button>
                                                </td>
                                            </tr> 
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-4'>
                            <div className='matchup-secs matchup-secs-update'>
                                <h3>Skills List</h3>
                                <div className='table-overflow'>
                                    <button className='btn-update' onClick={()=>this.setState({addSkill: true})}><span className='fa fa-plus'></span></button>
                                    <table className='table table-bordered'>
                                        <tbody>
                                            {this.state.addSkill&&
                                            <tr>
                                                <td>
                                                    <input className='general-input-noborder' value={this.state.newSkill} name='newSkill' autoFocus onBlur={this.onBlurAddSkill} onChange={this.handleChangeAdd}/>
                                                    <button className='btn-add-delete' onClick={()=>this.setState({addSkill:false})}><span className='fa fa-trash-o'></span></button>
                                                </td>
                                            </tr>
                                            }
                                            {this.state.skillOptions.map((i, index)=>
                                            <tr key={index}>
                                                <td className='inputfocus'>
                                                    <input className='general-input-noborder' defaultValue={i} name={i} onFocus={this.onFocusSkill} onBlur={this.onBlurSkill} onChange={this.handleChangeSkill}/>                                                    
                                                    <button className='btn-delete' onClick={()=>this.deleteSkill({i})}><span className='fa fa-trash-o'></span></button>
                                                </td>
                                            </tr> 
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div style={{position:'relative'}}>
                            <button className='btn-update-submit' onClick={this.onSubmit}>Save Changes</button>
                        </div>
                    </div>
                </div>
                }
                {this.state.fieldEdit==='FunctionRole'&&
                    <div>
                        <div className='row clearfix'>
                            <div className='col-sm-12'>
                                <div className='matchup-secs matchup-secs-update'>
                                    <ManageFunctionsRoles functionOptions={this.state.functionOptions}/>
                                </div>
                            </div>
                    </div>
                </div>
                }
                {this.state.fieldEdit==='FunctionSkills'&&
                    <div>
                        <div className='row clearfix'>
                            <div className='col-sm-12'>
                                <div className='matchup-secs matchup-secs-update'>
                                    <ManageFunctionsSkill functionOptions={this.state.functionOptions}/>
                                </div>
                            </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

const ManagingOperation = connect(mapStateToProps)(ConnectedManagingOperation);
export default ManagingOperation;