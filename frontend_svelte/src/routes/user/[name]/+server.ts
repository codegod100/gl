import { User, getUser, type Passkey } from "$lib/db";
import { Effect } from "effect"
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
    const res = getUser(params.name);
    const program = Effect.match(res, {
        onSuccess: (user) => Response.json(user),
        onFailure: (e) => json({ error: e.message }, { status: 404 })
    })
    return Effect.runPromise(program)
}