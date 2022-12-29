/**
 * main init function which calls the corresponding functions
 */
function init() {
  getCurrentDate();
  addNewList();
}

/**
 * Displays the current date in a formatted manner to the user
 * Date to display in My Day tab
 * Date is formatted to that the
 * month and weekday as long text
 * and day as in number
 */
function getCurrentDate() {
  const date = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  document.getElementById("current-date").outerHTML = date;
}

/**
 * Adds a new list
 * In which list can be mentioned as the to-do-list holder
 * they contain list of to-do-list
 * list keeps adding up when the user enters the text
 * and pressed the enter key
 */
function addNewList() {
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
}

init(); //calling init method
