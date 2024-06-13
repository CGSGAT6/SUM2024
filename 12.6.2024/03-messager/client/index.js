console.log("CGSG Forever!");

let userName = "";

let userBtn = document.querySelector(".user_btn");
let nameField = document.querySelector(".name_field");

userBtn.addEventListener("click", () => {
  let name = nameField.value;

  if (name != "" && nameField.disabled == false) {
    userName = name;
    nameField.disabled = true;
    initializeCommunication();
  }
});

function initializeCommunication() {
  let socket = new WebSocket("ws://localhost:4747");

  let button = document.querySelector(".send_btn");

  const messageField = document.querySelector(".messages_field");
  const messageTable = document.querySelector(".messages_table");
  const inputField = document.querySelector(".input_field");

  button.addEventListener("click", () => {
    if (userName == "") return;

    let txt = inputField.value;
    if (txt.trim() !== "") {
      inputField.value = "";
      socket.send(
        JSON.stringify({
          type: "msg",
          name: userName,
          value: txt.trim(),
        }),
      );
    }
  });

  inputField.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      button.dispatchEvent(new Event("click"));
    }
  });

  socket.onopen = (event) => {
    console.log("Socket open");
  };

  socket.onmessage = (event) => {
    let txt = JSON.parse(event.data.toString());

    if (txt.type == "msg") {
      let msg = document.createElement("div");
      msg.className = "msg";

      let mName = document.createElement("div");
      mName.className = "msg_name";
      mName.innerText = txt.name;

      let mVal = document.createElement("div");
      mVal.className = "msg_val";
      mVal.innerText = txt.value;

      if (txt.name == userName) {
        msg.id = "my_msg";
      }

      msg.appendChild(mName);
      msg.appendChild(mVal);

      let tr = document.createElement("tr");

      tr.appendChild(msg);
      messageTable.appendChild(tr);
      /*messageField.appendChild(msg);
      messageField.appendChild(document.createElement("br"));*/
      messageField.scroll({
        top: messageField.scrollHeight,
        behavior: "smooth",
      });
    } else if (txt.type == "hist") {
      let msgs = txt.msgs;

      for (let m of msgs) {
        m = JSON.parse(m);
        let msg = document.createElement("div");
        msg.className = "msg";
        let mName = document.createElement("div");
        mName.className = "msg_name";
        mName.innerText = m.name;
        let mVal = document.createElement("div");
        mVal.className = "msg_val";
        mVal.innerText = m.value;

        if (m.name == userName) {
          msg.id = "my_msg";
        }

        msg.appendChild(mName);
        msg.appendChild(mVal);

        let tr = document.createElement("tr");

        tr.appendChild(msg);
        messageTable.appendChild(tr);

        /*
        messageField.appendChild(msg);
        messageField.appendChild(document.createElement("br"));*/
      }

      messageField.scroll({
        top: messageField.scrollHeight,
        behavior: "smooth",
      });
    }
  };
}
