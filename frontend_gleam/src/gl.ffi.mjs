import { Ok, Error } from "./gleam.mjs";
import * as ed from '@noble/ed25519';
import { Sequelize, DataTypes } from "sequelize";

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

export function new_database(dialect = "sqlite", storage = "test.db") {
    const sequelize = new Sequelize({
        dialect,
        storage
    });
    return sequelize
}

export function define_table(db, table_name, args){
    console.log(args)
    for(const key in args) {
        if(args[key] === "string"){
            args[key] = DataTypes.STRING
        }
    }
    db.define(table_name,args)
}

export async function sync_db(db) {
    return await db.sync()
}