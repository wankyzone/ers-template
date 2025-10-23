import app from "../src/app";
import request from "supertest";

describe("Health Check", () => {
  it("GET / should return success", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("✅ ERS Backend");
  });
});
