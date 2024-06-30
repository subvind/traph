// Class representing a task
class Task {
  constructor(customerId, requiredSkill, description = 'Random event') {
    this.customerId = customerId;
    this.requiredSkill = requiredSkill;
    this.description = description;
  }

  setDescription(description) {
    this.description = description;
  }

  setRequiredSkill(requiredSkill) {
    this.requiredSkill = requiredSkill;
  }
}

export default Task;
