import SimpleWebAuthnServer from "@simplewebauthn/server";
import { getPasskeyByUserID } from "$lib/db";
import { User, type Passkey } from "$lib/db";
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


import { error } from "@sveltejs/kit";







export async function load() {

	const user = new User({
		username: "test",
		id: 1
	})
	const passkey = await getPasskeyByUserID(user.id);
	console.log({ passkey })

	const userPasskeys = (id: number): Passkey[] => {
		if (passkey instanceof Error) {
			return [];
		}
		return [passkey];
	}

	/**
	 * Human-readable title for your website
	 */
	const rpName = "SimpleWebAuthn Example";
	/**
	 * A unique identifier for your website. 'localhost' is okay for
	 * local dev
	 */
	const rpID = "localhost";

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

	const authOptions: PublicKeyCredentialRequestOptionsJSON =
		await generateAuthenticationOptions({
			rpID,
			// Require users to use a previously-registered authenticator
			allowCredentials: userPasskeys(user.id).map((passkey) => ({
				id: passkey.b64id,
				// transports: passkey.transports,
			})),
		});


	if (passkey instanceof Error) {
		return {
			options,
			passKeyError: passkey.message
		}
	}
	const publicKeyStr = passkey.publicKey.toString("base64");
	return {
		options,
		authOptions,
		passkey: {
			id: passkey.b64id,
			publicKeyStr: publicKeyStr,
			counter: passkey.counter,
		}
	};
}
