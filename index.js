const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PORT
const PORT = process.env.PORT || 3000;

const uri =
  "mongodb+srv://rasaleh:2u9EpEfAKjwLMSTo@cluster0.sgftned.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Root Route
app.get("/", (req, res) => {
  res.send("Express server with CORS and MongoDB is running!");
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("usersDB");
    const usersCollection = db.collection("users"); // fixed to lowercase
    const categoriesCollection = db.collection("categories");
    const transactionsCollection = db.collection("transactions"); // fixed to lowercase

    // USERS CRUD
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = email ? { email } : {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = await usersCollection.findOne({ id });
      res.send(user);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const update = { $set: req.body };
      const result = await usersCollection.updateOne({ id }, update);
      res.send(result);
    });

    // CATEGORIES CRUD
    app.get("/categories", async (req, res) => {
      const type = req.query.type;
      const query = type ? { type } : {};
      const categories = await categoriesCollection.find(query).toArray();
      res.send(categories);
    });
    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const category = await categoriesCollection.findOne({ id });
      res.send(category);
    });
    app.post("/categories", async (req, res) => {
      const category = req.body;
      const result = await categoriesCollection.insertOne(category);
      res.send(result);
    });
    app.put("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const update = { $set: req.body };
      const result = await categoriesCollection.updateOne({ id }, update);
      res.send(result);
    });
    app.delete("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const result = await categoriesCollection.deleteOne({ id });
      res.send(result);
    });

    // TRANSACTIONS CRUD
    // Get all transactions (admin) or filter by userId/email
    app.get("/transactions", async (req, res) => {
      const {
        userId,
        email,
        type,
        categoryId,
        sortBy,
        sortOrder = -1,
        month,
      } = req.query;
      let query = {};
      if (userId) query.userId = userId;
      if (email) query.userEmail = email;
      if (type) query.type = type;
      if (categoryId) query.categoryId = categoryId;
      if (month) query.month = month;
      let sort = {};
      if (sortBy) sort[sortBy] = parseInt(sortOrder);
      else sort["createdAt"] = -1;
      const txns = await transactionsCollection
        .find(query)
        .sort(sort)
        .toArray();
      res.send(txns);
    });
    app.get("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const txn = await transactionsCollection.findOne({ id });
      res.send(txn);
    });
    app.post("/transactions", async (req, res) => {
      const txn = req.body;
      const result = await transactionsCollection.insertOne(txn);
      res.send(result);
    });
    app.put("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const update = { $set: req.body };
      const result = await transactionsCollection.updateOne({ id }, update);
      res.send(result);
    });
    app.delete("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const result = await transactionsCollection.deleteOne({ id });
      res.send(result);
    });

    // Transaction summary for Home/Reports (total balance, income, expenses)
    app.get("/summary/:userId", async (req, res) => {
      const userId = req.params.userId;
      const txns = await transactionsCollection.find({ userId }).toArray();
      let income = 0,
        expense = 0,
        savings = 0;
      txns.forEach((t) => {
        if (t.type === "Income") income += Number(t.amount);
        else if (t.type === "Expense") expense += Number(t.amount);
        else if (t.type === "Savings") savings += Number(t.amount);
      });
      res.send({
        totalBalance: income - expense - savings,
        income,
        expense,
        savings,
      });
    });

    // Category total for Transaction Details
    app.get("/category-total/:categoryId/:userId", async (req, res) => {
      const { categoryId, userId } = req.params;
      const txns = await transactionsCollection
        .find({ categoryId, userId })
        .toArray();
      const total = txns.reduce((sum, t) => sum + Number(t.amount), 0);
      res.send({ total });
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir());

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
