import {
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { getUser, getPasskeyByUserID } from "$lib/db.js";

export async function POST({ request }) {
    const data = await request.json() as { auth: AuthenticationResponseJSON, authOptions: PublicKeyCredentialRequestOptionsJSON, username: string };
    const user = await getUser(data.username)
    if (user instanceof Error) {
        return Response.error()
    }
    const passkey = await getPasskeyByUserID(user.id)
    if (passkey instanceof Error) {
        return Response.error()
    }
    console.log("BUFFER")
    console.log(passkey.publicKey.buffer)
    const { verified } = await verifyAuthenticationResponse({
        response: data.auth,
        expectedChallenge: data.authOptions.challenge,
        expectedOrigin: "http://localhost:5173",
        expectedRPID: "localhost",
        authenticator: { credentialID: passkey.id.toString(), credentialPublicKey: passkey.publicKey, counter: passkey.counter, transports: passkey.transports },
    })
    console.log({ verified })
    return Response.json(verified)
}