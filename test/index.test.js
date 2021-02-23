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
const mockSet = (objToSet, callback) => {
    store = {
        ...store,
        ...objToSet,
    };
    callback();
};

mockGetLocal.mockImplementation(mockGet);
mockSetLocal.mockImplementation(mockSet);
mockGetSync.mockImplementation(mockGet);
mockSetSync.mockImplementation(mockSet);

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
    it('set initialValue as state', function () {
        const {result} = renderHook(() => hook(KEY, INITIAL));
        const [settings] = result.current;
        expect(settings).toEqual(INITIAL);
    });

    it('set functional initialValue as state', () => {
        const {result} = renderHook(() => hook(KEY, () => INITIAL));
        const [settings] = result.current;
        expect(settings).toEqual(INITIAL);
    });

    it('be persistent and with no error', function () {
        const {result} = renderHook(() => hook(KEY, INITIAL));
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
        const {result: resultA} = renderHook(() => useSettings());
        const {result: resultB} = renderHook(() => useSettings());

        act(() => {
            const setSettings = resultA.current[1];
            setSettings(UPDATED);
        });

        const [settings] = resultB.current;
        await waitFor(() => {
            expect(settings).toEqual(UPDATED);
        });
    });
});
