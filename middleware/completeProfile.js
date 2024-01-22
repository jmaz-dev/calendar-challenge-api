const User = require("../models/User");

module.exports = async (req, res, next) => {
 try {
  const user = await User.findById(req.userId);

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
