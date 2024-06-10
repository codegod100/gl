import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";


import { User, getUser, getPasskeyByUserID, type Passkey } from "$lib/db";

import { error } from "@sveltejs/kit";

const rpID = "localhost";
let challenge: string | undefined
export async function GET({ params, url }) {

    const c = url.searchParams.get("challenge")
    if (c) {
        challenge = c
    }
    const user = await getUser(params.username);
    if (user instanceof Error) {
        return error(400, "User not found")
    }
    const passkey = await getPasskeyByUserID(user.id);
    if (passkey instanceof Error) {
        return error(400, "Passkey not found")
    }
    const userPasskeys = (id: number): Passkey[] => {
        if (passkey instanceof Error) {
            return [];
        }
        return [passkey];
    }
    console.log({ challenge })
    const authOptions: PublicKeyCredentialRequestOptionsJSON =
        await generateAuthenticationOptions({
            challenge,
            rpID,
            // Require users to use a previously-registered authenticator
            allowCredentials: userPasskeys(user.id).map((passkey) => ({
                id: passkey.b64id,
                // transports: passkey.transports,
            })),
        });
    console.log({ chal: authOptions.challenge })
    const publicKeyStr = passkey.publicKey.toString("base64");




    return Response.json({
        authOptions, passkey: {
            id: passkey.b64id,
            publicKeyStr: publicKeyStr,
            counter: passkey.counter,
        }
    })
}