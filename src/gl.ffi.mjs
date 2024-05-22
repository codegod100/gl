import { Ok, Error } from "./gleam.mjs";
import * as ed from '@noble/ed25519';

export async function sign(message) {
    message = message.buffer
    // console.log(message)
    let privKey = ed.utils.randomPrivateKey();
    // console.log(privKey)
    const pubKey = await ed.getPublicKeyAsync(privKey);
    // console.log(pubKey)
    const signature = await ed.signAsync(message, privKey);
    // console.log(signature)
    return [pubKey, signature];
}

export async function isValid(pubKey, signature, message) {
    console.log(pubKey, signature, message)
    return await ed.verifyAsync(signature, message.buffer, pubKey);
}



export function read_localstorage(key) {
    const value = window.localStorage.getItem(key);

    return value ? new Ok(value) : new Error(undefined);
}

export function write_localstorage(key, value) {
    window.localStorage.setItem(key, value);
}

export function prompt() {
    return window.prompt("username");
}

export function read_user(){
    return document.cookie.split("=")[1]
}