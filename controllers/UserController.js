const User = require("../models/User");

// Completar o perfil do usuário
exports.completeProfile = async (req, res) => {
 try {
  const { name, lastName } = req.body;

  const photo = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;

  const updatedUser = await User.updateOne(
   { _id: req.params.userId },
   { $set: { name, lastName, photo, isActive: true } }
  );

  if (!updatedUser) {
   return res.status(404).json({ error: "Usuário não encontrado" });
  }

  res.status(200).json({ message: "Perfil atualizado com sucesso" });
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
