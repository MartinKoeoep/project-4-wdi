import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';

class EventsIndex extends React.Component {

  state = {
    sort: 'name|asc'
  }

  componentDidMount() {
    axios.get('/api/events')
      .then(res => {
        let events = res.data;
        events = events.filter(event => event.privacy === 'Public');
        this.setState({ events });
      });
  }

  handleSearch = (e) => {
    this.setState({ search: e.target.value });
  }

  filteredEvents = (events) => {
    const re = new RegExp(this.state.search, 'i');
    return events.filter(event => {
      return re.test(event.organizer.username) || re.test(event.name);
    });
  }

  handleSort = (e) => {
    this.setState({ sort: e.target.value });
  }

  sortedEvents = (events) => {
    const [ prop, dir ] = this.state.sort.split('|');
    return _.orderBy(events, prop, dir);
  }

  sortedAndFilteredEvents = () => {
    const filtered = this.filteredEvents(this.state.events);
    return this.sortedEvents(filtered);
  }

  render() {
    if(!this.state.events) return <h2 className="title is-2 font-is-light">Loading...</h2>;
    return(
      <section>
        <div className="filters">
          <input className="input" placeholder="Search events" onChange={this.handleSearch} />
        </div>

        <div className="control">
          <div className="select is-fullwidth">
            <select onChange={this.handleSort}>
              <option value="name|asc">Events A-Z</option>
              <option value="name|desc">Events Z-A</option>
            </select>
          </div>
        </div>

        <div className="columns is-multiline is-mobile indexTable">
          <div className="column is-full-mobile is-full-desktop is-full-tablet indexHeader">
            <h6 className="title is-6">Event</h6>
            <h6 className="title is-6">Location</h6>
            <h6 className="title is-6">Organizer</h6>
          </div>
          <div className="column columns is-full-mobile is-full-desktop is-full-tablet indexList is-multiline">
            {this.sortedAndFilteredEvents(this.state.events).map(event =>
              <div className="column columns is-full-mobile is-full-desktop is-full-tablet" key={event._id}><Link to={`/events/${event._id}`}>
                <div className="column is-one-third-mobile is-one-third-desktop rightItem"><p>{event.name}</p></div>
                <div className="column is-one-third-mobile is-one-third-desktop"><p>{event.address}</p></div>
                <div className="column is-one-third-mobile is-one-third-desktop leftItem"><p>{event.organizer.username}</p></div>
              </Link></div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default EventsIndex;
