import { apiConnection } from "./ApiConnection.js";

/**
 * Self invoking function which acts as a container
 * for certain variables and functions for the webpage
 * Contains all the support for the todo webpage
 * for organising the data such as
 * tasks, categories and tools to handle the to do list
 * by the user
 *
 * @author Dinesh Ravikumar
 * @since 28/12/2022
 */
(function () {
  const GET = "GET";
  const POST = "POST";
  const OPEN = "open";
  const CLOSE = "close";
  const OBJECT = "object";
  const DISPLAY = "display";
  const NEW_CATEGORY_ADDED = true;
  const UNTITLED = "Untitled Text";
  const CREATED_ON = "Created on ";
  const UPDATED_ON = "Updated on ";
  const LAST_STATIC_CATEGORY_ID = 5;
  const CREATED_TODAY = "Created today";
  const UPDATED_TODAY = "Updated Today";
  const IMPORTANT_ICON = "fa-solid fa-star";
  const NOT_IMPORTANT_ICON = "fa-regular fa-star";
  const TASK_PENDING_ICON = "fa-regular fa-circle";
  const TASK_COMPLETED_ICON = "fa-solid fa-circle-check";

  const NEW_TASK = document.getElementById("task-input");
  const RIGHT_SIDE = document.getElementById("right-side");
  const TASK_LIST = document.getElementsByClassName("task");
  const ADD_TASK_BUTTON = document.getElementById("add-task");
  const NEW_CATEGORY = document.getElementById("new-category");
  const CATEGORY_LIST = document.getElementsByClassName("category");

  let taskList = [];
  let categoryList = [];
  let selectedTask = null;
  let selectedCategory = null;
  let isRightContainerOpen = false;

  /**
   * main init function which calls the corresponding functions
   * init gets called at the start of the scope
   * works as a main unit for to-do manipulation process
   * calls functions sequentially to use required function for the right time
   * renders the categories and tasks and applies the current date,
   * and renders the selected category for applying the task,
   * at default it will be 1st category added, after all the renders over,
   * it applies the events for user interaction to the webpage
   */
  function init() {
    getCategories();
    getTasks();
    getCurrentDate(DISPLAY);
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
      TASK_LIST[i].children[2].addEventListener("click", applyImportantTask);
    }

    if (selectedTask != null) {
      RIGHT_SIDE.getElementsByClassName(
        "selected-task"
      )[0].children[0].addEventListener("click", applySelectedTaskStatus);
      RIGHT_SIDE.getElementsByClassName(
        "selected-task"
      )[0].children[2].addEventListener("click", applySelectedTaskImportant);
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
   * text entry from the user will be received by the event listener
   * and will be applied on real time to the selected task
   *
   * @param event - applies the event from the user, text entry will
   *                automatically generates a event
   *
   */
  function applyNoteToTask(event) {
    taskList.forEach((task) => {
      if (task.id == selectedTask.id) {
        task.note = event.target.value;
        task.noteSavedAt = getCurrentDate(OBJECT);
        apiConnection(POST, "task", selectedTask);
        selectedTask = task;
        renderNoteStatus();
      }
    });
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
   * @param event - event from the user, click event in a list of
   *                task will present as a new event using event listeners
   */
  function applySelectedTask(event) {
    if (event == null) {
      renderSelectedTask();
    } else if (event != null) {
      if (
        selectedTask != null &&
        event.target.id != selectedTask.id &&
        event.target.id != ""
      ) {
        removeTaskHighlight();
      }
      for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == event.target.id) {
          if (selectedTask != taskList[i]) {
            selectedTask = taskList[i];
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
   * highlight to show which was newly selected,
   * usually helps to get rid of old task higlight to provide a better experience
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
   * Refreshes the events after the selected category was applied
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
   * Right side render is based upon the selected task,
   * it will throw error if there is no selected task applied
   * after rendering it will open the right side and
   * renders the old notes applied and also the task created at
   */
  function renderRightSide() {
    let rightTaskInfo = RIGHT_SIDE.getElementsByClassName("selected-task")[0];
    rightTaskInfo.innerHTML = "";
    let icon = getTaskStatusIcon(selectedTask);
    let text = getCorrespondingText(selectedTask);
    let importantIcon = getTaskImportantIcon(selectedTask);
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
   * @param task - Contains the task for rendering the task name
   *               based upon the completion status of the task
   * @returns a text html element with a classname mentioning
   *          the task completed or uncompleted
   */
  function getCorrespondingText(task) {
    if (task.isCompleted) {
      return createHTMLElement("p", {
        className: "completed-task-name",
        content: task.name,
      });
    } else {
      return createHTMLElement("p", {
        className: "task-name",
        content: task.name,
      });
    }
  }

  /**
   * Task status is basically a task creation information
   * to make the user know when the task is actually gets created
   * i.e a display about the task creation date
   */
  function renderTaskDate() {
    let taskDateInfo =
      RIGHT_SIDE.getElementsByClassName("task-created-at")[0].childNodes[1];
    if (selectedTask.createdAt == getCurrentDate(OBJECT)) {
      taskDateInfo.innerText = CREATED_TODAY;
    } else {
      taskDateInfo.innerText = CREATED_ON + selectedTask.createdAt;
    }
  }

  /**
   * Controls the right side whether to close it or open it
   * commonly used when a task gets selected from the task list
   * to make use of right side to get control of the task console
   * like note, steps and etc.
   * Right side closes when the user changes the category or clicks the
   * slide button on the ride side
   * @param adjust - For adjusting the right side render, it lets selected task corner
   *                 render out or removes the render when there is no use case for
   *                 the selected task render(Right side).
   */
  function controlRightSide(adjust) {
    const CENTER = document.getElementById("center-block");
    if (adjust == CLOSE || adjust.type == "click") {
      CENTER.className = "center center-right-wide";
      RIGHT_SIDE.className = "right-side-closed";
      removeTaskHighlight();
      selectedTask = null;
      isRightContainerOpen = false;
      applySelectedTask();
      isRightContainerOpen = false;
    } else if (adjust == OPEN) {
      CENTER.className = "center";
      RIGHT_SIDE.className = "right-side";
      isRightContainerOpen = true;
    }
    events();
  }

  /**
   * Applies the selected category which user selected in the page
   * This function confronts the selected category is actually available in the
   * storage and makes it the new selected category and calls the necessary
   * function to render
   * @param event - Contains a event to apply a selected category
   *                event based upon the user selection of the list of categories
   */
  function applySelectedCategory(event) {
    if (event == null) {
      renderTasks(taskList);
      renderSelectedCategory();
    } else {
      for (let i = 0; i < categoryList.length; i++) {
        if (categoryList[i].id == event.target.id) {
          selectedCategory = categoryList[i];
          removeCategoryHighlight();
          renderSelectedCategory();
          getTasks();
          controlRightSide(CLOSE);
        }
      }
    }
  }

  /**
   * Removes the highlight for the category
   * removing the category highlight happens when the new category
   * has been selected by the user so the highlight has replaced by another one
   * usually removes the category highlight to get rid of redundancy of selected category
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
   * refreshed the events after the selected category has rendered
   */
  function renderSelectedCategory() {
    for (let i = 0; i < CATEGORY_LIST.length; i++) {
      if (CATEGORY_LIST[i].id == selectedCategory.id) {
        CATEGORY_LIST[i].className = "category-selected";
        let centerHead = document.getElementsByClassName("center-head")[0];
        centerHead.childNodes[1].childNodes[1].innerText =
          selectedCategory.iconName;
        centerHead.childNodes[3].childNodes[1].innerText =
          selectedCategory.name;
      }
    }
    events();
  }

  /**
   * Creates an html element
   * Checkes the element based upon their requirement,
   * to get rid of getting a error while
   * the elements has no use of classname or innertext
   * @param tagName - contains a tagname for the upcomming html element
   * @param element - elements that an html tag can have eg. class name, id and etc.
   * @returns final created html element to make use of in html document insertion
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
   * @param type - contains what type of date is needed,
   *               one can display the date information in the top page of category header
   *               another will returns object for corresponding function in use
   * @returns a formatted date object
   */
  function getCurrentDate(type) {
    const DATE = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (type === DISPLAY) {
      document.getElementById("current-date").innerText = DATE;
    } else if (type === OBJECT) {
      return DATE;
    }
  }

  /**
   * Adds a new group for todo list
   * In which groups can be mentioned as the to-do-list holder
   * they contain list of to-do-list
   * groups adds up when the user enters the text and pressed the enter key
   * @param event - contains a enter event for category when user
   *                wants to create a category
   */
  function addCategory(event) {
    if (event.key === "Enter") {
      if (NEW_CATEGORY.value === "") {
        NEW_CATEGORY.value = UNTITLED;
      }
      let userCategory = {
        iconName: "list",
        name: NEW_CATEGORY.value,
      };
      const RESPONSE = apiConnection(POST, "category", userCategory);
      RESPONSE.then(() => {
        NEW_CATEGORY.value = "";
        getCategories(NEW_CATEGORY_ADDED);
        renderSelectedCategory();
        controlRightSide(CLOSE);
      });
    }
  }

  /**
   * Gets the categories from the api and applies to a temporary categoryList
   * Renders the final category after the category has successfully got from the api
   * if the new category is added it makes the new category as it selected category
   * rendering selected category will be applied hierarchicaly in rendering category
   * @param isNewCategoryAdded - a boolean parameter to make sure if this method
   *                             is called after a new category is added or not, if its true
   *                             it applies the new categroy as its selected category,
   *                             if not it just renders the category
   */
  function getCategories(isNewCategoryAdded) {
    const CATEGORIES = apiConnection(GET, "categories");
    CATEGORIES.then((categories) => {
      categoryList = categories;
      if (isNewCategoryAdded) {
        selectedCategory = categoryList[categoryList.length - 1];
        applySelectedCategory();
      }
      renderCategory(categoryList);
    });
  }

  /**
   * Renders the categories in the left to sort out the to-do based
   * upon the category
   * Category is a list which can contain both predefined category(From the backend)
   * and user defined category(from the end user interacting the webpage)
   * category can contain tasks
   * @param categoryList - an list of categories that contain the category name, id, and icon name.
   */
  function renderCategory(categoryList) {
    let CATEGORY_LIST = document.getElementById("sidebar-category");
    CATEGORY_LIST.innerHTML = "";
    categoryList.forEach((category) => {
      let listItem = createHTMLElement("li", {
        className: "category",
        id: category.id,
      });
      let icon = createHTMLElement("i", {
        className: "material-icons",
        content: category.iconName,
      });
      let text = createHTMLElement("p", {
        content: category.name,
        className: "category-text",
      });
      CATEGORY_LIST.appendChild(listItem);
      listItem.appendChild(icon);
      listItem.appendChild(text);
      if (category.id == LAST_STATIC_CATEGORY_ID) {
        let hr = createHTMLElement("hr", { className: "split-category" });
        CATEGORY_LIST.appendChild(hr);
      }
    });
    if (selectedCategory == null) {
      selectedCategory = categoryList[0];
    }
    renderSelectedCategory();
  }

  /**
   * Adds a new task in todo list
   * In which tasks are the entries that user enters
   * Tasks can be divided upon categories for ease of use
   * Tasks has status to mention if the task is finished or not
   * @param event - has a enter and click event from the user
   *                to add a task using event listeners
   */
  function addTask(event) {
    if (event.key === "Enter" || event.type == "click") {
      if (NEW_TASK.value.trim() === "") {
        NEW_TASK.value = "";
      } else {
        let allocatedCategory = getAllocatedCategory();
        let userTask = {
          name: NEW_TASK.value,
          isCompleted: false,
          createdAt: getCurrentDate(OBJECT),
          categoryIds: allocatedCategory,
          note: null,
          noteSavedAt: null,
        };
        apiConnection(POST, "task", userTask).then(() => {
          getTasks();
          NEW_TASK.value = "";
        });
      }
    }
  }

  /**
   * gives the category list to allocated for an task,
   * category is based upon the selected category and
   * where the task is actually originated.
   * custom category cannot be applied to task category
   * @returns list of category that a task can be allocated to.
   */
  function getAllocatedCategory() {
    let allocatedCategory = [];
    if (selectedCategory != null) {
      allocatedCategory.push(selectedCategory.id);
    }
    if (selectedCategory.id < LAST_STATIC_CATEGORY_ID) {
      allocatedCategory.push(5);
    }
    return allocatedCategory;
  }

  /**
   * Gets the tasks from the api and applies to a temporary task list
   * after applying successfully it renders the tasks
   * the tasks will be rendered based upon the category selected
   * and the task status and importance will be rendered according
   * to the task objects in the list while rendering
   */
  function getTasks() {
    const TASKS = apiConnection(GET, "tasks");
    TASKS.then((tasks) => {
      taskList = tasks;
      renderTasks(tasks);
    });
  }

  /**
   * Renders tasks in the task container for the webpage
   * task contains user entered task which contains several manipulation features
   * task can be rendered by the allocated category.
   * Each task icons will be rendered based upon the status
   * if a task is completed the icon will be automatically rendered as completed
   * same for importance of the task
   * @param tasks - contains a task list which will be iterated and rendered according
   *                to the completion status, importance and with corresponding category
   */
  function renderTasks(tasks) {
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    let sortedTasks = tasks.reverse();
    let taskCompletedCount = renderIncompleteTasks(sortedTasks);
    if (taskCompletedCount > 0) {
      createCompletedTaskHeader(taskCompletedCount);
      renderCompletedTasks(sortedTasks);
    }
    sortedTasks = tasks.reverse();
    if (isRightContainerOpen) {
      applySelectedTask();
    }
    events();
  }

  function renderCompletedTasks(sortedTasks) {
    let selectedCategoryId = selectedCategory.id;
    sortedTasks.forEach((task) => {
      let taskCategoryIds = task.categoryIds;
      taskCategoryIds.forEach((category) => {
        if (
          selectedCategoryId == category &&
          category != null &&
          task.isCompleted
        ) {
          generateTaskRender(task);
        }
      });
    });
  }

  function renderIncompleteTasks(sortedTasks) {
    let taskCompletedCount = 0;
    let selectedCategoryId = selectedCategory.id;
    sortedTasks.forEach((task) => {
      let taskCategoryIds = task.categoryIds;
      taskCategoryIds.forEach((category) => {
        if (selectedTask != null) {
          if (task.id == selectedTask.id) {
            selectedTask = task;
          }
        }
        if (
          selectedCategoryId == category &&
          category != null &&
          !task.isCompleted
        ) {
          generateTaskRender(task);
        } else if (
          selectedCategoryId == category &&
          category != null &&
          task.isCompleted
        ) {
          taskCompletedCount++;
        }
      });
    });
    return taskCompletedCount;
  }

  function generateTaskRender(task) {
    let taskList = document.getElementById("task-list");
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
    let importantIcon = getTaskImportantIcon(task);
    taskList.appendChild(listItem);
    listItem.appendChild(icon);
    listItem.appendChild(taskInfoDiv);
    taskInfoDiv.appendChild(text);
    taskInfoDiv.appendChild(footer);
    listItem.appendChild(importantIcon);
  }

  function createCompletedTaskHeader(taskCompletedCount) {
    let taskList = document.getElementById("task-list");
    let completedHeader = createHTMLElement("li", {
      className: "completed-task-header",
      id: "completed-task-header",
    });
    let completedText = createHTMLElement("p", {
      className: "header-text",
      content: "v   Completed",
    });
    let count = createHTMLElement("p", {
      className: "count",
      content: taskCompletedCount,
    });
    taskList.appendChild(completedHeader);
    completedHeader.appendChild(completedText);
    completedHeader.appendChild(count);
  }
  /**
   * confirms the icon based upon the status of the task
   * i.e basis upon the completion of the task
   * This function creates an html element for the task status icon
   * @param task - contains a task object get a task status icon
   * @returns an html element of a icon based upon the task status
   */
  function getTaskStatusIcon(task) {
    if (task.isCompleted) {
      return createHTMLElement("i", {
        className: TASK_COMPLETED_ICON,
      });
    } else {
      return createHTMLElement("i", {
        className: TASK_PENDING_ICON,
      });
    }
  }

  /**
   * confirms the icon based upon the importance status of the task
   * i.e basis upon the important category selection
   * or in which a task is selected important by the user
   * This function creates an html element for icon
   * based upon the importancy status
   * @param task - contains a task object get a task importance icon
   * @returns an html element of a icon based upon the task importance
   */
  function getTaskImportantIcon(task) {
    let taskCategoryIds = task.categoryIds;
    let iconType = NOT_IMPORTANT_ICON;
    taskCategoryIds.forEach((category) => {
      if (category == "2") {
        iconType = IMPORTANT_ICON;
      }
    });
    return createHTMLElement("i", {
      className: iconType,
    });
  }

  /**
   * applies the task status whether to mark the task completed, true
   * or to mark it as pending, false.
   * The mark is based upon the user action which is executed using
   * Click event on the radio icon
   * @param event - the event from the user, click which
   *                was generated by the event listener
   */
  function applyTaskStatus(event) {
    let iconStyle = event.target.className;
    taskList.forEach((task) => {
      if (event.target.parentNode.id == task.id) {
        assignTaskStatus(task, iconStyle);
        apiConnection(POST, "task", task);
        if (selectedTask != null) {
          if (selectedTask.id == task.id) {
            selectedTask = task;
          }
        }
      }
    });
    getTasks();
  }

  /**
   * applies the selected task status whether to mark the task completed, true
   * or to mark it as pending, false.
   * The mark is based upon status of the right side,
   * the user action which is executed using
   * Click event on the radio icon.
   * This function doesnt gets any event when there is no task was selected,
   * selected a task generates a right side
   * @param event - the event from the user, click which
   *                was generated by the event listener
   */
  function applySelectedTaskStatus(event) {
    let iconStyle = event.target.className;
    if (selectedTask != null) {
      if (event.target.parentNode.id == "selected-task") {
        assignTaskStatus(selectedTask, iconStyle);
        apiConnection(POST, "task", selectedTask);
        getTasks();
      }
    }
  }

  /**
   * assigns a task status in basis of rollbacking a event of what user applies a event,
   * i.e rollbacking a completed task to not completed when the user click it
   * @param task - contains a task to update its status of completed or pending
   * @param iconStyle - to check the type of icon style user clicks on
   */
  function assignTaskStatus(task, iconStyle) {
    if (iconStyle == TASK_COMPLETED_ICON) {
      task.isCompleted = false;
      task.taskCompletedAt = null;
    } else if (iconStyle == TASK_PENDING_ICON) {
      task.isCompleted = true;
    } else {
      console.log("Error in applying task status");
    }
  }

  /**
   * applies the task importance whether to mark the task important based upon the
   * category it holds
   * The mark is based upon the user action which is executed using
   * Click event on the star icon
   * @param event - the event from the user, click which
   *                was generated by the event listener
   */
  function applyImportantTask(event) {
    let iconStyle = event.target.className;
    taskList.forEach((task) => {
      if (event.target.parentNode.id == task.id) {
        assignImportantTask(task, iconStyle);
        apiConnection(POST, "task", task).then(() => {
          if (selectedTask != null) {
            if (selectedTask.id == task.id) {
              selectedTask = task;
            }
          }
          getTasks();
        });
      }
    });
  }

  /**
   * applies the selected task importance whether to mark the task as important,
   * based upon the holded category ids
   * The mark is based upon status of the right side,
   * the user action which is executed using
   * Click event on the star icon.
   * This function doesnt gets any event when there is no task was selected,
   * selected a task generates a right side
   * @param event - the event from the user, click which
   *                was generated by the event listener
   */
  function applySelectedTaskImportant(event) {
    let iconStyle = event.target.className;
    if (selectedTask != null) {
      if (event.target.parentNode.id == "selected-task") {
        assignImportantTask(selectedTask, iconStyle);
        apiConnection(POST, "task", selectedTask);
        getTasks();
      }
    }
  }

  /**
   * assigns a task importance in basis of rollbacking a event of what user applies a event,
   * i.e rollbacking a important task to normal task when a user clicks it
   * gets the category index and removes the old importance to avoid repetition
   * @param task - contains a task to update its status of completed or pending
   * @param iconStyle - to check the type of icon style user clicks on
   */
  function assignImportantTask(task, iconStyle) {
    if (iconStyle == IMPORTANT_ICON) {
      let categoryIndex = task.categoryIds.indexOf(2);
      task.categoryIds.splice(categoryIndex, 1);
    } else if (iconStyle == NOT_IMPORTANT_ICON) {
      task.categoryIds.push("2");
    }
  }

  init();
})();
