export declare type SMCKeyManipFunc = (key: string) => string;
export declare type SMCExpireFunc = (key: string, value: any) => void;
export interface SMCEntryPublic {
    key: string;
    value: any;
    expire?: number;
}
/**
 * simple-mem-cache
 *
 * A simple in-memory cache for node-js
 *
 * by Fabio Rotondo <fabio.rotondo@gmail.com>
 *
 * MIT license
 */
export declare class SimpleMemCache {
    private _cache;
    /**
     * Function that can be defined for key manipulation.
     * The function will be called before any method call.
     *
     * @example  smc.keyManip = ( key ) => key.toLowerCase ();
    */
    keyManip: SMCKeyManipFunc;
    /** Read only property that returns the number of cache misses */
    misses: number;
    /** Read only property that returns the number of cache hits */
    hits: number;
    /** Read only property that returns the number of keys in the cache. */
    size: number;
    constructor(keyManip?: SMCKeyManipFunc);
    /**
     * Stores a value in the cache. You can automatically remove
     * the given value from the cache providing the *expire* attribute
     * (a numeric value indicating the duration time of the value
     * expressed in milliseconds).
     * Also, optionally, if the value is going to expire, you can specify
     * an expiration callback to be called at that time.
     *
     * @param key     the cache key name for retrieving value
     * @param value        the value to be cached. Can be any JavaScript type.
     * @param expire  (optional) the value determining the lifespan in memory, expressed in milliseconds.
     * @param expireCallback (optional) the callback to be called when the item expires from cache. It will be called with the following signature: expireCallback ( key, value )
     *
     * @returns {*} returns the value just cached.
     */
    add(key: string, value: any, expire?: number, expireCallback?: SMCExpireFunc): any;
    /**
     * Retrieves the value for the specified *key*. If the key is not found
     * in the cache, *defaultValue* is returned.
     *
     * @param key
     * @param defaultValue
     *
     * @returns This method returns the value in cache or *defaultValue*.
     */
    get(key: string, defaultValue?: any): any;
    /**
     * Deletes the provided *key* from the cache.
     *
     * @param key the cache key name
     *
     * @returns nothing
     */
    del(key: string): void;
    /**
     * Completely swipe cache data from memory.
     *
     * @returns nothing.
     */
    clear(): void;
    /**
     * Returns a string rappresentation of key/values in memory.
     *
     * @param indent The JSON indentation
     *
     * @see parse
     *
     * @returns the stringified version of key/values in memory.
     */
    stringify(indent?: number): string;
    /**
     * Restore keys / values inside the *json* string into memory cache.
     * If *skipExisting* is true, keys already present in the memory cache are preserved.
     *
     * @param json  The JSON string containg the key / values pair
     * @param skipExisting If set to `true` existing keys in memory will not be overwritten
     */
    parse(json: string, skipExisting?: boolean): void;
    /**
     * Retrieves all the keys currently in cache.
     *
     * @returns {list} of strings
     */
    keys(): string[];
    private _del;
    private _add;
}
