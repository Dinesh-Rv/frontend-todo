/**
 * Self invoking function which acts as a class
 * for certain variables and functions for the webpage
 */
(function () {
  const DISPLAY = "display";
  const OBJECT = "object";
  const OPEN = "open";
  const CLOSE = "close";
  const UNTITLED = "Untitled Text";

  const CATEGORIES = [
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
  let categoryId = 5;

  let taskId = 1;

  const TASKS = [];

  let selectedCategory = CATEGORIES[0];
  let selectedTask = null;
  const NEW_CATEGORY = document.getElementById("new-category");
  const NEW_TASK = document.getElementById("task-input");
  const ADD_TASK_BUTTON = document.getElementById("add-task");
  const CATEGORY_LIST = document.getElementsByClassName("category");
  const TASK_LIST = document.getElementsByClassName("task");
  const RIGHT_SIDE = document.getElementById("right-side");
  /**
   * main init function which calls the corresponding functions
   */
  function init() {
    getCurrentDate(DISPLAY);
    renderCategory();
    renderTasks();
    renderSelectedCategory();
    controlRightSide(CLOSE);
    events();
  }

  /**
   * Checks the event from the user to call the necessary function
   * in case of a user enters a text and adds a response key it submits a
   * request of a entered text to add using event listener
   *
   */
  function events() {
    NEW_CATEGORY.addEventListener("keypress", addCategory);
    NEW_TASK.addEventListener("keypress", addTask);
    ADD_TASK_BUTTON.addEventListener("click", addTask);

    for (let i = 0; i < CATEGORY_LIST.length; i++) {
      CATEGORY_LIST[i].addEventListener("click", applySelectedCategory);
    }

    for (let i = 0; i < TASK_LIST.length; i++) {
      TASK_LIST[i].addEventListener("click", applySelectedTask);
    }

    RIGHT_SIDE.getElementsByClassName("hide-right-side")[0].addEventListener(
      "click",
      controlRightSide
    );
  }

  function applySelectedTask(event) {
    if (event == null) {
      renderSelectedTask();
    } else {
      if (selectedTask != null) {
        removeTaskHighlight();
      }
      for (let i = 0; i < TASKS.length; i++) {
        if (TASKS[i].id == event.target.id) {
          if (selectedTask != TASKS[i]) {
            selectedTask = TASKS[i];
            renderSelectedTask();
          }
        }
      }
    }
  }

  function removeTaskHighlight() {
    const CURRENT_TASK =
      document.getElementsByClassName("user-selected-task")[0];
    CURRENT_TASK.className = "task";
  }

  function renderSelectedTask() {
    for (let i = 0; i < TASK_LIST.length; i++) {
      console.log(TASK_LIST[i].id);
      if (TASK_LIST[i].id == selectedTask.id) {
        TASK_LIST[i].className = "user-selected-task";
        renderRightSide();
      }
    }
    events();
  }

  function renderRightSide() {
    RIGHT_SIDE.className = "right-side";
    let rightSideHead =
      RIGHT_SIDE.getElementsByClassName(
        "selected-task"
      )[0].getElementsByTagName("p")[0];
    rightSideHead.innerText = selectedTask.name;
    controlRightSide(OPEN);
  }

  function controlRightSide(adjust) {
    const CENTER = document.getElementById("center-block");
    if (adjust == CLOSE || adjust.type == "click") {
      //   CENTER.className = "center center-wide";
      //   RIGHT_SIDE.className = "right-side-closed";
    } else if (adjust == OPEN) {
      CENTER.className = "center";
      RIGHT_SIDE.className = "right-side";
    }
    events();
  }

  function applySelectedCategory(event) {
    if (event == null) {
      renderTasks();
      renderSelectedCategory();
    } else {
      for (let i = 0; i < CATEGORIES.length; i++) {
        if (CATEGORIES[i].id == event.target.id) {
          selectedCategory = CATEGORIES[i];
          removeCategoryHighlight();
          renderTasks();
          renderSelectedCategory();
          controlRightSide(CLOSE);
        }
      }
    }
  }

  function removeCategoryHighlight() {
    const CURRENT_CATEGORY =
      document.getElementsByClassName("category-selected")[0];
    CURRENT_CATEGORY.className = "category";
    selectedTask = null;
  }

  function renderSelectedCategory() {
    for (let i = 0; i < CATEGORY_LIST.length; i++) {
      if (CATEGORY_LIST[i].id == selectedCategory.id) {
        CATEGORY_LIST[i].className = "category-selected";
        let centerHead = document.getElementsByClassName("center-head")[0];
        centerHead.childNodes[1].childNodes[1].innerText =
          selectedCategory.icon;
        centerHead.childNodes[3].childNodes[1].innerText =
          selectedCategory.text;
      }
    }
    events();
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
    const date = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (type === DISPLAY) {
      document.getElementById("current-date").innerText = date;
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
      CATEGORIES.push({
        id: ++categoryId,
        icon: "list",
        text: NEW_CATEGORY.value,
      });
      console.log(CATEGORIES);
      selectedCategory = CATEGORIES[categoryId - 1];
      renderCategory();
      NEW_CATEGORY.value = "";
      applySelectedCategory();
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
    CATEGORIES.forEach((category) => {
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
        TASKS.push({
          id: taskId,
          class: "task-element",
          name: NEW_TASK.value,
          taskStatus: false,
          createdAt: getCurrentDate(OBJECT),
          categoryId: selectedCategory.id,
        });
        renderTasks();
        taskId++;
        NEW_TASK.value = "";
        applySelectedTask();
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
    let selectedCategoryId = selectedCategory.id;
    let sortedTasks = TASKS.reverse();
    sortedTasks.forEach((task) => {
      if (selectedCategoryId == task.categoryId) {
        let listItem = createHTMLElement("li", {
          className: "task",
          id: task.id,
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
      }
    });
    sortedTasks = TASKS.reverse();
    events();
  }

  init(); //calling init method
})();
