import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import EventsForm from './Form';

class EventsNew extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      startDate: moment(),
      selectedTimes: [],
      timeSlots: [],
      address: ''
    };
    this.onChange = this.onChange.bind(this);
    this.addTimeSlot = this.addTimeSlot.bind(this);
    this.removeTimeSlot = this.removeTimeSlot.bind(this);
  }

  handleAddressChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .then(latLng => this.setState({ location: latLng }))
      .catch(error => console.error('Error', error));
  };

  handleChange = ({ target: { name, value }}) => {
    this.setState({ [name]: value });
  }

  onChange(date) {
    this.setState({ startDate: date });
  }

  addTimeSlot(e) {
    e.preventDefault();
    const selectedTimes = this.state.selectedTimes;
    const formattedTime = moment(this.state.startDate._d).format('ddd, MMM Do, HH:mm');
    selectedTimes.push(formattedTime);
    this.setState({ selectedTimes });
  }

  removeTimeSlot(e) {
    e.preventDefault();
    const selectedTimes = this.state.selectedTimes;
    selectedTimes.splice(selectedTimes.indexOf(e.target.value), 1);
    this.setState({ selectedTimes });
  }

  handleUpload = (e) => {
    this.setState({ image: e.filesUploaded[0].url });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const timeSlot = this.state.selectedTimes.map(time => {
      const date = moment(time, 'ddd, MMM Do, HH:mm').format('YYYY-MM-DD');
      const startTime = moment(time, 'ddd, MMM Do, HH:mm').format('HH:mm');
      return { date: date, startTime: startTime};
    });
    this.setState({ timeSlots: timeSlot });
    axios({
      method: 'POST',
      url: '/api/events',
      data: this.state,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push('/events'))
      .catch(err => this.setState({ errors: err.response.data.errors}));
  }


  render() {
    console.log(this.state.location);
    return(
      <EventsForm
        handleAddressChange={this.handleAddressChange}
        handleSelect={this.handleSelect}
        handleChange={this.handleChange}
        addTimeSlot={this.addTimeSlot}
        removeTimeSlot={this.removeTimeSlot}
        handleSubmit={this.handleSubmit}
        handleUpload={this.handleUpload}
        selected={this.state.startDate}
        onChange={this.onChange}
        data={this.state}
      />
    );
  }
}

export default EventsNew;
