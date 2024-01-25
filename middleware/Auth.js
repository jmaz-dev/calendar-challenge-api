const User = require("../models/User");
const secret = process.env.JWT_TOKEN_SECRET;
const jwt = require("jsonwebtoken-promisified");

module.exports = async (req, res, next) => {
 try {
  const user = await User.findById(req.userId);
  const token = req.headers.authorization;

  if (!token) {
   return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, secret, (err, decoded) => {
   if (err) {
    return res.status(401).json({ error: "Token inválido" });
   }

   req.userId = decoded.userId;
  });

  if (!user) {
   return res.status(404).json({ error: "Usuário não encontrado" });
  }

  if (!user.isActive) {
   // Se o usuário não estiver ativo, envie informações para o preenchimento do perfil
   return res.status(200).json({ needsProfile: true });
  }

  next();
 } catch (error) {
  res.status(500).json({ error: "Erro ao verificar o perfil do usuário" });
 }
};
