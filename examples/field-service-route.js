import { Simulation } from '../index.js'; // Import the Simulation class

const fieldService = new Simulation();

// Create skills
fieldService.createSkills();
console.log('Skills created.');

// Create 100k customers
fieldService.createCustomers(25);
console.log('25 customers created.');

// Create a fleet of 1,000 vehicles
fieldService.createFleet(10);
console.log('10 vehicles created.');

// Create a task force of 1,500 workers
fieldService.createWorkers(15);
console.log('15 workers created.');

// Queue random tasks from customers into the backlog
fieldService.queueTasks();
console.log('Random tasks queued into the backlog.');

// Assign tasks to each worker based on skill level
fieldService.assignTasks();

// Generate the shortest path between all tasks
fieldService.route();
