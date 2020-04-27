import { SimpleMemCache } from '.';
import { expect } from 'chai';

const smc = new SimpleMemCache();

it( 'lowercase keyManip', () => {
	smc.keyManip = ( k ) => k.toLowerCase();
	smc.clear();
	smc.add( "hello", "world" );

	const res = smc.stringify();
	expect( res ).equal( '[{"key":"hello","value":"world"}]' );
} );

it( 'uppercase keyManip', () => {
	smc.keyManip = ( k ) => k.toUpperCase();
	smc.clear();
	smc.add( "hello", "world" );

	const res = smc.stringify();

	expect( res ).equal( '[{"key":"HELLO","value":"world"}]' );
} );

it( 'get value', () => {
	smc.keyManip = ( k ) => k.toLowerCase();
	smc.clear();
	smc.add( "hello", "world" );
	const res = smc.get( "hello" );

	expect( res ).equal( "world" );

	// world is undefined key
	expect( smc.get( "world" ) ).is.undefined;

	// find key in UPPERCASE (where store is lowercase)
	expect( smc.get( 'HELLO' ) ).equal( 'world' );
} );

it( 'overwrite value', () => {
	smc.keyManip = ( k ) => k.toLowerCase();
	smc.clear();
	smc.add( "hello", "world" );
	smc.add( "hello", "big world" );

	expect( smc.get( "hello" ) ).equal( "big world" );
} );

it( 'default value', () => {
	smc.keyManip = ( k ) => k.toLowerCase();
	smc.clear();

	expect( smc.get( "hello", "default world" ) ).equal( "default world" );
} );

it( 'stringify / parse', () => {
	smc.keyManip = ( k ) => k.toLowerCase();
	smc.clear();
	smc.add( "hello", "world" );

	const s = smc.stringify();
	smc.clear();
	smc.parse( s );

	expect( smc.stringify() ).equal( '[{"key":"hello","value":"world"}]' );
} );

it( 'timeout', () => {
	smc.clear();
	smc.add( "hello", "world", 200 );

	// FIXME: setTimeout() not working
	setTimeout( () => {
		expect( smc.stringify() ).equal( '[]' );
	}, 300 );
} );

it( 'timeout / callback', () => {
	let v = 'empty';
	smc.clear();
	smc.add( "hello", "world", 200, () => { v = "full"; } );

	// FIXME: setTimeout() not working
	setTimeout( () => {
		expect( v ).equal( "full" );
	}, 300 );
} );

it( 'counters', () => {
	smc.clear();
	expect( smc.size ).equal( 0 );

	smc.add( "hello", "world" );
	expect( smc.size ).equal( 1 );

	smc.get( "hello" );
	expect( smc.hits ).equal( 1 );

	smc.get( "hello2" );
	expect( smc.misses ).equal( 1 );
} );