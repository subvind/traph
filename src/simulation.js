import PriorityQueue from './priorityQueue.js';
import Customer from './customer.js';
import Vehicle from './vehicle.js';
import Worker from './worker.js';
import Task from './task.js';
import Skill from './skill.js';
import Graph from './graph.js';

// Class representing a simulation for task assignment
class Simulation {
  constructor() {
    this.customers = [];
    this.vehicles = [];
    this.workers = [];
    this.skills = [];
    this.backlog = new PriorityQueue();
  }

  // Create skills
  createSkills() {
    const skillNames = [
      'Electrical', 'Plumbing', 'Carpentry', 'HVAC', 'Painting',
      'Landscaping', 'Roofing', 'Masonry', 'Welding', 'Inspection'
    ];
    this.skills = skillNames.map(name => new Skill(name));
  }

  // Create customers
  createCustomers(count) {
    for (let i = 0; i < count; i++) {
      const customer = new Customer(i + 1);
      customer.addLocation(`Address ${i + 1}`, Math.random() * 100, Math.random() * 100);
      this.customers.push(customer);
    }
  }

  // Create vehicles
  createFleet(count) {
    for (let i = 0; i < count; i++) {
      this.vehicles.push(new Vehicle(i + 1));
    }
  }

  // Create workers
  createWorkers(count) {
    for (let i = 0; i < count; i++) {
      const geoFence = `Geo-${Math.floor(Math.random() * 100)}`;
      const timeWindow = `${Math.floor(Math.random() * 24)}:00 - ${Math.floor(Math.random() * 24)}:00`;
      const workerSkills = new Set();

      // Assign at least 5 random skills to each worker
      while (workerSkills.size < 5) {
        const randomSkill = this.skills[Math.floor(Math.random() * this.skills.length)];
        workerSkills.add(randomSkill.name);
      }

      this.workers.push(new Worker(i + 1, geoFence, timeWindow, workerSkills));
    }
  }

  // Queue random tasks from customers into the backlog
  queueTasks() {
    this.customers.forEach(customer => {
      const requiredSkill = this.skills[Math.floor(Math.random() * this.skills.length)].name;
      const task = new Task(customer.id, requiredSkill);
      this.backlog.enqueue(task, customer.priority);
    });
  }

  // Assign tasks to workers based on skills and sticky sessions
  assignTasks() {
    while (!this.backlog.isEmpty()) {
      const task = this.backlog.dequeue().value;

      // Find workers who match the required skill
      const suitableWorkers = this.workers.filter(worker => worker.skills.has(task.requiredSkill));

      // Prefer or skip sticky sessions logic
      if (suitableWorkers.length > 0) {
        const assignedWorker = suitableWorkers[0];
        console.log(`Assigned task for customer ${task.customerId} to worker ${assignedWorker.id}`);
      } else {
        console.log(`No suitable worker found for customer ${task.customerId}`);
      }
    }
  }

  // Generate the shortest path between all tasks using Dijkstra's algorithm
  route() {
    const graph = new Graph();

    // Add nodes and edges for customer locations
    this.customers.forEach(customer => {
      const location = customer.locations[0];
      graph.addNode(location.address);
    });

    // Adding random weights between nodes for demonstration purposes
    this.customers.forEach(customer1 => {
      this.customers.forEach(customer2 => {
        if (customer1 !== customer2) {
          const location1 = customer1.locations[0];
          const location2 = customer2.locations[0];
          const weight = Math.sqrt(
            Math.pow(location1.latitude - location2.latitude, 2) +
            Math.pow(location1.longitude - location2.longitude, 2)
          );
          graph.addEdge(location1.address, location2.address, weight);
        }
      });
    });

    // Assume a starting point (first customer's location)
    const startNode = this.customers[0].locations[0].address;
    const endNode = this.customers[this.customers.length - 1].locations[0].address;
    const shortestPath = graph.getPath(startNode, endNode);

    console.log(`Shortest path: ${shortestPath.join(' -> ')}`);
  }
}

export default Simulation;
