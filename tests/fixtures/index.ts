import { mergeTests } from "@playwright/test";
import { holidaysTest } from "./holidays-fixtures";
import { sidebarTest } from "./sidebar-fixtures";

export const test = mergeTests(holidaysTest, sidebarTest)