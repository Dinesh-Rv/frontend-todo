/**
 * Self invoking function which acts as a class
 * for certain variables and functions for the webpage
 * Contains all the support for the todo webpage
 * for organising the data such as
 * tasks, categories and so on
 */
(function () {
  const DISPLAY = "display";
  const OBJECT = "object";
  const OPEN = "open";
  const CLOSE = "close";
  const UNTITLED = "Untitled Text";
  const CREATED_TODAY = "Created today";
  const CREATED_ON = "Created on ";
  const UPDATED_TODAY = "Updated Today";
  const UPDATED_ON = "Updated on ";
  const TASK_COMPLETED_ICON = "fa-regular fa-circle-check";
  const TASK_PENDING_ICON = "fa-regular fa-circle";

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

  let taskId = 2;

  const TASKS = [
    {
      id: 1,
      class: "task-element",
      name: "Sample Task",
      taskStatus: false,
      createdAt: "Saturday, January 5",
      categoryId: ["1", "5"],
      note: "Sample Note",
      noteSavedAt: "Saturday, January 6",
    },
  ];

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
   * init gets called at the start of the scope
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
   * eg in case of a user enters a text and adds a response key it submits a
   * request of a entered text to add using event listener
   * in some case user clicks on some event is valid
   * Input event on addition of selected task note is added
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
      TASK_LIST[i].children[0].addEventListener("click", applyTaskStatus);
    }

    if (selectedTask != null) {
      RIGHT_SIDE.getElementsByClassName(
        "selected-task"
      )[0].children[0].addEventListener("click", applySelectedTaskStatus);
    }

    RIGHT_SIDE.getElementsByClassName("hide-right-side")[0].addEventListener(
      "click",
      controlRightSide
    );

    if (selectedTask != null) {
      RIGHT_SIDE.getElementsByClassName("add-note")[0].addEventListener(
        "input",
        applyNoteToTask
      );
    }
  }

  /**
   * Applies the user entered note to the concerned selected task
   * storage to make use of the note when re-rendering the selected task again
   *
   * @param {*} event
   */
  function applyNoteToTask(event) {
    TASKS.forEach((task) => {
      if (task.id == selectedTask.id) {
        task.note = event.target.value;
        task.noteSavedAt = getCurrentDate(OBJECT);
      }
    });
    renderNoteStatus();
  }

  /**
   * Renders the note status near the note input
   * Consists of messages of when the note was applied for the task
   * note contains text or paragraph input entered by the user
   */
  function renderNoteStatus() {
    const NOTE_STATUS = document.getElementById("note-status");
    if (NOTE_STATUS != "") {
      NOTE_STATUS.innerText = "";
    }
    let noteSavedDate = selectedTask.noteSavedAt;
    if (noteSavedDate != null) {
      if (noteSavedDate == getCurrentDate(OBJECT)) {
        NOTE_STATUS.innerText = UPDATED_TODAY;
      } else {
        NOTE_STATUS.innerText = UPDATED_ON + noteSavedDate;
      }
    }
  }

  /**
   * Applies the webpage selected task request to the storage to make use
   * of the task in console such as notes, steps and so on,
   * it checks the selected task request is really available in the
   * account storage and carries to call the render
   * @param {*} event
   */
  function applySelectedTask(event) {
    if (event == null) {
      renderSelectedTask();
    } else {
      if (
        selectedTask != null &&
        event.target.id != selectedTask.id &&
        event.target.id != ""
      ) {
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

  /**
   * Removes the selected task highlight design such that, the task
   * highlight can be refreshed and be set for the other,
   * This function helps to remove the old selected task's
   * highlight to show which was newly selected
   */
  function removeTaskHighlight() {
    const CURRENT_TASK = document.getElementsByClassName(
      "task user-selected-task"
    )[0];
    if (CURRENT_TASK != null) {
      CURRENT_TASK.className = "task";
    }
  }

  /**
   * Renders the selected Task in which the user selects
   * This function gets applied when the user selection request
   * is valid and rendering will occur to show which was selected
   * After a succesfull highlighting of the selected task,
   * the right side will be rendered
   */
  function renderSelectedTask() {
    if (selectedTask != null) {
      for (let i = 0; i < TASK_LIST.length; i++) {
        if (TASK_LIST[i].id == selectedTask.id) {
          TASK_LIST[i].className = "task user-selected-task";
          renderRightSide();
        }
      }
    }
    events();
  }

  /**
   * Renders the right side to show in depth details of the task
   * selected and other accessibilities, right side
   * commonly used when a task gets selected from the task list
   * to make use of right side to get control of the task console
   * like note, steps and etc.
   */
  function renderRightSide() {
    let rightTaskInfo = RIGHT_SIDE.getElementsByClassName("selected-task")[0];
    rightTaskInfo.innerHTML = "";
    let icon = getTaskStatusIcon(selectedTask);
    let text = getCorrespondingText(selectedTask);
    let importantIcon = createHTMLElement("i", {
      className: "fa-regular fa-star",
    });
    rightTaskInfo.appendChild(icon);
    rightTaskInfo.appendChild(text);
    rightTaskInfo.appendChild(importantIcon);
    if (selectedTask.note != null) {
      RIGHT_SIDE.getElementsByClassName("add-note")[0].value =
        selectedTask.note;
    } else {
      RIGHT_SIDE.getElementsByClassName("add-note")[0].value = "";
    }
    renderNoteStatus();
    renderTaskDate();
    controlRightSide(OPEN);
  }

  /**
   * mainly used for to difrentiate pending and completed tasks
   * using different classname
   * different classname according to task status will be designed
   * accordingly using css
   *
   * @param {*} selectedTask
   * @returns a text html element with a classname
   */
  function getCorrespondingText(selectedTask) {
    if (selectedTask.taskStatus) {
      return createHTMLElement("p", {
        className: "completed-task-name",
        content: selectedTask.name,
      });
    } else {
      return createHTMLElement("p", {
        className: "task-name",
        content: selectedTask.name,
      });
    }
  }

  /**
   * Task status is basically a task creation information
   * to make the user know when the task is actually gets created
   */
  function renderTaskDate() {
    let taskStatus =
      RIGHT_SIDE.getElementsByClassName("task-created-at")[0].childNodes[1];
    if (selectedTask.createdAt == getCurrentDate(OBJECT)) {
      taskStatus.innerText = CREATED_TODAY;
    } else {
      taskStatus.innerText = CREATED_ON + selectedTask.createdAt;
    }
  }

  /**
   * Controls the right side whether to close it or open it
   * commonly used when a task gets selected from the task list
   * to make use of right side to get control of the task console
   * like note, steps and etc.
   * Right side closes when the user changes the category or clicks the
   * slide button on the ride side
   * @param {*} adjust
   */
  function controlRightSide(adjust) {
    const CENTER = document.getElementById("center-block");
    if (adjust == CLOSE || adjust.type == "click") {
      CENTER.className = "center center-right-wide";
      RIGHT_SIDE.className = "right-side-closed";
      removeTaskHighlight();
      selectedTask = null;
      applySelectedTask();
    } else if (adjust == OPEN) {
      CENTER.className = "center";
      RIGHT_SIDE.className = "right-side";
    }
    events();
  }

  /**
   * Applies the selected category which user selected in the page
   * This function confronts the selected category is actually available in the
   * storage and makes it the new selected category and calls the necessary
   * function to render
   * @param {*} event
   */
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

  /**
   * Removes the highlight for the category
   * removing the category highlight happens when the new category
   * has been selected by the user so the highlight has replaced by another one
   */
  function removeCategoryHighlight() {
    const CURRENT_CATEGORY =
      document.getElementsByClassName("category-selected")[0];
    CURRENT_CATEGORY.className = "category";
    selectedTask = null;
  }

  /**
   * Renders the selected category,
   * the Selected category is user selected and
   * user created category also can be selected
   * The main purpose of the selected category is to sort the task to their categories
   * for the ease of use for the user
   */
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
      selectedCategory = CATEGORIES[categoryId - 1];
      renderCategory();
      NEW_CATEGORY.value = "";
      controlRightSide(CLOSE);
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
      if (NEW_TASK.value.trim() === "") {
        NEW_TASK.value = "";
      } else {
        TASKS.push({
          id: taskId,
          class: "task-element",
          name: NEW_TASK.value,
          taskStatus: false,
          taskCompletedAt: null,
          createdAt: getCurrentDate(OBJECT),
          categoryId: [selectedCategory.id],
          note: null,
          noteSavedAt: null,
        });
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
    let selectedCategoryId = selectedCategory.id;
    let sortedTasks = TASKS.reverse();
    sortedTasks.forEach((task) => {
      let taskCategoryIds = task.categoryId;
      taskCategoryIds.forEach((categoryId) => {
        if (selectedCategoryId == categoryId) {
          let listItem = createHTMLElement("li", {
            className: "task",
            id: task.id,
          });
          let icon = getTaskStatusIcon(task);
          let taskInfoDiv = createHTMLElement("div", {
            className: "task-info",
          });
          let text = getCorrespondingText(task);
          let footer = createHTMLElement("p", {
            className: "labels",
            content: "Tasks",
          });
          let impIconDiv = createHTMLElement("div", {
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
    });
    sortedTasks = TASKS.reverse();
    renderCompletedTasks();
    applySelectedTask();
    events();
  }

  function renderCompletedTasks() {}

  function getTaskStatusIcon(task) {
    if (task.taskStatus) {
      return createHTMLElement("i", {
        className: TASK_COMPLETED_ICON,
      });
    } else {
      return createHTMLElement("i", {
        className: TASK_PENDING_ICON,
      });
    }
  }

  function renderForCompletedTasks() {}

  /**
   * applies the task status whether to mark the task completed, true
   * or to mark it as pending, false.
   * The mark is based upon the user action which is executed using
   * Click event on the radio icon
   * @param {*} event
   */
  function applyTaskStatus(event) {
    iconStyle = event.target.className;
    TASKS.forEach((task) => {
      if (event.target.parentNode.id == task.id) {
        assignTaskStatus(task, iconStyle);
      }
    });
    renderTasks();
  }

  function applySelectedTaskStatus(event) {
    iconStyle = event.target.className;
    if (selectedTask != null) {
      if (event.target.parentNode.id == "selected-task") {
        assignTaskStatus(selectedTask, iconStyle);
      }
    }
    renderTasks();
  }

  function assignTaskStatus(task, iconStyle) {
    if (iconStyle == TASK_COMPLETED_ICON) {
      task.taskStatus = false;
      task.taskCompletedAt = null;
    } else if (iconStyle == TASK_PENDING_ICON) {
      task.taskStatus = true;
    } else {
      console.log("Error in applying task status");
    }
  }

  init(); //calling init method
})();
