import { getUser } from "$lib/db"


export async function POST({ request }) {
    const data = await request.json()
    const { username, privateKey, publicKey } = data

    let user = await getUser(username)
    if (user instanceof Error) {
        return new Response(user.message, {
            status: 404
        })
    }
    user.privateKey = privateKey
    // user.publicKey = publicKey
    user.save()

    user = await getUser(username)
    if (user instanceof Error) {
        return new Response(user.message, {
            status: 404
        })
    }

    return Response.json({
        success: true
        ,
        key: user.privateKey
    })
}