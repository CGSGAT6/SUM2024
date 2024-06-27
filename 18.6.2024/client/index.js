let nameField = $(".name_field").get([0]);
let userBtn = $(".user_btn").get([0]);

if (sessionStorage.getItem("state") == "NameError") {
  alert("Игрок с таким именем уже существует!");
  nameField.value = "";
}

$(".user_btn").click(() => {
  let name = nameField.value;

  if (name != "") {
    let userName = name;
    sessionStorage.setItem("Name", userName);
    sessionStorage.setItem("Logined", "false");
    window.location.href = "./game.html";
  }
});