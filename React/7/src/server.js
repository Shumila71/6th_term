const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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