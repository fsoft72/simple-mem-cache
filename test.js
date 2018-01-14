const smc = require ( './index' );

smc.keyManip = ( k ) => k.toLowerCase ();

/*
smc.add ( "hello", "world" );
smc.add ( "temp", { "hello" : 1 }, 100 );
smc.add ( "longer", "still here", 1000 );
smc.add ( "boom", "123", 200, ( k, v ) =>
{
	console.log ( "KA-BOOOMMM for k: %s - v: %s", k, v );
} );

setTimeout ( () => {
	console.log ( "TEMP: ", smc.get ( "temp", "NOT FOUND" ) );
}, 50 );

const s = smc.stringify ();
console.log ( s );

setTimeout ( () => {
	smc.parse ( s );

	console.log ( "PARSE: ", smc.stringify () );
}, 200 );

setTimeout ( () => {
	smc.parse ( s );

	console.log ( "PARSE2: ", smc.stringify () );
}, 1000 );
*/


// now just use the cache
smc.add ( 'hello', 'world' );

// add an item that expires after 6 seconds
smc.add ( 'expiring', 'in 6 seconds', 6000 );

// add an item that expiring calls a cback
smc.add ( 'boom', 'exploding', 3000, ( key, val ) => {
    console.log ( 'KA-BOOOM for k: %s - v: %s', key, val );
} );

// Get values
console.log ( 'Hello: ', smc.get ( 'hello' ) );
console.log ( 'expiring: ', smc.get ( 'expiring' ) );
console.log ( 'boom: ', smc.get ( 'boom' ) );