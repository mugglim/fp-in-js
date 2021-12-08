const log = console.log;

// local Symbol
const s1 = Symbol();
const s2 = Symbol();
const s3 = Symbol('hello');
const s4 = Symbol('hello');

const symbolKey = Symbol('이름');

log(s1 === s2); // false
log(s3 === s4); // false

// use Symbol for key of object

const obj = {
	[symbolKey]: 'mugglim',
	lang: ['js'],
};

log(Object.keys(obj)); // [ 'lang' ]
log(Object.values(obj)); // [ [ 'js' ] ]
log(Object.entries(obj)); // [ [ 'lang', [ 'js' ] ] ]

// global Symbol

const globalS1 = Symbol.for();
const globalS2 = Symbol.for();

log(s1 === globalS1); // false
log(globalS1 === globalS2); // true

// Symbol.iterator

const obj2 = {
	[Symbol.iterator]: function* () {
		yield* [1, 2, 3];
	},
};

const iter = obj2[Symbol.iterator]();
log(iter.next().value); // 1
log(iter.next().value); // 2
log(iter.next().value); // 3
log(iter.next().value); // undefined
