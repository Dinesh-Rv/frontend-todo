const DEFAULT_URL = "http://localhost:8080/todo/";

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

function getRequestObject(method, object) {
  return {
    method: method,
    body: JSON.stringify(object),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  };
}
