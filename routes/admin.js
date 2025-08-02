// import express from 'express';
// import db from '../views/db.js';

// const router = express.Router();

// // Admin Dashboard
// router.get('/dashboard', (req, res) => {
//   const email = req.query.email;

//   db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
//     if (err || results.length === 0) return res.send('Admin not found');

//     const admin = results[0];
//     res.render('admin/dashboard', { admin });
//   });
// });

// // Add student form
// router.get('/add-student', (req, res) => {
//   res.render('admin/add-student');
// });

// // Add student handler
// router.post('/add-student', (req, res) => {
//   const { name, email, phone, course, password } = req.body;

//   const sql = 'INSERT INTO users (name, email, phone, course, password, role) VALUES (?, ?, ?, ?, ?, ?)';
//   db.query(sql, [name, email, phone, course, password, 'student'], (err, result) => {
//     if (err) return res.send('Error adding student');

//     res.redirect('/admin/students');
//   });
// });

// // View all students
// router.get('/students', (req, res) => {
//   db.query('SELECT * FROM users WHERE role = "student"', (err, results) => {
//     if (err) return res.send('Error fetching students');

//     res.render('admin/students', { students: results });
//   });
// });

// router.get('/view/:id', (req, res) => {
//   const id = req.params.id;
//   db.query('SELECT * FROM students WHERE id = ?', [id], (err, result) => {
//     if (err) return res.status(500).send("Error loading profile");
//     res.render('view-student', { student: result[0] });
//   });
// });


// router.get('/students', (req, res) => {
//   const search = req.query.search || '';
//   const sortBy = req.query.sortBy || '';
//   const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

//   let query = "SELECT * FROM students";
//   let values = [];

//   if (search) {
//     query += " WHERE name LIKE ? OR email LIKE ? OR course LIKE ? OR status LIKE ?";
//     values = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
//   }

//   const validFields = ['name', 'email', 'course', 'fees', 'age', 'gender', 'dob', 'address', 'phone', 'admission_date', 'status'];
//   if (sortBy && validFields.includes(sortBy)) {
//     query += ` ORDER BY ${sortBy} ${order}`;
//   }

//   db.query(query, values, (err, result) => {
//     if (err) return res.status(500).send("Query error");
//     res.render("view-students", { result, search, sortBy, order });
//   });
// });


// export default router;
