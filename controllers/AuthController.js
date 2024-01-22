const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
 const { email, senha } = req.body;

 try {
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(senha, user.senha)) {
   return res.status(401).json({ error: "Credenciais inválidas" });
  }

  if (!user.isActive) {
   return res.status(200).json({ needsProfile: true, userId: user._id });
  }

  const token = jwt.sign({ userId: user._id }, "secreto", { expiresIn: "3h" });
  res.status(200).json({ token });
 } catch (error) {
  res.status(500).json({ error: "Erro ao fazer login" });
 }
};
