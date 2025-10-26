import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/redis.service.js';


export const createUserController = async (req, res) => {
    console.log('📝 [REGISTER] Request received:', { email: req.body.email });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('❌ [REGISTER] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log('🔄 [REGISTER] Creating user...');
        const user = await userService.createUser(req.body);

        console.log('🔑 [REGISTER] Generating JWT token...');
        const token = await user.generateJWT();

        delete user._doc.password;

        console.log('✅ [REGISTER] User created successfully:', { email: user.email, id: user._id });
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('❌ [REGISTER] Error:', error.message);
        res.status(400).send(error.message);
    }
}

export const loginController = async (req, res) => {
    console.log('🔐 [LOGIN] Request received:', { email: req.body.email });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('❌ [LOGIN] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { email, password } = req.body;

        console.log('🔍 [LOGIN] Looking up user...');
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ [LOGIN] User not found:', email);
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        console.log('🔒 [LOGIN] Verifying password...');
        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
            console.log('❌ [LOGIN] Invalid password for:', email);
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        console.log('🔑 [LOGIN] Generating JWT token...');
        const token = await user.generateJWT();

        delete user._doc.password;

        console.log('✅ [LOGIN] Login successful:', { email: user.email, id: user._id });
        res.status(200).json({ user, token });


    } catch (err) {

        console.error('❌ [LOGIN] Error:', err.message);

        res.status(400).send(err.message);
    }
}

export const profileController = async (req, res) => {

    res.status(200).json({
        user: req.user
    });

}

export const logoutController = async (req, res) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Logged out successfully'
        });


    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id });

        return res.status(200).json({
            users: allUsers
        })

    } catch (err) {

        console.log(err)

        res.status(400).json({ error: err.message })

    }
}
