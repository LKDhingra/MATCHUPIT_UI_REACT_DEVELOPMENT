import React from 'react';
import HomePage from './components/modules/home/HomePage'
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashboardIndividual from './components/modules/dashboard-individual/DashboardIndividual';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import SignIn from './components/modules/authenticate/SignIn';
import SignUp from './components/modules/authenticate/SignUp';
import DashboardCorporate from './components/modules/dashboard-corporate/DashboardCorporate';
import TermsConditions from './components/modules/tnc/TermsConditions';
import Privacy from './components/modules/tnc/Privacy';
import { connect } from 'react-redux';
import Admin from './components/modules/admin/Admin';
import './MediaQueries.css';
import AboutUs from './components/modules/tnc/AboutUs';

const mapStateToProps = state => {
  return state
};

const ConnectedApp = (state) => {
  return (
    <div id="App">
      <ToastContainer autoClose={5000} />
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/signin' component={SignIn} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/dashboard-individual' component={DashboardIndividual} />
          <Route path='/dashboard-individual/:tab' component={DashboardIndividual} />
          <Route path='/dashboard-individual/:tab/:id' component={DashboardIndividual} />
          <Route exact path='/dashboard-corporate' component={DashboardCorporate} />
          <Route path='/dashboard-corporate/:tab' component={DashboardCorporate} />
          <Route path='/dashboard-corporate/:tab/:id' component={DashboardCorporate} />
          <Route exact path='/terms-conditions' component={TermsConditions} />
          <Route exact path='/privacy-policy' component={Privacy} />
          <Route exact path='/about-us' component={AboutUs} />
          <Route exact path='/admin' component={Admin} />
          <Route path='/admin/:tab' component={Admin} />
        </Switch>
      </Router>
    </div>
  );
}
const App = connect(mapStateToProps)(ConnectedApp);
export default App;