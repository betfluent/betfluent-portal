import { firebaseAuth, getKey } from './firebaseService';

const baseUrl = 'https://boston-02108.herokuapp.com/api/v1';

const defaultRequest = {
  method: "post",
  mode: "cors",
  headers: new Headers({
    Accept: "application/json",
    "Content-Type": "application/json"
  })
}

const fetchService = async ({ endpoint, body }) => {
  const { path, method, serviceType } = endpoint;
  const request = {
    ...defaultRequest,
    method
  };
  const idToken = await firebaseAuth.currentUser.getIdToken(true);
  request.headers.set('token', idToken);

  const bodyWrapper = {
    id: getKey(),
    request: body,
    serviceType
  };

  request.body = JSON.stringify(bodyWrapper);

  return await fetch(`${baseUrl}${path}`, request)
    .then(response => {
      if (response.status < 400) return response.json()
      if (response.status < 500) throw new Error('Unauthorized Request');
      else throw new Error('Server Error');
    })
    .then(body => {
      if (body.status === 'error') throw new Error(body.message);
      return body.data;
    })
    .catch(e => {
      throw new Error(e.message)
    })

};

export default fetchService;
