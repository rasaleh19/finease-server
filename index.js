const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.send("Express server alongwith MongoDB is running!");
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("usersDB");
    const usersCollection = db.collection("users");
    const categoriesCollection = db.collection("categories");
    const transactionsCollection = db.collection("transactions");

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

      let sortField = sortBy === "amount" ? "amount" : sortBy || "createdAt";
      let sortDirection = parseInt(sortOrder);

      let pipeline = [
        { $match: query },

        { $sort: { [sortField]: sortDirection } },
      ];

      const txns = await transactionsCollection.aggregate(pipeline).toArray();
      res.send(txns);
    });

    app.get("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      let txn = await transactionsCollection.findOne({ id });
      if (!txn) {
        try {
          txn = await transactionsCollection.findOne({ _id: new ObjectId(id) });
        } catch (e) {}
      }
      res.send(txn || {});
    });

    app.post("/transactions", async (req, res) => {
      const txn = req.body;
      const result = await transactionsCollection.insertOne(txn);
      res.send(result);
    });
    app.put("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      const update = { $set: req.body };
      let result = await transactionsCollection.updateOne({ id }, update);
      if (result.matchedCount === 0) {
        try {
          result = await transactionsCollection.updateOne(
            { _id: new ObjectId(id) },
            update
          );
        } catch (e) {}
      }
      res.send(result);
    });
    app.delete("/transactions/:id", async (req, res) => {
      const id = req.params.id;
      let result = await transactionsCollection.deleteOne({ id });
      if (result.deletedCount === 0) {
        try {
          result = await transactionsCollection.deleteOne({
            _id: new ObjectId(id),
          });
        } catch (e) {}
      }
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

app.listen(PORT, () => {
  console.log(`MongoDB Server running on port ${PORT}`);
});
