import React from 'react';
import './Admin.css'
import { connect } from 'react-redux';
import { ADMIN_EXPIRING_USERS } from '../../../utils/constants';
import moment from 'moment';
import { getCall } from '../../../utils/api.config';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
    return state
};

class ConnectedExpiringUsers extends React.Component {
    constructor() {
        super();
        this.state = {
            individualExpiringUsers: [],
            corporateExpiringUsers: []
        }
    }
    componentDidMount= ()=>{
        getCall(ADMIN_EXPIRING_USERS, {}, { sfn: this.successExpiringUsers, efn: this.errorExpiringUsers })
    }
    successExpiringUsers = (data) => {
        this.setState({individualExpiringUsers: data.response.userData, corporateExpiringUsers: data.response.corporateData})
    }
    errorExpiringUsers = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    render() {
        return (
            <div id="ExpiringUsers">
                <div className='row clearfix'>
                    <div className='col-sm-6'>
                        <div className='matchup-secs' style={{height:'600px'}}>
                            <h3>Expiring Individuals</h3>
                            <div className='table-overflow'>
                                {this.state.individualExpiringUsers.length?
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email Id</th>
                                            <th>Expiring On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.individualExpiringUsers.map((entry, index)=>
                                            <tr key={index}>
                                                <td>{entry.name?entry.name:"Guest"}</td>
                                                <td>{entry.email?<a href={`mailto:${entry.email}`}>{entry.email}</a>:"No email id"}</td>
                                                <td>{moment(entry.expiryDate).format("MMM Do YYYY")}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                :
                                <p className='noexpiryaccounts'>No account expiring till {moment().add(15, "days").format("MMM Do YYYY")}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='matchup-secs' style={{height:'600px'}}>
                            <h3>Expiring Corporates</h3>
                            <div className='table-overflow'>
                                {this.state.corporateExpiringUsers.length?
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email Id</th>
                                            <th>Expiring On</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.corporateExpiringUsers.map((entry, index)=>
                                            <tr key={index}>
                                                <td>{entry.name?entry.name:"Guest"}</td>
                                                <td>{entry.email?<a href={`mailto:${entry.email}`}>{entry.email}</a>:"No email id"}</td>
                                                <td>{moment(entry.expiryDate).format("MMM Do YYYY")}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                :
                                <p className='noexpiryaccounts'>No account expiring till {moment().add(15, "days").format("MMM Do YYYY")}</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const ExpiringUsers = connect(mapStateToProps)(ConnectedExpiringUsers);
export default ExpiringUsers;