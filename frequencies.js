const bigrams = require('./bigrams.json');
const trigrams = require('./trigrams.json');

const totalBigrams = 2819662855499;
const totalTrigrams = 2098121156991;	

Object.keys(bigrams).forEach(bigram => {
  bigrams[bigram] = bigrams[bigram]['*/*'] / totalBigrams;
});
Object.keys(trigrams).forEach(trigram => {
  trigrams[trigram] = trigrams[trigram]['*/*'] / totalTrigrams;
});

const unigrams = {
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

// console.log(Object.keys(trigrams).reduce((prev, cur) => prev += trigrams[cur], 0))
// console.log(Object.keys(bigrams).reduce((prev, cur) => prev += bigrams[cur], 0))


module.exports = {
  bigrams,
  unigrams,
  trigrams
};