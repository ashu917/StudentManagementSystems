// import express from 'express';
// import db from '../views/db.js';

// const router = express.Router();

// // Student dashboard by email
// router.get('/dashboard', (req, res) => {
//   const email = req.query.email;

//   db.query('SELECT * FROM users WHERE email = ? AND role = "student"', [email], (err, results) => {
//     if (err || results.length === 0) {
//       return res.send('Student not found or unauthorized');
//     }

//     const student = results[0];
//     res.render('student/dashboard', { student });
//   });
// });

// router.get('/profile/:id', (req, res) => {
//   const id = req.params.id;
//   db.query("SELECT * FROM students WHERE user_id = ?", [id], (err, result) => {
//     if (err) return res.status(500).send("Failed to load profile");

//     if (result.length === 0) {
//       return res.send("⚠️ Profile not found.");
//     }

//     res.render("student-profile", { student: result[0] });
//   });
// });


// export default router;
