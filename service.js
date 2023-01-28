import { connectPostApi, connectGetApi } from "./api.js";

const DEFAULT_URL = "http://localhost:8080/todo/";
const POST = "POST";

/**
 * adds a new category by applying suitable url and request object
 * Genrates a custom url for the category with default url and proceeds for api operation
 * gets called when the users enters a new category in the webpage
 * @param category - the category which was entered by the user,
 *                   will be validated before calling this function
 * @returns the promise which was returned after a successfull api post operation
 */
export function addNewCategory(category) {
  return connectPostApi(
    DEFAULT_URL + "category",
    getRequestObject(POST, category)
  );
}

/**
 * adds a new task by applying suitable url and request object
 * Genrates a custom url for the task with default url and proceeds for api operation
 * gets called when the users enters a new task in the webpage
 * @param task - the task which was entered by the user,
 *               will be validated before calling this function
 * @returns the promise which was returned after a successfull api post operation
 */
export function addNewTask(task) {
  return connectPostApi(DEFAULT_URL + "task", getRequestObject(POST, task));
}

/**
 * Gets all the categories
 * Categories contain way to render certain tasks in a categorized manner
 * It provides list of default category which was applied on backend and
 * the category which was updated from the user in the webpage
 * @returns the promise which was returned after a successfull api post operation,
 *          basically returns a list of categories whenever necessary for rendering
 */
export function getAllCategories() {
  return connectGetApi(DEFAULT_URL + "categories");
}

/**
 * Gets all the tasks
 * Tasks contain the to-do task that a user wants to implement in a daily basis,
 * it can contain which category they can placed upon
 * It provides list tasks which was updated from the user in the webpage
 * @returns the promise which was returned after a successfull api post operation,
 *          basically returns a list of tasks whenever necessary for rendering
 */
export function getAllTasks() {
  return connectGetApi(DEFAULT_URL + "tasks");
}

/**
 * Updates the task by applying corresponding url for it
 * Generates url with default url and gets called when user interacts with the task console control,
 * or anything related to updation for customizing their task
 * @param task - the task which was updated by the user manipulation in the webpage
 * @returns the promise which was returned after a successfull api operation
 */
export function updateTask(task) {
  return connectPostApi(DEFAULT_URL + "task", getRequestObject(POST, task));
}

/**
 * For making a request object for body in api operation,
 * commonly used for post or put operation
 * converts the js object to json string object
 * for applying for body in api operation
 * @param method - contains the api method to apply to request object
 * @param object - which will be applied to the body for the api operation
 * @returns the request object itself, which will be used to apply
 *          for api operation to process the corresponding operation
 */
function getRequestObject(method, object) {
  return {
    method: method,
    body: JSON.stringify(object),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  };
}
