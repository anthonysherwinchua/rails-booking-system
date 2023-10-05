import { ResponseTypeInterface } from '../interfaces/response_type_interface';

export const handleResponse = (res: Response, callback: (result: ResponseTypeInterface) => void): void => {
  if (res.ok) {
    if (res.status == 204) {
      return callback({ status: 'success', data: {} })
    } else {
      res
        .json()
        .then((json) => callback({ status: 'success', data: json }))
        .catch((error) => {
          console.error('Error parsing JSON:', error);
        });
    }
  } else {
    res
      .text()
      .then((text) => callback({ status: 'error', data: text }))
      .catch((error) => {
        console.error('Error parsing text:', error);
      });
  }
}
