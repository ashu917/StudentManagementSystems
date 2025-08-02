// import express from 'express';
// import db from '../views/db.js';

// const router = express.Router();

// // GET login page
// router.get('/login', (req, res) => {
//   res.render('login'); // a common login page with email & password
// });

// // POST login form
// router.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
//   db.query(sql, [email, password], (err, results) => {
//     if (err) return res.send('Database error');

//     if (results.length === 0) {
//       return res.render('login', { error: 'Invalid credentials' });
//     }

//     const user = results[0];

//     if (user.role === 'admin') {
//       res.redirect(`/admin/dashboard?email=${encodeURIComponent(user.email)}`);
//     } else {
//       res.redirect(`/student/dashboard?email=${encodeURIComponent(user.email)}`);
//     }
//   });
// });

// export default router;
