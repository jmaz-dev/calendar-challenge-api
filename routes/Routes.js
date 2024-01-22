// routes/apiRoutes.js
const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken-promisified");

const userController = require("../controllers/UserController");
const eventController = require("../controllers/EventController");
const authController = require("../controllers/AuthController");
const completeProfileMiddleware = require("../middleware/completeProfile");
const dotenv = require("dotenv");

dotenv.config();

// Rota de Login
router.post("/login", authController.login);

// Rota criar usuario
router.post("/users", authController.createUser);

// Middleware para verificar o token
router.use(async (req, res, next) => {
 const token = req.headers.authorization;
 const secret = process.env.JWT_TOKEN_SECRET;

 if (!token) {
  return res.status(401).json({ error: "Token não fornecido" });
 }

 try {
  const decoded = await jwt.verifyAsync(token, secret, { algorithm: "HS512" });

  req.userId = decoded.userId;

  console.log("Token válido. Payload decodificado: ", decoded);
  next();
 } catch (error) {
  console.log("Token inválido: ", error.message);
  return res.status(401).json({ error: "Token inválido" });
 }
});

// Rotas do Usuário
router.get("/users", userController.getAllUsers);
router.get("/users/:userId", userController.getUserById);
router.put("/users/:userId", userController.updateUser);
router.delete("/users/:userId", userController.deleteUser);

// Rotas do Evento
router.post("/events", eventController.createEvent);
router.get("/events", eventController.getAllEvents);
router.get("/events/:eventId", eventController.getEventById);
router.put("/events/:eventId", eventController.updateEvent);
router.delete("/events/:eventId", eventController.deleteEvent);

// Rota para Preenchimento do Perfil
router.put("/complete-profile/:userId", completeProfileMiddleware, userController.completeProfile);

module.exports = router;
