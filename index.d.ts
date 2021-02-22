/**
 * Hook which will use `chrome.storage.local` to persist state.
 *
 * @param {string} key - they key name in chrome's storage. Nested keys not supported
 * @param {*} [initialValue] - default value to use
 * @returns {[any, (value: any) => void, boolean, string]} - array of
 *      stateful `value`,
 *      function to update this `value`,
 *      `isPersistent` - will be `false` if error occurred during reading/writing chrome.storage,
 *      `error` - will contain error appeared in storage. if isPersistent is true will be empty string
 */
export function useChromeStorageLocal(key: string, initialValue?: any): [any, (value: any) => void, boolean, string];
/**
 * Hook which will use `chrome.storage.sync` to persist state.
 *
 * @param {string} key - they key name in chrome's storage. Nested keys not supported
 * @param {*} [initialValue] - default value to use
 * @returns {[any, (value: any) => void, boolean, string]} - array of
 *      stateful `value`,
 *      function to update this `value`,
 *      `isPersistent` - will be `false` if error occurred during reading/writing chrome.storage,
 *      `error` - will contain error appeared in storage. if isPersistent is true will be empty string
 */
export function useChromeStorageSync(key: string, initialValue?: any): [any, (value: any) => void, boolean, string];
/**
 * Use to create state with chrome.storage.local.
 * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
 *
 * @param {string} key - they key name in chrome's storage. Nested keys not supported
 * @param {*} [initialValue] - default value to use
 * @returns {function(): [any, (value: any) => void, boolean, string]}
 */
export function createChromeStorageStateHookLocal(key: string, initialValue?: any): () => [any, (value: any) => void, boolean, string];
/**
 * Use to create state with chrome.storage.sync.
 * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
 *
 * @param {string} key - they key name in chrome's storage. Nested keys not supported
 * @param {*} [initialValue] - default value to use
 * @returns {function(): [any, (value: any) => void, boolean, string]}
 */
export function createChromeStorageStateHookSync(key: string, initialValue?: any): () => [any, (value: any) => void, boolean, string];
