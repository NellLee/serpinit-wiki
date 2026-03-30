import assert from 'node:assert/strict';
import { parseSearchQuery } from './searchQuery';

const parsed = parseSearchQuery('title:"Do Uspil" foo -Lateralen path:Sodili type:article');

assert.deepEqual(parsed.freeTextTerms, ['foo']);
assert.deepEqual(parsed.phrases, []);
assert.deepEqual(parsed.exclusions, ['Lateralen']);
assert.deepEqual(parsed.fieldFilters.title, ['Do Uspil']);
assert.deepEqual(parsed.fieldFilters.path, ['Sodili']);
assert.deepEqual(parsed.fieldFilters.type, ['article']);

const repeatedFilters = parseSearchQuery('category:Religion category:Politik type:article type:index');
assert.deepEqual(repeatedFilters.fieldFilters.category, ['Religion', 'Politik']);
assert.deepEqual(repeatedFilters.fieldFilters.type, ['article', 'index']);

const mixedTerms = parseSearchQuery('path:Sodili Lateralen "Do Uspil"');
assert.deepEqual(mixedTerms.fieldFilters.path, ['Sodili']);
assert.deepEqual(mixedTerms.freeTextTerms, ['Lateralen']);
assert.deepEqual(mixedTerms.phrases, ['Do Uspil']);
