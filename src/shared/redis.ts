import config from "@/config";
import { createClient } from "redis";

const redisClient = createClient({
    url: `rediss://${config.redis.host}:${config.redis.port}`,
    password: config.redis.password,
});

redisClient.on("connect", () => {
    console.log("Connected to Redis.");
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

redisClient.connect();

export default redisClient;
