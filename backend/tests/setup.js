import dotenv from "dotenv";

const result = dotenv.config({
    path: ".env.test",
    override: true
});

if (result.error) {
    throw result.error;
}

if (process.env.NODE_ENV !== "test") {
    throw new Error(
        "Tests must run in the test environment"
    );
}

const databaseName = new URL(
    process.env.MONGO_URI
).pathname;

if (databaseName !== "/finora_test") {
    throw new Error(
        "Tests must use the finora_test database"
    );
}