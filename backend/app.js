const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import cors

const app = express();

app.use(cors()); // Kích hoạt CORS cho tất cả các yêu cầu
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sapassword',
  database: 'reactmysql'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});
 

//dang ky nguoi dung 
app.post('/api/register', (req, res) => {
  console.log('Register');
  
  // Lấy dữ liệu từ body
  const { username, password, email, avatar } = req.body;

  const sql = "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)";
  
  connection.query(sql, [username, email, password, avatar], function (err, result) {
    if (err) { 
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "User or email already registered" });
      }
      console.log("Error inserting", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json({ message: "User registered successfully" });
  });
});


// dang nhap nguoi dung
app.post('/api/users', (req, res) => {
  console.log('Login');
  
  // Lấy dữ liệu từ body
  const { username, password  } = req.body;

  const sql = "Select * from users where username=? and password=?";
  
  connection.query(sql, [username,  password ], function (err, result) {
    if (err) { 
      
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result.length > 0) {
      return res.json({
        id: result[0].id,
        avatar: result[0].avatar,
        username: result[0].username,
        email: result[0].email,
        created_at: result[0].created_at
      })

    }
    else {
      return res.status(401).json({message: "Thong tin dang nhap k chinh xac"})
    }
  });
});


// lay toan bo danh sach nguoi dung 
app.get('/api/users', (req, res) => {
  console.log('lay danh sach');
  
  const sql = "select * from users"
  connection.query(sql, function (err, result) {
    if (err) { 
      console.log("lay danh sach khong thanh cong")
      return res.status(500).json({ message: "Internal server error" });
    }

    
   
       res.json({users:result})
        console.log(result)
  });
});



// xoa nguoi dung 
app.delete('/api/users/:id', (req, res) => {
  console.log('Delete user');
  
  // Lấy id từ params
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";
  
  connection.query(sql, [id], function (err, result) {
    if (err) { 
      console.error("Lỗi khi xoá người dùng:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Kiểm tra nếu không có dòng nào bị ảnh hưởng
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Xoá người dùng thành công" });
  });
});

//cap nhat nguoi dung
//lay thong tin nguoi dung theo id
app.get('/api/users/:id', (req, res) => {
  console.log('get users by id');
  
  // Lấy id từ params
  const { id } = req.params;

  const sql = "SELECT * FROM users WHERE id = ?";

  connection.query(sql, [id], function (err, result) {
    if (err) { 
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Kiểm tra nếu không có dòng nào được trả về
    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Gửi thông tin người dùng
    res.json(result[0]);
  });
});


app.put('/api/users/:id', (req, res) => {
  // Lấy id từ params
  const { id } = req.params;  // Lấy id từ params
  const { username, email, avatar } = req.body;  // Lấy dữ liệu từ body

  const sql = "UPDATE users SET username = ?, email = ?, avatar = ? WHERE id = ?";

  connection.query(sql, [username, email, avatar, id], function (err, result) {
    if (err) { 
      console.error("Lỗi khi cập nhật thông tin người dùng:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Kiểm tra nếu không có dòng nào bị ảnh hưởng
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Gửi thông báo thành công
    res.json({ message: "Cập nhật người dùng thành công" });
  });
});



// Khởi động server
app.listen(4000, () => {
  console.log('App listening on port 4000');
});
