const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb+srv://ngophuc29:phuc29112003@reactmongo.szdzq.mongodb.net/?retryWrites=true&w=majority&appName=reactMongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Định nghĩa schema và model cho người dùng
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  role: { type: String, required: true, default: "USER" },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Định nghĩa schema và model cho chuyến bay
// Định nghĩa schema cho chuyến bay
const flightSchema = new mongoose.Schema({
  totalPrice: Number,
  adultCount: Number,
  childrenCount: Number,
  infantCount: Number,
  fromLocation: String,
  toLocation: String,
  departureDate: Date,
  returnDate: Date,
  selectedClass: String,
  flightType: String,
  locations: Array,
  airline: String,
  departureFlight: String,
  returnFlight: String,
  legs: Array,
  price: Number,
  travellers: Array,
  username: String,
  avatar: String,
});

const Flight = mongoose.model('Flight', flightSchema);

 

// ------------------- Các route API -------------------

// Đăng ký người dùng
app.post('/api/register', async (req, res) => {
  console.log('Register');
  try {
    const { username, password, email, avatar } = req.body;
    const newUser = new User({ username, password, email, avatar, role: "USER" });
    await newUser.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'User or email already registered' });
    } else {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Đăng nhập người dùng
app.post('/api/users', async (req, res) => {
  console.log('Login');
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({
        id: user._id,
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      });
    } else {
      res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Lấy toàn bộ danh sách người dùng
app.get('/api/users', async (req, res) => {
  console.log('Lấy danh sách');
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Xoá người dùng
app.delete('/api/users/:id', async (req, res) => {
  console.log('Delete user');
  try {
    const { id } = req.params;
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    } else {
      res.json({ message: 'Xoá người dùng thành công' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Lấy thông tin người dùng theo ID
app.get('/api/users/:id', async (req, res) => {
  console.log('Get user by ID');
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Cập nhật thông tin người dùng
app.put('/api/users/:id', async (req, res) => {
  console.log('Update user');
  try {
    const { id } = req.params;
    const { username, email, avatar } = req.body;
    const result = await User.updateOne(
      { _id: id },
      { username, email, avatar  }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    } else {
      res.json({ message: 'Cập nhật người dùng thành công' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.put('/api/admin/users/:id', async (req, res) => {
  console.log('Update user');
  try {
    const { id } = req.params;
    console.log('Update user',id);

    const { username, email, avatar,role } = req.body;
    const result = await User.updateOne(
      { _id: id },
      { username, email, avatar, role }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    } else {
      res.json({ message: 'Cập nhật người dùng thành công' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// ------------------- Các route API cho Chuyến bay -------------------

// POST - Thêm chuyến bay mới
// API route để thêm chuyến bay
app.post('/api/flights', (req, res) => {
  const newFlight = new Flight(req.body);
  newFlight.save()
    .then(() => res.status(201).send({ message: 'Flight added successfully' }))
    .catch((err) => res.status(400).send({ error: err.message }));
});

// GET - Lấy tất cả chuyến bay
app.get('/api/flights', async (req, res) => {
  console.log('Get all flights');
  try {
    const flights = await Flight.find();
    res.json({ flights });
  } catch (err) {
    console.error('Error fetching flights:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API để lấy chuyến bay theo username
 
app.get('/api/flights/:username', async (req, res) => {
  const { username } = req.params; // Lấy username từ URL path

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Tìm chuyến bay theo username
    const flights = await Flight.find({ username });

    if (flights.length === 0) {
      return res.status(404).json({ message: 'No flights found for this user' });
    }

    res.json({ flights });
  } catch (err) {
    console.error('Error fetching flights for username:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT - Cập nhật chuyến bay
app.put('/api/flights/:id', async (req, res) => {
  const { id } = req.params; // Lấy ID chuyến bay từ URL path
  const updatedData = req.body; // Dữ liệu mới để cập nhật

  try {
    const updatedFlight = await Flight.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedFlight) {
      return res.status(404).json({ message: 'Chuyến bay không tồn tại' });
    }

    res.json({ message: 'Cập nhật chuyến bay thành công', flight: updatedFlight });
  } catch (err) {
    console.error('Error updating flight:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật chuyến bay' });
  }
});
// DELETE - Xóa chuyến bay
app.delete('/api/flights/:id', async (req, res) => {
  const { id } = req.params; // Lấy ID chuyến bay từ URL path

  try {
    const deletedFlight = await Flight.findByIdAndDelete(id);

    if (!deletedFlight) {
      return res.status(404).json({ message: 'Chuyến bay không tồn tại' });
    }

    res.json({ message: 'Chuyến bay đã được xóa thành công' });
  } catch (err) {
    console.error('Error deleting flight:', err);
    res.status(500).json({ message: 'Lỗi khi xóa chuyến bay' });
  }
});

//thống kê

app.get('/api/admin/statistics', async (req, res) => {
  try {
    // Lấy tất cả chuyến bay và người dùng
    const flights = await Flight.find();
    const users = await User.find();

    let totalFlights = flights.length; // Tổng số chuyến bay
    let totalUsers = users.length; // Tổng số người dùng
    let totalRevenue = 0; // Tổng doanh thu
    let totalAdults = 0; // Tổng số người lớn
    let totalChildren = 0; // Tổng số trẻ em
    let totalInfants = 0; // Tổng số trẻ sơ sinh

    // Khởi tạo đối tượng để thống kê chuyến bay theo loại
    let flightTypes = {
      "One-Way": 0,
      "Round-Trip": 0,
      "Multi-City": 0
    };

    // Thống kê thông tin chuyến bay và doanh thu
    flights.forEach(flight => {
      // Thêm doanh thu
      totalRevenue += flight.price;

      // Thêm số lượng hành khách
      totalAdults += flight.adultCount;
      totalChildren += flight.childrenCount;
      totalInfants += flight.infantCount;

      // Thống kê theo loại chuyến bay
      flightTypes[flight.flightType] = (flightTypes[flight.flightType] || 0) + 1;
    });

    res.json({
      totalFlights,
      totalUsers,
      totalRevenue,
      totalAdults,
      totalChildren,
      totalInfants,
      flightTypes
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê chuyến bay' });
  }
});

// Khởi động server
app.listen(4000, () => {
  console.log('App listening on port 4000');
});
