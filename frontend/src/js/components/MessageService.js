import { ajax } from "rxjs/ajax";
import { map, catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";

export class MessageService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  fetchMessages() {
    return (source) =>
      source.pipe(
        switchMap(() => ajax.getJSON(this.apiUrl)),
        catchError(() => of({ messages: [] })),
      );
  }

  processMessages() {
    return map((response) => {
      if (!response.messages) return [];
      return response.messages.map((msg) => ({
        ...msg,
        shortSubject: this.truncateSubject(msg.subject),
        formattedDate: this.formatDate(msg.received),
      }));
    });
  }

  truncateSubject(subject) {
    return subject.length > 15 ? subject.slice(0, 15) + "..." : subject;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    const time = date.toLocaleTimeString('ru-RU', timeOptions);
    const formattedDate = date.toLocaleDateString('ru-RU', dateOptions);

    return `${time} ${formattedDate}`;
  }
}
