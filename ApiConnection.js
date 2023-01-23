const DEFAULT_URL = "http://localhost:8080/todo/";

/**
 * Works as a connectivity between data transfer from the backend
 * and will function multiple api operation at the same time,
 * it can do both post and get operation depending upon the api method
 * it gets called with.
 * @param method - contains the method to apply such as POST and GET,
 *                 http url will be applied based upon this variable
 * @param type - type of object the user needs to get or insert
 *               if the type is category, it does the api operation for category
 * @param object - contains object that user wants to apply to the api body,
 *                 works commonly for corresponding post operation
 * @returns response from the api, post operation returns the true statement or a
 *          statement regarding the state of post operation, get operation returns the
 *          object based upon the user mentioned type to get
 */
export async function apiConnection(method, type, object) {
  if (method == "POST") {
    let requestObject = getRequestObject(method, object);
    let request = new Request(DEFAULT_URL + type, requestObject);
    let response = (await fetch(request)).json;
    if (response != null) {
      return response;
    }
  } else if (method == "GET") {
    let request = null;
    if (object != null) {
      request = await fetch(DEFAULT_URL + type + "/" + object);
    } else {
      request = await fetch(DEFAULT_URL + type);
    }
    let response = await request.json();
    return response;
  }
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
