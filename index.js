import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNPreferenceManager } = NativeModules;

let PREFERENCES = {};
let SUITE_PREFERENCES = {};

try {
    PREFERENCES = JSON.parse(RNPreferenceManager.InitialPreferences);
} catch (err) {
    console.warn(`preference parse exception:${err.message}`);
}

function get(key?: String, suite?:String) {
    let preferences = getPreferences(suite)
    if (key != null) {
        return preferences[key];
    } else {
        return {
            ...preferences
        };
    }
}

function set(key: String|Object, value?: String, suite?:String) {
    let data = {};

    if (typeof key === 'object') {
        data = {
            ...key
        };
    } else {
        data[key] = value;
    }
    let preferences = getPreferences(suite)
    Object.keys(data).forEach((name) => {
        const stringfied = JSON.stringify(data[name]);
        if (stringfied) {
            preferences[name] = JSON.parse(stringfied);
        } else {
            delete preferences[name];
        }
    });

    return RNPreferenceManager.set(JSON.stringify(preferences), suite);
}

function getPreferences(suite?:String) {
    if (suite == null) {
        return PREFERENCES
    } else {
        if (SUITE_PREFERENCES[suite] == null) {
            try {
                SUITE_PREFERENCES[suite] = JSON.parse(RNPreferenceManager.getPreferences(suite));
            } catch (err) {
                SUITE_PREFERENCES[suite] = {}
                console.warn(`preference parse exception:${err.message}`);
            }
        }
        return SUITE_PREFERENCES[suite]
    }
}

function clear(key?: String|Array, suite?:String) {
    let preferences = getPreferences(suite)
    if (key == null) {
        preferences = {};
        return RNPreferenceManager.clear(suite);
    } else {
        let keys;
        if (!Array.isArray(key)) {
            keys = [key];
        }

        keys.map((name) => {
            delete preferences[name];
        });

        return RNPreferenceManager.set(JSON.stringify(preferences), suite);
    }
}

export default {
    get,
    set,
    clear
}
