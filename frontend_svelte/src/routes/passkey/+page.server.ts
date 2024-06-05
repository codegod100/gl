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






}
