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