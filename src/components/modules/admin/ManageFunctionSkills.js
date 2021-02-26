import React from 'react';
import './Admin.css'
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { postCall } from '../../../utils/api.config';
import { ADMIN_MANAGE_UPDATE } from '../../../utils/constants';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
    return state
};

class ManageFunctionSkills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            functionOptions: [
                {
                    name: '',
                    roles: [
                        {
                            name: '',
                            meanSalary: [
                                {
                                    region: 'Canada',
                                    currency: 'C$',
                                    value: ''
                                },
                                {
                                    region: 'UK',
                                    currency: 'Pounds',
                                    value: ''
                                },
                                {
                                    region: 'India',
                                    currency: 'INR',
                                    value: ''
                                },
                                {
                                    region: 'US',
                                    currency: 'USD',
                                    value: ''
                                },
                            ]
                        }
                    ],
                    primarySkills: []
                }
            ],
            defaultColDef: {
                type: 'String',
                resizable: true,
                sortable: true,
                filter: true,
                editable: true,
            },
            selectedRows: [],
            addRow: false
        }
    }

    updateFunctionName = (oldName, newName, data) =>{
        if(oldName!==''){
            if(newName!==''){
                var newFunctionOptions = [...this.state.functionOptions]
                var updatedIndex = newFunctionOptions.findIndex(i=>i.name===newName)
                var funcIndex = newFunctionOptions.findIndex(i=>i.name===oldName)
                if(updatedIndex===-1||updatedIndex===funcIndex){
                    newFunctionOptions[funcIndex].name = newName
                    this.setState({functionOptions: newFunctionOptions})
                }
                else{
                    this.setState({functionOptions: newFunctionOptions})
                    toast.error('Function already exists')
                }
            }
            else{
                toast.error('Input cannot be empty')
            }
        }
        else{
            if(this.state.addRow){
                if(data.function!==''&&data.primaryskill!==''){
                    this.updateRow(data)
                }
            }
        }
    }

    updateSkillName = (oldName, newName, data) =>{
        if(oldName!==''){
            if(newName!==''){
                if(data.function!==''){
                    var newFunctionOptions = [...this.state.functionOptions]
                    var funcIndex = newFunctionOptions.findIndex(i=>i.name===data.function)
                    var skillOptions = newFunctionOptions[funcIndex].primarySkills
                    var updatedSkillIndex = skillOptions.indexOf(newName)
                    var skillIndex = skillOptions.indexOf(oldName)
                    if(updatedSkillIndex===-1||updatedSkillIndex===skillIndex){
                        skillOptions[skillIndex] = newName
                        newFunctionOptions[funcIndex].primarySkills = skillOptions
                        this.setState({functionOptions: newFunctionOptions})
                    }
                    else{
                        this.setState({functionOptions: newFunctionOptions})
                        toast.error('Primary skill already exists')
                    }
                }
            }
            else{
                toast.error('Input cannot be empty')
            }
        }
        else{
            if(this.state.addRow){
                if(data.function!==''&&data.role!==''){
                    this.updateRow(data)
                }
            }
        }
    }

    updateRow = (data)=>{
        var newFunctionOptions = [...this.state.functionOptions]
        newFunctionOptions.splice(0, 1)
        var funcIndex = newFunctionOptions.findIndex(i=>i.name===data.function)
        if(funcIndex===-1){
            var newFunctionElement = {
                name: data.function,
                roles: [
                    {
                        name: '',
                        meanSalary: [
                            {
                                region: 'Canada',
                                currency: 'C$',
                                value: ''
                            },
                            {
                                region: 'UK',
                                currency: 'Pounds',
                                value: ''
                            },
                            {
                                region: 'India',
                                currency: 'INR',
                                value: ''
                            },
                            {
                                region: 'US',
                                currency: 'USD',
                                value: ''
                            }
                        ]
                    }
                ],
                primarySkills: [ data.primaryskill ]
            }
            newFunctionOptions = [newFunctionElement, ...newFunctionOptions]
            this.setState({functionOptions: newFunctionOptions, addRow: false})
        }
        else{
            var newSkillOptions = newFunctionOptions[funcIndex].primarySkills
            var skillIndex = newSkillOptions.indexOf(data.primaryskill)
            if(skillIndex===-1){
                newSkillOptions = [data.primaryskill, ...newSkillOptions]
                newFunctionOptions[funcIndex].primarySkills = newSkillOptions
                this.setState({functionOptions: newFunctionOptions, addRow: false})
            }
            else{
                this.setState({functionOptions: newFunctionOptions, addRow: false})
                toast.error('Role Already Exists in the Function')
            }
        }
    }

    deleteRow = () =>{
        var selectedRow = this.gridApi.getSelectedRows()
        var newFunctionOptions = [...this.state.functionOptions]
        if(selectedRow[0].function!==''&&selectedRow[0].primaryskill!==''){
            var delFunc = selectedRow[0].function
            var delSkill = selectedRow[0].primaryskill
            var funcIndex = newFunctionOptions.findIndex(i=>i.name===delFunc)
            var skillOptions = newFunctionOptions[funcIndex].primarySkills
            if(skillOptions.length!==1){
                var skillIndex = skillOptions.indexOf(delSkill)
                skillOptions.splice(skillIndex, 1)
                newFunctionOptions[funcIndex].primarySkills = skillOptions
                this.setState({functionOptions: newFunctionOptions, selectedRows:[]})
            }
            else{
                newFunctionOptions.splice(funcIndex, 1)
                this.setState({functionOptions: newFunctionOptions, selectedRows:[]})
            }
        }
        else {
            newFunctionOptions.splice(0, 1)
            this.setState({functionOptions: newFunctionOptions, selectedRows:[]})
        }
    }

    addRow = () =>{
        var funcElement = {
            name: '',
            roles: [
                {
                    name: '',
                    meanSalary: [
                        {
                            region: 'Canada',
                            currency: 'C$',
                            value: ''
                        },
                        {
                            region: 'UK',
                            currency: 'Pounds',
                            value: ''
                        },
                        {
                            region: 'India',
                            currency: 'INR',
                            value: ''
                        },
                        {
                            region: 'US',
                            currency: 'USD',
                            value: ''
                        }
                    ]
                }
            ],
            primarySkills: ['']
        }
        var newFunctionOptions = [funcElement, ...this.state.functionOptions]
        this.setState({functionOptions: newFunctionOptions, addRow: true})
    }

    onRowSelected = () => {
        this.setState({selectedRows: this.gridApi.getSelectedRows()})
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    };

    componentDidMount(){
        this.setState({functionOptions: this.props.functionOptions})
    }
    onSubmit = () => {
        let bodyFunctions = {
            schema: 'roles',
            payload: this.state.functionOptions
        }
        postCall(ADMIN_MANAGE_UPDATE, bodyFunctions, {sfn: this.successFunctionUpdate, efn: this.errorFunctionUpdate })
    }
    successFunctionUpdate = () =>{
        toast.success("Functions and Primary Skill are updated successfully.")
    }
    errorFunctionUpdate = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    render() {
        let rowData = [], columnDefs = []
        columnDefs = [
            { 
                headerName: 'Function', field: 'function', checkboxSelection: true, width: 300,
                onCellValueChanged: (params)=>{
                    this.updateFunctionName(params.oldValue, params.newValue, params.data)
                }
            },
            { 
                headerName: 'Primary Skills', field: 'primaryskill', width: 300,
                onCellValueChanged: (params)=>{
                    this.updateSkillName(params.oldValue, params.newValue, params.data)
                }
            }
        ]
        for(let i=0; i<this.state.functionOptions.length; i++){
            for(let j=0; j<this.state.functionOptions[i].primarySkills.length; j++){
                    rowData.push(
                        {
                            function: this.state.functionOptions[i].name,
                            primaryskill: this.state.functionOptions[i].primarySkills[j]
                        }
                    )
            }
        }
        return (
            <div className='row clear-fix'>
                <div  style={{display:"grid"}}>
                <h3 style={{margin:"15px"}}>Functions/Primary Skills List
                    <span>
                        <button className='btn-update btn-update-fr frs' onClick={this.onSubmit}>Save Changes</button>
                        <button className='btn-update btn-update-fr' onClick={this.addRow}>Add</button>
                        {this.state.selectedRows.length?<button  className='btn-update btn-update-fr' onClick={this.deleteRow}>Delete</button>:null}
                    </span>
                </h3>
                </div>
                <div className="ag-theme-alpine col-sm-12" style={{height: '430px', width: '100%' }}>
                    <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={this.state.defaultColDef}
                    stopEditingWhenGridLosesFocus = {true}
                    onRowSelected={this.onRowSelected}
                    animateRows
                    onGridReady={this.onGridReady}>
                    </AgGridReact>
                </div>
            </div>
            
        )
    }
}

const ManageFunctionSkill = connect(mapStateToProps)(ManageFunctionSkills);
export default ManageFunctionSkill;