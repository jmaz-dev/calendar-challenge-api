const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken-promisified");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWT_TOKEN_SECRET;

// Criar um novo usuário
exports.createUser = async (req, res) => {
 try {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
   return res.status(400).json({ error: "E-mail já cadastrado" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();

  const payload = { userId: newUser._id };
  const token = await jwt.signAsync(payload, secret, { algorithm: "HS512", expiresIn: "3h" });

  res.status(201).json({ needsProfile: true, userId: newUser._id, token: token });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao criar usuário" });
 }
};

// Login usuário existente
exports.login = async (req, res) => {
 const { email, password } = req.body;

 try {
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
   return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const payload = { userId: user._id };
  const token = await jwt.signAsync(payload, secret, { algorithm: "HS512", expiresIn: "3h" });
  if (!user.isActive) {
   return res.status(200).json({ needsProfile: true, userId: user._id, token });
  }

  res.status(200).json({ token, userId: user._id, needsProfile: false });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao fazer login" });
 }
};
