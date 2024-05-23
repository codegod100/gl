import { Sequelize, DataTypes, Model } from "sequelize";
import { Result } from "@badrap/result";
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "test.db",
});

class User extends Model {
	declare username: string;
	declare birthday: Date;
	declare hash: string;
}
User.init(
	{
		username: DataTypes.STRING,
		hash: DataTypes.STRING,
		birthday: DataTypes.DATE,
	},
	{ sequelize, modelName: "User" },
);

await sequelize.sync({ force: true });
export async function insertUser({
	username,
	hash,
}: { username: string; hash: string }) {
	await User.create({
		username,
		hash,
		birthday: new Date(),
	});
}
export async function getAllUsers() {
	return await User.findAll();
}

export async function getUser(username: string): Promise<Result<User, Error>> {
	const record = await User.findOne({ where: { username } });
	if (!record) {
		return Result.err(new Error(`User ${username} not found in database`));
	}

	return Result.ok(record);
}
