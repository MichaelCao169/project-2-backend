const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const RefreshToken = require('../models/RefreshToken'); 

// Tạo access token
const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Tạo refresh token
const createRefreshToken = async (user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET);
  await new RefreshToken({ token, userId: user._id }).save();
  return token;
};


// Đăng ký User
const registerUser = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword, fullName });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Đăng nhập User
const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ email: identifier });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials non-exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials no match' });
    }
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Đăng ký Company
const registerCompany = async (req, res) => {
  const { companyName, email, password, companyLogo, description, industry, website } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const company = new Company({ companyName, email, password: hashedPassword, companyLogo, description, industry, website });
    await company.save();
    res.status(201).json({ message: 'Company registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering company', error: err.message });
  }
};

// Đăng nhập Company
const loginCompany = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const company = await Company.findOne({ email: identifier });
    if (!company) {
      return res.status(400).json({ message: 'Invalid credentials non-exist company' });
    }
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials no match company ' });
    }
    const accessToken = createAccessToken(company);
    const refreshToken = await createRefreshToken(company);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Làm mới access token
const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const existingToken = await RefreshToken.findOne({ token });

    if (!existingToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id) || await Company.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAccessToken = createAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerCompany,
  loginCompany,
  refreshToken,
};