import { Dispatch, SetStateAction } from "react";

export = useChromeStorage;
export as namespace useChromeStorage;

declare namespace useChromeStorage {
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
  function useChromeStorageLocal<S>(key: string, initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>, boolean, string];
  // convenience overload when initialValue is omitted
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
  function useChromeStorageLocal<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string];


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
  function useChromeStorageSync<S>(key: string, initialValue: S | (() => S)): [S, Dispatch<SetStateAction<S>>, boolean, string];
  // convenience overload when initialValue is omitted
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
  function useChromeStorageSync<S = undefined>(key: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string];


  /**
   * Use to create state with chrome.storage.local.
   * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
   *
   * @param {string} key - they key name in chrome's storage. Nested keys not supported
   * @param {*} [initialValue] - default value to use
   * @returns {function(): [any, (value: any) => void, boolean, string]}
   */
  function createChromeStorageStateHookLocal<S>(key: string, initialValue: S | (() => S)): () => [S, Dispatch<SetStateAction<S>>, boolean, string];
  // convenience overload when initialValue is omitted
  /**
   * Use to create state with chrome.storage.local.
   * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
   *
   * @param {string} key - they key name in chrome's storage. Nested keys not supported
   * @param {*} [initialValue] - default value to use
   * @returns {function(): [any, (value: any) => void, boolean, string]}
   */
  function createChromeStorageStateHookLocal<S = undefined>(key: string): () => [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string];


  /**
   * Use to create state with chrome.storage.sync.
   * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
   *
   * @param {string} key - they key name in chrome's storage. Nested keys not supported
   * @param {*} [initialValue] - default value to use
   * @returns {function(): [any, (value: any) => void, boolean, string]}
   */
  function createChromeStorageStateHookSync<S>(key: string, initialValue: S | (() => S)): () => [S, Dispatch<SetStateAction<S>>, boolean, string];
  // convenience overload when initialValue is omitted
  /**
   * Use to create state with chrome.storage.sync.
   * Useful if you want to reuse same state across components and/or context (like in popup, content script, background pages)
   *
   * @param {string} key - they key name in chrome's storage. Nested keys not supported
   * @param {*} [initialValue] - default value to use
   * @returns {function(): [any, (value: any) => void, boolean, string]}
   */
  function createChromeStorageStateHookSync<S = undefined>(key: string): () => [S | undefined, Dispatch<SetStateAction<S | undefined>>, boolean, string];
}
