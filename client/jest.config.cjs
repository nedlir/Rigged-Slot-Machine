const path = require('path');

module.exports = {
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/setup.js')],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: [path.resolve(__dirname, 'tests/**/*.test.jsx')],
};
