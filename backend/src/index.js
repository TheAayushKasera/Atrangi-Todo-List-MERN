const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Allow requests from any origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Body parsing middleware to parse URL-encoded and JSON data from the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/todolist")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// Define a MongoDB schema for the Listmodel
const listSchema = new mongoose.Schema({ item: String });

// Create a model based on the schema
const Listmodel = mongoose.model("Lists", listSchema);

// Function to create data and store it in the database
const createData = async (item) => {
  const document = new Listmodel({ item: item });
  const result = await document.save();
};

// Function to read data from the database
const readData = async () => {
  const result = await Listmodel.find();
  return result;
};

// Function to delete data from the database based on the given _id
const deleteData = async (_id) => {
  const result = await Listmodel.findByIdAndDelete({ _id: _id });
  return result.item;
};

// Route to handle POST requests to add an item to the database
app.post("/api/post", async (req, res) => {
  console.log(req.body); // Log the data received from the request body
  await createData(req.body.item); // Create data and store it in the database

  res.send("Item added to Database"); // Send a response back to the client
});

// Route to handle GET requests to fetch data from the database
app.get("/api/get", async (req, res) => {
  const result = await readData(); // Read data from the database
  res.send(result); // Send the fetched data as the response
});

// Route to handle DELETE requests to delete data from the database based on the given _id
app.delete("/api/delete", async (req, res) => {
  const _id = req.body._id; // Extract the _id property from the request body
  const result = await deleteData(_id); // Delete data from the database
  res.send(result); // Send the deleted item as the response
});

// Start the server and listen on port 8000
app.listen(8000, () => {
  console.log("listening on port 8000");
});
