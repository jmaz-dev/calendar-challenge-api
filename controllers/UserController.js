const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

  // Criar token de autenticação
  const token = jwt.sign({ userId: newUser._id }, "secreto", { expiresIn: "1h" });

  res.status(201).json({ token });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao criar usuário" });
 }
};

// Completar o perfil do usuário
exports.completeProfile = async (req, res) => {
 try {
  const { name, lastName, photo } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
   req.params.userId,
   { name, lastName, photo, isActive: true },
   { new: true }
  );

  if (!updatedUser) {
   return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.status(200).json(updatedUser);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao preencher o perfil" });
 }
};

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
 try {
  const users = await User.find();
  res.status(200).json(users);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao obter usuários" });
 }
};

// Obter usuário por ID
exports.getUserById = async (req, res) => {
 try {
  const user = await User.findById(req.params.userId);
  if (!user) {
   return res.status(404).json({ error: "Usuário não encontrado" });
  }
  res.status(200).json(user);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao obter usuário por ID" });
 }
};

// Atualizar usuário por ID
exports.updateUser = async (req, res) => {
 try {
  const { name, lastName, photo } = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.params.userId, { name, lastName, photo }, { new: true });
  if (!updatedUser) {
   return res.status(404).json({ error: "Usuário não encontrado" });
  }
  res.status(200).json(updatedUser);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao atualizar usuário por ID" });
 }
};

// Excluir usuário por ID
exports.deleteUser = async (req, res) => {
 try {
  const deletedUser = await User.findByIdAndDelete(req.params.userId);
  if (!deletedUser) {
   return res.status(404).json({ error: "Usuário não encontrado" });
  }
  res.status(204).send();
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao excluir usuário por ID" });
 }
};
