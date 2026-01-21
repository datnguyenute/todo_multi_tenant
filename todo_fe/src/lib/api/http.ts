const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const sendRequest = async <T>(props: IRequest) => {
  const { url, method, body, useCredentials = false, headers = {}, nextOption = {} } = props;

  const options = {
    method: method,
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  console.log('OPTIONS: ', options);

  // if (queryParams) {
  //   url = `${url}?${queryString.stringify(queryParams)}`;
  // }

  return fetch(`${API_URL}${url}`, options).then((res) => {
    if (res.ok) {
      return res.json() as T; //generic
    } else {
      return res.json().then(function (json) {
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};
