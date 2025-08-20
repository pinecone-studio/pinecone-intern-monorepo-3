import nextJest from "next/jest";
import type { Config } from "@jest/types";

// ⬇️ ЭНД: монорепо root биш, тухайн аппын хавтсыг заана
const createJestConfig = nextJest({ dir: __dirname });

const customJestConfig: Config.InitialOptions = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "<rootDir>/**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)",
    "<rootDir>/**/*.(spec|test).(ts|tsx|js|jsx)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

};

export default createJestConfig(customJestConfig);
