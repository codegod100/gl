import SimpleWebAuthnServer from "@simplewebauthn/server";
import { getPasskeyByUserID, Session, User } from "$lib/db";
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







export async function load({ cookies }) {
	const session_id = cookies.get("session_id")
	if (session_id) {
		const session = await Session.findOne({ where: { id: session_id } })
		if (session) {
			const user = await User.findOne({ where: { id: session.user_id } })
			if (user instanceof User) {
				return ({ username: user.username })

			}
		}
	}





}
