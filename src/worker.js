// Class representing a worker
class Worker {
  constructor(id, geoFence, timeWindow, skills) {
    this.id = id;
    this.geoFence = geoFence || `Geo-${Math.floor(Math.random() * 100)}`;
    this.timeWindow = timeWindow || `${Math.floor(Math.random() * 24)}:00 - ${Math.floor(Math.random() * 24)}:00`;
    this.skills = skills || new Set();
  }

  setGeoFence(geoFence) {
    this.geoFence = geoFence;
  }

  setTimeWindow(timeWindow) {
    this.timeWindow = timeWindow;
  }

  addSkill(skill) {
    this.skills.add(skill);
  }

  removeSkill(skill) {
    this.skills.delete(skill);
  }
}

export default Worker;
