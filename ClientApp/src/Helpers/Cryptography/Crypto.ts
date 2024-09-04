import CryptoES from "crypto-es";

/**
 * Encrypts string data using AES algorithm
 * @param {string} input text to be encrypted
 * @returns combined cipher text including salt + iv + encrypted text
 */
export const Encrypt = (input: string): string => {
  var combinedStr = "";
  try {
    let configObj = {
      SALT_SIZE: process.env.REACT_APP_CRYPTO_SALTSIZE,
      KEY_SIZE: process.env.REACT_APP_CRYPTO_KEYSIZE,
      REACT_APP_CRYPTO_KEY: process.env.REACT_APP_CRYPTO_KEY,
      REACT_APP_CRYPTO_SALTSIZE: process.env.REACT_APP_CRYPTO_SALTSIZE,
      REACT_APP_CRYPTO_IVSIZE: process.env.REACT_APP_CRYPTO_IVSIZE,
      REACT_APP_CRYPTO_ITERATIONS: process.env.REACT_APP_CRYPTO_ITERATIONS,
    };

    console.log(configObj);

    //generate random salt
    var salt = CryptoES.lib.WordArray.random(
      parseInt(process.env.REACT_APP_CRYPTO_SALTSIZE)
    );
    //generate key as per rfc2898 specification
    var key = CryptoES.PBKDF2(process.env.REACT_APP_CRYPTO_KEY, salt, {
      keySize: parseInt(process.env.REACT_APP_CRYPTO_KEYSIZE),
      iterations: parseInt(process.env.REACT_APP_CRYPTO_ITERATIONS),
    });
    //generate random iv
    var iv = CryptoES.lib.WordArray.random(
      parseInt(process.env.REACT_APP_CRYPTO_IVSIZE)
    );
    //create AES encryptor object
    var encryptor = CryptoES.algo.AES.createEncryptor(key, {
      iv: iv,
      padding: CryptoES.pad.Pkcs7,
      mode: CryptoES.mode.CBC,
      format: CryptoES.format.OpenSSL,
      kdf: CryptoES.kdf.OpenSSL,
    });
    //encrypt data
    var encrypted = encryptor.finalize(input);
    //combine bytes of salt + iv + encrypted
    combinedStr = salt
      .concat(iv)
      .concat(encrypted)
      .toString(CryptoES.enc.Base64);
  } catch (err) {
    console.error("Error while encrypting", err);
  }
  return combinedStr;
};
/**
 * Decrypts string data using AES algorithm
 * @param {string} input text to be decrypted
 * @returns decrypted text
 */
export const Decrypt = (input: string): string => {
  var decryptedString = "";
  try {
    //convert base64 input to CryptoES.lib.WordArray
    var inputAsWordArray = CryptoES.enc.Base64.parse(input);
    //convert CryptoES.lib.WordArray to Uint8Array for splitting salt + iv + encrypted text
    var inputAsUint8Array = WordArrayToUint8Array(inputAsWordArray);
    //split salt from input Uint8Array
    var salt = inputAsUint8Array.slice(
      0,
      parseInt(process.env.REACT_APP_CRYPTO_SALTSIZE)
    );
    //convert Uint8Array back to CryptoES.lib.WordArray for decryptor
    var saltAsWordArray = CryptoES.lib.WordArray.create(salt);
    //split iv from input Uint8Array
    var iv = inputAsUint8Array.slice(
      parseInt(process.env.REACT_APP_CRYPTO_SALTSIZE),
      parseInt(process.env.REACT_APP_CRYPTO_SALTSIZE) +
        parseInt(process.env.REACT_APP_CRYPTO_IVSIZE)
    );
    //convert Uint8Array back to CryptoES.lib.WordArray for decryptor
    var ivAsWordArray = CryptoES.lib.WordArray.create(iv);
    //split encrypted text from input Uint8Array
    var encrypted = inputAsUint8Array.slice(
      parseInt(process.env.REACT_APP_CRYPTO_SALTSIZE) +
        parseInt(process.env.REACT_APP_CRYPTO_IVSIZE)
    );
    //convert Uint8Array back to CryptoES.lib.WordArray for decryptor
    var encryptedAsWordArray = CryptoES.lib.WordArray.create(encrypted);
    //generate key as per rfc2898 specification
    var key = CryptoES.PBKDF2(
      process.env.REACT_APP_CRYPTO_KEY,
      saltAsWordArray,
      {
        keySize: parseInt(process.env.REACT_APP_CRYPTO_KEYSIZE),
        iterations: parseInt(process.env.REACT_APP_CRYPTO_ITERATIONS),
      }
    );
    //create AES decryptor object
    var decryptor = CryptoES.algo.AES.createDecryptor(key, {
      iv: ivAsWordArray,
      padding: CryptoES.pad.Pkcs7,
      mode: CryptoES.mode.CBC,
      format: CryptoES.format.OpenSSL,
      kdf: CryptoES.kdf.OpenSSL,
    });
    //decrypt data into CryptoES.lib.WordArray
    var decryptedAsWordArray = decryptor.finalize(encryptedAsWordArray);
    //convert CryptoES.lib.WordArray to UTF8 string
    decryptedString = decryptedAsWordArray.toString(CryptoES.enc.Utf8);
  } catch (err) {
    console.error("Error while decrypting", err);
  }
  return decryptedString;
};
/* Converts a WordArray to native Uint8Array */
const WordArrayToUint8Array = (
  wordArray: CryptoES.lib.WordArray
): Uint8Array => {
  var l = wordArray.sigBytes;
  var words = wordArray.words;
  var result = new Uint8Array(l);
  var i = 0 /*dst*/,
    j = 0; /*src*/
  while (true) {
    // here i is a multiple of 4
    if (i === l) {
      break;
    }
    var w = words[j++];
    // eslint-disable-next-line no-bitwise
    result[i++] = (w & 0xff000000) >>> 24;
    if (i === l) {
      break;
    }
    // eslint-disable-next-line no-bitwise
    result[i++] = (w & 0x00ff0000) >>> 16;
    if (i === l) {
      break;
    }
    // eslint-disable-next-line no-bitwise
    result[i++] = (w & 0x0000ff00) >>> 8;
    if (i === l) {
      break;
    }
    // eslint-disable-next-line no-bitwise
    result[i++] = w & 0x000000ff;
  }
  return result;
};
