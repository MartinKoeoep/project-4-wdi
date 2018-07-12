import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import EventsForm from './Form';

class EventsEdit extends React.Component {

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
      .then(results => getLatLng(results[0]), console.log(address))
      .then(latLng => this.setState({ location: latLng, address: address }))
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
    new Promise(resolve => {
      const timeSlot = this.state.selectedTimes.map(time => {
        const date = moment(time, 'ddd, MMM Do, HH:mm').format('ddd, MMM Do');
        const startTime = moment(time, 'ddd, MMM Do, HH:mm').format('HH:mm');
        return { date: date, startTime: startTime};
      });
      resolve(this.setState({ timeSlots: timeSlot }));
    })
      .then(() => {
        axios({
          method: 'PUT',
          url: '/api/events',
          data: this.state,
          headers: { Authorization: `Bearer ${Auth.getToken()}`}
        })
          .then(() => this.props.history.push('/events'))
          .catch(err => this.setState({ errors: err.response.data.errors}));
      });
  }

  componentDidMount() {
    axios({
      url: '/api/events',
      method: 'GET'
    })
      .then(res => {
        const options = res.data.map(user => {
          return { value: user._id, label: user.username };
        });
        console.log(res.data);
      });
  }

  handleSelectChange = selectedOptions => {
    const invitees = selectedOptions.map(option => option.value);
    this.setState({ selectedOptions, invitees });
  }

  render() {
    return(
      <EventsForm
        handleAddressChange={this.handleAddressChange}
        handleSelect={this.handleSelect}
        handleChange={this.handleChange}
        addTimeSlot={this.addTimeSlot}
        removeTimeSlot={this.removeTimeSlot}
        handleSubmit={this.handleSubmit}
        handleUpload={this.handleUpload}
        handleSelectChange={this.handleSelectChange}
        selected={this.state.startDate}
        onChange={this.onChange}
        data={this.state}
      />
    );
  }
}

export default EventsEdit;
