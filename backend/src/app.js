/** @format */

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.use(express.json()); //  parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/practicetwo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected.......Database....");
  })
  .catch((error) => {
    console.error("Not Connected..........", error);
  });

// Create schema
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  age: Number,
});

// Create model
const User = new mongoose.model("User", userSchema);

// Define the GET API route
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Define the POST API route
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});
// Define the DELETE API route
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});
// Define the PUT API route
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated user
      runValidators: true, // Validate the updated data
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
