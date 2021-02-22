// import {chrome as jestChrome} from 'jest-chrome';
import {act, renderHook} from '@testing-library/react-hooks';
import {waitFor} from '@testing-library/react';
import {useChromeStorageLocal} from '../src';


const KEY = 'settings';
const INITIAL = {opt1: true, opt2: false};
const UPDATED = {opt3: false, opt4: true};
const UPDATED_PARTIALLY = {opt1: true, opt2: true};

let storeLocal = {};

const mockGet = chrome.storage.local.get;
const mockSet = chrome.storage.local.set;

mockGet.mockImplementation((objToGet, callback) => {
    const key = Object.keys(objToGet)[0];
    const value = Object.values(objToGet)[0];
    let res = storeLocal[key];
    if (res === undefined) {
        res = {[key]: value};
    }
    callback(res);
});

mockSet.mockImplementation((objToSet, callback) => {
    storeLocal = {
        ...storeLocal,
        ...objToSet,
    };
    callback();
});

beforeEach(() => {
    storeLocal = {};
    mockGet.mockClear();
    mockSet.mockClear();
});

describe('useChromeStorageLocal()', () => {
    it('set initialValue as state', function () {
        const {result} = renderHook(() => useChromeStorageLocal(KEY, INITIAL));
        const [settings] = result.current;
        expect(settings).toEqual(INITIAL);
    });

    it('set functional initialValue as state', () => {
        const {result} = renderHook(() => useChromeStorageLocal(KEY, () => INITIAL));
        const [settings] = result.current;
        expect(settings).toEqual(INITIAL);
    });

    it('be persistent and with not error', function () {
        const {result} = renderHook(() => useChromeStorageLocal(KEY, INITIAL));
        const [, , isPersistent, error] = result.current;
        expect(isPersistent).toBeTruthy();
        expect(error).toBe('');
    });

    it('not update storage with initialValue', async function () {
        renderHook(() => useChromeStorageLocal(KEY, () => INITIAL));
        expect(mockSet).not.toHaveBeenCalled();
        await waitFor(() => {
            expect(storeLocal).toEqual({});
        });
    });

    it('update state and storage', async function () {
        const {result} = renderHook(() => useChromeStorageLocal(KEY, INITIAL));

        act(() => {
            const setSettings = result.current[1];
            setSettings(UPDATED);
        });
        const [settings, , isPersistent, error] = result.current;
        expect(settings).toEqual(UPDATED);
        expect(isPersistent).toBeTruthy();
        expect(error).toBe('');

        expect(mockGet).toHaveBeenCalled();
        expect(mockGet.mock.calls[0][0]).toEqual({[KEY]: INITIAL});
        expect(mockSet).toHaveBeenCalled();
        expect(mockSet.mock.calls[0][0]).toEqual({[KEY]: UPDATED});

        await waitFor(() => {
            expect(storeLocal[KEY]).toEqual(UPDATED);
        });
    });

    it('update state and storage with callback', async function () {
        const {result} = renderHook(() => useChromeStorageLocal(KEY, INITIAL));

        act(() => {
            const setSettings = result.current[1];
            setSettings(prevValue => {
                return {...prevValue, opt2: true};
            });
        });
        const [settings, , isPersistent, error] = result.current;
        expect(settings).toEqual(UPDATED_PARTIALLY);
        expect(isPersistent).toBeTruthy();
        expect(error).toBe('');

        expect(mockGet).toHaveBeenCalled();
        expect(mockGet.mock.calls[0][0]).toEqual({[KEY]: INITIAL});
        expect(mockSet).toHaveBeenCalled();
        expect(mockSet.mock.calls[0][0]).toEqual({[KEY]: UPDATED_PARTIALLY});

        await waitFor(() => {
            expect(storeLocal[KEY]).toEqual(UPDATED_PARTIALLY);
        });
    });
});
