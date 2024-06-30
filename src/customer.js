import Location from './location.js';

// Class representing a customer
class Customer {
  constructor(id, priority = Math.random()) {
    this.id = id;
    this.priority = priority;
    this.locations = [];
  }

  setPriority(priority) {
    this.priority = priority;
  }

  addLocation(address, latitude, longitude) {
    const location = new Location(address, latitude, longitude);
    this.locations.push(location);
  }
}

export default Customer;
