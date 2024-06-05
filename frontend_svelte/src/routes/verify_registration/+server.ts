import {
    verifyRegistrationResponse
} from "@simplewebauthn/server";
import fs from "node:fs"
import { Passkey } from "$lib/db"
import { getUser, insertUser, insertPasskey } from "$lib/db";
// import { Buffer } from "node:buffer"
export async function POST({ request }) {
    const data = await request.json();
    const verify = await verifyRegistrationResponse({
        response: data.reg,
        expectedChallenge: data.options.challenge,
        expectedOrigin: "http://localhost:5173",
        expectedRPID: "localhost",
    })
    console.log(verify)
    const { verified, registrationInfo } = verify
    if (!registrationInfo) return Response.json({ verified })
    const {
        credentialID,
        credentialPublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
    } = registrationInfo;


    let user = await getUser("test")
    if (user instanceof Error) {
        await insertUser({ username: "test", hash: "test" })
    }
    user = await getUser("test")
    if (user instanceof Error) {
        return Response.error()
    }
    insertPasskey({
        // `user` here is from Step 2
        // Created by `generateRegistrationOptions()` in Step 1
        webauthnUserID: data.options.user.id,
        // The public key bytes, used for subsequent authentication signature verification
        publicKey: Buffer.from(credentialPublicKey),
        // The number of times the authenticator has been used on this site so far
        counter,
        // Whether the passkey is single-device or multi-device
        deviceType: credentialDeviceType,
        // Whether the passkey has been backed up in some way
        backedUp: credentialBackedUp,
        // `body` here is from Step 2
        transports: data.reg.transports,
        user_id: user.id,
        b64id: credentialID
    })
    await user.save()
    return Response.json({})
}