#!/usr/bin/env node
'use strict';

const genetic = require('./task4/genetic');

const ciphertext = 'MULDCLZWKLZTWTXHJCXEDQLHLXIHBLLJDQWHDQUZSOBCKMEKWXRABUGADQZOBLQNNXMJSYXDWYZFNKINEUICNJNHSUTTNQZTQNGFCYYJCNEANNXHNKSADQZVDSEDCLRSWRZSAQMFMXOJSYCFSYETSQZSBOSNMSIVNCBCWRXVBGIBAGKFMLZTWTBBFUOJESIIBGEPBRNAKMYTYOSCWTZSBYSPCCZFCMBBXTIUBSXTNMENRNKADQRFCYQZVLKFUZYZNNJZMYKONUKFWAGFCYYJUCQNNYSCENBVKNTSWOSKCMRHFYYJKLXHECSKBZIAKJSHJNKWMAWFSNXHWRICYYYJESIIBYYTFHENNNLKCMRHBOZJZYINDHOFFYZSBKEPYNXHVUNKDTDJNZIHJQIGEHSVWHWZKEYZINZTMGIVJNQNAYNHAHIIBQXFQNZJMKLTLXSNNUMPAWSHJNCPVEZZSLKONCCZRLWBCUOHJNQTTKZQASSKNCBCQCXNENKABOTFCOXGDTNZKHWKJLLDBOCSDSEKNNQNINGFCNSCMSWVNCBCQNECATDABQXKWDFTSLZTWTXFUHSHNNQNATCAXOSQVUNGDMTZSYZFFNEPMKGFCLTZVYBWFNUCWZLVKLICNNJHDYZZMAENVUNKDTDWBQXNWDSEWSMNWSSUBTRSCLXJFRQFQYYJKLXHELQZTSEVJEQFGCMTSPZSBEQFTSEGRCZSEUXNAJKJEHETSYSYNEYPDQSNYUSNSUZGDASTNTBHDXZFQLZTMLLQFUOJESSVCUCJFQICTZBCNKNPNLXEBHK';

const bin = ciphertext
  .split('')
  .map(char => char.charCodeAt(0))
  .map(charCode => charCode.toString(2))
  .join('');

  const hammings = [];

  for (let n = 8; n < bin.length / 4; n += 8) {
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
  
  console.log(`probably the key size is ${ keysize } bytes or ${ keysizeBytes } chars`)

const cracker = new genetic.GeneticCracker(ciphertext, 4);

console.log(cracker.run(485, 275))