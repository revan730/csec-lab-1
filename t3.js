'use strict';

const cipherText = 'EFFPQLEKVTVPCPYFLMVHQLUEWCNVWFYGHYTCETHQEKLPVMSAKSPVPAPVYWMVHQLUSPQLYWLASLFVWPQLMVHQLUPLRPSQLULQESPBLWPCSVRVWFLHLWFLWPUEWFYOTCMQYSLWOYWYETHQEKLPVMSAKSPVPAPVYWHEPPLUWSGYULEMQTLPPLUGUYOLWDTVSQETHQEKLPVPVSMTLEUPQEPCYAMEWWYOYULULTCYWPQLSEOLSVOHTLUYAPVWLYGDALSSVWDPQLNLCKCLRQEASPVILSLEUMQBQVMQCYAHUYKEKTCASLFPYFLMVHQLUHULIVYASHEUEDUEHQBVTTPQLVWFLRYGMYVWMVFLWMLSPVTTBYUNESESADDLSPVYWCYAMEWPUCPYFVIVFLPQLOLSSEDLVWHEUPSKCPQLWAOKLUYGMQEUEMPLUSVWENLCEWFEHHTCGULXALWMCEWETCSVSPYLEMQYGPQLOMEWCYAGVWFEBECPYASLQVDQLUYUFLUGULXALWMCSPEPVSPVMSBVPQPQVSPCHLYGMVHQLUPQLWLRPHEUEDUEHQMYWPEVWSSYOLHULPPCVWPLULSPVWDVWGYUOEPVYWEKYAPSYOLEFFVPVYWETULBEUF';

//const cipherText = 'KHOORZRUOG';

const engFregs = {
    'A': 0.080,
    'B': 0.015,
    'C': 0.030,
    'D': 0.040,
    'E': 0.130,
    'F': 0.020,
    'G': 0.015,
    'H': 0.060,
    'I': 0.065,
    'J': 0.005,
    'K': 0.005,
    'L': 0.035,
    'M': 0.030,
    'N': 0.070,
    'O': 0.080,
    'P': 0.020,
    'Q': 0.002,
    'R': 0.065,
    'S': 0.060,
    'T': 0.090,
    'U': 0.030,
    'V': 0.010,
    'W': 0.015,
    'X': 0.005,
    'Y': 0.020,
    'Z': 0.002,
}
// Use statistical attack to crack the cipher

// Compute frequency of each letter in text

const cipherFreqs = {};

for (let i = 0;i < cipherText.length;i++) {
    if (cipherFreqs[cipherText[i]] === undefined) {
        cipherFreqs[cipherText[i]] = 1.0;
    } else {
        cipherFreqs[cipherText[i]] += 1.0;
    }
}

//console.log(cipherFreqs);

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