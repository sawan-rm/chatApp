import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


export const authUser = async (req, res, next) => {
    console.log('🔐 [AUTH] Checking authentication for:', req.method, req.path);
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

        if (!token) {
            console.log('❌ [AUTH] No token provided');
            return res.status(401).send({ error: 'Unauthorized User' });
        }

        console.log('🔍 [AUTH] Checking if token is blacklisted...');
        const isBlackListed = await redisClient.get(token);

        if (isBlackListed) {
            console.log('❌ [AUTH] Token is blacklisted');
            res.cookie('token', '');

            return res.status(401).send({ error: 'Unauthorized User' });
        }

        console.log('🔑 [AUTH] Verifying JWT token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('✅ [AUTH] Authentication successful:', decoded.email);
        next();
    } catch (error) {

        console.error('❌ [AUTH] Authentication error:', error.message);

        res.status(401).send({ error: 'Unauthorized User' });
    }
}