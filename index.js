const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const authRouter = require('./routes/authRoute');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('./utils/appError')
const labs_items = require('./models/labs_items');
const school_items = require("./models/school_items")
const canteen_items = require("./models/canteen_items")
const sports_items = require("./models/sports_items")
const User = require('./models/userModel');
const logs_schema = require('./models/logs_schema');

//MIddleware
// app.use(cors());
const corsOptions = {
  origin: [
    "https://school-inventory-management-system-mauve.vercel.app/",
    "http://localhost:5173",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
//2) Route
// app.use('/api/auth', authRouter);
app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const user1 = await User.findOne({ email: req.body.email });

    if (user1) {
      return next(new createError("User already exits!", 400))
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    //Assign JWT (json web Token) to user
    const token = jwt.sign({ _id: newUser._id }, 'secretkey123', {
      expiresIn: '90d',
    });
    res.status(201).json({
      status: 'success',
      message: 'User registered sucesssfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        // role: newUser.role,
      },
    })
  } catch (error) {
    next(error);
  }
}
)

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(new createError('User not found', 404));

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new createError('Invalid email or password', 401))
    }
    const token = jwt.sign({ _id: user._id }, 'secretkey123', {
      expiresIn: '90d',
    });
    res.status(200).json({
      status: 'success',
      token,
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // role: user.role,
      }
    })
  } catch (error) {
    next(error)
  }
})
//3) MOngo Db Connection 
mongoose
  .connect('mongodb://localhost:27017/school_inventory_management_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDb!'))
  .catch((error) => console.error('Failed to connect to MongoDb:', error));

//4)Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/labs_items', async (req, res) => {
  try {
    const newItem = new labs_items(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/school_items', async (req, res) => {
  try {
    const newItem = new school_items(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/sports_items', async (req, res) => {
  try {
    const newItem = new sports_items(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// const canteenRoute = require('./routes/canteenRoute');
// app.use('/canteen_items', canteenRoute);

app.get('/', async (req, res) => {
  try {
    const items = await CanteenItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Predict next month's demand
app.post('/predict/:id', async (req, res) => {
  try {
    const item = await CanteenItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Example: sending mock past data to AI service
    // const history = [
    //   { date: "2025-09-01", quantity: 10 },
    //   { date: "2025-09-10", quantity: 15 },
    //   { date: "2025-09-20", quantity: 12 },
    //   { date: "2025-09-30", quantity: 14 }
    // ];

    const response = await axios.post("http://127.0.0.1:7000/predict", { history });
    res.json({
      item_name: item.item_name,
      predicted_quantity: response.data.predicted_quantity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/canteen_items', async (req, res) => {
  try {
    const newItem = new canteen_items(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/labs_items', async (req, res) => {
  try {
    const items = await labs_items.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/canteen_items', async (req, res) => {
  try {
    const items = await canteen_items.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/sports_items', async (req, res) => {
  try {
    const items = await sports_items.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/school_items', async (req, res) => {
  try {
    const items = await school_items.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.delete('/school_items', async (req, res) => {
  const { ids } = req.body;
  await school_items.deleteMany({ _id: { $in: ids } });
  res.send({ message: 'Resources deleted successfully' });
});

app.delete('/canteen_items', async (req, res) => {
  const { ids } = req.body;
  await canteen_items.deleteMany({ _id: { $in: ids } });
  res.send({ message: 'Resources deleted successfully' });
});

// app.delete('/sports_items', async (req, res) => {
//   const { ids } = req.body;
//   await sports_items.deleteMany({ _id: { $in: ids } });
//   res.send({ message: 'Resources deleted successfully' });
// });

app.delete('/labs_items', async (req, res) => {
  const { ids } = req.body;
  await labs_items.deleteMany({ _id: { $in: ids } });
  res.send({ message: 'Resources deleted successfully' });
});
app.delete('/school_items/:id', async (req, res) => {
  try {
    const deletedItem = await school_items.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/school_items/:id', async (req, res) => {
  try {
    const updatedItem = await school_items.findByIdAndUpdate(
      req.params.id,
      {
        item_name: req.body.item_name,
        unit: req.body.unit,
        quantity: req.body.quantity,
        purchase_date: req.body.purchase_date,
        expiry_date: req.body.expiry_date,
        purchase_price: req.body.purchase_price
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/labs_items/:id', async (req, res) => {
  try {
    const deletedItem = await labs_items.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/labs_items/:id', async (req, res) => {
  try {
    const updatedItem = await labs_items.findByIdAndUpdate(
      req.params.id,
      {
        item_name: req.body.item_name,
        unit: req.body.unit,
        dimension: req.body.dimension,
        weight: req.body.weight,
        barcode: req.body.barcode,
        quantity: req.body.quantity,
        subject: req.body.subject,
        refrigirator: req.body.refrigirator,
        hazardious: req.body.hazardious,
        cost: req.body.cost,
        purchase_date: req.body.purchase_date,
        expiry_date: req.body.expiry_date,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/sports_items/:id', async (req, res) => {
  try {
    const deletedItem = await sports_items.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/sports_items/:id', async (req, res) => {
  try {
    const updatedItem = await sports_items.findByIdAndUpdate(
      req.params.id,
      {
        item_name: req.body.item_name,
        sports_name: req.body.sports_items,
        manufacturer: req.body.manufacturer,
        brand: req.body.brand,
        barcode: req.body.barcode,
        cost: req.body.cost,
        vendor_name: req.body.vendor_name,
        quantity: req.body.quantity,
        purchase_date: req.body.purchase_date,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/canteen_items/:id', async (req, res) => {
  try {
    const deletedItem = await canteen_items.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/canteen_items/:id', async (req, res) => {
  try {
    const updatedItem = await canteen_items.findByIdAndUpdate(
      req.params.id,
      {
        item_name: req.body.item_name,
        unit: req.body.unit,
        quantity: req.body.quantity,
        category: req.body.category,
        refrigirator: req.body.refrigirator,
        manufactur_date: req.body.manufactur_date,
        expiry_date: req.body.expiry_date,
        purchase_date: req.body.purchase_date,
        purchase_price: req.body.purchase_price,
        selling_price: req.body.selling_price,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.get('/:inventoryType/:inventoryId', async (req, res) => {
  const { inventoryType, inventoryId } = req.params;

  try {
    const Model = getModelByType(inventoryType);  // Function to map inventoryType to the corresponding model
    const item = await Model.findById(inventoryId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// app.post('/logs', async (req, res) => {
//   const { inventoryId, new_quantity, reason, timestamp } = req.body;

//   const logEntry = new Log({
//     inventory_name,
//     item_name,
//     previous_quantity,
//     new_quantity,
//     reason,
//     timestamp,
//   });

//   try {
//     const savedLog = await logEntry.save();
//     res.status(201).json(savedLog);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });
app.post('/logs', async (req, res) => {
  try {
    const newItem = new logs_schema(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/logs', async (req, res) => {
  try {
    const items = await logs_schema.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
function getModelByType(type) {
  switch (type) {
    case 'labs_items':
      return labs_items;
    case 'school_items':
      return school_items;
    case 'canteen_items':
      return canteen_items;
    case 'sports_items':
      return sports_items;
    default:
      throw new Error('Invalid inventory type');
  }
}


//5)server


//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});