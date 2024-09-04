import { createContext } from "react";
import { Encrypt, Decrypt } from "../Cryptography/Crypto";

export function addContextToLocalStorage(payLoad) {
  let json = JSON.stringify(payLoad);
  let encryptedRes = Encrypt(json);
  localStorage.setItem("pload", encryptedRes);
}

export function getContext() {
  let encDat = localStorage.getItem("pload");
  if (encDat === undefined || encDat === null) {
    deleteLocalStorage();
    if (window.location.href !== `${window.location.origin}/login`) {
      // window.location.href = `${window.location.origin}/login`;
    }
  } else {
    let encryptedRes = Decrypt(encDat);
    return JSON.parse(encryptedRes);
  }
}

export function deleteLocalStorage() {
  localStorage.removeItem("pload");
}

// loader context
// @ts-ignore
export const LoaderContext = createContext<any>();
