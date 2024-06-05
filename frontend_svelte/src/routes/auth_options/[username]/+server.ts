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

export async function GET({ params }) {
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
    const authOptions: PublicKeyCredentialRequestOptionsJSON =
        await generateAuthenticationOptions({
            rpID,
            // Require users to use a previously-registered authenticator
            allowCredentials: userPasskeys(user.id).map((passkey) => ({
                id: passkey.b64id,
                // transports: passkey.transports,
            })),
        });

    const publicKeyStr = passkey.publicKey.toString("base64");




    return Response.json({
        authOptions, passkey: {
            id: passkey.b64id,
            publicKeyStr: publicKeyStr,
            counter: passkey.counter,
        }
    })
}