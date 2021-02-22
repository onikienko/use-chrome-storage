import {chrome} from 'jest-chrome';


// @ts-expect-error we need to set this to use browser polyfill
chrome.runtime.id = 'test id';
Object.assign(global, {chrome});
