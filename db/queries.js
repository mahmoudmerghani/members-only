import pool from "./pool.js";
import bcrypt from "bcryptjs";

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
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE username = $1;
    `, [username]);

    return rows[0] || null;
}

export default {
    addUser,
    getUserByUsername
};
