const ERROR_MESSAGE = 'User Already Exists.';

export class UserAlreadyExistsError extends Error {
  status = 400;

  constructor () {
    super(ERROR_MESSAGE);
  }
}