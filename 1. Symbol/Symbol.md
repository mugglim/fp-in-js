# Symbol

## 1. Symbol?

-   Data Type이다.
-   Immutable 한데, 다른 값과 중복되지 않는다. (유일성 보장)

## 2. How to use?

> Symbol([description]) - MDN

-   `description`은 optional이며, 문자열을 사용한다.

```js
const log = console.log;

const s1 = Symbol();
const s2 = Symbol();

const s3 = Symbol('hello');
const s4 = Symbol('hello');

log(s1 === s2); // false
log(s3 === s4); // false
```

## 3. To know

### 1. 열거되지 않는다.

```js
const symbolKey = Symbol('이름');

const obj = {
	[symbolKey]: 'mugglim',
	lang: ['js'],
};

console.log(Object.keys(obj)); // [ 'lang' ]
console.log(Object.values(obj)); // [ [ 'js' ] ]
console.log(Object.entries(obj)); // [ [ 'lang', [ 'js' ] ] ]
```

### 2.전역 Symbol을 생성할 수 있다.

-   `Symbol.for()`을 통해 전역으로 Symbol을 관리할 수 있다.

```js
const s1 = Symbol.for();
const s2 = Symbol.for();

console.log(s1 === s2); // true
```

### 3. `Symbol.iterator` 🚀(중요)

-   `Symbol.iterator` 은 객체에 대응하는 `기본 이터레이터`를 지정한다.

```js
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
```
