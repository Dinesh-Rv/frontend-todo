/**
 * Self invoking function which acts as a class
 * for certain variables and functions for the webpage
 */
(function () {
  const DISPLAY = "1";
  const OBJECT = "2";
  const UNTITLED = "Untitled Text";
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

  let toDoGroupId = 0;

  const toDoGroupList = [];

  let taskId = 0;

  const tasks = [];

  /**
   * main init function which calls the corresponding functions
   */
  function init() {
    getCurrentDate(DISPLAY);
    renderCategory(categories);
    addToDoGroup();
    processTaskName();
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
   * Displays the current date in a formatted manner to the user
   * Date to display in My Day tab
   * Date is formatted to that the
   * month and weekday as long text
   * and day as in number
   */
  function getCurrentDate(type) {
    const date = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (type === DISPLAY) {
      document.getElementById("current-date").outerHTML = date;
    } else if (type === OBJECT) {
      return date;
    }
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
   * Adds a new group for todo list
   * In which groups can be mentioned as the to-do-list holder
   * they contain list of to-do-list
   * groups adds up when the user enters the text and pressed the enter key
   */
  function addToDoGroup() {
    let toDoGroup = document.getElementById("new-list");
    toDoGroup.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        console.log(toDoGroup.value);
        if (toDoGroup.value === "") {
          toDoGroup.value = UNTITLED;
        }
        toDoGroupList.push({
          id: toDoGroupId,
          icon: "list",
          text: toDoGroup.value,
        });
        console.log(toDoGroupList);
        renderToDoGroup();
        toDoGroup.value = "";
        toDoGroup++;
      }
    });
  }

  /**
   * Renders to do group for the webpage
   * to do group contains list of tasks in to do list
   */
  function renderToDoGroup() {
    let toDoGroups = document.getElementById("group-list");
    toDoGroups.innerHTML = "";
    toDoGroupList.forEach((toDoGroup) => {
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
    });
  }

  /**
   * Processes the input task from the user, because user can
   * submit the task by pressing enter or by clicking an submit event
   */
  function processTaskName() {
    let taskName = document.getElementById("task-input");
    taskName.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        addTask(taskName.value);
        taskName.value = "";
      }
    });
  }

  /**
   * Adds a new task in todo list
   * In which tasks are the entries that user enters
   * Tasks can be divided upon categories for ease of use
   * Tasks has status to mention if the task is finished or not
   */
  function addTask(taskName) {
    if (taskName === "") {
      taskName = UNTITLED;
    }
    tasks.push({
      id: taskId,
      class: "task-element",
      name: taskName,
      taskStatus: false,
      createdAt: getCurrentDate(OBJECT),
      category: null,
      group: null,
    });
    console.log(tasks);
    renderTasks();
    taskId++;
    taskName = "";
  }

  /**
   * Renders tasks in the task container for the webpage
   * task contains user entered task which contains several manipulation features
   */
  function renderTasks() {
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    let sortedTasks = tasks.reverse();
    sortedTasks.forEach((task) => {
      let listItem = createHTMLElement("li", {
        className: "task",
      });
      let icon = createHTMLElement("i", {
        className: "fa-regular fa-circle",
      });
      let taskInfoDiv = createHTMLElement("div", {
        className: "task-info",
      });
      let text = createHTMLElement("p", {
        className: "task-name",
        content: task.name,
      });
      let footer = createHTMLElement("p", {
        className: "labels",
        content: "Tasks",
      });
      let impIconDiv = createHTMLElement("p", {
        className: "important-icon",
      });
      let importantIcon = createHTMLElement("i", {
        className: "fa-regular fa-star",
      });
      taskList.appendChild(listItem);
      listItem.appendChild(icon);
      listItem.appendChild(taskInfoDiv);
      taskInfoDiv.appendChild(text);
      taskInfoDiv.appendChild(footer);
      listItem.appendChild(impIconDiv);
      impIconDiv.appendChild(importantIcon);
    });
    sortedTasks = tasks.reverse();
  }

  init(); //calling init method
})();
