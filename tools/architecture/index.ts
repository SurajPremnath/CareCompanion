import { createArchitectureContainer } from "./container";

async function main(): Promise<void> {

    const { engine } =
        createArchitectureContainer();

    await engine.analyze();

    console.log("");
    console.log("✔ Architecture analysis completed.");
    console.log("");
}

main().catch(error => {

    console.error(error);

    process.exit(1);
});