import {Dispatch, SetStateAction} from 'react';


export = useChromeStorage;
export as namespace useChromeStorage;

declare namespace useChromeStorage {
  /**
   * Hook which will use `chrome.storage.local` to persist state.
   *
   * @param {string} key - they key name in chrome's storage. Nested keys not supported
   * @param {*} [initialValue] - default value to use
   * @returns {[any, (value: any) => void, boolean, string, boolean]} - array of
   *      stateful `value`,
   *      function to update this `value`,
   *      `isPersistent` - will be `false` if error occurred during reading/writing chrome.storage,
   *      `error` - will contain error appeared in storage. if isPersistent is true will be empty string
   *      `isInitialStateResolved` - will set to `true` once `initialValue` will be replaced with stored in chrome.storage
   */
  function useChromeStorageLocal<S>(key: string, initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>, boolean, string, boolean];
  // convenience overload when initialValue is omitted
    /**
     * Hook which will use `chrome.storage.local` to persist state.
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {[any, (value: any) => void, boolean, string, boolean]} - array of
     *      stateful `value`,
     *      function to update this `value`,
     *      `isPersistent` - will be `false` if error occurred during reading/writing chrome.storage,
     *      `error` - will contain error appeared in storage. if isPersistent is true will be empty string
     *      `isInitialStateResolved` - will set to `true` once `initialValue` will be replaced with stored in chrome.storage
     */
    function useChromeStorageLocal<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string, boolean];


    /**
     * Hook which will use `chrome.storage.sync` to persist state.
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {[any, (value: any) => void, boolean, string, boolean]} - array of
     *      stateful `value`,
     *      function to update this `value`,
     *      `isPersistent` - will be `false` if error occurred during reading/writing chrome.storage,
     *      `error` - will contain error appeared in storage. if isPersistent is true will be empty string
     *      `isInitialStateResolved` - will set to `true` once `initialValue` will be replaced with stored in chrome.storage
     */
    function useChromeStorageSync<S>(key: string, initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>, boolean, string, boolean];
  // convenience overload when initialValue is omitted
    /**
     * Hook which will use `chrome.storage.sync` to persist state.
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {[any, (value: any) => void, boolean, string, boolean]} - array of
     *      stateful `value`,
     *      function to update this `value`,
     *      `isPersistent` - will be `false` if error occurred during reading/writing chrome.storage,
     *      `error` - will contain error appeared in storage. if isPersistent is true will be empty string
     *      `isInitialStateResolved` - will set to `true` once `initialValue` will be replaced with stored in chrome.storage
     */
    function useChromeStorageSync<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string, boolean];


    /**
     * Use to create state with chrome.storage.local.
     * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {function(): [any, (value: any) => void, boolean, string, boolean]}
     */
    function createChromeStorageStateHookLocal<S>(key: string, initialValue: S | (() => S)): () => [S, Dispatch<SetStateAction<S>>, boolean, string, boolean];
  // convenience overload when initialValue is omitted
    /**
     * Use to create state with chrome.storage.local.
     * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {function(): [any, (value: any) => void, boolean, string, boolean]}
     */
    function createChromeStorageStateHookLocal<S = undefined>(key: string): () => [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string, boolean];


    /**
     * Use to create state with chrome.storage.sync.
     * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {function(): [any, (value: any) => void, boolean, string, boolean]}
     */
    function createChromeStorageStateHookSync<S>(key: string, initialValue: S | (() => S)): () => [S, Dispatch<SetStateAction<S>>, boolean, string, boolean];
  // convenience overload when initialValue is omitted
    /**
     * Use to create state with chrome.storage.sync.
     * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
     *
     * @param {string} key - they key name in chrome's storage. Nested keys not supported
     * @param {*} [initialValue] - default value to use
     * @returns {function(): [any, (value: any) => void, boolean, string, boolean]}
     */
    function createChromeStorageStateHookSync<S = undefined>(key: string): () => [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string, boolean];
}
