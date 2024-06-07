module.exports = {
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Adds additional jest-dom assertions
  rootDir: ".", // Adjust this path based on your project structure if necessary

  testEnvironment: "jsdom", // Simulates the browser environment for React components

  testPathIgnorePatterns: ["/node_modules/", "/build/"], // Directories to ignore when running tests

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|tiff|eot|svg|png|jpg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  transform: {
    // Transforms ES6 and JSX syntax to a format Jest can understand
    "^.+\\.jsx?$": "babel-jest",
  },

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$", // Regex to find test files

  moduleFileExtensions: ["js", "jsx", "json", "node"], // File extensions for modules

  collectCoverage: true, // Indicates whether Jest should collect coverage information

  coverageDirectory: "coverage", // Directory where Jest should output coverage reports

  coverageThreshold: {
    // Sets the coverage thresholds for your project
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
