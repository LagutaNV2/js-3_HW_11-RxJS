import { interval } from "rxjs";
import { MessageService } from "./components/MessageService";
import { MessageList } from "./components/MessageList";

const POLLING_INTERVAL = 5000; // 5 секунд

// Инициализация компонентов
const messageService = new MessageService(
  "http://localhost:7070/messages/unread",
);
const messageList = new MessageList(
  document.getElementById("message-container"),
);

// Настройка потока данных
interval(POLLING_INTERVAL)
  .pipe(
    messageService.fetchMessages(), // Получаем новые сообщения
    messageService.processMessages(), // Фильтруем и преобразуем данные
  )
  .subscribe({
    next: (messages) => messageList.render(messages),
    error: (err) => console.error("Ошибка:", err),
  });
