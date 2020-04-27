export type SMCKeyManipFunc = ( key: string ) => string;
export type SMCExpireFunc = ( key: string, value: any ) => void;

interface SMCEntry {
	value: any;
	expire: number;
	timeout: number;
}

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
export class SimpleMemCache {
	private _cache: Map<string, any>;

	/**
	 * Function that can be defined for key manipulation.
	 * The function will be called before any method call.
	 *
	 * @example  smc.keyManip = ( key ) => key.toLowerCase ();
	*/
	public keyManip: SMCKeyManipFunc;

	/** Read only property that returns the number of cache misses */
	public misses: number;
	/** Read only property that returns the number of cache hits */
	public hits: number;
	/** Read only property that returns the number of keys in the cache. */
	public size: number;

	constructor ( keyManip: SMCKeyManipFunc = null ) {
		this._cache = new Map<string, any>();

		this.misses = 0;
		this.hits = 0;
		this.size = 0;

		this.keyManip = keyManip;

		// Sets all basic variables
		this.clear();
	}

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
	public add( key: string, value: any, expire = 0, expireCallback: SMCExpireFunc = null ) {
		key = this.keyManip ? this.keyManip( key ) : key;

		this._del( key );
		return this._add( key, value, expire, expireCallback );
	}

	/**
	 * Retrieves the value for the specified *key*. If the key is not found
	 * in the cache, *defaultValue* is returned.
	 *
	 * @param key
	 * @param defaultValue
	 *
	 * @returns This method returns the value in cache or *defaultValue*.
	 */
	public get( key: string, defaultValue: any = undefined ) {
		key = this.keyManip ? this.keyManip( key ) : key;

		const rec = this._cache.get( key );

		if ( !rec ) {
			this.misses++;
			return defaultValue;
		}

		this.hits++;
		return rec.value;
	}

	/**
	 * Deletes the provided *key* from the cache.
	 *
	 * @param key the cache key name
	 *
	 * @returns nothing
	 */
	public del( key: string ) {
		key = this.keyManip ? this.keyManip( key ) : key;
		this._del( key );
	}

	/**
	 * Completely swipe cache data from memory.
	 *
	 * @returns nothing.
	 */
	clear() {
		this._cache.forEach( ( rec ) => {
			clearTimeout( rec.timeout );
		} );

		this._cache.clear();

		this.hits = 0;
		this.misses = 0;
		this.size = 0;
	}

	/**
	 * Returns a string rappresentation of key/values in memory.
	 *
	 * @param indent The JSON indentation
	 *
	 * @see parse
	 *
	 * @returns the stringified version of key/values in memory.
	 */
	public stringify( indent = 0 ) {
		const res: SMCEntryPublic[] = [];

		for ( const [ key, rec ] of this._cache.entries() ) {
			const k: SMCEntryPublic = {
				key,
				value: rec.value
			};

			if ( rec.expire ) k.expire = rec.expire;

			res.push( k );
		};

		return JSON.stringify( res, null, indent );
	}

	/**
	 * Restore keys / values inside the *json* string into memory cache.
	 * If *skipExisting* is true, keys already present in the memory cache are preserved.
	 *
	 * @param json  The JSON string containg the key / values pair
	 * @param skipExisting If set to `true` existing keys in memory will not be overwritten
	 */
	public parse( json: string, skipExisting = false ) {
		const items = JSON.parse( json );
		const currTime = Date.now();

		items.forEach( ( item: SMCEntryPublic ) => {
			if ( skipExisting && ( item.key in this._cache ) ) return;

			// Recalc expiration (if any)
			if ( item.expire ) {
				let timeLeft = item.expire - currTime;
				if ( timeLeft < 0 ) return;

				// Keep only delta time for adding item
				timeLeft = timeLeft - currTime;

				this._add( item.key, item.value, timeLeft, null );
			} else
				this._add( item.key, item.value );
		} );
	}

	/**
	 * Retrieves all the keys currently in cache.
	 *
	 * @returns {list} of strings
	 */
	keys() {
		return Object.keys( this._cache );
	}

	// =========================================================================
	// INTERNAL USE ONLY FUNCTIONS
	// =========================================================================
	private _del( key: string ) {
		const rec = this._cache.get( key );
		if ( !rec ) return;

		clearTimeout( rec.timeout );
		this._cache.delete( key );
		this.size--;
	}

	private _add( key: string, value: any, expire: number = 0, expireCallback: SMCExpireFunc = null ) {
		const rec: SMCEntry = {
			expire: 0,
			timeout: 0,
			value: value
		};

		if ( expire ) {
			rec.expire = expire + Date.now();
			rec.timeout = setTimeout(
				() => {
					this._del( key );
					expireCallback && expireCallback( key, value );
				}, expire
			);
		}

		this._cache.set( key, rec );
		this.size++;

		return value;
	}
}