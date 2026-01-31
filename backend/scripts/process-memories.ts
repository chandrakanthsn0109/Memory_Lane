import { processAllMemories } from "../lib/scheduler";

async function run() {
    console.log("Starting manual memory processing...");
    try {
        const results = await processAllMemories();
        console.log(`Processed ${results.length} memories.`);
        process.exit(0);
    } catch (error) {
        console.error("Error processing memories:", error);
        process.exit(1);
    }
}

run();
