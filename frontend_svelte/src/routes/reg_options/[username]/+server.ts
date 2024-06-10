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

const rpName = "SimpleWebAuthn Example";
import { User, getUser, getPasskeyByUserID, type Passkey } from "$lib/db";

import { error } from "@sveltejs/kit";

const rpID = "localhost";

export async function GET({ params }) {
    const user = await getUser(params.username);
    if (user instanceof Error) {
        return error(400, "User not found")
    }
    const passkey = await getPasskeyByUserID(user.id);
    // if (passkey instanceof Error) {
    //     return error(400, "Passkey not found")
    // }
    const userPasskeys = (id: number): Passkey[] => {
        if (passkey instanceof Error) {
            return [];
        }
        return [passkey];
    }

    const options: PublicKeyCredentialCreationOptionsJSON =
        await generateRegistrationOptions({
            rpName,
            rpID,
            userName: user.username,
            // Don't prompt users for additional information about the authenticator
            // (Recommended for smoother UX)
            attestationType: "none",
            // Prevent users from re-registering existing authenticators
            excludeCredentials: userPasskeys(user.id).map((passkey) => ({
                id: passkey.b64id,
                // Optional
                // transports: passkey.transports,
            })),
            // See "Guiding use of authenticators via authenticatorSelection" below
            authenticatorSelection: {
                // Defaults
                residentKey: "preferred",
                userVerification: "preferred",
                // Optional
                // authenticatorAttachment: "platform",
            },
        });

    // const publicKeyStr = passkey.publicKey.toString("base64");

    return Response.json({
        options
    })
}