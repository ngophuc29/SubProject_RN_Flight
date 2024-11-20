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
      { username, email, avatar }
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


// Khởi động server
app.listen(4000, () => {
  console.log('App listening on port 4000');
});
