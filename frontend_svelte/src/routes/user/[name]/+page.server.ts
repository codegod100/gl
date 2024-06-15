import { User, getUser, type Passkey } from "$lib/db";
import { Effect, Console } from "effect"
import { error } from '@sveltejs/kit';
import { NodeSdk } from "@effect/opentelemetry"
import {
    ConsoleSpanExporter,
    BatchSpanProcessor
} from "@opentelemetry/sdk-trace-base"

const NodeSdkLive = NodeSdk.layer(() => ({
    resource: { serviceName: "example" },
    spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

export function load({ params }) {
    const res = getUser(params.name).pipe(Effect.withSpan(`in /user/${params.name}`));
    const program = Effect.match(res, {
        onSuccess: (user) => ({ user: user.toJSON() }),
        onFailure: (error) => ({ error: error.message })
    })
    return Effect.runPromise(program.pipe(Effect.provide(NodeSdkLive)))
}
