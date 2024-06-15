import { User, getUser, type Passkey } from "$lib/db";
import { Effect } from "effect"
import { error } from '@sveltejs/kit';

export function load({ params }) {
    const res = getUser(params.name);
    const program = Effect.match(res, {
        onSuccess: (data) => ({ user: data.toJSON() }),
        onFailure: (error) => ({ error: error.message })
    })
    return Effect.runPromise(program)
}