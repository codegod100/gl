import {
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON, AuthenticatorAssertionResponseJSON } from '@simplewebauthn/types';
import { getUser, getPasskeyByUserID, Session, getPasskeyByPublicKey } from "$lib/db.js";
import { verifySignature, isoBase64URL, isoUint8Array, toHash } from "$lib/webauthn_util"
import { v4 } from "uuid"

async function verify(response: AuthenticatorAssertionResponseJSON, publicKey: Buffer) {
    const authDataBuffer = isoBase64URL.toBuffer(
        response.authenticatorData,
    );
    console.log({ authenticator_data: response.authenticatorData })
    console.log({ client_data: response.clientDataJSON })
    const clientDataHash = await toHash(
        isoBase64URL.toBuffer(response.clientDataJSON),
    );
    const data = isoUint8Array.concat([authDataBuffer, clientDataHash]);
    const signature = isoBase64URL.toBuffer(response.signature);
    const credentialPublicKey = publicKey
    return await verifySignature({ signature, data, credentialPublicKey })
}
export async function POST({ request, cookies }) {
    const data = await request.json()
    const publicKey = Buffer.from(data.passkey.publicKeyStr, "base64")
    const response: AuthenticationResponseJSON = data.auth
    const authOptions: PublicKeyCredentialRequestOptionsJSON = data.authOptions
    const expectedChallenge = authOptions.challenge
    const v = await verify(response.response, publicKey)
    console.log({ v })
    try {
        const res = await verifyAuthenticationResponse({
            response,
            expectedChallenge,
            expectedOrigin: "http://localhost:5173",
            expectedRPID: "localhost",
            authenticator: { credentialID: data.passkey.id, credentialPublicKey: publicKey, counter: data.passkey.counter, transports: data.passkey.transports },
        })

        console.log({ res })
        if (res.verified) {
            const passkey = await getPasskeyByPublicKey(publicKey)
            if (passkey instanceof Error) {
                return Response.json(false)
            }
            const id = v4()
            const user_id = passkey.user_id
            await Session.create({ id, user_id })
            cookies.set("session_id", id, { path: "/" })
        }
        return Response.json(res.verified)
    } catch (e) {
        console.log({ e })
        return Response.json(false)
    }

}