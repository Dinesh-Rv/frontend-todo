/**
 * Works as a Post api connectivity for the backend
 * It can apply url for the api operation by basis of url applied
 * Contains the main connectivity with the backend and finalize the promise
 * after a proper response from the backend has received
 * @param url - url to make the corresponding post operation for required task,
 *              url should be concaded and applied before calling this function
 * @param requestObject - contains request object that a user wanted to apply to save
 *                        request object is a normal javascript object will be
 *                        converted to json for post operation body
 * @returns a promise response when the backend is successfull in returning a object after execution
 *          this function will return a response indicating the execution status
 */
export function connectPostApi(url, requestObject) {
  let request = new Request(url, requestObject);
  return fetch(request).then((response) => {
    if (response != null) {
      return response.json();
    }
  });
}

/**
 * Works as a Get api connectivity for the backend
 * It can apply url for the api operation by basis of url applied
 * Contains the main connectivity with the backend and finalize the promise
 * after a proper response from the backend has received
 * @param url - url to make the corresponding post operation for required task,
 *              url should be concaded and applied before calling this function
 * @returns a promise response when the backend is successfull in returning a object after execution
 *          for this function it will basically returns a get object so response value wil be a list
 */
export function connectGetApi(url) {
  return fetch(url).then((response) => {
    if (response != null) {
      return response.json();
    }
  });
}
