import { any, func } from 'prop-types';
import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
// import MaskedInput from 'react-text-mask';
import { Portal } from 'react-overlays';

const CalendarContainer = ({ children }) => {
  const el = document.getElementById('calendar-portal');

  return <Portal container={el}>{children}</Portal>;
};

CalendarContainer.propTypes = {
  children: any,
};
export default class CustomDateComponent extends Component {
  static propTypes = {
    onDateChanged: func,
    filterParams: any,
  };

  state = {
    date: null,
  };

  //* ********************************************************************************
  //          METHODS REQUIRED BY AG-GRID
  //* ********************************************************************************

  getDate() {
    const { date } = this.state;
    // ag-grid will call us here when in need to check what the current date value is hold by this
    // component.
    return date;
  }

  setDate(date) {
    // ag-grid will call us here when it needs this component to update the date that it holds.
    this.setState({ date });
  }

  updateAndNotifyAgGrid(date) {
    // Callback after the state is set. This is where we tell ag-grid that the date has changed so
    // it will proceed with the filtering and we can then expect AG Grid to call us back to getDate
    const { onDateChanged } = this.props;
    this.setState({ date }, onDateChanged);
  }

  //* ********************************************************************************
  //          LINKING THE UI, THE STATE AND AG-GRID
  //* ********************************************************************************

  onDateChanged = (selectedDates) => {
    this.setState({ date: selectedDates });
    this.updateAndNotifyAgGrid(selectedDates);
  };

  render() {
    const { date } = this.state;
    const { filterParams } = this.props;
    const { buttons } = filterParams;
    return (
      <DatePicker
        className="filterDate"
        selected={date || null}
        onChange={(changeProps) => {
          this.onDateChanged(changeProps);
        }}
        // customInput={
        //   <MaskedInput
        //     type="text"
        //     // eslint-disable-next-line prettier/prettier
        //     mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
        //   />
        // }
        // disabled={disabled}
        placeholderText="MM/DD/YYYY"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        value={date}
        autoComplete="off"
        autoFocus
        popperContainer={(!buttons && CalendarContainer) || undefined}
      />
    );
  }
}
