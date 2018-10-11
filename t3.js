#!/usr/bin/env node
'use strict';

const genetic = require('./task3/genetic');

const cipherText = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYOYULULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPHEUEDUEHQMYWPEVWSSYOLHULPPCVWPLULSPVWDVWGYUOEPVYWEKYAPSYOLEFFVPVYWETULBEUF';

// const cipherText = 'KHOORZRUOG';

// Use statistical attack to crack the cipher

// Compute frequency of each letter in text

/*const cipherFreqs = {};

for (let i = 0;i < cipherText.length;i++) {
    if (cipherFreqs[cipherText[i]] === undefined) {
        cipherFreqs[cipherText[i]] = 1.0;
    } else {
        cipherFreqs[cipherText[i]] += 1.0;
    }
}


for (let f in cipherFreqs) {
    cipherFreqs[f] = cipherFreqs[f] / cipherText.length;
}

console.log(cipherFreqs);

// Calculate correlation of frequencies

/*const aCharCode = 65;
const zCharCode = 90;

const correlations = []; 

for (let i = 0;i < 26;i++) {
    correlations[i] = 0.0;
    for (let c in cipherFreqs) {
        const shift = (c.charCodeAt(0) - 65 - i);
        let ind = 0;
        if (shift < 0) {
            ind = String.fromCharCode(91 - i);
        } else {
            ind = String.fromCharCode(shift + 65);
        }
        const p = engFregs[ind];
        //correlations[i] += cipherFreqs[c]
        // * engFregs[c] * ((c.charCodeAt(0) - 65) - i);
        correlations[i] += cipherFreqs[c] * p;
        console.log(`cf ${cipherFreqs[c]} ef ${engFregs[c]} c ${c}`);
        console.log(c.charCodeAt(0) - 65);
    }
}

console.log(correlations);*/

//'ekmflgdqvzntowyhxuspaibrcj'
// 'abcdefghijklmnopqrstuvwxyz'

const chromosome = new genetic.Chromosome(
  'ekmflgdqvzntowyhxuspaibrcj',
  cipherText
);

console.log(`Chromosome fitness is ${chromosome.fitness}`);

const cracker = new genetic.GeneticCracker(cipherText);

console.log(cracker.run(485, 275))