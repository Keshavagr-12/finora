import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    beforeEach
} from "vitest";

import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";

import { env } from "../src/config/env.js";

import User from "../src/modules/users/user.model.js";

import RefreshToken from
    "../src/modules/auth/refreshToken.model.js";

import { hashToken } from "../src/utils/token.js";


const AUTH_URL = "/api/v1/auth";

const ORIGIN = "http://localhost:5173";

const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "Finora@123"
};


const registerUser = async (data = testUser) => {

    return request(app)
        .post(`${AUTH_URL}/register`)
        .send(data);

};


const loginUser = async () => {

    return request(app)
        .post(`${AUTH_URL}/login`)
        .set("Origin", ORIGIN)
        .send({
            email: testUser.email,
            password: testUser.password
        });

};


const getRefreshCookie = (response) => {

    const cookie = response.headers["set-cookie"]
        ?.find(value =>
            value.startsWith("finoraRefreshToken=")
        );

    expect(cookie).toBeDefined();

    return cookie.split(";")[0];

};


beforeAll(async () => {

    await mongoose.connect(env.MONGO_URI);

    if (mongoose.connection.name !== "finora_test") {
        throw new Error("Unsafe test database");
    }

    await User.init();

    await RefreshToken.init();

});


beforeEach(async () => {

    if (mongoose.connection.name !== "finora_test") {
        throw new Error("Unsafe database cleanup");
    }

    await RefreshToken.deleteMany({});

    await User.deleteMany({});

});


afterAll(async () => {

    await mongoose.disconnect();

});


describe("FINORA Authentication APIs", () => {

    it("should register a new user", async () => {

    const response = await registerUser();

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.data.email)
        .toBe(testUser.email);

    expect(response.body.data.role)
        .toBe("user");

    expect(response.body.data)
        .not.toHaveProperty("passwordHash");

});


it("should reject duplicate registration", async () => {

    const first = await registerUser();

    expect(first.status).toBe(201);

    const response = await registerUser();

    expect(response.status).toBe(409);

});


it("should reject invalid registration data", async () => {

    const response = await registerUser({
        name: "A",
        email: "invalid-email",
        password: "123"
    });

    expect(response.status).toBe(400);

});


it("should prevent administrator role injection", async () => {

    const response = await registerUser({
        ...testUser,
        role: "admin"
    });

    expect(response.status).toBe(400);

});

it("should log in with valid credentials", async () => {

    await registerUser();

    const response = await loginUser();

    expect(response.status).toBe(200);

    expect(response.body.data.accessToken)
        .toBeDefined();

    expect(response.body.data)
        .not.toHaveProperty("refreshToken");

    expect(response.body.data.user)
        .not.toHaveProperty("passwordHash");

    const cookie = getRefreshCookie(response);

    expect(cookie)
        .toContain("finoraRefreshToken=");

    expect(
        response.headers["set-cookie"].join(";")
    ).toContain("HttpOnly");

});


it("should reject an incorrect password", async () => {

    await registerUser();

    const response = await request(app)
        .post(`${AUTH_URL}/login`)
        .set("Origin", ORIGIN)
        .send({
            email: testUser.email,
            password: "WrongPassword"
        });

    expect(response.status).toBe(401);

});


it("should reject inactive accounts", async () => {

    await registerUser();

    await User.updateOne(
        { email: testUser.email },
        { isActive: false }
    );

    const response = await loginUser();

    expect(response.status).toBe(403);

});

it("should retrieve the authenticated user", async () => {

    await registerUser();

    const login = await loginUser();

    expect(login.status).toBe(200);

    const accessToken = login.body.data.accessToken;

    const response = await request(app)
        .get(`${AUTH_URL}/me`)
        .set(
            "Authorization",
            `Bearer ${accessToken}`
        );

    expect(response.status).toBe(200);

    expect(response.body.data.email)
        .toBe(testUser.email);

});


it("should reject requests without an access token", async () => {

    const response = await request(app)
        .get(`${AUTH_URL}/me`);

    expect(response.status).toBe(401);

});


it("should reject invalid access tokens", async () => {

    const response = await request(app)
        .get(`${AUTH_URL}/me`)
        .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);

});

it("should rotate refresh tokens successfully", async () => {

    await registerUser();

    const login = await loginUser();

    const oldCookie = getRefreshCookie(login);

    const response = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", ORIGIN)
        .set("Cookie", oldCookie);

    expect(response.status).toBe(200);

    expect(response.body.data.accessToken)
        .toBeDefined();

    const newCookie = getRefreshCookie(response);

    expect(newCookie).not.toBe(oldCookie);

    const oldToken = oldCookie.split("=")[1];

    const storedToken = await RefreshToken.findOne({
        tokenHash: hashToken(oldToken)
    });

    expect(storedToken.revokedAt)
        .not.toBeNull();

});


it("should reject reused refresh tokens and revoke the family", async () => {

    await registerUser();

    const login = await loginUser();

    const oldCookie = getRefreshCookie(login);

    const refresh = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", ORIGIN)
        .set("Cookie", oldCookie);

    expect(refresh.status).toBe(200);

    const newCookie = getRefreshCookie(refresh);

    const reused = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", ORIGIN)
        .set("Cookie", oldCookie);

    expect(reused.status).toBe(401);

    const replacement = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", ORIGIN)
        .set("Cookie", newCookie);

    expect(replacement.status).toBe(401);

});


it("should reject missing refresh tokens", async () => {

    const response = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", ORIGIN);

    expect(response.status).toBe(401);

});

it("should revoke the current session on logout", async () => {

    await registerUser();

    const login = await loginUser();

    const cookie = getRefreshCookie(login);

    const logout = await request(app)
        .post(`${AUTH_URL}/logout`)
        .set("Origin", ORIGIN)
        .set("Cookie", cookie);

    expect(logout.status).toBe(200);

    const refresh = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", ORIGIN)
        .set("Cookie", cookie);

    expect(refresh.status).toBe(401);

});


it("should revoke all existing user sessions", async () => {

    await registerUser();

    const firstLogin = await loginUser();

    const secondLogin = await loginUser();

    const firstCookie = getRefreshCookie(firstLogin);

    const secondCookie = getRefreshCookie(secondLogin);

    const response = await request(app)
        .post(`${AUTH_URL}/logout-all`)
        .set("Origin", ORIGIN)
        .set(
            "Authorization",
            `Bearer ${secondLogin.body.data.accessToken}`
        );

    expect(response.status).toBe(200);

    for (const cookie of [firstCookie, secondCookie]) {

        const refresh = await request(app)
            .post(`${AUTH_URL}/refresh`)
            .set("Origin", ORIGIN)
            .set("Cookie", cookie);

        expect(refresh.status).toBe(401);

    }

});

it("should reject unauthorised request origins", async () => {

    const response = await request(app)
        .post(`${AUTH_URL}/refresh`)
        .set("Origin", "https://unknown.example");

    expect(response.status).toBe(403);

});

it("should deny administrator access to normal users", async () => {

    await registerUser();

    const login = await loginUser();

    const response = await request(app)
        .get(`${AUTH_URL}/admin-test`)
        .set(
            "Authorization",
            `Bearer ${login.body.data.accessToken}`
        );

    expect(response.status).toBe(403);

});


it("should allow administrator access", async () => {

    await registerUser();

    await User.updateOne(
        { email: testUser.email },
        { role: "admin" }
    );

    const login = await loginUser();

    const response = await request(app)
        .get(`${AUTH_URL}/admin-test`)
        .set(
            "Authorization",
            `Bearer ${login.body.data.accessToken}`
        );

    expect(response.status).toBe(200);

});

});