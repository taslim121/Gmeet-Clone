import {MMKV} from 'react-native-mmkv'
const storage = new MMKV({
    id: 'user_storage',
    encryptionKey: 'your-encryption-key-here',
});
export const mmkvStorage ={
    setItem : (key, value) => {
    storage.set(key, value);
     },
    getItem : (key) => {
    return storage.getString(key);
    },
    removeItem : (key) => {
    storage.delete(key);
    }
};
