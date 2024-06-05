import { User, getUser, type Passkey } from "$lib/db";

export function GET({ params }) {
    const res = getUser(params.name);
    if (res instanceof Error) {
        return new Response(res.message, {
            status: 404
        })
    }
    return Response.json({})
}