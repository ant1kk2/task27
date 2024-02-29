import "./styles.css";

const nameField = document.getElementById("name");
const surnameField = document.getElementById("surname");
const regForm = document.getElementById("regForm");
const chat = document.querySelector(".chat__container");

const sendBtn = document.querySelector(".chat__send-btn");
const message = document.querySelector(".chat__input-field");

message.addEventListener('input', e => {
  sendBtn.classList.remove('inactive')
  if(!e.target.value){
    sendBtn.classList.add('inactive')
  }
})

function checkTextField(e) {
  e.target.classList.remove("empty");
}

nameField.addEventListener("input", checkTextField);
surnameField.addEventListener("input", checkTextField);

function gotoChat(e) {
  e.preventDefault();
  [nameField, surnameField].forEach((field) => {
    field.classList.remove("empty");
    if (field.value.trim() === "") {
      field.classList.add("empty");
    }
  });
  if (
    nameField.classList.contains("empty") ||
    surnameField.classList.contains("empty")
  ) {
    return;
  }
  this.remove();
  chat.style.display = "block";

  const user = {
    message: "",
    name: nameField.value,
    surname: surnameField.value,
  };
  const protocol = location.protocol === 'http:' ? 'ws' : 'wss'
  const ws = new WebSocket(`${protocol}://${location.host}`);

  ws.addEventListener("open", () => {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mes = message.value.trim();
      if (mes) {
        user.message = mes;
        ws.send(JSON.stringify(user));
        message.value = "";
      }
    });
  });

  ws.addEventListener("message", (e) => {
    const avatar = JSON.parse(e.data).avatar;
    const date = JSON.parse(e.data).date;
    const message = JSON.parse(e.data).message;
    const isNotMyMessage = JSON.parse(e.data).isNotMyMessage;

    const chat = document.querySelector(".chat__window");
    const text = document.createElement("div");

    if (isNotMyMessage) {
      text.className = "chat__message not-my-message";

      const avaEl = document.createElement("div");
      avaEl.className = "not-my-message__avatar";
      const mesEl = document.createElement("div");
      mesEl.className = "not-my-message__text";
      const timeEl = document.createElement("div");
      timeEl.className = "not-my-message__time";

      avaEl.innerHTML = avatar;
      mesEl.innerHTML = message;
      timeEl.innerHTML = formatDate(+date);
      text.append(avaEl);
      text.append(mesEl);
      text.append(timeEl);

      chat.append(text);
      chat.scrollTop = chat.scrollHeight;
    } else {
      text.className = "chat__message my-message";
      const mesEl = document.createElement("div");
      mesEl.className = "my-message__text";
      const timeEl = document.createElement("div");
      timeEl.className = "my-message__time";
      mesEl.innerHTML = message;
      timeEl.innerHTML = formatDate(+date);
      text.append(mesEl);
      text.append(timeEl);

      chat.append(text);
      chat.scrollTop = chat.scrollHeight;
    }
  });
}

regForm.addEventListener("submit", gotoChat);

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const months = [
    "сiч",
    "лют",
    "бер",
    "квiт",
    "трав",
    "черв",
    "лип",
    "серп",
    "вер",
    "жовт",
    "лист",
    "груд",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedDay = day < 10 ? "0" + day : day;
  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return (
    formattedDay + " " + month + " " + formattedHours + ":" + formattedMinutes
  );
}
