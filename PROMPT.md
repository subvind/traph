Please follow the instructions within ./TODO.md! Thank you :)
### ./index.js

```js
import Customer from './src/customer.js';
import Dijkstra from './src/dijkstra.js';
import * as Genetic from './src/genetic.js';
import Graph from './src/graph.js'; 
import Location from './src/location.js';
import PriorityQueue from './src/priorityQueue.js';
import Simulation from './src/simulation.js';
import Skill from './src/skill.js';
import Task from './src/task.js';
import TSP from './src/traveling-salesman-problem.js';
import Vehicle from './src/vehicle.js';
import Worker from './src/worker.js';

export {
  Customer,
  Dijkstra,
  Genetic,
  Graph,
  Location,
  PriorityQueue,
  Simulation,
  Skill,
  Task,
  TSP,
  Vehicle,
  Worker
}
```

### ./src/genetic.js

```js
// Gene.js
class Gene {
  constructor(code) {
    this.code = code;
  }

  // You can add methods here if needed
}

// Chromosome.js
class Chromosome {
  constructor(genes) {
    this.genes = genes;
    this.fitness = 0;
  }

  // Fitness calculation will be problem-specific and set externally
}

// Population.js
class Population {
  constructor(chromosomes) {
    this.chromosomes = chromosomes;
  }

  sort() {
    this.chromosomes.sort((a, b) => b.fitness - a.fitness);
  }
}

// GeneticAlgorithm.js
class GeneticAlgorithm {
  constructor(config) {
    this.populationSize = config.populationSize || 100;
    this.mutationRate = config.mutationRate || 0.01;
    this.crossoverRate = config.crossoverRate || 0.9;
    this.elitismCount = config.elitismCount || 2;
    this.tournamentSize = config.tournamentSize || 5;

    this.fitnessFunction = config.fitnessFunction;
    this.mutationFunction = config.mutationFunction;
    this.crossoverFunction = config.crossoverFunction;
    this.geneFactory = config.geneFactory;
    this.genesPerChromosome = config.genesPerChromosome;
  }

  initPopulation() {
    let chromosomes = [];
    for (let i = 0; i < this.populationSize; i++) {
      let genes = Array.from({ length: this.genesPerChromosome }, () => this.geneFactory());
      chromosomes.push(new Chromosome(genes));
    }
    return new Population(chromosomes);
  }

  evalPopulation(population) {
    for (let chromosome of population.chromosomes) {
      chromosome.fitness = this.fitnessFunction(chromosome);
    }
    population.sort();
  }

  evolve(population) {
    let newPopulation = new Population([]);

    // Elitism
    for (let i = 0; i < this.elitismCount; i++) {
      newPopulation.chromosomes.push(population.chromosomes[i]);
    }

    // Crossover and mutation
    while (newPopulation.chromosomes.length < this.populationSize) {
      let parent1 = this.selectParent(population);
      let parent2 = this.selectParent(population);
      let child;
      if (Math.random() < this.crossoverRate) {
        child = new Chromosome(this.crossoverFunction(parent1.genes, parent2.genes));
      } else {
        child = new Chromosome([...parent1.genes]);
      }
      for (let i = 0; i < child.genes.length; i++) {
        if (Math.random() < this.mutationRate) {
          child.genes[i] = this.mutationFunction(child.genes[i]);
        }
      }
      newPopulation.chromosomes.push(child);
    }

    return newPopulation;
  }

  selectParent(population) {
    // Tournament selection
    let tournament = [];
    for (let i = 0; i < this.tournamentSize; i++) {
      let randomIndex = Math.floor(Math.random() * population.chromosomes.length);
      tournament.push(population.chromosomes[randomIndex]);
    }
    return tournament.reduce((best, current) => (current.fitness > best.fitness ? current : best));
  }

  run(generations) {
    let population = this.initPopulation();
    this.evalPopulation(population);
    let bestSolution = population.chromosomes[0];  // Initialize with the first chromosome after evaluation

    console.log('Initial best solution fitness:', bestSolution.fitness);

    for (let i = 0; i < generations; i++) {
      population = this.evolve(population);
      this.evalPopulation(population);
      
      // Update best solution if a better one is found
      if (population.chromosomes[0].fitness > bestSolution.fitness) {
        bestSolution = population.chromosomes[0];
        console.log(`Generation ${i}: New best solution fitness:`, bestSolution.fitness);
      }
    }

    console.log('Final best solution fitness:', bestSolution.fitness);
    return bestSolution;
  }
}

export { 
  Gene, 
  Chromosome, 
  Population, 
  GeneticAlgorithm
}
```

### ./src/traveling-salesman-problem.js

```js
// traveling-salesman-problem.js

import { Gene, Chromosome, GeneticAlgorithm, Population } from './genetic.js';

class TSP {
  constructor(graph, start, finish, nodesToVisit, config = {}) {
    this.graph = graph;
    this.start = start;
    this.finish = finish;
    this.nodesToVisit = nodesToVisit;
    this.allNodes = [start, ...nodesToVisit, finish];
    
    this.gaConfig = {
      populationSize: config.populationSize || 100,
      mutationRate: config.mutationRate || 0.01,
      crossoverRate: config.crossoverRate || 0.9,
      elitismCount: config.elitismCount || 2,
      tournamentSize: config.tournamentSize || 5,
      generations: config.generations || 1000,
      genesPerChromosome: this.nodesToVisit.length,
      
      geneFactory: () => new Gene(this.nodesToVisit[Math.floor(Math.random() * this.nodesToVisit.length)]),
      
      fitnessFunction: this.calculateFitness.bind(this),
      
      mutationFunction: this.mutate.bind(this),
      
      crossoverFunction: this.crossover.bind(this)
    };
    
    this.ga = new GeneticAlgorithm(this.gaConfig);
  }

  calculateFitness(chromosome) {
    const path = [this.start, ...chromosome.genes.filter(gene => gene !== null).map(gene => gene.code), this.finish];

    // Check for duplicate nodes (except start and finish)
    const middleNodes = path.slice(1, -1);
    if (new Set(middleNodes).size !== middleNodes.length) {
      return 0; // Invalid path, return 0 fitness
    }

    try {
      let totalDistance = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const currentNode = path[i];
        const nextNode = path[i + 1];
        if (currentNode === nextNode) {
          continue; // Skip if current and next nodes are the same
        }
        const shortestPath = this.graph.getPath(currentNode, nextNode);
        if (!shortestPath || shortestPath.length === 0) {
          throw new Error(`No path between ${currentNode} and ${nextNode}`);
        }
        totalDistance += this.graph.getPathTotal(shortestPath);
      }
      return totalDistance === 0 ? 0 : 1 / totalDistance;
    } catch (error) {
      console.error('Error calculating fitness:', error.message);
      return 0; // Return 0 fitness for invalid paths
    }
  }

  mutate(gene) {
    if (!gene) {
      return new Gene(this.nodesToVisit[Math.floor(Math.random() * this.nodesToVisit.length)]);
    }
    const availableNodes = this.nodesToVisit.filter(node => node !== gene.code);
    const nodeIndex = Math.floor(Math.random() * availableNodes.length);
    return new Gene(availableNodes[nodeIndex]);
  }

  crossover(parent1Genes, parent2Genes) {
    // Implement Ordered Crossover (OX)
    const start = Math.floor(Math.random() * parent1Genes.length);
    const end = start + Math.floor(Math.random() * (parent1Genes.length - start));
    
    const child = new Array(parent1Genes.length).fill(null);
    
    // Copy a substring from parent1
    for (let i = start; i <= end; i++) {
      child[i] = parent1Genes[i];
    }
    
    // Fill the remaining positions with nodes from parent2
    let j = 0;
    for (let i = 0; i < parent2Genes.length; i++) {
      if (parent2Genes[i] !== null && !child.some(gene => gene && gene.code === parent2Genes[i].code)) {
        while (j < child.length && child[j] !== null) j++;
        if (j < child.length) {
          child[j] = parent2Genes[i];
        }
      }
    }
    
    // Fill any remaining null genes
    for (let i = 0; i < child.length; i++) {
      if (child[i] === null) {
        const availableNodes = this.nodesToVisit.filter(node => !child.some(gene => gene && gene.code === node));
        if (availableNodes.length > 0) {
          child[i] = new Gene(availableNodes[Math.floor(Math.random() * availableNodes.length)]);
        }
      }
    }
    
    return child;
  }

  getCompletePath(path) {
    let completePath = [];
    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];
      const shortestPath = this.graph.getPath(currentNode, nextNode);
      completePath = completePath.concat(shortestPath.slice(0, -1)); // Exclude the last node to avoid duplicates
    }
    completePath.push(path[path.length - 1]); // Add the final node
    return completePath;
  }

  getSolution() {
    const bestSolution = this.ga.run(this.gaConfig.generations);
    console.log('Best solution:', bestSolution);
  
    if (!bestSolution || !bestSolution.genes) {
      console.error('No valid solution found');
      return { path: [], distance: Infinity, error: 'No valid solution found' };
    }
  
    const path = [this.start, ...bestSolution.genes.filter(gene => gene !== null).map(gene => gene.code), this.finish];
    
    if (path.length !== this.allNodes.length) {
      console.error('Invalid path length', path);
      return { path, distance: Infinity, error: 'Invalid path length' };
    }
  
    const completePath = this.getCompletePath(path);
    const distance = bestSolution.fitness ? 1 / bestSolution.fitness : Infinity;
    return { path: completePath, distance };
  }
}

export default TSP;
```

### ./examples/tsp-route.js

```js
import { Graph, TSP } from '../index.js'; // Import the Graph class

// Create and populate the graph
const graph = new Graph();

graph.addNode('A');
graph.addNode('B');
graph.addNode('C');
graph.addNode('D');
graph.addNode('E');
graph.addNode('F');
graph.addNode('G');
graph.addNode('H');
graph.addNode('I');
graph.addNode('J');
graph.addNode('K');

graph.addEdge("A", "B", 10);
graph.addEdge("A", "C", 15);
graph.addEdge("A", "D", 20);
graph.addEdge("B", "C", 35);
graph.addEdge("B", "D", 25);
graph.addEdge("C", "D", 10);
graph.addEdge("C", "E", 35);
graph.addEdge("C", "F", 30);
graph.addEdge("D", "G", 10);
graph.addEdge("E", "G", 15);
graph.addEdge("F", "G", 10);
graph.addEdge("G", "H", 20);
graph.addEdge("G", "I", 15);
graph.addEdge("G", "J", 40);
graph.addEdge("H", "K", 30);
graph.addEdge("I", "K", 10);
graph.addEdge("J", "K", 45);

const start = "A";
const finish = "K";
const nodesToVisit = ["G", "K", "D"];

// Solve the traveling salesman problem
const tsp = new TSP(graph, start, finish, nodesToVisit, { generations: 1000 });
const solution = tsp.getSolution();

console.log('Best tour:', solution.path.join(' -> '));
console.log('Tour length:', solution.distance);

if (solution.error) {
  console.error('Error:', solution.error);
}
```

### ./CURRENT_ERROR.md

```md
npm run tsp-route

> traph@1.0.0 tsp-route
> node ./examples/tsp-route.js

Initial best solution fitness: 0.01818181818181818
Final best solution fitness: 0.01818181818181818
Best solution: Chromosome {
  genes: [ Gene { code: 'D' }, Gene { code: 'G' }, Gene { code: 'K' } ],
  fitness: 0.01818181818181818
}
Best tour: A -> D -> G -> I -> K
Tour length: 55
```

### ./TODO.md

```md
after todo: i will update my code base with the submitted files and run
the program ... if there is an error then it will be placed within ./CURRENT_ERROR.md
otherwise assume i have updated my requirements.

durring todo: if there is an error within ./CURRENT_ERROR.md then help me solve that
otherwise don't worry about it and proceed with the following todo rules.

TODO RULES:
 1) return a ./src/<filename>.js file
 2) i'd like JavaScript code in response to my queries!
 3) keep console.log statements for debugging
 4) keep code comments for documentation
```

