
// Priority queue class used in Dijkstra's algorithm
class PriorityQueue {
  constructor() {
    this.collection = []; // Array to store the elements of the priority queue
  }

  // Method to add an element to the queue with a priority
  enqueue(value, priority) {
    this.collection.push({ value, priority });
    this.sort(); // Ensure the queue is sorted after adding a new element
  }

  // Method to remove and return the element with the highest priority (lowest value)
  dequeue() {
    return this.collection.shift();
  }

  // Method to check if the queue is empty
  isEmpty() {
    return this.collection.length === 0;
  }

  // Method to sort the queue based on priorities
  sort() {
    this.collection.sort((a, b) => a.priority - b.priority);
  }
}

export default PriorityQueue; // Export the PriorityQueue class as a module