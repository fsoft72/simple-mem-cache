const smc = require ( './index' );

test ( 'lowercase keyManip', () => {
	smc.keyManip = ( k ) => k.toLowerCase ();
	smc.clear ();
	smc.add ( "hello", "world" );

	const res = smc.stringify ();
	expect ( res ).toBe ( '[{"key":"hello","value":"world"}]' );
} );

test ( 'uppercase keyManip', () => {
	smc.keyManip = ( k ) => k.toUpperCase ();
	smc.clear ();
	smc.add ( "hello", "world" );

	const res = smc.stringify ();

	expect ( res ).toBe ( '[{"key":"HELLO","value":"world"}]' );
} );

test ( 'get value', () => {
	smc.keyManip = ( k ) => k.toLowerCase ();
	smc.clear ();
	smc.add ( "hello", "world" );
	const res = smc.get ( "hello" );

	expect ( res ).toBe ( "world" );

	// world is undefined key
	expect ( smc.get ( "world" ) ).toBeUndefined ();

	// find key in UPPERCASE (where store is lowercase)
	expect ( smc.get ( 'HELLO' ) ).toBe ( 'world' );
} );

test ( 'overwrite value', () => {
	smc.keyManip = ( k ) => k.toLowerCase ();
	smc.clear ();
	smc.add ( "hello", "world" );
	smc.add ( "hello", "big world" );

	expect ( smc.get ( "hello" ) ).toBe ( "big world" );
} );

test ( 'default value', () => {
	smc.keyManip = ( k ) => k.toLowerCase ();
	smc.clear ();

	expect ( smc.get ( "hello", "default world" ) ).toBe ( "default world" );
} );

test ( 'stringify / parse', () => {
	smc.keyManip = ( k ) => k.toLowerCase ();
	smc.clear ();
	smc.add ( "hello", "world" );

	const s = smc.stringify ();
	smc.clear ();
	smc.parse ( s );

	expect ( smc.stringify () ).toBe ( '[{"key":"hello","value":"world"}]' );
} );

test ( 'timeout', () => {
	smc.clear ();
	smc.add ( "hello", "world", 200 );

	// FIXME: setTimeout() not working
	setTimeout ( () => {
		expect ( smc.stringify () ).toBe ( '[]' );
	}, 300 );
} );

test ( 'timeout / callback', () => {
	let v = 'empty';
	smc.clear ();
	smc.add ( "hello", "world", 200, () => { v = "full" } );

	// FIXME: setTimeout() not working
	setTimeout ( () => {
		expect ( v ).toBe ( "full" );
	}, 300 );
} );

test ( 'counters', () => {
	smc.clear ();
	expect ( smc.size ).toBe ( 0 );

	smc.add ( "hello", "world" );
	expect ( smc.size ).toBe ( 1 );

	smc.get ( "hello" );
	expect ( smc.hits ).toBe ( 1 );

	smc.get ( "hello2" );
	expect ( smc.misses ).toBe ( 1 );
} );