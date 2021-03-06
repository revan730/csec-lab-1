#!/usr/bin/env node
'use strict';
/*
1. Write a piece of software to attack single-byte XOR cipher which is the same as Caesar but with xor op.
*/
const ciphered = 
"]|d3gaj3r3avcvrgz}t>xvj3K\A3pzc{va=3V=t=3zg3`{|f.w3grxv3r3`gaz}t31{v..|3d|a.w13r}w?3tzev}3g{v3xvj3z`31xvj1?3k|a3g{v3uza`g3.vggva31{13dzg{31x1?3g{v}3k|a31v13dzg{31v1?3g{v}31.13dzg{31j1?3r}w3g{v}3k|a3}vkg3p{ra31.13dzg{31x13rtrz}?3g{v}31|13dzg{31v13r}w3`|3|}=3J|f3~rj3f`v3z}wvk3|u3p|z}pzwv}pv?3[r~~z}t3wz`gr}pv?3Xr`z`xz3vkr~z}rgz|}?3`grgz`gzpr.3gv`g`3|a3d{rgveva3~vg{|w3j|f3uvv.3d|f.w3`{|d3g{v3qv`g3av`f.g=";

const charMap = [];

for (let i = 0; i < ciphered.length; i++) {
  charMap.push(ciphered.charCodeAt(i));
}

let solvesArr = [];


// just trying shit
for (let i = 1; i < 27; i++) {
  solvesArr.push(charMap.map(el => String.fromCharCode(el ^ (i))));
}


// filtering obvious out
solvesArr = solvesArr.filter(el => el.reduce((prev, cur) => prev && cur.charCodeAt(0) >= 32 && cur.charCodeAt(0) <= 127, true))


// compressing char ars back to string
solvesArr.forEach((el, i, arr) => arr[i] = el.join(''));

const commonWords = ['the', 'and', 'or', 'is'];
// filtering out common words
solvesArr = solvesArr.filter(el => commonWords.reduce((prev, w) => prev && el.includes(w), true))

console.log(solvesArr)

