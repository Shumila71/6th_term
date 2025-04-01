const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = 'your-secret-key';
const sequelize = new Sequelize('postgres', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

const Employee = sequelize.define('employee', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  position: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Middleware аутентификации
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Запуск сервера и инициализация БД
sequelize.sync({ force: false })
  .then(async () => {
    const adminExists = await User.findOne({ where: { isAdmin: true } });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@mail.ru',
        password: await bcrypt.hash('123', 10),
        isAdmin: true
      });
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });

// Роуты аутентификации
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Защищенные роуты
app.get('/employees', authenticate, async (req, res) => {
  try {
    const where = req.user.isAdmin ? {} : { createdBy: req.user.id };
    const employees = await Employee.findAll({ where });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/employees', authenticate, async (req, res) => {
  try {
    const employee = await Employee.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/employees/:id', authenticate, async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (!req.user.isAdmin) where.createdBy = req.user.id;

    const employee = await Employee.findOne({ where });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Not found or no permissions' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/employees/:id', authenticate, async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (!req.user.isAdmin) where.createdBy = req.user.id;

    const [updated] = await Employee.update(req.body, { where });
    if (updated) {
      const updatedEmployee = await Employee.findByPk(req.params.id);
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Not found or no permissions' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/employees/:id', authenticate, async (req, res) => {
  try {
    const where = { id: req.params.id };
    if (!req.user.isAdmin) where.createdBy = req.user.id;

    const deleted = await Employee.destroy({ where });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Not found or no permissions' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
