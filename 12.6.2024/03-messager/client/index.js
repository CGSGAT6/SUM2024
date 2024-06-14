console.log("CGSG Forever!");

let choosedMsg = -1;

let userName = "";

let userBtn = $(".user_btn").get([0]); //document.querySelector(".user_btn");
let nameField = $(".name_field").get([0]);
let button = $(".send_btn").get([0]);

const messageField = $(".messages_field").get([0]);
const messageTable = $(".messages_table").get([0]);
const inputField = $(".input_field").get([0]);

function messageAdd(txt) {
  let msg = document.createElement("div");
  msg.classList.add("msg");
  msg.number = txt.number;

  let mName = document.createElement("div");
  mName.className = "msg_name";
  mName.innerText = txt.name;
  mName.id = txt.number;

  mName.setAttribute("data-scrollh", txt.height);

  let mVal = document.createElement("div");
  mVal.className = "msg_val";
  mVal.innerText = txt.value;

  // mName.onclick = (event) => {
  //   if (choosedMsg == mName.id) choosedMsg = -1;
  //   else choosedMsg = mName.id;
  //   //console.log(choosedMsg);
  // };

  if (txt.name == userName) {
    msg.classList.add("my_msg");
  } else {
    msg.classList.add("not_my_msg");
  }

  msg.appendChild(mName);

  if (txt.repl !== -1) {
    let replDiv = document.createElement("div");
    replDiv.classList.add("msg_repl");
    let ref = document.createElement("p");
    let href = "#" + txt.repl;

    let replMsg = document.getElementById(txt.repl);
    let replTxt = replMsg.innerText + ": ";
    let par = replMsg.parentElement.lastChild.innerText;

    replTxt += par.slice(0, 5);
    if (par.slice(0, 5) != par) replTxt += "...";

    ref.innerText = replTxt;
    replDiv.appendChild(ref);

    replDiv.onclick = () => {
      messageField.scroll({
        top: $(href).data("scrollh"),
        behavior: "smooth",
      });
      //console.log($(href).data("scrollh"));
    };
    msg.appendChild(replDiv);
  }

  msg.appendChild(mVal);

  let tr = document.createElement("tr");

  tr.appendChild(msg);
  messageTable.appendChild(tr);

  $("#" + txt.number).dblclick((e) => {
    if (choosedMsg == e.target.id) choosedMsg = -1;
    else choosedMsg = e.target.id;
  });
}

$(".user_btn").click(() => {
  let name = nameField.value;

  if (name != "" && nameField.disabled == false) {
    userName = name;
    nameField.disabled = true;
    initializeCommunication();
  }
});

// userBtn.addEventListener("click", () => {
//   let name = nameField.value;

//   if (name != "" && nameField.disabled == false) {
//     userName = name;
//     nameField.disabled = true;
//     initializeCommunication();
//   }
// });

function initializeCommunication() {
  let socket = new WebSocket("ws://localhost:4747");

  button.addEventListener("click", () => {
    if (userName == "") return;

    let txt = inputField.value;

    txt = txt.trim();
    if (txt !== "") {
      inputField.value = "";
      socket.send(
        JSON.stringify({
          type: "msg",
          name: userName,
          value: txt,
          repl: choosedMsg,
          height: messageField.scrollHeight,
        }),
      );

      choosedMsg = -1;
    }
  });

  $(".input_field").keydown((e) => {
    if (e.keyCode == 13 && !e.shiftKey) $(".send_btn").click();
  });

  // inputField.addEventListener("keydown", (e) => {
  //   if (e.keyCode == 13 && !e.shiftKey) {
  //     button.dispatchEvent(new Event("click"));
  //   }
  // });

  socket.onopen = (event) => {
    console.log("Socket open");
  };

  socket.onmessage = (event) => {
    let txt = JSON.parse(event.data.toString());

    if (txt.type == "msg") {
      messageAdd(txt);
      messageField.scroll({
        top: messageField.scrollHeight,
        behavior: "smooth",
      });
      // $("#" + txt.number)
      //   .parent()
      //   .hide()
      //   .show(500).then();

      messageField.scroll({
        top: messageField.scrollHeight,
        behavior: "smooth",
      });
    } else if (txt.type == "hist") {
      let msgs = txt.msgs;

      for (let m of msgs) {
        m = JSON.parse(m);
        messageAdd(m);
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
