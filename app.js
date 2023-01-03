(function () {
  const categories = [
    {
      icon: "light_mode",
      info: "My Day",
    },
    {
      icon: "star",
      info: "Important",
    },
    {
      icon: "calendar_month",
      info: "Planned",
    },
    {
      icon: "person",
      info: "Assigned to me",
    },
    {
      icon: "home",
      info: "Tasks",
    },
  ];

  const toDoGroupList = [];

  /**
   * main init function which calls the corresponding functions
   */
  function init() {
    getCurrentDate();
    renderCategory(categories);
    addToDoGroup();
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
   * Renders the categories in the left to sort out the to-do based
   * upon the category
   *
   */
  function renderCategory() {
    let categoryList = document.getElementById("sidebar-list");
    categories.forEach((category) => {
      let listItem = createHTMLElement("li", {
        className: "selective",
      });
      let icon = createHTMLElement("i", {
        className: "material-icons",
        content: category.icon,
      });
      let info = createHTMLElement("p", {
        content: category.info,
        className: "category-info",
      });
      categoryList.appendChild(listItem);
      listItem.appendChild(icon);
      listItem.appendChild(info);
    });
  }

  /**
   * Creates an html element
   * Checkes the element based upon their requirement,
   * to get rid of getting a error while
   * the elements has no use of classname or innertext
   * @param {*} element
   * @returns created element
   */
  function createHTMLElement(tagName, element) {
    let createdElement = document.createElement(tagName);
    if (element.className !== undefined) {
      createdElement.className = element.className;
    }
    if (element.content !== undefined) {
      createdElement.innerText = element.content;
    }
    return createdElement;
  }

  /**
   * Adds a new group for todo list
   * In which groups can be mentioned as the to-do-list holder
   * they contain list of to-do-list
   * groups adds up when the user enters the text and pressed the enter key
   */
  function addToDoGroup() {
    let toDoGroup = document.getElementById("new-list");
    toDoGroup.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        toDoGroupList.push({
          icon: "list",
          text: toDoGroup.value,
        });
        console.log(toDoGroupList);
        renderToDoGroup();
        toDoGroup.value = "";
      }
    });
  }

  function renderToDoGroup() {
    let toDoGroups = document.getElementById("group-list");
    toDoGroups.innerHTML = "";
    toDoGroupList.forEach((toDoGroup) => {
      if (toDoGroup !== toDoGroups) {
        let listItem = createHTMLElement("li", {
          className: "group",
        });
        let icon = createHTMLElement("i", {
          className: "material-icons",
          content: toDoGroup.icon,
        });
        let text = createHTMLElement("p", {
          content: toDoGroup.text,
        });
        toDoGroups.appendChild(listItem);
        listItem.appendChild(icon);
        listItem.appendChild(text);
      }
    });
  }

  init(); //calling init method
})();
