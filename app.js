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
      id: 1,
      icon: "light_mode",
      text: "My Day",
    },
    {
      id: 2,
      icon: "star",
      text: "Important",
    },
    {
      id: 3,
      icon: "calendar_month",
      text: "Planned",
    },
    {
      id: 4,
      icon: "person",
      text: "Assigned to me",
    },
    {
      id: 5,
      icon: "home",
      text: "Tasks",
    },
  ];
  let categoryId = 6;

  let taskId = 1;

  const tasks = [];

  let selectedCategory = categories[0];
  const NEW_CATEGORY = document.getElementById("new-category");
  const NEW_TASK = document.getElementById("task-input");
  const ADD_TASK_BUTTON = document.getElementById("add-task");
  const CATEGORY_LIST = document.getElementsByClassName("category");
  /**
   * main init function which calls the corresponding functions
   */
  function init() {
    getCurrentDate(DISPLAY);
    renderCategory();
    renderSelectedCategory();
    events();
  }

  /**
   * Checks the event from the user to call the necessary function
   * in case of a user enters a text and adds a response key it submits a
   * request of a entered text to add using event listener
   */
  function events() {
    NEW_CATEGORY.addEventListener("keypress", addCategory);
    NEW_TASK.addEventListener("keypress", addTask);
    ADD_TASK_BUTTON.addEventListener("click", addTask);

    for (let i = 0; i < CATEGORY_LIST.length; i++) {
      CATEGORY_LIST[i].addEventListener("click", applySelectedCategory);
    }
  }

  function applySelectedCategory(event) {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id == event.target.id) {
        const currentCategory = document.getElementsByClassName("category-selected")[0];
        currentCategory.classList = "category";
        document.getElementById("main-head").innerText = categories[i].text;
        // removeOldCategoryHighlight();
        selectedCategory = categories[i];
        renderSelectedCategory();
      }
    }
    // selectedCategory =
    //   event.target.getElementsByClassName("category-id")[0].innerText;
    // event.target.classList = "category-selected";
  }

  function renderSelectedCategory() {
    for (let i = 0; i < CATEGORY_LIST.length; i++) {
      if (CATEGORY_LIST[i].id == selectedCategory.id) {
        CATEGORY_LIST[i].className = "category-selected";
      }
    }
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
    if (element.id !== undefined) {
      createdElement.id = element.id;
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
    const date = new Date();
    if (type === DISPLAY) {
      document.getElementById("current-date").outerHTML =
        date.toLocaleDateString("en-us", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
    } else if (type === OBJECT) {
      return date;
    }
  }

  /**
   * Adds a new group for todo list
   * In which groups can be mentioned as the to-do-list holder
   * they contain list of to-do-list
   * groups adds up when the user enters the text and pressed the enter key
   * @param {*} event
   */
  function addCategory(event) {
    if (event.key === "Enter") {
      if (NEW_CATEGORY.value === "") {
        NEW_CATEGORY.value = UNTITLED;
      }
      categories.push({
        id: categoryId,
        icon: "list",
        text: NEW_CATEGORY.value,
      });
      console.log(categories);
      renderCategory();
      NEW_CATEGORY.value = "";
      categoryId++;
    }
  }

  /**
   * Renders the categories in the left to sort out the to-do based
   * upon the category
   *
   */
  function renderCategory() {
    let CATEGORY_LIST = document.getElementById("sidebar-category");
    CATEGORY_LIST.innerHTML = "";
    categories.forEach((category) => {
      let listItem = createHTMLElement("li", {
        className: "category",
        id: category.id,
      });
      let icon = createHTMLElement("i", {
        className: "material-icons",
        content: category.icon,
      });
      let text = createHTMLElement("p", {
        content: category.text,
        className: "category-text",
      });
      CATEGORY_LIST.appendChild(listItem);
      listItem.appendChild(icon);
      listItem.appendChild(text);
      if (category.id == 5) {
        let hr = createHTMLElement("hr", { className: "split-category" });
        CATEGORY_LIST.appendChild(hr);
      }
    });
  }

  /**
   * Adds a new task in todo list
   * In which tasks are the entries that user enters
   * Tasks can be divided upon categories for ease of use
   * Tasks has status to mention if the task is finished or not
   */
  function addTask(event) {
    if (event.key === "Enter" || event.type == "click") {
      if (NEW_TASK.value === "") {
        NEW_TASK.value = "";
      } else {
        tasks.push({
          id: taskId,
          class: "task-element",
          name: NEW_TASK.value,
          taskStatus: false,
          createdAt: getCurrentDate(OBJECT),
          categoryId: selectedCategory.id,
        });
        console.log(tasks);
        renderTasks();
        taskId++;
        NEW_TASK.value = "";
      }
    }
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
