const { NextFunction, Request, Response } = require('express');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: req.body.email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

const generateToken = (userId) => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jwt.sign(
        { _id: userId, random: random },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { _id: userId, random: random },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
};

const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('Wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('Wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        if (!refreshToken) {
            reject('Fail');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            reject('Fail');
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err, payload) => {
            if (err) {
                reject('Fail');
                return;
            }
            const userId = payload._id;
            try {
                const user = await userModel.findById(userId);
                if (!user || !user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    if (user) {
                        user.refreshToken = [];
                        await user.save();
                    }
                    reject('Fail');
                    return;
                }
                user.refreshToken = user.refreshToken.filter((token) => token !== refreshToken);
                resolve(user);
            } catch (err) {
                reject('Fail');
            }
        });
    });
};

const logout = async (req, res) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        await user.save();
        res.status(200).send('Success');
    } catch (err) {
        res.status(400).send('Fail');
    }
};

const refresh = async (req, res) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send('Fail');
            return;
        }
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
        });
    } catch (err) {
        res.status(400).send('Fail');
    }
};

const authMiddleware = (req, res, next) => {
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = payload._id;
        next();
    });
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    authMiddleware,
};
