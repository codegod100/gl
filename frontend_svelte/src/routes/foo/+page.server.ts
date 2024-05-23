import { insert, read } from "$lib/db";
export async function load() {
	// await insert();
	const users = await read();
	const jane = JSON.stringify(users[0]);
	return { jane };
}
