import { getConnection } from "../lib/db";

async function run() {
    console.log("Connecting to database...");
    try {
        const conn = await getConnection();
        console.log("Connected.");

        const countResult = await conn.execute("SELECT count(*) FROM employee_memory_events");
        console.log("Total events:", countResult.rows);

        const statusResult = await conn.execute("SELECT employee_status, count(*) as count FROM employee_memory_events GROUP BY employee_status");
        console.log("Events by status:", statusResult.rows);

        await conn.close();
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
