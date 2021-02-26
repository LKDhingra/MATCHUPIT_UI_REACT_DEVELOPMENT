import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Shared.css"
class DatepickerComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            startDate: this.props.date
        };
    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
    };

    render() {
        return (
            <DatePicker
                name={this.props.name}
                selected={this.state.startDate?new Date(this.state.startDate): null}
                onChange={this.handleChange}
                maxDate={this.props.max}
                minDate={this.props.min}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat={'MM/dd/yyyy'}
                disabled={this.props.disabled}
            />
        );
    }
}
export default DatepickerComponent