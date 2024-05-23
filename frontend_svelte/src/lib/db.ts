import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "test.db",
});
const User = sequelize.define("User", {
	username: DataTypes.STRING,
	birthday: DataTypes.DATE,
});
await sequelize.sync();
export async function insert() {
	await User.create({
		username: "janedoe",
		birthday: "2000-01-01",
	});
}
export async function read() {
	return await User.findAll();
}

export async function getUser() {
	return await User.findOne({ where: { username: "janedoe" } });
}
