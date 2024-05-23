import { Sequelize, DataTypes, Model } from "sequelize";
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "test.db",
});

class User extends Model {}
User.init(
	{
		username: DataTypes.STRING,
		birthday: DataTypes.DATE,
	},
	{ sequelize, modelName: "User" },
);
// import { Sequelize, Table, Column, Model, HasMany } from "sequelize-typescript";

// @Table
// class User extends Model {
// 	@Column
// 	username: string;

// 	@Column
// 	birthday: Date;
// }

// type User = {
// 	username: string;
// 	birthday: string;
// };
// const UserTable = sequelize.define("User", {
// 	username: DataTypes.STRING,
// 	birthday: DataTypes.DATE,
// });
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

export async function getUser(): Promise<User> {
	const record = await User.findOne({ where: { username: "janedoe" } });
	if (!record) {
		throw "User not found";
	}

	return record as User;
}
