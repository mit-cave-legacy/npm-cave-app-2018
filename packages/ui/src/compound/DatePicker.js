import { Div } from 'glamorous'
import moment from 'moment'
import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import { pxScale } from '../theme'
import './DatePickerStyle/DatePicker-cssmodules.css'
import './DatePickerStyle/DatePicker.css'
import './DatePickerStyle/mixins.css'
import './DatePickerStyle/variables.css'

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

// Examples of different kinds of date-picker: https://reactdatepicker.com/#example-18

// startDate and endDate are states
export class DatePickerCAVE extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment(),
      endDate: moment()
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
  }

  handleChange(date) {
    this.setState({
      startDate: date
    })
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date
    })
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date
    })
  }

  render() {
    return (
      <Div
        css={{
          transform: pxScale(),
          transformOrigin: 'top left'
        }}
      >
        {this.renderInner()}
      </Div>
    )
  }

  renderInner() {
    const { withTime, withRange, onlyTime } = this.props

    if (withTime) {
      return (
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="LLL"
          timeCaption="time"
        />
      )
    } else if (withRange) {
      return (
        <div>
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
          />
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
          />
        </div>
      )
    } else if (onlyTime) {
      return (
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          dateFormat="LT"
          timeCaption="Time"
        />
      )
    } else {
      return (
        <DatePicker
          minDate={moment()}
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
      )
    }
  }
}
