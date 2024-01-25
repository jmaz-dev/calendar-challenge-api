const Event = require("../models/Events");

exports.createEvent = async (req, res) => {
 try {
  const { description, startDate, endDate } = req.body;

  const existingEvent = await Event.findOne({
   startDate: { $lte: endDate },
   endDate: { $gte: startDate },
  });

  if (existingEvent) {
   return res.status(400).json({ error: "Já existe um evento para esta data" });
  }

  const newEvent = new Event({ user: req.userId, description, startDate, endDate });
  const savedEvent = await newEvent.save();

  res.status(201).json(savedEvent);
 } catch (error) {
  res.status(500).json({ error: "Erro ao criar evento" });
 }
};

// Obter todos os eventos
exports.getAllEvents = async (req, res) => {
 try {
  const events = await Event.find();
  res.status(200).json(events);
 } catch (error) {
  res.status(500).json({ error: "Erro ao obter eventos" });
 }
};

// Obter evento por ID
exports.getEventById = async (req, res) => {
 try {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
   return res.status(404).json({ error: "Evento não encontrado" });
  }
  res.status(200).json(event);
 } catch (error) {
  res.status(500).json({ error: "Erro ao obter evento por ID" });
 }
};

// Atualizar evento por ID
exports.updateEvent = async (req, res) => {
 try {
  const { description, startDate, endDate } = req.body;

  const existingEvent = await Event.findOne({
   _id: { $ne: req.params.eventId },
   startDate: { $lte: endDate },
   endDate: { $gte: startDate },
  });

  if (existingEvent) {
   return res.status(400).json({ error: "Já existe um evento para esta data" });
  }

  const updatedEvent = await Event.findByIdAndUpdate(
   req.params.eventId,
   { description, startDate, endDate },
   { new: true }
  );

  if (!updatedEvent) {
   return res.status(404).json({ error: "Evento não encontrado" });
  }

  res.status(200).json(updatedEvent);
 } catch (error) {
  res.status(500).json({ error: "Erro ao atualizar evento por ID" });
 }
};

// Excluir evento por ID
exports.deleteEvent = async (req, res) => {
 try {
  const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
  if (!deletedEvent) {
   return res.status(404).json({ error: "Evento não encontrado" });
  }
  res.status(204).send();
 } catch (error) {
  res.status(500).json({ error: "Erro ao excluir evento por ID" });
 }
};

// Obter todos os eventos vinculados a um usuário
exports.getEventsByUser = async (req, res) => {
 try {
  const events = await Event.find({ user: req.userId });
  res.status(200).json(events);
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Erro ao obter eventos do usuário" });
 }
};
