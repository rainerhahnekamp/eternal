// ❌ Should be allowed
import { HolidayApi } from '../../api/holiday.api';
// ✅
import { createHoliday } from '../../model/holiday';
// ✅
import { domainUi } from '../../ui/ui';
// ✅
import { featBApi } from '../api/feat-b.api';
// ✅
import { featBStore } from '../data/feat-b.store';
// ✅
import { featBModel } from '../model/feat-b.model';
// ✅
import { featBUi } from '../ui/feat-b-ui';

const domainApi = HolidayApi
const domainModl = createHoliday()
const domainUI = domainUi
const api = featBApi
const data = featBStore
const model = featBModel
const ui = featBUi
