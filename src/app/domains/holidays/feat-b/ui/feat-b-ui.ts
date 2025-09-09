// ✅
import { featBApi } from '../api/feat-b.api';
// ✅
import { featBStore } from '../data/feat-b.store';
// ✅
import { featBModel } from '../model/feat-b.model';
// ✅
import { HolidayApi } from '../../api/holiday.api';
// ✅
import { domainUi } from '../../ui/ui';
// ✅
import { createHoliday } from '../../model/holiday';

export const featBUi = {}

const api = featBApi
const store = featBStore
const model = featBModel

const domainApi = HolidayApi
const domainUI = domainUi
const domainModel = createHoliday
