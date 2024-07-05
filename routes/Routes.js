// routes/apiRoutes.js
const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken-promisified");
const multer = require("multer");

const userController = require("../controllers/UserController");
const eventController = require("../controllers/EventController");
const authController = require("../controllers/AuthController");
const authMiddleware = require("../middleware/Auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

    next();
  } catch (error) {
    console.log("Token inválido: ", error.message);
    return res.status(401).json({ error: "Token inválido" });
  }
});

// Rotas do Usuário
router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/users/:userId", authMiddleware, userController.getUserById);
router.put("/users/:userId", authMiddleware, userController.updateUser);
router.delete("/users/:userId", authMiddleware, userController.deleteUser);

// Rotas do Evento
router.post("/events", authMiddleware, eventController.createEvent);
router.get("/events", authMiddleware, eventController.getAllEvents);
router.get("/events/:eventId", authMiddleware, eventController.getEventById);
router.get("/events-user", authMiddleware, eventController.getEventsByUser);
router.put("/events/:eventId", authMiddleware, eventController.updateEvent);
router.delete("/events/:eventId", authMiddleware, eventController.deleteEvent);

// Rota para Preenchimento do Perfil
router.put("/complete-profile/:userId", upload.single("photo"), userController.completeProfile);

module.exports = router;
