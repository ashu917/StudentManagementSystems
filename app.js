import express from 'express';
import db from './db.js';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url'; // required for ES modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // ✅ Define app FIRST

app.set('views', path.join(__dirname, 'views')); // ✅ Now safe to use
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.render('auth/index'); // matches views/auth/index.ejs
});

// Admin login form
app.get('/admin/login', (req, res) => {
  res.render('auth/admin/login'); // matches views/auth/admin/login.ejs
});

// Student login form
app.get('/student/login', (req, res) => {
  res.render('auth/student/login'); // matches views/auth/student/login.ejs
});

app.get('/admin/dashboard', (req, res) => {
  const admin = { id: 1, name: "Admin Name", email: "admin@example.com" };
  res.render('admin/dashboard', { admin });
});


// Admin login handler
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length === 0) {
      return res.redirect('/admin/login?error=Invalid credentials');
    }
    const admin = results[0];
    res.redirect(`/admin/dashboard/${admin.id}`);
  });
});

app.get('/admin/dashboard/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send("DB error");
    if (results.length === 0) return res.status(404).send("Admin not found");
    res.render('admin/dashboard', { admin: results[0] });
  });
});
;



// Student login handler
app.post('/student/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM students WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send("Database error during login");
    if (result.length > 0) {
      const studentId = result[0].id;
      res.redirect(`/student/dashboard/${studentId}`);
    } else {
      res.redirect('/?error=Invalid student credentials');
    }
  });
});


// ==============================
// 🔷 Admin Dashboard
// ==============================
app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

// GET Add Student Form
app.get('/admin/add-student', (req, res) => {
  res.render('admin/add-students'); // ✅ File must exist
});

// POST Add Student to DB
app.post('/adds', (req, res) => {
  const {
    name, email, password, course, fees, age, gender,
    dob, address, phone, admission_date, status
  } = req.body;

  const sql = `
    INSERT INTO students 
    (name, email, course, fees, age, gender, dob, address, phone, admission_date, status, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    name, email, course, fees, age, gender,
    dob, address, phone, admission_date, status, password
  ], (err) => {
    if (err) {
      console.error("❌ INSERT ERROR:\n", err.sqlMessage);
      return res.status(500).send("Something went wrong while saving student.");
    }
    console.log("✅ Student added successfully!");
    res.redirect('/admin/students');
  });
});

// GET All Students List
// app.get('/admin/students', (req, res) => {
//   db.query("SELECT * FROM students", (err, results) => {
//     if (err) {
//       console.error("SELECT ERROR:", err);
//       return res.status(500).send("Error fetching students.");
//     }
//     res.render('admin/all-students', { students: results }); // ✅ File must exist
//   });
// });

app.get('/admin/all', (req, res) => {
  const sql = `SELECT id, name, email, course, age, gender FROM students`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Failed to load students");
    }

    res.render('admin/all-students', { students: result });
  });
});

// Add this route in app.js
app.get('/admin/students', (req, res) => {
  const sql = `SELECT id, name, email, course, age, gender FROM students`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Failed to load students");
    }

    res.render('admin/all-students', { students: result });
  });
 });


// app.get(['/admin/all', '/admin/students'], (req, res) => {
//   const sql = `SELECT id, name, email, course, age, gender FROM students`;

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("DB Error:", err);
//       return res.status(500).send("Failed to load students");
//     }

//     res.render('admin/all-students', { students: result });
//   });
// });


// ==============================
// 🔍 View Individual Student Profile
// ==============================
// ✅ GET route to show full student profile
app.get('/admin/view/:id', (req, res) => {
  const studentId = req.params.id;

  const sql = `SELECT * FROM students WHERE id = ?`;
  db.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error("Error fetching student:", err);
      return res.status(500).send("⚠️ Server Error: Couldn't load student profile.");
    }

    if (result.length === 0) {
      return res.status(404).send("❌ Student not found");
    }

    res.render('admin/view-student', { student: result[0] }); // 👈 This is your provided file
  });
});


// ==============================
// 📝 Show Edit Form (GET)
// ==============================
app.get('/admin/edit/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching student for edit:", err);
      return res.status(500).send("Error loading edit form.");
    }

    if (result.length === 0) {
      return res.status(404).send("Student not found.");
    }

    res.render('admin/edit-student', { student: result[0] }); // 👈 Pass single student
  });
});



// ==============================
// 💾 Update Student (POST)
// ==============================
app.post('/admin/update-student/:id', (req, res) => {
  const id = req.params.id;
  const {
    name, email, course, fees, age, gender,
    dob, address, phone, admission_date, status
  } = req.body;

  const sql = `UPDATE students SET
    name = ?, email = ?, course = ?, fees = ?, age = ?, gender = ?,
    dob = ?, address = ?, phone = ?, admission_date = ?, status = ?
    WHERE id = ?`;

  db.query(sql, [
    name, email, course, fees, age, gender,
    dob, address, phone, admission_date, status, id
  ], (err) => {
    if (err) return res.status(500).send("Update failed");
    res.redirect('/admin/students');
  });
});


// ==============================
// 🗑️ Delete Student
// ==============================
app.get('/admin/delete/:id', (req, res) => {
  const id = req.params.id;
  const str = "DELETE FROM students WHERE id = ?";
  db.query(str, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.redirect('/admin/students');
  });
});

// ==============================
// 🔍 SEARCH Students by Any Field
// ==============================
app.get('/admin/search', (req, res) => {
  const term = `%${req.query.term}%`;

  const str = `
    SELECT * FROM students 
    WHERE name LIKE ? OR email LIKE ? OR course LIKE ? OR phone LIKE ? OR status LIKE ?
    ORDER BY admission_date DESC
  `;

  db.query(str, [term, term, term, term, term], (err, students) => {
    if (err) return res.status(500).send(err);
    res.render('admin/all-students', { students });
  });
});


// ==============================
// 🔃 SORT Students by Field & Order
// ==============================
app.get('/admin/sort', (req, res) => {
  let { field, order } = req.query;

  const validFields = ['name', 'course', 'fees', 'age', 'admission_date', 'status'];
  const validOrder = ['asc', 'desc'];

  // Set default if invalid or missing
  if (!validFields.includes(field)) field = 'name';
  if (!validOrder.includes(order)) order = 'asc';

  const str = `SELECT * FROM students ORDER BY ${field} ${order}`;

  db.query(str, (err, students) => {
    if (err) return res.status(500).send(err);
    res.render('admin/all-students', { students });
  });
});

// GET Route for Add Student Performance Page
app.get('/admin/add-student-performance', (req, res) => {
  res.render('admin/add-student-performance'); // Make sure views/admin/add-student-performance.ejs exists
});

// GET Route for Viewing Student Performance Reports
app.get('/admin/view-performance', (req, res) => {
  const sql = `
    SELECT sp.*, s.name, s.email
    FROM student_performance sp
    JOIN students s ON sp.student_id = s.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching performance reports:", err);
      return res.status(500).send("Server Error: Couldn't load performance reports.");
    }
    res.render('admin/view-performance', { performances: results });
  });
});

// POST Route for Adding or Updating Student Performance
app.post('/add-student-performance', (req, res) => {
  const {
    student_id,
    attendance,
    assignments_done,
    projects,
    participation,
    behavior_rating,
    teacher_remarks
  } = req.body;

  const sql = `
    INSERT INTO student_performance 
      (student_id, attendance, assignments_done, projects, participation, behavior_rating, teacher_remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      attendance = VALUES(attendance),
      assignments_done = VALUES(assignments_done),
      projects = VALUES(projects),
      participation = VALUES(participation),
      behavior_rating = VALUES(behavior_rating),
      teacher_remarks = VALUES(teacher_remarks)
  `;

  const values = [
    student_id,
    attendance,
    assignments_done,
    projects,
    participation,
    behavior_rating,
    teacher_remarks
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).send("⚠️ Server Error: Couldn't save performance.");
    }
    res.redirect('/admin/view-performance');
  });
});



app.get('/logout', (req, res) => {
      console.log("🔓 Logout route hit");
  res.redirect('/admin/login'); // or any route you want to use as login entry
});


// Student Dashboard

// GET route for student to view their own performance
app.get('/student/performance', (req, res) => {
  const studentId = req.session.user?.id;

  if (!studentId) {
    return res.status(401).send("Unauthorized: Please log in first.");
  }

  const sql = `
    SELECT sp.*, s.name, s.email
    FROM student_profiles sp
    JOIN students s ON sp.student_id = s.id
    WHERE s.id = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error("Error fetching performance:", err);
      return res.status(500).send("⚠️ Error fetching performance");
    }

    if (result.length === 0) {
      return res.render("student/performance", {
        performance: null,
        message: "No performance record found yet.",
      });
    }

    res.render("student/performance", {
      performance: result[0],
      message: null
    });
  });
});



app.get('/student/dashboard/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Database error");
    if (result.length === 0) return res.status(404).send("Student not found");
    res.render('student/dashboard', { student: result[0] });
  });
});

// Student Profile
app.get('/student/profile/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Database error");
    if (result.length === 0) return res.status(404).send("Student not found");
    res.render('student/profile', { student: result[0] });
  });
});

app.get('/student/performance/:id', (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      sp.*, 
      s.name 
    FROM 
      student_performance sp
    JOIN 
      students s ON sp.student_id = s.id
    WHERE 
      sp.student_id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err.message);
      return res.status(500).send("Error fetching performance");
    }

    if (result.length === 0) {
      return res.render('student/performance', { profile: null, student: { id, name: 'N/A' } });
    }

    
    const data = result[0];
    res.render('student/performance', {
      profile: {
        attendance: data.attendance,
        assignments_done: data.assignments_done,
        projects: data.projects,
        participation: data.participation,
        behavior_rating: data.behavior_rating,
        teacher_remarks: data.teacher_remarks,
        updated_at: data.updated_at
      },
      student: {
        id: data.student_id,
        name: data.name
      }
    });
  });
});

app.get('/student/edit/:id', (req, res) => {
  const id = req.params.id;

  const sql = "SELECT * FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Database error");
    }

    if (result.length === 0) {
      return res.status(404).send("Student not found");
    }

    res.render('student/edit-profile', { student: result[0] });
  });
});


app.post('/student/update-profile', (req, res) => {
  const {
    id,
    name,
    email,
    course,
    fees,
    age,
    gender,
    dob,
    address,
    phone,
    admission_date,
    status
  } = req.body;

  const sql = `
    UPDATE students SET
      name = ?, email = ?, course = ?, fees = ?, age = ?, gender = ?,
      dob = ?, address = ?, phone = ?, admission_date = ?, status = ?
    WHERE id = ?
  `;

  const values = [
    name, email, course, fees, age, gender,
    dob, address, phone, admission_date, status,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Error updating profile");
    }

    res.redirect(`/student/profile/${id}`);
  });
});

  

// Edit Form (GET)
app.get('/student/edit/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM students WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Error loading student");
    if (result.length === 0) return res.status(404).send("Student not found");
    res.render('student/edit', { student: result[0] });
  });
});

// Edit Form (POST)
app.post('/student/edit/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, course, phone } = req.body;

  const sql = "UPDATE students SET name = ?, email = ?, course = ?, phone = ? WHERE id = ?";
  db.query(sql, [name, email, course, phone, id], (err) => {
    if (err) return res.status(500).send("Update failed");
    res.redirect(`/student/profile/${id}`);
  });
});

app.get('/logouts', (req, res) => {
      console.log("🔓 Logout route hit");
  res.redirect('/student/login'); // or any route you want to use as login entry
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});


