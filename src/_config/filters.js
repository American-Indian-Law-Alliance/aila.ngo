import {toISOString, formatDate} from './filters/dates.js';
import {shuffleArray} from './filters/sort-random.js';
import {sortAlphabetically} from './filters/sort-alphabetic.js';
import {splitlines} from './filters/splitlines.js';
import {striptags} from './filters/striptags.js';
import {slugifyString} from './filters/slugify.js';
import { getBaseDomain } from './filters/base-domain.js';
import {limit} from './filters/limit.js';

export default {
  toISOString,
  formatDate,
  splitlines,
  striptags,
  shuffleArray,
  sortAlphabetically,
  slugifyString,
  getBaseDomain,
  limit
};
