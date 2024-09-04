
import CryptoJS from "crypto-js";
import { JsonResponseModel } from "../Models/JsonResponseModel";

export function Encrypt(value: any) {
  const encryptedString = CryptoJS.AES.encrypt(value, "REACTJS").toString();
  return encryptedString;
}

export async function Decrypt(value: any) {
  const decryptedWordArray = CryptoJS.AES.decrypt(value, "REACTJS");
  const decryptedString = await decryptedWordArray.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}

export const APICall: JsonResponseModel | any = async (
  apiUrl: any,
  methodType: any,
  inputParam: any,
  enableEncryption: boolean = true,
  userAuthToken: string = ""
) => {
  if (enableEncryption) {
    try {
      inputParam = {key : "value"}
      let response = await fetch(apiUrl, {
        method: methodType,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
       //   Authorization: "Bearer " + userAuthToken,
        },
       body: methodType == 'GET' ? null : JSON.stringify({inputParam}),
      });
      console.log(response)
      const responseBody: JsonResponseModel =
        (await response.json()) as JsonResponseModel;
      console.log(responseBody)
      return responseBody;
    } catch (error) {
      console.log(error)
      return JSON.stringify(error);
    }
  }
};
