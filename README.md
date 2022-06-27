# use-chrome-storage

### Russian invaders must die. Glory to Ukraine. Тримайтеся, брати!

☝️ This package is for usage in Chrome Extensions. Should work with Firefox extensions but not tested.

Custom React hooks for `chrome.storage.` You may use it for keeping global persisted state in Chrome Extensions.

**Note:** Since it's a React hook, it may be used only in the React context.
So it's impossible to use this package in the background service worker.

- Simplify work with `chrome.storage`
- Supports `chrome.storage.local` and `chrome.storage.sync`
- May be used as persisted state available in different extension's contexts (content script, popup, options page)
- Listen for `chrome.storage` changes and keep local state updated

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
use `useChromeStorageSync` hook.

### Usage of useChromeStorage

```javascript
import React from 'react';
import {useChromeStorageLocal} from 'use-chrome-storage';


const LocalCounter = () => {
    // if you need to state be preserved in `chrome.storage.sync` use useChromeStorageSync
    const [value, setValue, isPersistent, error] = useChromeStorageLocal('counterLocal', 0);
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
            </div>
    );
};
```

### Usage of createChromeStorageStateHook

If you want to use same `key` in different components in different extension parts in React context (like in PopUp, content scripts,
) you need to use `createChromeStorageStateHookLocal`(for chrome.storage.**local**)
or `createChromeStorageStateHookSync` (for chrome.storage.**sync**)

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

Use `useSettingsStore` on options page:

```javascript
// options.js
import React from 'react';
import {useSettingsStore} from './common/useSettingsStore';


const Options = () => {
    const [settings, setSettings, isPersistent, error] = useSettingsStore();

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
                {!isPersistent && <div>Error writing to the chrome.storage: {error}</div>}
            </div>
    );
};
```

Or from content script:

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

In the same way you may use it for PopUp.

## API

### useChromeStorageLocal(key, initialValue?)

State will be persisted in `chrome.storage.local` (and updated from `chrome.storage.local` if it was updated in other
contexts). If you want to use this hook in more than one place, use `createChromeStorageStateHookLocal`.

- `key: string` - The key used in `chrome.storage.local`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.local` has no stored value yet

#### Returns

`[value, setValue, isPersistent, error]`

- `value: any` - stateful value like first one returned from `React.useState()`
- `setValue: function` - function to update `value` like second one returned from `React.useState()`
- `isPersistent: boolean` - Will be `true` if data is persisted in `chrome.storage.local`. In case of error
  during `chrome.storage.local.get` or `chrome.storage.local.set` value will be stored in memory only and `isPersistent`
  will be set to `false`
- `error: string` - If `isPersistent` is `true` will contain empty string. Otherwise, will contain error returned
  by `chrome.runtime.lastError`.

### useChromeStorageSync(key, initialValue?)

Similar to `useChromeStorageLocal` but will use `chrome.storage.sync`. State will be persisted
in `chrome.storage.sync` (and updated from `chrome.storage.sync` if it was updated in other contexts). If you want to
use this hook in more than one place, use `createChromeStorageStateHookSync`.

- `key: string` - The key used in `chrome.storage.sync`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.sync` has no stored value yet

#### Returns

`[value, setValue, isPersistent, error]`

- `value: any` - stateful value like first one returned from `React.useState()`
- `setValue: function` - function to update `value` like second one returned from `React.useState()`
- `isPersistent: boolean` - Will be `true` if data is persisted in `chrome.storage.sync`. In case of error
  during `chrome.storage.local.get` or `chrome.storage.local.set` value will be stored in memory only and `isPersistent`
  will be set to `false`
- `error: string` - If `isPersistent` is `true` will contain empty string. Otherwise, will contain error returned
  by `chrome.runtime.lastError`.

### createChromeStorageStateHookLocal(key, initialValue?)

In case you want to use same `key` in different components/extension contextsInstead you may create state hook which may
be used across extension. See [example](#usage-of-createchromestoragestateHook). State will be persisted
in `chrome.storage.local`.

- `key: string` - The key used in `chrome.storage.local`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.local` has no stored value yet

### Returns

`function(): [any, (value: any) => void, boolean, string]` - `useChromeStorageLocal` hook which may be used across
extension's components/pages

### createChromeStorageStateHookSync(key, initialValue?)

Similar to `createChromeStorageStateHookLocal` but uses `chrome.storage.sync`. In case you want to use same `key` in
different components/extension contextsInstead you may create state hook which may be used across extension.
See [example](#usage-of-createchromestoragestateHook) and replace with `createChromeStorageStateHookSync`. State will be
persisted in `chrome.storage.sync`.

- `key: string` - The key used in `chrome.storage.sync`
- `initialValue: any = undefined` - value which will be used if `chrome.storage.sync` has no stored value yet

### Returns

`function(): [any, (value: any) => void, boolean, string]` - `useChromeStorageSync` hook which may be used across
extension's components/pages

## Thanks to

[use-local-storage-state](https://github.com/astoilkov/use-local-storage-state) for inspiration
