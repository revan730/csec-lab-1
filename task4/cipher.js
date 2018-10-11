
class PolyalphabeticCipher {
    constructor() {
       this.key = [];
       this.alphabet = [];
    }
 
    setAlphabet(alphabet) {
       this.alphabet = this._alphabetToArray(alphabet);
    }
 
    setKey(key) {
       this.key = [];
       for (let i = 0; i < key.length; i++) {
          this.key.push(key.charAt(i).toUpperCase());
       }
    }
 
    encrypt(plaintext) {
       let ciphertext = "";
       for (let i = 0; i < plaintext.length; i++) {
          ciphertext += this._transformChar(
             plaintext.charAt(i),
             this.alphabet,
             this.key);
       }
       return ciphertext;
    }
 
    decrypt(ciphertext) {
       let plaintext = "";
       for (let i = 0; i < ciphertext.length; i++) {
          plaintext += this._transformChar(
             ciphertext.charAt(i),
             this.key,
             this.alphabet);
       }
       return plaintext;
    }
 
    _alphabetToArray(alphabet) {
       let alphabetArray = [];
       for (let i = 0; i < alphabet.length; i++) {
          alphabetArray.push(alphabet.charAt(i).toUpperCase());
       }
       return alphabetArray;
    }
 
    _transformChar(char, charArray, transformCharArray) {
       let index = charArray.findIndex(function(element) {
          return element == char;
       });
 
       if (index === -1) {
          return char;
       }
       else {
          return transformCharArray[index];
       }
    }
 }

 module.exports = PolyalphabeticCipher;