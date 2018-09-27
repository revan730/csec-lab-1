'use strict';

const MonoAlphabeticCipher = require('text-ciphers').MonoAlphabeticCipher;

// Genetic algorithm implementation for substitution cipher decryption

const LOG_BASE = 2;

const calculateFitness = (genome, cipherText, engFreqs) => {
    let fitness = 0.0;
    const mCipher = new MonoAlphabeticCipher({
        substitution: genome
    });

    console.log(`genome is ${genome}`);
    const decryptedText = mCipher.decipher(cipherText.toLowerCase()).toUpperCase();
    console.log("decryptedText");
    console.log(decryptedText);

    

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
    console.log(decryptedFreqs);
    for (let c in decryptedFreqs) {
        //console.log(`char ${c} dec ${decryptedFreqs[c]} eng ${engFreqs[c]} log ${Math.log2(engFreqs[c])}`);
        fitness += Math.abs(decryptedFreqs[c] - engFreqs[c]);
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
    constructor(genome, cipherText, engFreqs) {
        this.genome = genome;
        this.cipherText = cipherText;
        this.engFreqs = engFreqs;
        this.fitness = calculateFitness(genome, cipherText, engFreqs);
    }
}

class GeneticCracker {
    constructor(cipherText, engFreqs) {
        this.generations = 1000;
        this.populationSize = 10;
        this.elitismPercentage = 15;
        this.tournamentSize = 20;
        this.tournamentWinnerProbability = 0.75;
        this.crossoverProbability = 0.65;
        this.mutationProbability = 0.2;
        this.crossoverPoints = 5;
        this.currentGeneration = 0;
        this.population = [];
        this.cipherText = cipherText;
        this.engFreqs = engFreqs;
    }

    createInitialPopulation() {
        for (let i = 0;i < this.populationSize;i++) {
            const genome = MonoAlphabeticCipher.createKeyRandom();
            const chromosome = new Chromosome(genome, this.cipherText, this.engFreqs);
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
                    index = getRandomInt(0, firstChromo.genome.length);
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
            const oldPosition = getRandomInt(0, firstChromo.genome.length);
            let newPosition = -1;
            do
            {
                newPosition = getRandomInt(0, firstChromo.genome.length);
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
            const oldPosition = getRandomInt(0, secondChromo.genome.length);
            let newPosition = -1;
            do
            {
                newPosition = getRandomInt(0, secondChromo.genome.length);
            } while (oldPosition == newPosition);
            const oldChar = secondChild[oldPosition];
            secondChild = setCharAt(secondChild, oldPosition,
                secondChild[newPosition]);
            secondChild = setCharAt(secondChild, newPosition,
                oldChar);
        }

        children[0] = new Chromosome(firstChild, this.cipherText, this.engFreqs);
        children[1] = new Chromosome(secondChild, this.cipherText, this.engFreqs);

        return children;
    }
}

module.exports.Chromosome = Chromosome;
module.exports.GeneticCracker = GeneticCracker;