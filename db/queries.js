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

function normalizeMessage(dbMessage) {
    if (!dbMessage) return null;

    return {
        id: dbMessage.id,
        title: dbMessage.title,
        text: dbMessage.text,
        createdAt: dbMessage.created_at,
        user: {
            id: dbMessage.user_id,
            firstName: dbMessage.first_name,
            lastName: dbMessage.last_name,
            username: dbMessage.username,
        },
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

async function getAllMessages() {
    const { rows } = await pool.query(
        `
        SELECT 
            m.*,
            u.first_name,
            u.last_name,
            u.username
        FROM messages m JOIN users u
        ON m.user_id = u.id
        ORDER BY m.created_at DESC;
    `
    );

    return rows.map(normalizeMessage);
}

async function setUserMemberStatus(userId, memberStatus) {
    await pool.query(
        `
        UPDATE users
        SET is_member = $2
        WHERE id = $1;
    `,
        [userId, memberStatus]
    );
}

async function deleteMessage(messageId) {
    await pool.query(
        `
        DELETE FROM messages
        WHERE id = $1;
        `,
        [messageId]
    );
}

export default {
    addUser,
    getUserByUsername,
    getUserById,
    addMessage,
    getAllMessages,
    setUserMemberStatus,
    deleteMessage,
};
