import {
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { getUser, getPasskeyByUserID } from "$lib/db.js";

export async function POST({ request }) {
    console.log("in auth")
    const data = await request.json()
    console.log({ data })
    const publicKey = Buffer.from(data.passkey.publicKeyStr, "base64")
    try {
        const res = await verifyAuthenticationResponse({
            response: data.auth,
            expectedChallenge: data.authOptions.challenge,
            expectedOrigin: "http://localhost:5173",
            expectedRPID: "localhost",
            authenticator: { credentialID: data.passkey.id, credentialPublicKey: publicKey, counter: data.passkey.counter, transports: data.passkey.transports },
        })
        console.log({ res })
        return Response.json(res.verified)
    } catch (e) {
        console.log({ e })
        return Response.json(false)
    }

}