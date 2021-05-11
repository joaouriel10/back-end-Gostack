import { Request, Response, NextFunction, response} from 'express';
import redis from 'redis';
import AppError from '@shared/errors/AppError';
import  { RateLimiterRedis } from 'rate-limiter-flexible';

const RedisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined
});

const limiter = new RateLimiterRedis({
    storeClient: RedisClient,
    keyPrefix: 'rateLimit',
    points: 5,
    duration: 1,
});

export default async function rateLimiter(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
        await limiter.consume(request.ip);

        return next();
    } catch (error) {
        throw new AppError('Too many requests', 429);
    }
}