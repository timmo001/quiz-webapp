import { WebSocket } from 'mock-socket';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;

window.speechSynthesis = { onvoiceschanged: jest.fn() };

global.WebSocket = WebSocket;
