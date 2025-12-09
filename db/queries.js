import pool from "./pool.js";
import bcrypt from "bcryptjs";

function normalizeUser(dbUser) {
    if (!dbUser) return null;

    return {
        id: dbUser.id,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        username: dbUser.username,
        password: dbUser.password,
        isMember: dbUser.is_member,
        createdAt: dbUser.created_at,
    };
}

async function addUser({ firstName, lastName, username, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
        `
        INSERT INTO users (first_name, last_name, username, password) 
        VALUES ($1, $2, $3, $4) RETURNING id;
    `,
        [firstName, lastName, username, hashedPassword]
    );

    return rows[0].id;
}

async function getUserByUsername(username) {
    const { rows } = await pool.query(
        `
        SELECT * FROM users WHERE username = $1;
    `,
        [username]
    );

    return normalizeUser(rows[0]);
}

async function getUserById(id) {
    const { rows } = await pool.query(
        `
        SELECT * FROM users WHERE id = $1;
    `,
        [id]
    );

    return normalizeUser(rows[0]);
}

async function addMessage({ title, text, userId }) {
    const { rows } = await pool.query(
        `
        INSERT INTO messages (title, text, user_id)
        VALUES ($1, $2, $3) RETURNING id;
    `,
        [title, text, userId]
    );

    return rows[0].id;
}

export default {
    addUser,
    getUserByUsername,
    getUserById,
    addMessage,
};
