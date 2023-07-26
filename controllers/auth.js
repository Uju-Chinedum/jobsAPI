const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();

    // when building, you only want to send back the token only the frontend needs
    // any other thing expressly
    res.status(StatusCodes.CREATED).json({ name: { name: user.name }, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email/password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ name: { name: user.name }, token });
};

module.exports = {
    register,
    login,
};
