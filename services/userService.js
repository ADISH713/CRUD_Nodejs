
const { randomUUID } = require("crypto");
const userModel = require("../models/userModel");

const createError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const validateUser = (data, isUpdate = false) => {
    const allowedFields = ["name", "email", "age"];

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw createError("Request body must be an object");
    }

    const invalidField = Object.keys(data).find(
        (field) => !allowedFields.includes(field)
    );

    if (invalidField) {
        throw createError(`Unknown field: ${invalidField}`);
    }

    if (!isUpdate || Object.hasOwn(data, "name")) {
        if (
            typeof data.name !== "string" ||
            data.name.trim().length < 2
        ) {
            throw createError("Name must contain at least 2 characters");
        }
    }

    if (!isUpdate || Object.hasOwn(data, "email")) {
        if (typeof data.email !== "string") {
            throw createError("A valid email is required");
        }

        data.email = data.email.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(data.email)) {
            throw createError("Invalid email format");
        }
    }

    if (Object.hasOwn(data, "age")) {
        if (
            typeof data.age !== "number" ||
            !Number.isFinite(data.age) ||
            data.age < 0
        ) {
            throw createError("Age must be a non-negative number");
        }
    }
};

const getUsers = async () => {
    return await userModel.findAll();
};

const getUserById = async (id) => {
    const user = await userModel.findById(id);

    if (!user) {
        throw createError("User not found", 404);
    }

    return user;
};

const createUser = async (data) => {
    const input = { ...data };
    validateUser(input);

    const existingUser = await userModel.findByEmail(input.email);

    if (existingUser) {
        throw createError("Email already exists", 409);
    }

    const now = new Date().toISOString();

    const user = {
        id: randomUUID(),
        name: input.name.trim(),
        email: input.email,
        ...(input.age !== undefined && { age: input.age }),
        createdAt: now,
        updatedAt: now,
    };

    return await userModel.create(user);
};

const updateUser = async (id, data) => {
    const input = { ...data };
    validateUser(input, true);

    const existingUser = await userModel.findById(id);

    if (!existingUser) {
        throw createError("User not found", 404);
    }

    if (Object.hasOwn(input, "email")) {
        const duplicate = await userModel.findByEmail(input.email);

        if (duplicate && duplicate.id !== id) {
            throw createError("Email already exists", 409);
        }
    }

    const updatedData = {
        ...input,
        ...(Object.hasOwn(input, "name") && {
            name: input.name.trim(),
        }),
        updatedAt: new Date().toISOString(),
    };

    return await userModel.update(id, updatedData);
};

const deleteUser = async (id) => {
    const deletedUser = await userModel.remove(id);

    if (!deletedUser) {
        throw createError("User not found", 404);
    }

    return deletedUser;
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
