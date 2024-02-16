import {useCallback, useEffect, useState} from 'react';
import {storage} from './storage';


/**
 * Basic hook for storage
 * @param {string} key
 * @param {*} initialValue
 * @param {'local'|'sync'|'session'} storageArea
 * @returns {[*, function(*= any): void, boolean, string, boolean]}
 */
export default function useChromeStorage(key, initialValue, storageArea) {
    const [INITIAL_VALUE] = useState(() => {
        return typeof initialValue === 'function' ? initialValue() : initialValue;
    });
    const [STORAGE_AREA] = useState(storageArea);
    const [state, setState] = useState(INITIAL_VALUE);
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');
    const [isInitialStateResolved, setIsInitialStateResolved] = useState(false);

    useEffect(() => {
        storage.get(key, INITIAL_VALUE, STORAGE_AREA)
            .then(res => {
                setState(res);
                setIsPersistent(true);
                setError('');
            })
            .catch(error => {
                setIsPersistent(false);
                setError(error);
            })
            .finally(() => {
                setIsInitialStateResolved(true);
            });
    }, [key, INITIAL_VALUE, STORAGE_AREA]);

    const updateValue = useCallback((newValue) => {
        const toStore = typeof newValue === 'function' ? newValue(state) : newValue;
        storage.set(key, toStore, STORAGE_AREA)
            .then(() => {
                setIsPersistent(true);
                setError('');
            })
            .catch(error => {
                // set newValue to local state because chrome.storage.onChanged won't be fired in error case
                setState(toStore);
                setIsPersistent(false);
                setError(error);
            });
    }, [STORAGE_AREA, key, state]);

    useEffect(() => {
        const onChange = (changes, areaName) => {
            if (areaName === STORAGE_AREA && key in changes) {
                const change = changes[key]; 
                const isValueStored = 'newValue' in change;
                // only set the new value if it's actually stored (otherwise it'll just set undefined)
                if (isValueStored) {
                    setState(change.newValue);
                } else {
                    setState(INITIAL_VALUE);
                }
                setIsPersistent(isValueStored);
                setError('');
            }
        };
        chrome.storage.onChanged.addListener(onChange);
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [key, STORAGE_AREA]);

    return [state, updateValue, isPersistent, error, isInitialStateResolved];
}
