getCurrentDate();

/**
 * Displays the current date in a formatted manner to the user
 */
function getCurrentDate() {
  const date = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  document.getElementById("current-date").outerHTML = date;
}

var toDoHolderName = document.getElementById("to-do-vault-name");
toDoHolderName.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const node = document.createElement("li");
    const text = document.createTextNode(toDoHolderName.value);
    node.innerHTML = '<i class="material-icons">list</i>';
    node.appendChild(text);
    document.getElementById("sortable-list").appendChild(node);
    toDoHolderName.value = "";
  }
});
