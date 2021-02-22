export const storage = {
    get: (key, defaultValue, storageArea) => {
        return new Promise((resolve, reject) => {
            chrome.storage[storageArea].get({[key]: defaultValue}, items => {
                const error = chrome.runtime.lastError;
                if (error) return reject(error);
                resolve(items[key]);
            });
        });

    },
    set: (key, value, storageArea) => {
        return new Promise((resolve, reject) => {
            chrome.storage[storageArea].set({[key]: value}, () => {
                const error = chrome.runtime.lastError;
                error ? reject(error) : resolve();
            });
        });
    },
};
