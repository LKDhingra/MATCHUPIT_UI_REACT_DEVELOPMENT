import React from 'react';
import './Admin.css'
import { connect } from 'react-redux';
import PieChart from 'react-minimal-pie-chart';
import moment from 'moment'
import { getCall, postCall } from '../../../utils/api.config';
import { JsonToExcel } from 'react-json-excel';
import { ADMIN_USERCOUNT, ADMIN_REPORT, ADMIN_TOP_COMMUNITIES, ADMIN_PAYMENT_STATUS, ADMIN_REVENUE, ADMIN_EXPIRING_USERS } from '../../../utils/constants';
import { toast } from 'react-toastify';

const mapStateToProps = state => {
    return state
};

class ConnectedDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            topCommunities: [],
            viewMode: 'CM',
            paymentStatus: {
                paidCorporates: 0,
                paidUsers: 0,
                totalCorporates: 0,
                totalUsers: 0
            },
            rows: [],
            individualRevenue: 0,
            corporateRevenue: 0,
            currentMonthRevenue: 0,
            corporateExpiringUsers: [],
            individualExpiringUsers: [],
            reportData: [],
            reportFields: {},
            downloadReady:false,
            isFetching:false
        }
        this.drawBackgroundColor = this.drawBackgroundColor.bind(this)
    }
    componentDidMount = () => {
        getCall(ADMIN_TOP_COMMUNITIES, {}, { sfn: this.successTopCommunities, efn: this.errorTopCommunities })
        getCall(ADMIN_PAYMENT_STATUS, {}, { sfn: this.successPaymentStatus, efn: this.errorPaymentStatus })
        getCall(ADMIN_REVENUE, {}, { sfn: this.successRevenueStatus, efn: this.errorPaymentStatus })
        getCall(ADMIN_EXPIRING_USERS, {}, { sfn: this.successExpiringUsers, efn: this.errorExpiringUsers })
        let payload = { cat: 'CM' }
        postCall(ADMIN_USERCOUNT, payload, { sfn: this.successUserCount, efn: this.errorUserCount })
    }
    errorPaymentStatus = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    errorExpiringUsers = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    errorUserCount = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    drawBackgroundColor() {
        let data = new window.google.visualization.DataTable();
        data.addColumn('number', 'Date');
        data.addColumn('number', 'Individuals');
        data.addColumn('number', 'Corporates');
        data.addRows(this.state.rows);
        let options = {
            hAxis: { title: 'Current Month' },
            vAxis: { title: 'Users' },
            backgroundColor: '#FFFFFF',
            legend: { position: 'top' },
            series: {
                0: { color: '#17b712' },
                1: { color: '#3992f9' }
            },
            chartArea:{
                right: 0,
                left: 50,
                width:'80%',
            }
        }
        switch (this.state.viewMode) {
            case ('CW'): {
                options.hAxis = { title: 'Current Week' }
                break;
            }
            case ('PW'): {
                options.hAxis = { title: 'Previous Week' }
                break;
            }
            case ('CM'): {
                options.hAxis = { title: 'Current Month' }
                break;
            }
            case ('PM'): {
                options.hAxis = { title: 'Previous Month' }
                break;
            }
            case ('PSM'): {
                options.hAxis = { title: 'Previous Six Months' }
                break;
            }
            case ('CY'): {
                options.hAxis = { title: 'Current Year' }
                break;
            }
            case ('PY'): {
                options.hAxis = { title: 'Previous Year' }
                break;
            }
            default: break;
        }

        let chart = new window.google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

    successTopCommunities = (data) => {
        this.setState({ topCommunities: data.data })
    }
    successPaymentStatus = (data) => {
        this.setState({ paymentStatus: data.response })
    }
    successUserCount = (data) => {
        this.setState({ rows: data.response.result })
        window.google.charts.load('current', {
            packages: ['corechart', 'line']
        });
        window.google.charts.setOnLoadCallback(this.drawBackgroundColor);
    }
    successRevenueStatus = (data) => {
        let totalRevenueByMonth = data.response.corporateRevenueByMonth + data.response.userRevenueByMonth
        this.setState({ individualRevenue: data.response.userRevenueTotal, corporateRevenue: data.response.corporateRevenueTotal, currentMonthRevenue: totalRevenueByMonth })
    }
    successExpiringUsers = (data) => {
        this.setState({ individualExpiringUsers: data.response.userData, corporateExpiringUsers: data.response.corporateData })
    }
    errorTopCommunities = () => {
        toast.error("Server failed to respond. Please try again later.")
    }
    updateViewMode = e => {
        this.setState({ viewMode: e.target.value })
        setTimeout(() => {
            if (this.state.viewMode !== '-1') {
                let payload = { cat: this.state.viewMode }
                postCall(ADMIN_USERCOUNT, payload, { sfn: this.successUserCount, efn: this.errorUserCount })
            }
            else {
                let payload = { cat: 'CM' }
                postCall(ADMIN_USERCOUNT, payload, { sfn: this.successUserCount, efn: this.errorUserCount })
            }
        }, 1);
    }
    switchTab = () => {
        window.location.href = '/admin/expiringusers'
    }
    generateRoport = () => {
        this.setState({isFetching:true})
        getCall(ADMIN_REPORT,{},{sfn:this.reportGenerated,efn:this.generationFailed})
    }
    reportGenerated=(data)=>{
        this.setState({isFetching:false})
        this.setState({
            reportFields:data.response.fields,
            reportData:data.response.data,
            downloadReady:true
        })
    }
    generationFailed=()=>{
        toast.error("Report generation failed. Please try after some time.")
    }
    downloadReport=()=>{
        Array.from(document.getElementsByClassName('download-link'))[0].click()
    }
    render() {
        return (
            <div id="Dashboard">
                <div className="row">
                    <div className="col-md-8">
                        <div className="matchup-secs matchup-secs-height">
                            <div className="row">
                                <div className="col-md-4">
                                    <p><strong>Dashboard</strong></p>
                                    <strong><span className="big-text">${this.state.currentMonthRevenue.toFixed(2)}</span></strong>
                                    <p className='sub-text'>Revenue this month</p><br />
                                    {this.state.isFetching ?
                                        <img src={require('../../../images/icons/loader2.gif')} alt="" className="fit-layout"/>
                                        :
                                        this.state.downloadReady?
                                        <span className="report-gen">
                                            Your Report is generated <button type="button" className="dl-btn" onClick={this.downloadReport}><i className="fa fa-download"></i></button>
                                        </span>
                                        :
                                        <span className="report-gen">
                                            <button type="button" className="link" onClick={this.generateRoport}>Click Here</button> to generate report
                                        </span>
                                    }
                                    {this.state.downloadReady&&<JsonToExcel
                                        data={this.state.reportData}
                                        className={"download-link"}
                                        filename={"Orders-Summary"}
                                        fields={this.state.reportFields}
                                        style={{ visibility: 'hidden' }}
                                    />}
                                </div>
                                <div className="col-md-8 graph-col">
                                    <div className="row">
                                        <div className="col-xs-8"><strong className="signup-text-admin">SignUp Graph</strong></div>
                                        <div className="col-xs-4">
                                            <select name="viewMode" className='general-search-input' value={this.state.viewMode} onChange={this.updateViewMode}>
                                                <option value='-1'>Select Viewing Mode</option>
                                                <option value='CW'>Current Week</option>
                                                <option value='PW'>Previous Week</option>
                                                <option value='CM'>Current Month</option>
                                                <option value='PM'>Previous Month</option>
                                                <option value='PSM'>Previous Six Months</option>
                                                <option value='CY'>Current Year</option>
                                                <option value='PY'>Previous Year</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="chart_div"></div>
                                </div>
                            </div>
                            <div className="revenue-desc">
                                <div className="row">
                                    <div className="col-sm-6 col-md-3">
                                        <div className="item one">
                                            <p>Individual Users</p>
                                            <p><strong>{this.state.paymentStatus.totalUsers}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-3">
                                        <div className="item two">
                                            <p>Individual Revenue</p>
                                            <p><strong>$ {this.state.individualRevenue.toFixed(2)}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-3">
                                        <div className="item three">
                                            <p>Corporate Users</p>
                                            <p><strong>{this.state.paymentStatus.totalCorporates}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-3">
                                        <div className="item four">
                                            <p>Corporate Revenue</p>
                                            <p><strong>$ {this.state.corporateRevenue.toFixed(2)}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="matchup-secs matchup-secs-height">
                            <div className="row">
                                <div className="col-xs-6">
                                    <div style={{maxHeight:"200px", display:"flex"}}>
                                    <PieChart
                                        data={[
                                            { title: this.state.paymentStatus.totalCorporates - this.state.paymentStatus.paidCorporates + ' Unpaid Corporate', value: this.state.paymentStatus.totalCorporates - this.state.paymentStatus.paidCorporates, color: '#17b712' },
                                            { title: this.state.paymentStatus.paidCorporates + ' Paid Corporate', value: this.state.paymentStatus.paidCorporates, color: '#3F465B' }
                                        ]}
                                    />
                                    </div>
                                    
                                    <ul className="pie-indicators">
                                        <li><div className='color-box' style={{ background: "#17b712" }}></div> {this.state.paymentStatus.totalCorporates - this.state.paymentStatus.paidCorporates} Unpaid Corporates</li>
                                        <li><div className='color-box' style={{ background: "#3F465B" }}></div> {this.state.paymentStatus.paidCorporates} Paid Corporates</li>
                                    </ul>
                                </div>
                                <div className="col-xs-6">
                                    <div style={{maxHeight:"200px", display:"flex"}}>
                                    <PieChart
                                        data={[
                                            { title: this.state.paymentStatus.totalUsers - this.state.paymentStatus.paidUsers + ' Unpaid Individual', value: this.state.paymentStatus.totalUsers - this.state.paymentStatus.paidUsers, color: '#3992f9' },
                                            { title: this.state.paymentStatus.paidUsers + ' Paid Individuals', value: this.state.paymentStatus.paidUsers, color: '#ebc23b' }
                                        ]}
                                    />
                                    </div>
                                    <ul className="pie-indicators">
                                        <li><div className='color-box' style={{ background: "#3992f9" }}></div> {this.state.paymentStatus.totalUsers - this.state.paymentStatus.paidUsers} Unpaid Individual</li>
                                        <li><div className='color-box' style={{ background: "#ebc23b" }}></div> {this.state.paymentStatus.paidUsers} Paid Individual</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="matchup-secs matchup-secs-table">
                            <strong>Top Communities</strong>
                            <p>Five most active communities</p>
                            <div style={{overflowX:"auto"}}>
                            <table className="table table-hover top-comm-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Created On</th>
                                        <th>Members</th>
                                        <th>Topics</th>
                                        <th>Comments</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.topCommunities.map(entry =>
                                        <tr key={entry.title}>
                                            <td>{entry.title}</td>
                                            <td>{moment(entry.createdOn).format("MMM Do YYYY")}</td>
                                            <td className="text-center">{entry.userCount}</td>
                                            <td className="text-center">{entry.postsCount}</td>
                                            <td className="text-center">{entry.commentCount}</td>
                                            {entry.is_active ? <td><div className="active-square">Active</div></td> : <td><div className="expired-square">Expired</div></td>}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="matchup-secs">
                                    <strong>Upcoming Subscription Expiry</strong>
                                    <p>Individuals</p>
                                    {this.state.individualExpiringUsers.length ?
                                        <div style={{overflowX:"auto"}}>
                                            <div className="expiry-table">
                                            <table className="table table-hover ">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Expiring On</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.individualExpiringUsers.slice(0, 5).map((entry, index) =>
                                                        <tr key={index}>
                                                            <td>{entry.name?entry.name:'Guest'}</td>
                                                            <td>{moment(entry.expiryDate).format("MMM Do YYYY")}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            <button className='button-view-all' onClick={this.switchTab}>View All</button>
                                            </div>
                                        </div>
                                        :
                                        <p className='noexpiryaccounts'>No account expiring till {moment().add(15, "days").format("MMM Do YYYY")}</p>
                                    }
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="matchup-secs">
                                    <strong>Upcoming Subscription Expiry</strong>
                                    <p>Corporates</p>
                                    {this.state.corporateExpiringUsers.length ?
                                        <div style={{overflowX:"auto"}}>
                                            <div className="expiry-table">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Expiring On</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.corporateExpiringUsers.slice(0, 5).map((entry, index) =>
                                                        <tr key={index}>
                                                            <td>{entry.name?entry.name:'Guest'}</td>
                                                            <td>{moment(entry.expiryDate).format("MMM Do YYYY")}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                            <button className='button-view-all' onClick={this.switchTab}>View All</button>
                                            </div>
                                        </div>
                                        :
                                        <p className='noexpiryaccounts'>No account expiring till {moment().add(15, "days").format("MMM Do YYYY")}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const Dashboard = connect(mapStateToProps)(ConnectedDashboard);
export default Dashboard;