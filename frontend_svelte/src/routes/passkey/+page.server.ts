import SimpleWebAuthnServer from "@simplewebauthn/server";
import type { Passkey, UserModel } from "$lib/passkey";
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





const user: UserModel = {
	id: "1",
	username: "test",
};

const userPasskeys: Passkey[] = [];

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
		excludeCredentials: userPasskeys.map((passkey) => ({
			id: passkey.id,
			// Optional
			transports: passkey.transports,
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
		allowCredentials: userPasskeys.map((passkey) => ({
			id: passkey.id,
			transports: passkey.transports,
		})),
	});

export function load() {
	return {
		options,
		authOptions,
		user
	};
}
