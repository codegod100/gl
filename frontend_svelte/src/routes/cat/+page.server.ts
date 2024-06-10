
import { init, Wasmer } from "@wasmer/sdk";
import fs from "node:fs"



export async function load({ setHeaders }) {
    await init();
    const bin = fs.readFileSync("./main.wasm")
    const pkg = await Wasmer.fromFile(bin);
    // const instance = await pkg.entrypoint.run({
    //     args: ["-c", "print('Hello, World!')"],
    // });

    // const { code, stdout } = await instance.wait();
    setHeaders({ "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" })
}