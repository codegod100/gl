import { Sequelize, DataTypes, Model } from "sequelize";
import { Result } from "$lib/result"
import type {
	AuthenticatorTransportFuture,
	CredentialDeviceType,
	Base64URLString,
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "test.db",
});



export class User extends Model {
	declare username: string;
	declare birthday: Date;
	declare hash: string;
	declare id: number;
	// declare publicKey: JsonWebKey;
	declare privateKey: JsonWebKey;
}
User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		username: DataTypes.STRING,
		hash: DataTypes.STRING,
		birthday: DataTypes.DATE,
		// publicKey: DataTypes.JSON,
		privateKey: DataTypes.JSON,
	},
	{ sequelize, modelName: "User" },
);

export class Session extends Model {
	declare id: string;
	declare user_id: number;
}
Session.init({
	id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	user_id: DataTypes.INTEGER
},
	{ sequelize, modelName: "Session" },)

export class Passkey extends Model {
	declare id: number;
	declare b64id: string;
	declare webauthnUserID: Base64URLString;
	declare publicKey: Buffer;
	declare counter: number;
	declare deviceType: CredentialDeviceType;
	declare backedUp: boolean;
	declare user_id: number;
}
Passkey.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
		b64id: DataTypes.STRING,
		webauthnUserID: DataTypes.STRING,
		publicKey: DataTypes.BLOB,
		counter: DataTypes.INTEGER,
		deviceType: DataTypes.STRING,
		backedUp: DataTypes.BOOLEAN,
	},
	{ sequelize, modelName: "Passkey" },
);

await sequelize.sync();
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
export async function insertPasskey({
	webauthnUserID,
	publicKey,
	counter,
	deviceType,
	backedUp,
	transports,
	user_id,
	b64id,
}: {
	webauthnUserID: Base64URLString;
	publicKey: Buffer;
	counter: number;
	deviceType: CredentialDeviceType;
	backedUp: boolean;
	transports?: AuthenticatorTransportFuture[];
	user_id: number;
	b64id: string;
}) {
	await Passkey.create({
		webauthnUserID,
		publicKey,
		counter,
		deviceType,
		backedUp,
		transports,
		user_id,
		b64id
	});
}

export async function getPasskeyByUserID(id: number): Promise<Passkey | Error> {
	const record = await Passkey.findOne({ where: { user_id: id } });
	if (!record) {
		return new Error("Passkey not found")
	}
	return record
}
export async function getPasskeyByPublicKey(key: Buffer): Promise<Passkey | Error> {
	const record = await Passkey.findOne({ where: { publicKey: key } })
	if (!record) {
		return new Error("Passkey not found")
	}
	return record
}

export async function getAllUsers() {
	return await User.findAll();
}

export async function getUser(username: string): Promise<User | Error> {
	const record = await User.findOne({ where: { username } });
	if (!record) {
		return new Error("User not found")
	}
	return record
}
