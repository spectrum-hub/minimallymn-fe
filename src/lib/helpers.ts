import { AUTH_SESSION_ID } from "../Constants";
import CryptoJS from "crypto-js"; 

export function formatPriceWithSign(num?: number, decimals = 0, noSpace = " ") {
  const number = num ?? 0;
  const roundedNumber = Number(Number(number).toFixed(decimals));
  const parts = roundedNumber.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".") + noSpace + "₮";
}

export const encryptData = (message: string): string => {
  const data = CryptoJS.AES.encrypt(message, AUTH_SESSION_ID);
  return data.toString();
};

export const decryptData = (encryptedData: string): string => {
  const decr = CryptoJS.AES.decrypt(encryptedData, AUTH_SESSION_ID);
  return decr.toString(CryptoJS.enc.Utf8);
};

export function scrollToTop() {
  window?.scrollTo?.(0, 0);
}
