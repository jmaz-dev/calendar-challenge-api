// routes/apiRoutes.js

const express = require("express");
const router = express.Router();

const userController = require("../controllers/UserController");
const eventController = require("../controllers/EventController");
const authController = require("../controllers/AuthController");
const completeProfileMiddleware = require("../middleware/completeProfile");

// Rota de Login
router.post("/login", authController.login);

// Middleware para verificar o token
router.use((req, res, next) => {
 const token = req.headers.authorization;

 if (!token) {
  return res.status(401).json({ error: "Token não fornecido" });
 }

 jwt.verify(token, "secreto", (err, decoded) => {
  if (err) {
   return res.status(401).json({ error: "Token inválido" });
  }

  req.userId = decoded.userId;
  next();
 });
});

// Rotas do Usuário
router.post("/users", userController.createUser);
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
