

const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const db = require('../models/db');


const validateRegistration = [
    check('name').notEmpty().withMessage('Name is required'),
    check('address').notEmpty().withMessage('Address is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('batch').notEmpty().withMessage('Batch is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerStudent = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, email, batch, password } = req.body; 
    const monthlyFee = 1000;

    db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error', details: err });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => { 
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).json({ error: 'Error hashing password', details: err });
            }

            db.query(
                'INSERT INTO students (name, address, email, batch, monthly_fee, password) VALUES (?, ?, ?, ?, ?, ?)',
                [name, address, email, batch, monthlyFee, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error('Database insertion error:', err);
                        return res.status(500).json({ error: 'Database error', details: err });
                    }
                    res.status(201).json({
                        message: 'Student registered successfully!',
                        studentId: result.insertId,
                    });
                }
            );
        });
    });
};

module.exports = { registerStudent, validateRegistration };
