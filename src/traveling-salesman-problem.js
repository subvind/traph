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