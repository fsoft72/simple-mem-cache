const _ = require ( 'lodash' );

/**
 * simple-mem-cache
 *
 * A simple in-memory cache for node-js
 * 
 * by Fabio Rotondo <fabio.rotondo@gmail.com>
 * 
 * MIT license
 */
class SimpleMemCache
{
	constructor ()
	{
		this._cache = {};

		// Sets all basic variables
		this.clear ();

		/** 
		 * Function that can be defined for key manipulation.
		 * The function will be called before any method call.
		 * 
		 * @example  smc.keyManip = ( key ) => key.toLowerCase ();
		*/
		this.keyManip = null;
	}

	/**
	 * Stores a value in the cache. You can automatically remove 
	 * the given value from the cache providing the *expire* attribute 
	 * (a numeric value indicating the duration time of the value 
	 * expressed in milliseconds).
	 * Also, optionally, if the value is going to expire, you can specify 
	 * an expiration callback to be called at that time. 
	 * 
	 * @param {string} key     the cache key name for retrieving value
	 * @param {*} value        the value to be cached. Can be any JavaScript type.
	 * @param {number} expire  (optional) the value determining the lifespan in memory, expressed in milliseconds.
	 * @param {function} expireCallback (optional) the callback to be called when the item expires from cache. It will be called with the following signature: expireCallback ( key, value )
	 * 
	 * @returns {*} returns the value just cached.
	 */
	add ( key, value, expire = 0, expireCallback = null )
	{
		key = this.keyManip ? this.keyManip ( key ) : key;

		this._del ( key );
		return this._add ( key, value, expire, expireCallback );
	}

	/**
	 * Retrieves the value for the specified *key*. If the key is not found 
	 * in the cache, *defaultValue* is returned.
	 * 
	 * @param {string} key 
	 * @param {*} defaultValue 
	 * 
	 * @returns This method returns the value in cache or *defaultValue*.
	 */
	get ( key, defaultValue )
	{
		key = this.keyManip ? this.keyManip ( key ) : key;

		const rec = this._cache [ key ];

		if ( ! rec )
		{
			this.misses ++;
			return defaultValue;
		}

		this.hits ++;
		return rec.value;
	}

	/**
	 * Deletes the provided *key* from the cache.
	 * 
	 * @param {string} key the cache key name
	 * 
	 * @returns nothing
	 */
	del ( key )
	{
		key = this.keyManip ? this.keyManip ( key ) : key;
		this._del ( key );
	}

	/**
	 * Completely swipe cache data from memory.
	 * 
	 * @returns nothing.
	 */
	clear ()
	{
		_.each ( this._cache, ( rec ) =>
		{
			clearTimeout ( rec.timeout );
		} );

		this._cache = {};

		/** Read only property that returns the number of cache hits */
		this.hits = 0;  
		/** Read only property that returns the number of cache misses */
		this.misses = 0;
		/** Read only property that returns the number of keys in the cache. */
		this.size = 0;
	}

	/**
	 * Returns a string rappresentation of key/values in memory.
	 * 
	 * @see parse
	 * 
	 * @returns {string} the strimgified version of key/values in memory.
	 */
	stringify ()
	{
		const res = [];

		_.each ( this._cache, ( rec, key ) => {
			const k = {
				key,
				value: rec.value
			};

			if ( rec.expire ) k.expire = rec.expire;

			res.push ( k );
		} );

		return JSON.stringify ( res, indent = indent );
	}

	/**
	 * Restore keys / values inside the *json* string into memory cache.
	 * If *skipExisting* is true, keys already present in the memory cache are preserved.
	 * 
	 * @param {string} json 
	 * @param {bool} skipExisting 
	 */
	parse ( json, skipExisting = false )
	{
		const items = JSON.parse ( json );
		const currTime = Date.now ();

		_.each ( items, ( item ) =>
		{
			if ( skipExisting && ( item.key in this._cache ) ) return;

			// Recalc expiration (if any)
			if ( item.expire )
			{
				let timeLeft = item.expire - currTime;
				if ( timeLeft < 0 ) return;

				// Keep only delta time for adding item
				timeLeft = timeLeft - currTime;

				this._add ( item.key, item.value, timeLeft );
			} else
				this._add ( item.key, item.value )
		} );
	}

	/**
	 * Retrieves all the keys currently in cache.
	 * 
	 * @returns {list} of strings
	 */
	keys ()
	{
		return _.keys ( this._cache );
	}

	// =========================================================================
	// INTERNAL USE ONLY FUNCTIONS
	// =========================================================================
	_del ( key )
	{
		const rec = this._cache [ key ];
		if ( ! rec ) return;

		clearTimeout ( rec.timeout );
		delete this._cache [ key ];
		this.size --;
	}

	_add ( key, value, expire, expireCallback )
	{
		const rec = {
			value: value
		};

		if ( expire )
		{
			rec.expire = expire + Date.now ();
			rec.timeout = setTimeout ( 
				() => {
					this._del ( key );
					expireCallback && expireCallback ( key, value );
				}, expire
			);
		}

		this._cache [ key ] = rec;
		this.size ++;

		return value;
	}
}

const smc = new SimpleMemCache ();

module.exports = smc;