import { Sequelize, DataTypes } from "sequelize";

export function new_database(dialect = "sqlite", storage = "test.db") {
	const sequelize = new Sequelize({
		dialect,
		storage,
	});
	return sequelize;
}

export function define_table(db, table_name, args) {
	const vals = {}
	for (const [k,v] of args){
		if (v === "string") {
			vals[k] = DataTypes.STRING
		}
	}
	return db.define(table_name, vals);
}

export async function sync_db(db) {
	return await db.sync();
}


export async function insert(table, args){
	const vals = {}
	for (const [k,v] of args){
			vals[k] = v
	}
	console.log(vals)
	return await table.create(vals);
}