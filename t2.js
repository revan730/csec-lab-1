#!/usr/bin/env node
'use strict';

const hextob = require('hex-to-binary')

/*
Now try a repeating-key XR cipher. 
E.g. it should take a string "hello world" and, 
given the key is "key", xor the first letter "h" with "k", 
then xor "e" with "e", then "l" with "y", and then xor next char "l" with "k" again, 
then "o" with "e" and so on. 
You may use index of coincidence, Hamming distance, Kasiski examination, 
statistical tests or whatever method you feel would show the best result.

*/


let ciphered = 
"1c41023f564b2a130824570e6b47046b521f3f5208201318245e0e6b40022643072e13183e51183f5a1f3e4702245d4b285a1b23561965133f2413192e571e28564b3f5b0e6b50042643072e4b023f4a4b24554b3f5b0238130425564b3c564b3c5a0727131e38564b245d0732131e3b430e39500a38564b27561f3f5619381f4b385c4b3f5b0e6b580e32401b2a500e6b5a186b5c05274a4b79054a6b67046b540e3f131f235a186b5c052e13192254033f130a3e470426521f22500a275f126b4a043e131c225f076b431924510a295f126b5d0e2e574b3f5c4b3e400e6b400426564b385c193f13042d130c2e5d0e3f5a086b52072c5c192247032613433c5b02285b4b3c5c1920560f6b47032e13092e401f6b5f0a38474b32560a391a476b40022646072a470e2f130a255d0e2a5f0225544b24414b2c410a2f5a0e25474b2f56182856053f1d4b185619225c1e385f1267131c395a1f2e13023f13192254033f13052444476b4a043e131c225f076b5d0e2e574b22474b3f5c4b2f56082243032e414b3f5b0e6b5d0e33474b245d0e6b52186b440e275f456b710e2a414b225d4b265a052f1f4b3f5b0e395689cbaa186b5d046b401b2a500e381d61";

const bin = hextob(ciphered);


const hammings = [];

for (let n = 8; n < ciphered.length / 4; n += 8) {
  let chunk1 = bin.slice(0, n);
  let chunk2 = bin.slice(n, n * 2)

  hammings[n] = {
    n, len: 0
  }

  for (let i = 0; i < n; i++) {
    if (chunk1.charAt(i) != chunk2.charAt(i)) {
      hammings[n].len++;
    }
  }
  // hammings[n].len = hammings[n].len / n;


  chunk1 = bin.slice(n * 2, n * 3);
  chunk2 = bin.slice(n * 3, n * 4)

  // console.log(chunk1, chunk2)

  for (let i = 0; i < n; i++) {
    if (chunk1.charAt(i) != chunk2.charAt(i)) {
      hammings[n].len++;
    }
  }
  hammings[n].len /= 2
  hammings[n].len /= n;
}

hammings.sort((a, b) => a.len - b.len)

const keysize = hammings[0].n;

const keysizeBytes = keysize / 8;

console.log('probably the key size is', keysize, 'bytes')

// Now lets crack this clubberfuck

const scores = {
  'a': 834,
  'b': 154,
  'c': 273,
  'd': 414,
  'e': 1260,
  'f': 203,
  'g': 192,
  'h': 611,
  'i': 671,
  'j': 23,
  'k': 87,
  'l': 424,
  'm': 253,
  'n': 680,
  'o': 770,
  'p': 166,
  'q': 9,
  'r': 568,
  's': 611,
  't': 937,
  'u': 285,
  'v': 106,
  'w': 234,
  'x': 20,
  'y': 204,
  'z': 6,
  ' ': 2320
}

const score = (s) => {
  let str = s.toLowerCase();
  let res = 0;
  for (let i = 0; i < s.length; i++) {
    if (scores[str[i]] !== undefined) {
      res += scores[str[i]];
    }
  }
  return res;
}

const xor = (s, k) => {
  let result = '';
  for (let i = 0; i < s.length; i++) {
    result += String.fromCharCode(s.charCodeAt(i) ^ k);
  }
  return result;
}

const sliceStr = (str, start, step) => {
  let res = '';
  for (let i = start; i < str.length; i += step) {
    res += str[i];
  }
  return res;
}

const hex2a = (hex) => {
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

const keyBytes = new Array(keysizeBytes);


for (let i = 0; i < keysizeBytes; i++) {
  const slice = sliceStr(hex2a(ciphered), i, keysizeBytes);
  // console.log(slice);
  let xored = new Array(256);
  for (let j = 0; j < 256; j++) {
    xored[j] = score(xor(slice, j));
  }
  xored = xored.map((el, i) => ({byte: i, score: el}));
  xored.sort((a, b) => b.score - a.score);

  keyBytes[i] = xored[0].byte;
}


console.log("key is ");

let key = '';
for (let i = 0; i < keyBytes.length;i++) {
  key += String.fromCharCode(keyBytes[i]);
}
console.log(key);


const cypheredAscii = hex2a(ciphered);
let decoded = '';
for (let i = 0;i < cypheredAscii.length;) {
  for (let j = 0;j < keyBytes.length;j++) {
    decoded += xor(cypheredAscii[i], keyBytes[j]);
    i++;
    if (i >= cypheredAscii.length) {
      break;
    }
  }
}

console.log(decoded);
