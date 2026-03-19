// จำว่าค้องเชื่อมต่อ DB ,ทำ hash password , สร้าง verify JWT
const bcrypt = require('bcrypt')
const db = require('../config/db')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { display_name, email, username, password } = req.body
    if (!display_name || !email || !username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณาใส่ข้อมูลให้ครบ' })
    }
    
    const checkEmail = `SELECT * FROM users WHERE email = ?`
    const [rowEmail] = await db.query(checkEmail, [email])
    if (rowEmail.length) {
        return res.status(409).json({ success: false, message: 'มีการใช้ email นี้ไปแล้ว' })
    }
    const checkUser = `SELECT * FROM users WHERE username = ?`
    const [rowUser] = await db.query(checkUser, [username])
    if (rowUser.length) {
        return res.status(409).json({ success: false, message: 'มีการใช้ username นี้ไปแล้ว' })
    }

    const password_hash = await bcrypt.hash(password, 10)// hash password
    const sql = `INSERT INTO users(display_name,email,username,password_hash)VALUES(?,?,?,?)`
    const [result] = await db.query(sql, [display_name, email, username, password_hash])


    return res.status(201).json({ success: true, message: 'ลงทะเบียนสำเร็จ' })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'ใส่ข้อมูลให้ครบ' })
    }
    const sql = `SELECT * FROM users WHERE email = ?`
    const [row] = await db.query(sql, [email])

    if (row.length === 0) {
        return res.status(400).json({ success: false, message: 'email หรือ password ไม่ถูกต้อง' })
    }
    const isMatch = await bcrypt.compare(password, row[0].password_hash)
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'email หรือ password ไม่ถูกต้อง' })
    }
    const token = jwt.sign(
        { id: row[0].id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
    return res.status(200).json({ success: true, message: 'login สำเร็จ', token })
}

const me = async (req, res) => {
    const userId = req.user.id
    const sql = `SELECT id,display_name,email FROM users WHERE id =?`
    const [rows] = await db.query(sql, [userId])
    res.json({ success: true, data: rows[0] })
}

module.exports = { register, login, me }