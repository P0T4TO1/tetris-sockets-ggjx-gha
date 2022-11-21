
const btnLogin = document.getElementById("btnLogin");
const username = document.getElementById("username");
const roomName = document.getElementById("roomName");

btnLogin.addEventListener("click", () => {
  if (username.value !== "" && roomName.value !== "") {
    document.cookie = `username=${username.value}`;
    document.cookie = `roomName=${roomName.value}`;
    document.location.href = "/";
  } else {
    Swal.fire(
      "Error",
      "El nombre de usuario y la sala no pueden estar vacíos",
      "error"
    );
  }
});

username.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    btnLogin.click();
  }
});
