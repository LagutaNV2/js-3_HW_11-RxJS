// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import * as crypto from "crypto";
// import pino from 'pino';
// import pinoPretty from 'pino-pretty';
// import { faker } from '@faker-js/faker';
// import path from 'path';
// import { fileURLToPath } from 'url';
"use strict";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const pino = require('pino');
const pinoPretty = require('pino-pretty');
const { faker } = require('@faker-js/faker');
const path = require('path');
const { fileURLToPath } = require('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const logger = pino(pinoPretty());

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(
  bodyParser.json({
    type(req) {
      return true;
    },
  })
);

// Middleware для CSP заголовков
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:;"
  );
  next();
});

// Маршрут для получения непрочитанных сообщений
app.get('/messages/unread', (req, res) => {
  try {
    // Генерация случайного количества сообщений (0-3)
    const messages = Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      id: crypto.randomUUID(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence({ min: 5, max: 20 }), // Генерация заголовков разной длины
      body: faker.lorem.paragraph(),
      received: faker.date.recent({ days: 7 }).getTime(), // Случайная дата за последние 7 дней
    }));

    logger.info('GET /messages/unread responded with %d messages', messages.length);
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      messages,
    });
  } catch (error) {
    logger.error('Error in /messages/unread: %s', error.message);
    res.status(200).json({
      status: 'ok',
      timestamp: Date.now(),
      messages: [], // В случае ошибки возвращаем пустой массив сообщений
    });
  }
});

const port = process.env.PORT || 7070;

const bootstrap = async () => {
  try {
    app.listen(port, () =>
        logger.info(`Server has been started on http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
