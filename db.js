import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ashu@9179',
  database: 'ejs_project_2'
});

// Optional: test connection immediately
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

export default db;

// import mysql from 'mysql2'

// const db=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'raghvendra',
//     database:'ejsproject'
// })
// db.connect(err=>{
//     if(err){
//         throw err;
//     }
//     else{
//         console.log("database connected")
//     }
// })

// export default db;