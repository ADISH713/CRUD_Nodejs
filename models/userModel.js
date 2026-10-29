
const fs = require("fs/promises");
const path = require("path");

const USERS_FILE = path.join(__dirname, "..", "user.json");

const readUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeUsers([]);
            return [];
        }

        throw error;
    }
};

const writeUsers = async (users) => {
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2),
        "utf8"
    );
};

const findAll = async () => {
    return await readUsers();
};

const findById = async (id) => {
    const users = await readUsers();
    return users.find((user) => user.id === id) || null;
};

const findByEmail = async (email) => {
    const users = await readUsers();

    return users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    ) || null;
};

const create = async (userData) => {
    const users = await readUsers();
    users.push(userData);
    await writeUsers(users);

    return userData;
};

const update = async (id, updatedData) => {
    const users = await readUsers();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    users[index] = { ...users[index], ...updatedData };
    await writeUsers(users);

    return users[index];
};

const remove = async (id) => {
    const users = await readUsers();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) return null;

    const [deletedUser] = users.splice(index, 1);
    await writeUsers(users);

    return deletedUser;
};

module.exports = {
    findAll,
    findById,
    findByEmail,
    create,
    update,
    remove,
};
