<script lang="ts">
    import {
        Application,
        Assets,
        Texture,
        Sprite,
        Graphics,
        Text,
        TextStyle,
        FillGradient,
        Color,
    } from "pixi.js";
    import { onMount } from "svelte";
    let game: HTMLDivElement;
    let app: Application;
    onMount(async () => {
        function onClick() {
            bunny.scale.x *= 1.25;
            bunny.scale.y *= 1.25;
            console.log("wee");
        }
        const graphics = new Graphics();
        //rectangle
        graphics.rect(50, 50, 100, 100);
        graphics.fill(0xde3249);

        // Draw polygon
        const path = [400, 170, 500, 260, 580, 220, 530, 370, 390, 320];
        const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7);
        const colors = [0xffffff, 0x00ff99].map((color) =>
            Color.shared.setValue(color).toNumber(),
        );

        colors.forEach((number, index) => {
            const ratio = index / colors.length;

            fill.addColorStop(ratio, number);
        });
        graphics.poly(path);
        graphics.fill(0x3500fa);
        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: "bold",
            fill: { fill },
            stroke: { color: "#4a1850", width: 5, join: "round" },
            dropShadow: {
                color: "#000000",
                blur: 4,
                angle: Math.PI / 6,
                distance: 6,
            },
            wordWrap: true,
            wordWrapWidth: 440,
        });

        const richText = new Text({
            text: "Click the stupid tranny bunny and win a prize!",
            style,
        });

        richText.x = 50;
        const texture: Texture = await Assets.load(
            "https://pixijs.com/assets/bunny.png",
        );
        const bunny = new Sprite(texture);
        bunny.on("pointerdown", onClick);
        bunny.eventMode = "static";
        app = new Application();
        // Create a PixiJS application.
        app.stage.addChild(bunny);
        app.stage.addChild(graphics);
        bunny.anchor.set(0.5);
        // bunny.setSize(75, 100);
        // Intialize the application.
        await app.init({
            background: "#1099bb",
            resizeTo: game,
            antialias: true,
        });

        // Then adding the application's canvas to the DOM body.
        // document.body.appendChild(app.canvas);
        game.replaceChildren(app.canvas);

        bunny.x = app.screen.width / 2;
        bunny.y = app.screen.height / 2;
        let direction = "left";
        let speed = 2;
        const defaultIcon = "url('https://pixijs.com/assets/bunny.png'),auto";
        // app.renderer.events.cursorStyles.default = defaultIcon;
        bunny.cursor = defaultIcon;

        app.ticker.add((time) => {
            bunny.rotation += 0.1 * time.deltaTime;
            if (bunny.x < 5) {
                direction = "right";
            }
            if (bunny.x > game.clientWidth - 5) {
                direction = "left";
            }
            if (direction === "left") {
                bunny.x = bunny.x - speed;
            }
            if (direction === "right") {
                bunny.x = bunny.x + speed;
            }
        });
        app.stage.on("pointerdown", (event) => console.log(event));
        richText.x = 50;
        richText.y = 220;
        app.stage.addChild(richText);
    });
</script>

<div class="bg-black h-96" bind:this={game}>Loading..</div>
<div><a href="/" class="anchor">Go home</a></div>
