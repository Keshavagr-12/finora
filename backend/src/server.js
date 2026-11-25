import { env } from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.PORT, () => {
            console.log(
                `FINORA Backend running on port ${env.PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();