# simple-mem-cache

A simple in-memory cache for node.js.
By Fabio Rotondo.

## Installation

    yarn add simple-mem-cache

or

    npm install simple-mem-cache --save


## Usage

```javascript
var smc = require ( 'simple-mem-cache' );

// now just use the cache
smc.add ( 'hello', 'world' );

// add an item that expires after 6 seconds
smc.add ( 'expiring', 'in 6 seconds', 6000 );

// add an item that when expires calls a cback
smc.add ( 'boom', 'exploding', 3000, ( key, val ) => {
    console.log ( 'KA-BOOOM for k: %s - v: %s', key, val );
} );

// Get values
console.log ( 'Hello: ', smc.get ( 'hello' ) );
console.log ( 'expiring: ', smc.get ( 'expiring' ) );
console.log ( 'boom: ', smc.get ( 'boom' ) );
```

which should print

    Hello:  world
    expiring:  in 6 seconds
    boom:  exploding

and after 6 seconds, also:

    KA-BOOOM for k: boom - v: exploding


You can obtain the full items collection with:

    // Get current items as JSON string
    const s = smc.stringify ();

And also add elements to the cache by parsing a previously JSON dump:

    // Adding elements from a previously JSON dump
    smc.parse ( s );

With the *skipExisting* flag, you will not override elements in the memory cache:

    // Adding elements from a previously JSON dump skipping keys already present
    smc.parse ( s, true );

----
## API

### add ( key, value, expire, expireCallback )

Stores a value in the cache. You can automatically remove the given value from the cache providing the *expire* attribute (a numeric value indicating the duration time of the value expressed in milliseconds).
Also, optionally, if the value is going to expire, you can specify an expireation callback to be called at that time.

#### Parameters:

* **key**:   the cache key name for retrieving value
* **value**: the cache value. Can be any JavaScript type.
* **expire**: the value duration time in memory (in milliseconds). If omitted, the key will last forever.
* **expireCallback**: the callback to be called when the item expires from cache. It will be called with the following signature:

    expireCallback ( key, value )


#### Returns

This method returns the value just cached.

-----

### get ( key, defaultValue )

Retrieves the value for the specified *key*. If the key is not found in the cache, *defaultValue* is returned.

#### Parameters:

* **key**:   the cache key name
* **defaultValue**: (*optional*) the value to be returned if *key* is missed.

#### Returns

This method returns the value in cache or *defaultValue*.

---
### del ( key )

Deletes the provided *key* from the cache.

#### Parameters:

* **key**:   the cache key name

#### Returns

This method returns nothing.

---
### clear ()

Completely swipe cache data from memory.

#### Returns

This method returns nothing.

---

### stringify ()
Returns a string rappresentation of key/values in memory.

#### Returns

Returns a JSON string rappresenting the current key/values in memory.

---

### parse ( json, skipExisting )

Restore keys / values inside the *json* string into memory cache. If *skipExisting* is true, keys already present in the memory cache are preserved.

#### Parameters

* **json**: The JSON string to be parsed.
* **skipExisting**: (*optional*) If set to *true* keys already present in the memory cache are preserved.

---

### keys ()

Returns all the keys currently in cache.

---

### size 

This is a class read only property that returns the numeber of keys in the cache.

### hits 

This is a class read only property that returns the number of cache hits.

### misses

This is a class read only property that returns the number of cache misses.

---

## Changelog

0.1.3: Added jest tests
