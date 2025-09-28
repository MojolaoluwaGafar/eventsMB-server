const EVENT = require("../models/Event");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
  console.log("Incoming create event request");
  const {
    date,
    title,
    host,
    timeStart,
    timeEnd,
    location,
    online,
    description,
    category,
    tags,
    free,
    regularEnabled,
    regular,
    vip,
    vipEnabled,
  } = req.body;

  const isOnline = online === "true";
  const isFree = free === "true";
  const isRegularEnabled = regularEnabled === "true";
  const isVipEnabled = vipEnabled === "true";
  const parsedTags = JSON.parse(tags || "[]");

  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    if (!title || !host || !date || !timeStart || !timeEnd || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isOnline && !location) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!isFree) {
      if (isRegularEnabled && (regular === undefined || regular < 0)) {
        return res.status(400).json({ message: "Regular price is required" });
      }
      if (isVipEnabled && (vip === undefined || vip < 0)) {
        return res.status(400).json({ message: "VIP price is required" });
      }
    }

    const photoUrl = req.file?.path;
    if (!photoUrl) {
      return res.status(400).json({ message: "Event photo is required" });
    }

    const newEvent = new EVENT({
      photo: photoUrl,
      title,
      hostName: host,
      date,
      timeStart,
      timeEnd,
      location,
      online: isOnline,
      description,
      category,
      tags: parsedTags,
      free: isFree,
      regular,
      regularEnabled: isRegularEnabled,
      vip,
      vipEnabled: isVipEnabled,
      createdBy: req.user.userId,
      hostedBy: req.user.userId,
    });

    await newEvent.save();
    console.log("Event created:", newEvent._id);

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating an event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getHostingEvents = async (req, res) => {
  console.log("Incoming hosting events request");

  try {
    const userId = req.user.userId;
    const events = await EVENT.find({ hostedBy: userId }).sort({ date: 1 });

    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching hosting events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendingEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await EVENT.find({ attendees: userId })
      .populate("hostedBy", "fullName email")
      .populate("attendees", "fullName email")
      .sort({ date: 1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching attending events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPreviousEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    const events = await EVENT.find({
      hostedBy: userId,
      date: { $lt: today },
    }).sort({ date: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching previous events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    console.log("All events request received");
    const events = await EVENT.find().sort({ date: 1 });
    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching all events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSearchEvents = async (req, res) => {
  try {
    const {
      query,
      location,
      category,
      tags,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (query) {
      const regex = { $regex: query, $options: "i" };
      filter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { location: regex },
        { tags: regex },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (tags) {
      filter.tags = { $in: tags.split(",").map((tag) => new RegExp(tag, "i")) };
    }

    if (minPrice || maxPrice) {
      filter.$or = filter.$or || [];
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      filter.$or.push({ regular: priceFilter }, { vip: priceFilter });
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      EVENT.find(filter).skip(skip).limit(Number(limit)).sort({ date: 1 }),
      EVENT.countDocuments(filter),
    ]);

    res.status(200).json({
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching search events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getAttendingEvents,
  getHostingEvents,
  getPreviousEvents,
  getAllEvents,
  getSearchEvents,
};
