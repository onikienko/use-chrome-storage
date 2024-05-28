# use-chrome-storage

☝️ This package is for usage in Chrome (and Chromium-based) Extensions, but it should work with Firefox extensions too.

Custom React hooks for `chrome.storage.` You may use it to keep the global persisted state in Chrome Extensions.

**Note:** Since it's a React hook, it may be used only in the React context.
So it's impossible to use this package in the background service worker.

- Simplify work with `chrome.storage`
- Supports `chrome.storage.local`, `chrome.storage.sync`, and `chrome.storage.session`
- Can be used as persisted state available in different extension's contexts (content script, popup, options page)
- Listen for `chrome.storage` changes and keep the local state updated

## Install

```bash
npm i use-chrome-storage
```

## Usage

This package requires the storage permission in manifest.json:

```json
{
    "name": "My Extension",
    "permissions": [
        "storage"
    ]
}
```

For usage with chrome.storage.**local** use `useChromeStorageLocal` hook. For chrome.storage.**sync**
use `useChromeStorageSync` hook. Use `useChromeStorageSession` for chrome.storage.**session**

### Usage of useChromeStorage

```javascript
import React from 'react';
import {useChromeStorageLocal} from 'use-chrome-storage';


const LocalCounter = () => {
    // If you need to state be preserved in `chrome.storage.sync` use useChromeStorageSync
    // for `chrome.storage.session` use useChromeStorageSession
    const [value, setValue, isPersistent, error, isInitialStateResolved] = useChromeStorageLocal('counterLocal', 0);
    return (
            <div>
                <button
                        onClick={() => {
                            setValue(prev => (prev + 1));
                        }}
                >
                    Increment in Local Storage
                </button>
                <div>Value: {value}</div>
                <div>Persisted in chrome.storage.local: {isPersistent.toString()}</div>
                <div>Error: {error}</div>
                <div>Is state from chrome.storage already loaded? - {isInitialStateResolved.toString()}</div>
            </div>
    );
};
```

### Usage of createChromeStorageStateHook

If you want to use the same `key` in different components in different extension parts in the React context (like in PopUp,
content scripts,
) you need to use `createChromeStorageStateHookLocal`(for chrome.storage.**local**),
`createChromeStorageStateHookSync` (for chrome.storage.**sync**)
and `createChromeStorageStateHookSession` (for chrome.storage.**session**).

Initialize storage:

```javascript
// common/useSettingsStore.js
import {createChromeStorageStateHookLocal} from 'use-chrome-storage';


const SETTINGS_KEY = 'settings';
const INITIAL_VALUE = {
    showAvatar: true,
    showHistory: false,
};

export const useSettingsStore = createChromeStorageStateHookLocal(SETTINGS_KEY, INITIAL_VALUE);
```

Use `useSettingsStore` on the options page:

```javascript
// options.js
import React from 'react';
import {useSettingsStore} from './common/useSettingsStore';


const Options = () => {
    const [settings, setSettings, isPersistent, error, isInitialStateResolved] = useSettingsStore();

    const handleChange = event => {
        setSettings(prevState => {
            return {
                ...prevState,
                [event.target.name]: event.target.checked
            };
        });
    };

    return (
            <div>
                <label>
                    <input
                            type="checkbox"
                            name="showAvatar"
                            checked={settings.showAvatar}
                            onChange={handleChange}
                    />
                    <span>Show Avatar</span>
                </label>
                <label>
                    <input
                            type="checkbox"
                            name="showHistory"
                            checked={settings.showHistory}
                            onChange={handleChange}
                    />
                    <span>Show History</span>
                </label>
                {isInitialStateResolved && <div>Initial state from "chrome.storage" is loaded</div>}
                {!isPersistent && <div>Error writing to the chrome.storage: {error}</div>}
            </div>
    );
};
```

Or from the content script:

```javascript
// contentScript.js
import React from 'react';
import Avatar from './common/Avatar';
import History from './common/History';
import {useSettingsStore} from './common/useSettingsStore';


const Card = () => {
    const [settings] = useSettingsStore();

    return (
            <div>
                {settings.showAvatar && <Avatar/>}
                {settings.showHistory && <History/>}
            </div>
    );
};
```

In the same way, you may use it for PopUp.

### Initial Value flow

Say we have the next hook:

```javascript
const [value, setValue, isPersistent, error, isInitialStateResolved] = useChromeStorageLocal('counterLocal', 1);
```

Say in the `chrome.storage.local` we already have: `counterLocal: 10`.

Changes of `value`:

1. `value` is 1 (`initialValue` set in the hook)
2. `useChromeStorageLocal` calls to Chrome API (this API is async) to get the value of `counterLocal`.

- `value` changes to *10*
- `isInitialStateResolved` changes to `true` indicating that `value` synchronized with data saved in `chrome.storage`

### Usage with `chrome.storage.session`

`useChromeStorageSession` and `createChromeStorageStateHookSessin` use `chrome.storage.session` to persist state.
By default, it's not exposed to content scripts,
but this behavior can be changed by calling `chrome.storage.session.setAccessLevel('TRUSTED_AND_UNTRUSTED_CONTEXTS')`
(call it from the background script).
https://developer.chrome.com/docs/extensions/reference/storage/#method-StorageArea-setAccessLevel

### Clearing or removing storage items

Suppose you want to reset all your stored items back to their initial values. 

You could, for example, use `chrome.storage.local.clear()` (or their 'session', 'sync' counterparts) to clear the entire storage.  
Alternatively, you can use `chrome.storage.local.remove(key)` to remove a specific storage item.

This will trigger a sync event in your `useChromeStorage[Local|Session|Sync]` hooks, setting them back to their _initial value_.

## API

### useChromeStorageLocal(key, initialValue?)

The state will be persisted in `chrome.storage.local` (and updated from `chrome.storage.local` if it was updated in other
contexts). If you want to use this hook in more than one place, use `createChromeStorageStateHookLocal`.

- `key: string` - The key used in `chrome.storage.local`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.local` has no stored value yet or when a stored item is removed (unset)

#### Returns

`[value, setValue, isPersistent, error, isInitialStateResolved]`

- `value: any` - stateful value like first one returned from `React.useState()`
- `setValue: function` - function to update `value` like second one returned from `React.useState()`
- `isPersistent: boolean` - Will be `true` if data is persisted in `chrome.storage.local`. In case of error
  during `chrome.storage.local.get` or `chrome.storage.local.set` value will be stored in memory only and `isPersistent`
  will be set to `false`
- `error: string` - If `isPersistent` is `true` will contain empty string. Otherwise, will contain error returned
  by `chrome.runtime.lastError`.
- `isInitialStateResolved: boolean` - will set to `true` once `initialValue` will be replaced with stored in
  chrome.storage

### useChromeStorageSync(key, initialValue?)

Similar to `useChromeStorageLocal` but will use `chrome.storage.sync`. State will be persisted
in `chrome.storage.sync` (and updated from `chrome.storage.sync` if it was updated in other contexts). If you want to
use this hook in more than one place, use `createChromeStorageStateHookSync`.

- `key: string` - The key used in `chrome.storage.sync`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.sync` has no stored value yet

#### Returns

`[value, setValue, isPersistent, error]`

- `value: any` - stateful value like the first one returned from `React.useState()`
- `setValue: function` - function to update `value` like the second one returned from `React.useState()`
- `isPersistent: boolean` - Will be `true` if data is persisted in `chrome.storage.sync`. In case of an error
  during `chrome.storage.local.get` or `chrome.storage.local.set` value will be stored in memory only and `isPersistent`
  will be set to `false`
- `error: string` - If `isPersistent` is `true` will contain empty string. Otherwise, will contain error returned
  by `chrome.runtime.lastError`.
- `isInitialStateResolved: boolean` - will set to `true` once `initialValue` will be replaced with stored in
  chrome.storage

### useChromeStorageSession(key, initialValue?)

Similar to `useChromeStorageLocal` but will use `chrome.storage.session`. State will be persisted
in `chrome.storage.session` (and updated from `chrome.storage.session` if it was updated in other contexts). If you want
to use this hook in more than one place, use `createChromeStorageStateHookSession`.

- `key: string` - The key used in `chrome.storage.session`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.session` has no stored value yet

#### Returns

`[value, setValue, isPersistent, error]`

- `value: any` - stateful value like the first one returned from `React.useState()`
- `setValue: function` - function to update `value` like the second one returned from `React.useState()`
- `isPersistent: boolean` - Will be `true` if data is persisted in `chrome.storage.session`. In case of an error
  during `chrome.storage.session.get` or `chrome.storage.session.set` value will be stored in memory only
  and `isPersistent` will be set to `false`
- `error: string` - If `isPersistent` is `true` will contain empty string. Otherwise, will contain an error returned
  by `chrome.runtime.lastError`.
- `isInitialStateResolved: boolean` - will set to `true` once `initialValue` will be replaced with stored in
  `chrome.storage.session`

### createChromeStorageStateHookLocal(key, initialValue?)

In case you want to use the same `key` in different components/extension contexts you could create the state hook which can
be used across the extension. See [example](#usage-of-createchromestoragestateHook). The state will be persisted
in `chrome.storage.local`.

- `key: string` - The key used in `chrome.storage.local`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.local` has no stored value yet

### Returns

`function(): [any, (value: any) => void, boolean, string, boolean]` - `useChromeStorageLocal` hook which may be used
across
extension's components/pages

### createChromeStorageStateHookSync(key, initialValue?)

Similar to `createChromeStorageStateHookLocal` but uses `chrome.storage.sync`. In case you want to use the same `key` in
different components/extension contexts you could create a state hook that can be used across the extension.
See [example](#usage-of-createchromestoragestateHook) and replace with `createChromeStorageStateHookSync`. State will be
persisted in `chrome.storage.sync`.

- `key: string` - The key used in `chrome.storage.sync`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.sync` has no stored value yet

### Returns

`function(): [any, (value: any) => void, boolean, string, boolean]` - `useChromeStorageSync` hook which may be used
across extension's components/pages

### createChromeStorageStateHookSession(key, initialValue?)

Similar to `createChromeStorageStateHookLocal` but uses `chrome.storage.session`. In case you want to use the same `key` in
different components/extension contexts, you could create a state hook that can be used across extension.
See [example](#usage-of-createchromestoragestateHook) and replace with `createChromeStorageStateHookSession`. State will
be persisted in `chrome.storage.session`.

- `key: string` - The key used in `chrome.storage.session`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.session` has no stored value yet

### Returns

`function(): [any, (value: any) => void, boolean, string, boolean]` - `useChromeStorageSession` hook which may be used
across extension's components/pages

## Thanks to

[use-local-storage-state](https://github.com/astoilkov/use-local-storage-state) for inspiration
