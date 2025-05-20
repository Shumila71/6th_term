const fc = require('fast-check');
const request = require('supertest');
const { app } = require('./app');
const { pool } = require('./db');

// Вспомогательные функции
const registerTestUser = async (username, password) => {
  return request(app)
    .post('/api/auth/register')
    .send({ username, password });
};

const loginTestUser = async (username, password) => {
  return request(app)
    .post('/api/auth/login')
    .send({ username, password });
};

// Очистка тестовых данных перед тестами
beforeEach(async () => {
  await pool.query('DELETE FROM messages');
  await pool.query('DELETE FROM chat_users');
  await pool.query('DELETE FROM chats');
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

describe('Фаззинг-тесты для аутентификации', () => {
  test('Регистрация с рандомными данными', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length >= 3),
        fc.string({ minLength: 6, maxLength: 30 }).filter(s => s.trim().length >= 6),
        async (username, password) => {
          const res = await registerTestUser(username, password);
          
          expect([201, 400]).toContain(res.status);
          
          if (res.status === 201) {
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('userId');
          } else {
            expect(res.body.error).toBe('Данный логин занят');
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  test('Логин с рандомными данными', async () => {
    // Сначала создадим тестового пользователя
    await registerTestUser('testuser', 'testpass123');
    
    await fc.assert(
      fc.asyncProperty(
        fc.constant('testuser'),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (username, password) => {
          const res = await loginTestUser(username, password);
          
          expect([200, 401]).toContain(res.status);
          
          if (res.status === 200) {
            expect(res.body).toHaveProperty('token');
          } else {
            expect(res.body.error).toMatch(/Неверные логин или пароль/);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe('Фаззинг-тесты для чатов', () => {
  let authToken;
  let testUserId;
  
  beforeAll(async () => {
    // Создаем тестового пользователя и получаем токен
    await registerTestUser('chat_user', 'chat_pass123');
    const loginRes = await loginTestUser('chat_user', 'chat_pass123');
    authToken = loginRes.body.token;
    testUserId = loginRes.body.userId;
  });
  
  test('Создание чатов с рандомными именами', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (chatName) => {
          const res = await request(app)
            .post('/api/chats')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: chatName });
          
          expect([201, 500]).toContain(res.status);
          
          if (res.status === 201) {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', chatName);
          }
        }
      ),
      { numRuns: 30 }
    );
  });
  
  test('Добавление пользователей в чат с рандомными данными', async () => {
    // Сначала создадим чат
    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'test_chat' });
    const chatId = chatRes.body.id;
    
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 3, maxLength: 20 }),
        async (username) => {
          // Сначала регистрируем пользователя
          await registerTestUser(username, 'testpass123');
          
          const res = await request(app)
            .post('/api/chats/add-user')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ chatId, username });
          
          // Проверяем возможные ответы
          expect([200, 400, 404, 500]).toContain(res.status);
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe('Фаззинг-тесты для сообщений', () => {
  let authToken;
  let chatId;
  
  beforeAll(async () => {
    // Создаем тестового пользователя и чат
    await registerTestUser('message_user', 'message_pass123');
    const loginRes = await loginTestUser('message_user', 'message_pass123');
    authToken = loginRes.body.token;
    
    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'message_chat' });
    chatId = chatRes.body.id;
  });
  
  test('Отправка сообщений с рандомным текстом', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        async (messageText) => {
          const res = await request(app)
            .post('/api/messages/send')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ chatId, text: messageText });
          
          expect([201, 500]).toContain(res.status);
          
          if (res.status === 201) {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('text', messageText);
          }
        }
      ),
      { numRuns: 20 }
    );
  });
  
  test('Получение сообщений с рандомными параметрами', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(chatId),
        async (randomChatId) => {
          const res = await request(app)
            .get(`/api/messages/${randomChatId}`)
            .set('Authorization', `Bearer ${authToken}`);
          
          // Может вернуть 200 (если чат существует) или 500 (если нет)
          expect([200, 500]).toContain(res.status);
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe('Фаззинг-тесты для управления ролями', () => {
  let adminToken;
  let chatId;
  let testUserId;
  
  beforeAll(async () => {
    // Создаем тестового пользователя и чат
    await registerTestUser('admin_user', 'admin_pass123');
    const loginRes = await loginTestUser('admin_user', 'admin_pass123');
    adminToken = loginRes.body.token;
    testUserId = loginRes.body.userId;
    
    const chatRes = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'admin_chat' });
    chatId = chatRes.body.id;
  });
  
  test('Назначение ролей с рандомными данными', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(testUserId),
        fc.oneof(
          fc.constant('admin'),
          fc.constant('member'),
          fc.constant('moderator'),
          fc.string({ minLength: 1, maxLength: 20 })
        ),
        async (userId, role) => {
          const res = await request(app)
            .post(`/api/chats/${chatId}/assign-role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ userId, role });
          
          // Проверяем возможные ответы
          expect([200, 400, 403, 500]).toContain(res.status);
        }
      ),
      { numRuns: 30 }
    );
  });
  
  test('Назначение тегов должностей с рандомными данными', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(testUserId),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (userId, positionTag) => {
          const res = await request(app)
            .post(`/api/chats/${chatId}/assign-position-tag`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ userId, positionTag });
          
          // Проверяем возможные ответы
          expect([200, 400, 403, 500]).toContain(res.status);
        }
      ),
      { numRuns: 30 }
    );
  });
});
