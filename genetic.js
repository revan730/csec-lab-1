'use strict';

const MonoAlphabeticCipher = require('text-ciphers').MonoAlphabeticCipher;

const frequencies = require('./frequencies');

// Genetic algorithm implementation for substitution cipher decryption

const bigramFinder = nGram(2)
const trigramFinder = nGram(3)

// Factory returning a function that converts a value string to n-grams.
function nGram(n) {
  if (typeof n !== 'number' || isNaN(n) || n < 1 || n === Infinity) {
    throw new Error('`' + n + '` is not a valid argument for n-gram');
  }

  return grams;

  // Create n-grams from a given value.
  function grams(value) {
    const nGrams = [];
    let index;

    if (value === null || value === undefined) {
      return nGrams;
    }

    value = value.slice ? value : String(value);
    index = value.length - n + 1;

    if (index < 1) {
      return nGrams;
    }

    while (index--) {
      nGrams[index] = value.slice(index, index + n);
    }

    return nGrams;
  }
}

const calculateFitness = (genome, cipherText) => {
    let fitness = 0.0;
    const mCipher = new MonoAlphabeticCipher({
        substitution: genome
    });

    //console.log(`genome is ${genome}`);
    const decryptedText = mCipher.decipher(cipherText.toLowerCase()).toUpperCase();
    //console.log("decryptedText");
    //console.log(decryptedText);

    

    const decryptedFreqs = {};

    for (let i = 0;i < decryptedText.length;i++) {
        if (decryptedFreqs[decryptedText[i]] === undefined) {
            decryptedFreqs[decryptedText[i]] = 1.0;
        } else {
            decryptedFreqs[decryptedText[i]] += 1.0;
        }
    } 
    
    for (let f in decryptedFreqs) {
        decryptedFreqs[f] = decryptedFreqs[f] / decryptedText.length;
    }
    //console.log(decryptedFreqs);
    for (let c in decryptedFreqs) {
        //console.log(`char ${c} dec ${decryptedFreqs[c]} eng ${frequencies.unigrams[c]} log ${Math.log2(frequencies.unigrams[c])}`);
        fitness += Math.log2(Math.abs(decryptedFreqs[c] - frequencies.unigrams[c]));
        //fitness += decryptedFreqs[c] * Math.log2(frequencies.unigrams[c])
    }

    let bigrams = bigramFinder(decryptedText);


    const bigramFreqs = {};

    for (let i = 0; i < bigrams.length; i++) {
      if (bigramFreqs[bigrams[i]] === undefined) {
        bigramFreqs[bigrams[i]] = 1.0;
      } else {
        bigramFreqs[bigrams[i]] += 1.0;
      }
    }
    
    for (let f in bigramFreqs) {
      bigramFreqs[f] = bigramFreqs[f] / (decryptedText.length - 1);
    }
    for (let c in bigramFreqs) {
      if (frequencies.bigrams[c]) {
        fitness += Math.log2(Math.abs(bigramFreqs[c] - frequencies.bigrams[c]));
      }
    }

    let trigrams = trigramFinder(decryptedText);

    const trigramFreqs = {};

    for (let i = 0; i < trigrams.length; i++) {
      if (trigramFreqs[trigrams[i]] === undefined) {
        trigramFreqs[trigrams[i]] = 1.0;
      } else {
        trigramFreqs[trigrams[i]] += 1.0;
      }
    }
    
    for (let f in trigramFreqs) {
      trigramFreqs[f] = trigramFreqs[f] / (decryptedText.length - 2);
    }
    for (let c in trigramFreqs) {
      if (frequencies.trigrams[c]) {
        fitness += Math.log2(Math.abs(trigramFreqs[c] - frequencies.trigrams[c]));
      }
    }

    // Check if there are common words
    for (let w in frequencies.commonWords) {
        if (decryptedText.search(w) !== -1) {
            fitness += frequencies.commonWords[w];
        }
    }

    return fitness;
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setCharAt = (str, index, chr) => {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

class Chromosome {
    constructor(genome, cipherText) {
        this.genome = genome;
        this.cipherText = cipherText;
        this.fitness = calculateFitness(genome, cipherText);
    }
}

class GeneticCracker {
    constructor(cipherText) {
        this.generations = 500;
        this.populationSize = 250;
        this.elitismPercentage = 15;
        this.tournamentSize = 20;
        this.tournamentWinnerProbability = 0.75;
        this.crossoverProbability = 0.7;
        this.mutationProbability = 0.2;
        this.crossoverPoints = 5;
        this.currentGeneration = 0;
        this.population = [];
        this.cipherText = cipherText;
    }

    run(gens, popsize) {
      this.generations = gens;
      this.populationSize = popsize;


      let timer = Date.now();

      this.createInitialPopulation();


      while (this.currentGeneration < this.generations) {
        this.newGeneration();
        if (this.currentGeneration % 50 === 0) {
          console.log(`current generation: ${this.currentGeneration}`);
        }
      }
      this.population.sort((a, b) => a.fitness - b.fitness);

      const keyTextPairs = [];
      for (let i = 0; i < this.population.length;i++) {
        const mCipher = new MonoAlphabeticCipher({
            substitution: this.population[i].genome
        });
          keyTextPairs.push({
            key: this.population[i].genome,
            deciphered: mCipher.decipher(this.cipherText.toLowerCase()).toUpperCase()
          });
      }

      return keyTextPairs;
      /*const mCipher = new MonoAlphabeticCipher({
          substitution: this.population[0].genome
      });
      return {
        key: this.population[0].genome,
        deciphered: mCipher.decipher(this.cipherText.toLowerCase()).toUpperCase(),
        took: Date.now() - timer
      }*/
    }

    createInitialPopulation() {
        for (let i = 0;i < this.populationSize;i++) {
            const genome = MonoAlphabeticCipher.createKeyRandom();
            const chromosome = new Chromosome(genome, this.cipherText);
            this.population.push(chromosome);
            this.population.sort((a, b) => a.fitness < b.fitness);
        }
    }

    createChildren(firstChromo, secondChromo) {
        const children = [];

        const crossoverProbability = Math.random();
        const firstMutationProbability = Math.random();
        const secondMutationProbability = Math.random();

        let firstChild = new Array(firstChromo.genome.length + 1).join('a');
        let secondChild = new Array(firstChromo.genome.length + 1).join('a');

        // Position based crossover

        if (crossoverProbability < this.crossoverProbability) {
            const randomPositions = [];
            for (let i = 0;i < this.crossoverPoints;i++) {
                let index = -1;
                do {
                    index = getRandomInt(0, firstChromo.genome.length - 1);
                } while (randomPositions.includes(index));
                randomPositions.push(index);
            }

            const remainingFirstCharacters = firstChromo.genome.split('');
            const remainingSecondCharacters = secondChromo.genome.split('');

            for (const pos of randomPositions) {
                const c1 = firstChromo.genome[pos];
                const c2 = secondChromo.genome[pos];
                firstChild = setCharAt(firstChild, pos, c1[0]);
                secondChild = setCharAt(secondChild, pos, c2[0]);
                // Remove from remaining
                const indFirst = remainingFirstCharacters.indexOf(c1);
                remainingFirstCharacters.splice(indFirst, 1);
                const indSecond = remainingSecondCharacters.indexOf(c2);
                remainingSecondCharacters.splice(indSecond, 1);
            }

            let j = 0;
            for (let i = 0;i < firstChromo.genome.length;i++) {
                if (!randomPositions.includes(i)) {
                    firstChild = setCharAt(firstChild, i,
                         remainingFirstCharacters[j]);
                    secondChild = setCharAt(secondChild, i,
                        remainingSecondCharacters[j]);
                    j++;
                }
            }
        } else {
            for (let i = 0; i < firstChromo.genome.length; i++)
            {
                firstChild = setCharAt(firstChild, i,
                    firstChromo.genome[i]);
                secondChild = setCharAt(secondChild, i,
                    firstChromo.genome[i]);
            }
        }
        // First child mutation
        if (firstMutationProbability < this.mutationProbability)
        {
            const oldPosition = getRandomInt(0, firstChromo.genome.length - 1);
            let newPosition = -1;
            do
            {
                newPosition = getRandomInt(0, firstChromo.genome.length - 1);
            } while (oldPosition == newPosition);
            const oldChar = firstChild[oldPosition];
            firstChild = setCharAt(firstChild, oldPosition,
                firstChild[newPosition]);
            firstChild = setCharAt(firstChild, newPosition,
                oldChar);
        }
        // Second child mutation
        if (secondMutationProbability < this.mutationProbability)
        {
            const oldPosition = getRandomInt(0, secondChromo.genome.length - 1);
            let newPosition = -1;
            do
            {
                newPosition = getRandomInt(0, secondChromo.genome.length - 1);
            } while (oldPosition == newPosition);
            const oldChar = secondChild[oldPosition];
            secondChild = setCharAt(secondChild, oldPosition,
                secondChild[newPosition]);
            secondChild = setCharAt(secondChild, newPosition,
                oldChar);
        }

        children[0] = new Chromosome(firstChild, this.cipherText);
        children[1] = new Chromosome(secondChild, this.cipherText);

        return children;
    }

    newGeneration() {
        const newPopulation = [];
        const elitismAmount = Math.ceil(this.populationSize * (this.elitismPercentage / 100));
        const childrenNumber = this.populationSize - elitismAmount;

        if (elitismAmount > 0) {
            newPopulation.concat(this.population.slice(0, elitismAmount));
        }
        if (childrenNumber > 0) {
            let firstTournamentMembers = [];
            let secondTournamentMembers = [];
            const probabilities = [];
            probabilities.push(this.tournamentWinnerProbability);
            let runningProbability = probabilities[0];
            for (let i = 1;i < this.tournamentSize;i++) {
                runningProbability *= (1 - this.tournamentWinnerProbability);
                probabilities.push(probabilities[i - 1] + runningProbability);
            }

            for (let i = 0; i < Math.ceil(childrenNumber / 2); i++) {
                firstTournamentMembers = [];
                secondTournamentMembers = [];

                for (let j = 0; j < this.tournamentSize; j++) {
                    let individual = null;
                    do {
                            individual = this.population[getRandomInt(0, this.populationSize - 1)];
                       } while (firstTournamentMembers.includes(individual));
                    firstTournamentMembers.push(individual);
                    do {
                        individual = this.population[getRandomInt(0, this.populationSize - 1)];
                   } while (secondTournamentMembers.includes(individual) || firstTournamentMembers.includes(individual));
                   secondTournamentMembers.push(individual);
                }

                // Sort members by fitness
                firstTournamentMembers.sort((a, b) => a.fitness > b.fitness);
                secondTournamentMembers.sort((a, b) => a.fitness > b.fitness);

                const firstProbability = Math.random();
                const secondProbability = Math.random();
                let firstWinner = null;
                let secondWinner = null;
                for (let j = 0; j < this.tournamentSize; j++) {
                    if (firstProbability <= probabilities[j] || j === this.tournamentSize - 1)
                    {
                        firstWinner = firstTournamentMembers[j];
                        break;
                    }
                }
                for (let j = 0; j < this.tournamentSize; j++) {
                    if (secondProbability <= probabilities[j] || j === this.tournamentSize - 1)
                    {
                        secondWinner = secondTournamentMembers[j];
                        break;
                    }
                }
                
                const children = this.createChildren(firstWinner, secondWinner);
                newPopulation.push(children[0]);
                if (newPopulation.length < this.populationSize) {
                    newPopulation.push(children[1]);
                }
            }
        }
        newPopulation.sort((a, b) => a.fitness < b.fitness);
        this.population = newPopulation;
        this.currentGeneration += 1;
    }
}

module.exports.Chromosome = Chromosome;
module.exports.GeneticCracker = GeneticCracker;