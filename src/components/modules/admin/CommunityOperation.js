import React from 'react';
import './Admin.css'
import { connect } from 'react-redux';
import moment from 'moment';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { postCall, getCall } from '../../../utils/api.config';
import { CREATE_COMMUNITY, GET_COMMUNITIES, VALIDATE_COMMUNITY, TOGGLE_ACTIVATION, EDIT_COMMUNITY } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const mapStateToProps = state => {
    return state
};

class ConnectedCommunityOperation extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            communityName: { value: '', err: '' },
            communityDesc: { value: '', err: '' },
            communityList: [],
            mode: 'new',
            currPage: 1,
            totalPages: 1,
            formReady: false,
            selectedCommunityDetails: null,
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                minWidth: 50
            },
            communityActive: null
        }
    }
    componentDidMount = () => {
        getCall(GET_COMMUNITIES, {}, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
    }

    postCommunityFetch = (data) => {
        this.setState({
            communityList: data.data?data.data:[],
        })
    }
    errInCommunityFetch = () =>{
        toast.error("Server failed to respond. Please try again later.")
    }

    onOpenModal = () => {
        this.setState({
            open: true,
            communityName: { value: '', err: '' },
            communityDesc: { value: '', err: '' },
            selectedCommunity: null,
            mode: 'new'
        });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    onInputValueChange = (e) => {
        switch (e.target.name) {
            case "communityName": this.setState({ communityName: { value: e.target.value, err: '' }, formReady: true }); break;
            case "communityDesc": this.setState({ communityDesc: { value: e.target.value, err: '' }, formReady: true }); break;
            default: break;
        }
    }

    submitCommunity = () => {
        let payload = {
            title: this.state.communityName.value,
            description: this.state.communityDesc.value,
            communityId: this.state.selectedCommunity
        }
        if (payload.title.trim() === '') {
            this.setState({ communityName: { value: '', err: 'Community Name cannot be empty' }, formReady: false })
        }
        if (payload.description.trim() === '') {
            this.setState({ communityDesc: { value: '', err: 'Description cannot be empty' }, formReady: false })
        }
        if(this.state.selectedCommunityDetails.title!==this.state.communityName.value){
            postCall(VALIDATE_COMMUNITY, { title: this.state.communityName.value },
                {
                    sfn: () => {
                        setTimeout(() => {
                            if (this.state.formReady) {
                                this.state.mode === 'new' ? postCall(CREATE_COMMUNITY, payload, { sfn: this.communityCreated, efn: this.loginError }) :
                                    postCall(EDIT_COMMUNITY, payload, { sfn: this.communityCreated, efn: this.loginError })
                            }
                        }, 0)
                    },
                    efn: this.communityExists
                }
            )
        }
        if(this.state.selectedCommunityDetails.title===this.state.communityName.value){
            if (this.state.formReady) {
                this.state.mode === 'new' ? postCall(CREATE_COMMUNITY, payload, { sfn: this.communityCreated, efn: this.loginError }) :
                    postCall(EDIT_COMMUNITY, payload, { sfn: this.communityCreated, efn: this.loginError })
            }
        }
    }
    loginError = () =>{
        toast.error("Server failed to respond. Please try again later.")
    }

    communityCreated = (data) => {
        getCall(GET_COMMUNITIES, {}, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch })
        toast.success(this.state.mode === 'new' ? 'Community Successfully Created' : 'Community Successfully Updated')
        this.onCloseModal.call()
    }

    toggleActivation = (e) => {
        postCall(TOGGLE_ACTIVATION, { communityId: e.target.name }, { sfn: this.postToggleActivation, efn: this.errPostToggleActivation })
    }

    errPostToggleActivation = () => {
        toast.error("Server failed to respond. Please try again later.")
    }

    postToggleActivation = (data) => {
        toast.success(data.msg)
        this.setState({communityActive: !this.state.communityActive, selectedCommunityDetails: null}, ()=>getCall(GET_COMMUNITIES, {}, { sfn: this.postCommunityFetch, efn: this.errInCommunityFetch }))
    }
    editCommunity = (id, title, description) => {
        this.setState({
            communityName: { value: title, err: '' },
            communityDesc: { value: description, err: '' },
            selectedCommunity: id,
            mode: 'edit',
            open: true
        })
    }

    validateTitle = () => {
        if (this.state.communityName.value === '') {
            this.setState({
                communityName: { value: this.state.communityName.value, err: 'Title cannot be empty' }
            })
        } else {
            if(this.state.selectedCommunityDetails.title!==this.state.communityName.value){
                postCall(VALIDATE_COMMUNITY, { title: this.state.communityName.value }, { efn: this.communityExists })
            }
        }
    }

    communityExists = () => {
        this.setState({
            communityName: { value: this.state.communityName.value, err: 'Community already exists' },
            formReady: false
        })
    }

    onRowSelected = () => {
        if(this.gridApi.getSelectedRows().length){
            var titleId = this.gridApi.getSelectedRows()[0].id
            var communityOption = [...this.state.communityList]
            var index = communityOption.findIndex(i=>i._id===titleId)
            if(index!==-1){
                this.setState({selectedCommunityDetails: communityOption[index]}, ()=>this.setState({communityActive: this.state.selectedCommunityDetails.is_active}))
            }
        }
        else{
            this.setState({selectedCommunityDetails: null, communityActive: null})
        }
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    render() {
        let columnDefs = [], rowDefs = []
        columnDefs.push(
            { 
                headerName: 'Name', field: 'name', width: 500, checkboxSelection: true, tooltipField: 'description',
            },
            { 
                headerName: 'Created On', field: 'createdon', width: 220
            },
            { 
                headerName: 'Created By', field: 'createdby', width: 220
            },
            { 
                headerName: 'Members', field: 'members', width: 220
            },
            { 
                headerName: 'Status', field: 'status', width: 220
            },
        )
        console.log(this.state.communityList)
        for(let i = 0; i<this.state.communityList.length; i++){
            rowDefs.push(
                {
                    name: this.state.communityList[i].title,
                    createdon: moment(this.state.communityList[i].createdOn).format("MMM Do YYYY"),
                    createdby: this.state.communityList[i].name,
                    members: this.state.communityList[i].userCount,
                    id: this.state.communityList[i]._id,
                    status: this.state.communityList[i].is_active ? 'Active' : 'Inactive',
                    description: this.state.communityList[i].description
                }
            )
        }
        return (
            <div id="CommunityOperation">
                <h3>Manage Communities</h3>
                <div className="row">
                    <div className="col-xs-6">
                        <button type="button" className="btn-create-comm" onClick={this.onOpenModal}>Create New</button>
                    </div>
                    <div className="col-xs-6">
                        <div className="text-right">
                            {this.state.selectedCommunityDetails?
                            <span>
                                <button type="button" className='btn-update btn-update-comm' onClick={() => this.editCommunity.call(this, this.state.selectedCommunityDetails._id, this.state.selectedCommunityDetails.title, this.state.selectedCommunityDetails.description)}>Edit</button>
                                <button type="button" className='btn-update btn-update-comm' name={this.state.selectedCommunityDetails._id} onClick={this.toggleActivation}>{this.state.communityActive ? 'Deactivate': 'Activate'}</button>
                            </span>
                            :
                            <span></span>    
                            }
                        </div>
                    </div>
                </div>
                <div className="matchup-secs">
                    <div className="ag-theme-alpine col-sm-12" style={{height: '430px', width: '100%' }}>
                        <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowDefs}
                        onRowSelected={this.onRowSelected}
                        defaultColDef={this.state.defaultColDef}
                        animateRows
                        onGridReady={this.onGridReady}
                        >
                        </AgGridReact>
                    </div>
                </div>
                <Modal
                    open={this.state.open}
                    onClose={this.onCloseModal}
                    center>
                    <div className="create-comm-modal">
                        <h3 className="text-center">Create New Community</h3>
                        <form>
                            <div className="form-unit">
                                <input type="text" maxLength="50" placeholder="Enter the Community Name" value={this.state.communityName.value} className={this.state.communityName.err === '' ? "" : "error-input"} name="communityName" onChange={this.onInputValueChange} onBlur={this.validateTitle} />
                                {this.state.communityName.err !== '' && <div className="error-info">{this.state.communityName.err}</div>}
                            </div>
                            <div className="form-unit">
                                <textarea rows="6" maxLength="1000" placeholder="Enter Description for Community" value={this.state.communityDesc.value} className={this.state.communityDesc.err === '' ? "" : "error-input"} name="communityDesc" onChange={this.onInputValueChange}></textarea>
                                {this.state.communityDesc.err !== '' && <div className="error-info">{this.state.communityDesc.err}</div>}
                            </div>
                            <button type="button" className="btn-general-community" onClick={this.submitCommunity}>{this.state.mode === 'new' ? "Create Community" : "Edit Community"}</button>
                        </form>
                    </div>
                </Modal>
            </div>
        )
    }
}

const CommunityOperation = connect(mapStateToProps)(ConnectedCommunityOperation);
export default CommunityOperation;