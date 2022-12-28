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

var toDoHolderName = document.getElementById("to-do-holder-name");
toDoHolderName.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const node = document.createElement("li");
    const text = document.createTextNode(toDoHolderName.value);
    node.appendChild(text);
    document.getElementById("to-do-holder-list").appendChild(node);
    toDoHolderName.value = "";
  }
});
