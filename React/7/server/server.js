const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Sequelize = require('sequelize');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Секретный ключ для JWT
const JWT_SECRET = 'your-secret-key';

// Временная "база данных" для хранения пользователей
const users = [];

// Регистрация нового пользователя
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Проверка, существует ли пользователь с таким email
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создание нового пользователя
    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);

    // Генерация JWT токена
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
});

// Авторизация пользователя
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Поиск пользователя в "базе данных"
    const user = users.find((user) => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Генерация JWT токена
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log(user.email, user.password)
    res.status(200).json({ token });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
//----------------------------------------

// Подключение к PostgreSQL
const sequelize = new Sequelize('postgres', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres'
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
    }
  });
  
  // Синхронизация с базой данных
  sequelize.sync({ force: false }); // force: true пересоздает таблицы
  
  // CRUD endpoints для Employee
  
  // Create Employee
  app.post('/employees', async (req, res) => {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Read all Employees
  app.get('/employees', async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Read one Employee
  app.get('/employees/:id', async (req, res) => {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (employee) {
        res.json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update Employee
  app.put('/employees/:id', async (req, res) => {
    try {
      const [updated] = await Employee.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedEmployee = await Employee.findByPk(req.params.id);
        res.json(updatedEmployee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete Employee
  app.delete('/employees/:id', async (req, res) => {
    try {
      const deleted = await Employee.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });