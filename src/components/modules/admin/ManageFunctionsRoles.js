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

class ManageFunctionRoles extends React.Component {
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
            if(data.role!==''){
                var newFunctionOptions = [...this.state.functionOptions]
                var updatedIndex = newFunctionOptions.findIndex(i=>i.name===newName)
                if(updatedIndex===-1){
                    var funcIndex = newFunctionOptions.findIndex(i=>i.name===oldName)
                    newFunctionOptions[funcIndex].name = newName
                    this.setState({functionOptions: newFunctionOptions})
                }
                else{
                    this.setState({functionOptions: newFunctionOptions})
                }
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

    updateRoleName = (oldName, newName, data, rowIndex) =>{
        if(oldName!==''){
            if(newName!==''){
                if(data.function!==''){
                    var newFunctionOptions = [...this.state.functionOptions]
                    var funcIndex = newFunctionOptions.findIndex(i=>i.name===data.function)
                    var roleOptions = newFunctionOptions[funcIndex].roles
                    var updatedRoleIndex = roleOptions.findIndex(i=>i.name===newName)
                    if(updatedRoleIndex===-1){
                        var roleIndex = roleOptions.findIndex(i=>i.name===oldName)
                        roleOptions[roleIndex].name = newName
                        newFunctionOptions[funcIndex].roles = roleOptions
                        this.setState({functionOptions: newFunctionOptions})
                    }
                    else{
                        this.setState({functionOptions: newFunctionOptions})
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
        this.gridApi.ensureIndexVisible(rowIndex, "middle")
    }

    updateMeanSalary = ( newMeanSalary, headerName, data, rowIndex) =>{
        if(data.function!==''&&data.role!==''){
            switch(headerName){
                case('Canada (C$)'): {this.updateMeanSalaryNow(newMeanSalary, 'Canada', data, rowIndex); break}
                case('UK (Pounds)'): {this.updateMeanSalaryNow(newMeanSalary, 'UK', data, rowIndex); break}
                case('India (INR)'): {this.updateMeanSalaryNow(newMeanSalary, 'India', data, rowIndex); break}
                case('US (USD)'): {this.updateMeanSalaryNow(newMeanSalary, 'US', data, rowIndex); break};
                default:break;
            }
        }
    }

    updateMeanSalaryNow = (newMeanSalary, headerName, data, rowIndex) =>{
        var newFunctionOptions = [...this.state.functionOptions]
        var funcIndex = newFunctionOptions.findIndex(i=>i.name===data.function)
        var roleOptions = newFunctionOptions[funcIndex].roles
        var roleIndex = roleOptions.findIndex(i=>i.name===data.role)
        if(roleIndex!==-1){
            var meanSalaryOptions = roleOptions[roleIndex].meanSalary
            var index = meanSalaryOptions.findIndex(i=>i.region===headerName)
            meanSalaryOptions[index].value = newMeanSalary
            roleOptions[roleIndex].meanSalary = meanSalaryOptions
            newFunctionOptions[funcIndex].roles = roleOptions
            this.setState({functionOptions: newFunctionOptions})
        }
        else{
            var newRoleElement = {
                name: data.role,
                meanSalary: [
                    {
                        region: 'Canada',
                        currency: 'C$',
                        value: data.Canada
                    },
                    {
                        region: 'UK',
                        currency: 'Pounds',
                        value: data.UK
                    },
                    {
                        region: 'India',
                        currency: 'INR',
                        value: data.India
                    },
                    {
                        region: 'US',
                        currency: 'USD',
                        value: data.US
                    }
                ]
            }
            roleOptions = [newRoleElement, ...roleOptions]
            newFunctionOptions[funcIndex].roles = roleOptions
            this.setState({functionOptions: newFunctionOptions})
        }
        this.gridApi.ensureIndexVisible(rowIndex, "middle")
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
                        name: data.role,
                        meanSalary: [
                            {
                                region: 'Canada',
                                currency: 'C$',
                                value: data.Canada
                            },
                            {
                                region: 'UK',
                                currency: 'Pounds',
                                value: data.UK
                            },
                            {
                                region: 'India',
                                currency: 'INR',
                                value: data.India
                            },
                            {
                                region: 'US',
                                currency: 'USD',
                                value: data.US
                            }
                        ]
                    }
                ],
                primarySkills: ['']
            }
            newFunctionOptions = [newFunctionElement, ...newFunctionOptions]
            this.setState({functionOptions: newFunctionOptions, addRow: false})
        }
        else{
            var newRoleOptions = newFunctionOptions[funcIndex].roles
            var roleIndex = newRoleOptions.findIndex(i=>i.name===data.role)
            if(roleIndex===-1){
                var newRoleElement = {
                    name: data.role,
                    meanSalary: [
                        {
                            region: 'Canada',
                            currency: 'C$',
                            value: data.Canada
                        },
                        {
                            region: 'UK',
                            currency: 'Pounds',
                            value: data.UK
                        },
                        {
                            region: 'India',
                            currency: 'INR',
                            value: data.India
                        },
                        {
                            region: 'US',
                            currency: 'USD',
                            value: data.US
                        }
                    ]
                }
                newRoleOptions = [newRoleElement, ...newRoleOptions]
                newFunctionOptions[funcIndex].roles = newRoleOptions
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
        if(selectedRow[0].function!==''&&selectedRow[0].role!==''&&selectedRow[0].Canada!==''&&selectedRow[0].UK!==''&&selectedRow[0].India!==''&&selectedRow[0].US!==''){
            var delFunc = selectedRow[0].function
            var delRole = selectedRow[0].role
            var funcIndex = newFunctionOptions.findIndex(i=>i.name===delFunc)
            var roleOptions = newFunctionOptions[funcIndex].roles
            if(roleOptions.length!==1){
                var roleIndex = roleOptions.findIndex(i=>i.name===delRole)
                roleOptions.splice(roleIndex, 1)
                newFunctionOptions[funcIndex].roles = roleOptions
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
        toast.success("Functions and Roles updated successfully.")
    }
    errorFunctionUpdate = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    render() {
        let rowData = [], columnDefs = [], child= []
        for(let i=0; i<this.state.functionOptions[0].roles[0].meanSalary.length; i++){
            child.push(
                {
                    headerName: this.state.functionOptions[0].roles[0].meanSalary[i].region + ' (' + this.state.functionOptions[0].roles[0].meanSalary[i].currency.replace(/ +/g, "") + ')',
                    field: this.state.functionOptions[0].roles[0].meanSalary[i].region.replace(/ +/g, ""),
                    width: 205,
                    onCellValueChanged: (params)=>{
                        this.updateMeanSalary(params.newValue, params.colDef.headerName, params.data, params.node.rowIndex)
                    }
                }
            )
        }
        columnDefs = [
            { 
                headerName: 'Function', field: 'function', checkboxSelection: true, width: 300,
                onCellValueChanged: (params)=>{
                    this.updateFunctionName(params.oldValue, params.newValue, params.data)
                }
            },
            { 
                headerName: 'Role', field: 'role', width: 300,
                onCellValueChanged: (params)=>{
                    this.updateRoleName(params.oldValue, params.newValue, params.data, params.node.rowIndex)
                }
            },
            {
                headerName: 'Mean Salary',
                children: child
            },
        ]
        for(let i=0; i<this.state.functionOptions.length; i++){
            for(let j=0; j<this.state.functionOptions[i].roles.length; j++){
                    rowData.push(
                        {
                            function: this.state.functionOptions[i].name,
                            role: this.state.functionOptions[i].roles[j].name,
                            Canada: Number(this.state.functionOptions[i].roles[j].meanSalary[0].value),
                            UK: Number(this.state.functionOptions[i].roles[j].meanSalary[1].value),
                            India: Number(this.state.functionOptions[i].roles[j].meanSalary[2].value),
                            US: Number(this.state.functionOptions[i].roles[j].meanSalary[3].value)
                        }
                    )
            }
        }
        return (
            <div className='row clear-fix'>
                <div style={{display:"grid"}}>
                <h3 style={{margin:"15px"}}>Functions/Roles List
                    <span>
                        <button className='btn-update btn-update-fr frs' onClick={this.onSubmit}>Save Changes</button>
                        <button className='btn-update btn-update-fr' onClick={this.addRow}>Add</button>
                        {this.state.selectedRows.length?<button className='btn-update btn-update-fr' onClick={this.deleteRow}>Delete</button>:null}
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

const ManageFunctionRole = connect(mapStateToProps)(ManageFunctionRoles);
export default ManageFunctionRole;