export class MessageList {
  constructor(container) {
    this.container = container;
    this.messages = [];
    this.container.setAttribute('data-safe', 'true'); // Маркер для защиты
  }

  render(newMessages) {
    // Добавляем новые сообщения в начало
    this.messages = [...newMessages, ...this.messages];

    // Ограничиваем 50 сообщениями
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(0, 50);
    }

    // Создаем таблицу
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    ['От', 'Тема', 'Дата'].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    this.messages.forEach((msg, index) => {
      const row = document.createElement('tr');
      row.className = 'message-item';

      // Добавляем анимацию для новых сообщений
      if (index < newMessages.length) {
        row.classList.add('new-message');
      }

      // Создаем ячейки
      const createCell = (content) => {
        const cell = document.createElement('td');
        cell.textContent = content;
        return cell;
      };

      const fromCell = createCell(msg.from);
      const subjectCell = createCell(msg.shortSubject);
      subjectCell.title = msg.subject;
      const dateCell = createCell(msg.formattedDate);

      row.append(fromCell, subjectCell, dateCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    this.container.replaceChildren(table);
  }

  animateNewMessages(count) {
    const newRows = this.container.querySelectorAll(".message-item");
    Array.from(newRows)
      .slice(0, count)
      .forEach((row) => {
        row.style.animation = "fadeIn 1s ease-in-out";
      });
  }
}
