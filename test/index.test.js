import {waitFor} from '@testing-library/react';
import {act, renderHook} from '@testing-library/react-hooks';
import {chrome} from 'jest-chrome';
import {
    createChromeStorageStateHookLocal,
    createChromeStorageStateHookSync,
    useChromeStorageLocal,
    useChromeStorageSync,
} from '../src';


const KEY = 'settings';
const INITIAL = {opt1: true, opt2: false};
const UPDATED = {opt3: false, opt4: true};
const UPDATED_PARTIALLY = {opt1: true, opt2: true};

let store = {};

const mockGetLocal = chrome.storage.local.get;
const mockSetLocal = chrome.storage.local.set;

const mockGetSync = chrome.storage.sync.get;
const mockSetSync = chrome.storage.sync.set;

const mockGet = (objToGet, callback) => {
    const key = Object.keys(objToGet)[0];
    const defaultValue = Object.values(objToGet)[0];
    const res = store[key] === undefined ? {[key]: defaultValue} : {[key]: store[key]};
    callback(res);
};
const mockSet = (objToSet, callback, storageArea) => {
    const key = Object.keys(objToSet)[0];
    const changeObj = {
        [key]: {
            oldValue: Object.values(store)[0],
            newValue: Object.values(objToSet)[0],
        },
    };
    store = {
        ...store,
        ...objToSet,
    };
    chrome.storage.onChanged.callListeners(changeObj, storageArea);
    callback();
};

mockGetLocal.mockImplementation(mockGet);
mockSetLocal.mockImplementation((objToSet, callback) => mockSet(objToSet, callback, 'local'));
mockGetSync.mockImplementation(mockGet);
mockSetSync.mockImplementation((objToSet, callback) => mockSet(objToSet, callback, 'sync'));

beforeEach(() => {
    store = {};
    mockGetLocal.mockClear();
    mockSetLocal.mockClear();
    mockGetSync.mockClear();
    mockSetSync.mockClear();
});

describe.each`
    hook                     | mGet            | mSet
    ${useChromeStorageLocal} | ${mockGetLocal} | ${mockSetLocal}
    ${useChromeStorageSync}  | ${mockGetSync}  | ${mockSetSync}
`('$hook', ({hook, mGet, mSet}) => {
    it('set initialValue as state', async function () {
        const {result, waitForNextUpdate} = renderHook(() => hook(KEY, INITIAL));

        let isInitialStateResolved = result.current[4];
        expect(isInitialStateResolved).toBe(false);
        await waitForNextUpdate();
        isInitialStateResolved = result.current[4];
        expect(isInitialStateResolved).toBe(true);

        const [settings] = result.current;
        expect(settings).toEqual(INITIAL);
    });

    it('set functional initialValue as state', async () => {
        const {result, waitForNextUpdate} = renderHook(() => hook(KEY, () => INITIAL));

        let isInitialStateResolved = result.current[4];
        expect(isInitialStateResolved).toBe(false);
        await waitForNextUpdate();
        isInitialStateResolved = result.current[4];
        expect(isInitialStateResolved).toBe(true);

        const [settings] = result.current;
        expect(settings).toEqual(INITIAL);
    });

    it('be persistent and with no error', async function () {
        const {result, waitForNextUpdate} = renderHook(() => hook(KEY, INITIAL));

        let isInitialStateResolved = result.current[4];
        expect(isInitialStateResolved).toBe(false);
        await waitForNextUpdate();
        isInitialStateResolved = result.current[4];
        expect(isInitialStateResolved).toBe(true);

        const [, , isPersistent, error] = result.current;
        expect(isPersistent).toBeTruthy();
        expect(error).toBe('');
    });

    it('not update storage with initialValue', async function () {
        renderHook(() => hook(KEY, () => INITIAL));
        expect(mSet).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(store).toEqual({});
        });
    });

    it('update state with no errors', async function () {
        const {result} = renderHook(() => hook(KEY, INITIAL));
        act(() => {
            const setSettings = result.current[1];
            setSettings(UPDATED);
        });
        const [settings, , isPersistent, error] = result.current;
        await waitFor(() => {
            expect(settings).toEqual(UPDATED);
            expect(isPersistent).toBeTruthy();
            expect(error).toBe('');
        });
    });

    it('update state in callback function with no errors', async function () {
        const {result} = renderHook(() => hook(KEY, INITIAL));
        act(() => {
            const setSettings = result.current[1];
            setSettings(prevValue => {
                return {...prevValue, opt2: true};
            });
        });
        const [settings, , isPersistent, error] = result.current;
        await waitFor(() => {
            expect(settings).toEqual(UPDATED_PARTIALLY);
            expect(isPersistent).toBeTruthy();
            expect(error).toBe('');
        });
    });

    it('update storage when update state', async function () {
        const {result} = renderHook(() => hook(KEY, INITIAL));
        act(() => {
            const setSettings = result.current[1];
            setSettings(UPDATED);
        });
        expect(mGet).toHaveBeenCalled();
        expect(mGet.mock.calls[0][0]).toEqual({[KEY]: INITIAL});
        expect(mSet).toHaveBeenCalled();
        expect(mSet.mock.calls[0][0]).toEqual({[KEY]: UPDATED});
        await waitFor(() => {
            expect(store[KEY]).toEqual(UPDATED);
        });
    });
});


describe.each`
    createHook
    ${createChromeStorageStateHookLocal}
    ${createChromeStorageStateHookSync}
`('$createHook', ({createHook}) => {
    it('one hook update the other', async function () {
        const useSettings = createHook(KEY, INITIAL);
        const { result: resultA, waitForNextUpdate } = renderHook(() => useSettings());
        await waitForNextUpdate();
        expect(resultA.current[4]).toBe(true);

        const { result: resultB } = renderHook(() => useSettings());
        act(() => {
            const setSettings = resultA.current[1];
            setSettings(UPDATED);
        });

        const [settings, , isPersistent, error] = resultB.current;
        await waitFor(() => {
            expect(settings).toEqual(UPDATED);
            expect(isPersistent).toBe(true);
            expect(error).toBe("");
        });
    });
});
