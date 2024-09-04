import { test as baseTest, mergeTests } from "@playwright/test";
import { HolidayFixtures, holidayTest } from "./holiday-fixtures";
import { SidemenuFixtures, sidemenuTest } from "./sidemenu-fixtures";
import { parentEngineTest } from "tests/engines/parent.engine";

export const test = mergeTests(sidemenuTest, holidayTest, parentEngineTest)