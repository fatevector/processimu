const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });

router.patch("/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id) {
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
                new: true
            });
            const resObj = {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                models: updatedUser.models
            };
            res.send(resObj);
        } else {
            res.status(401).json({
                error: {
                    message: "UNAUTHORIZED",
                    code: 401
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже"
        });
    }
});

router.get("/:userId", auth, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id) {
            const foundUser = await User.findById(userId);
            const resObj = {
                _id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                models: foundUser.models
            };
            res.send(resObj);
        } else {
            res.status(401).json({
                error: {
                    message: "UNAUTHORIZED",
                    code: 401
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже"
        });
    }
});

module.exports = router;
