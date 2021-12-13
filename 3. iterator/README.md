# for...of

-   `Set, Map`은 `Array`와 달리 index로 접근이 불가한데 `어떻게 순회`를 할까?
-   어떻게 `for...of` 문은 추상화 되어 있을까?

```jsx
const arr = [1, 2, 3];
const set = new Set(arr);
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3],
]);

for (const a of arr) console.log(a); // 1,2,3
for (const a of set) console.log(a); // 1,2,3
for (const a of map) console.log(a); // [['a', 1], ['b', 2], ['c', 3],]
```

# Symbol.iterator

-   객체의 기본 인터레이터를 위한 key 값
-   `for...of` / `Spread Operator(...)`를 지원함.

```jsx
const arr = [1, 2, 3];
console.log(arr[Symbol.iterator]); // [Function: values]
for (const a of a) console.log(a);
```

# 이터러블/이터레이터 프로토콜

-   (1) 이터레이터 : `{value, done}` 객체를 리턴하는 `next()` 함수를 가진 객체

    ```jsx
    const arr = [1, 2, 3];

    const iterator = arr[Symbol.iterator](); // Object [Array Iterator] {}

    console.log(iterator.next()); // { value: 1, done: false }
    console.log(iterator.next()); // { value: 2, done: false }
    console.log(iterator.next()); // { value: 3, done: false }
    ```

-   (2) 이터러블 객체: 이터레이터를 리턴하는 [Symbol.iterator] 을 가진 객체

    ```jsx
    const arr = [1, 2, 3];
    console.log(arr[Symbol.iterator]()); // Object [Array Iterator] {}

    const iterable = {
    	[Symbol.iterator]() {
    		// ..
    	},
    };
    ```

-   (3) 이터러블/이터레이터 프로토콜 : 이터러블을 `for...of`, `전개 연산자` 등을 동작할 수 있도록 하는 규약

    ```jsx
    const a = [1, 2, 3, 4, 5];
    // 👍
    for (const a of arr) console.log(a);
    console.log(...a);

    // ⛔ Error
    a[Symbol.iterator] = null;
    for (const a of arr) console.log(a);
    console.log(...a);
    ```

    ```jsx
    // not error
    const a = [1, 2];
    console.log([...a, 3, 4, 5]);

    // error : a is not iterable
    const a = [1, 2];
    ```

# 이터레이터를 반환하는 함수

-   `map.keys()`, `map.values()`, `map.entries()` 은 목적에 맞는 이터레이터를 반환해준다.

```jsx
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3],
]);

const mapIter = map[Symbol.iterator]();
const keyIter = map.keys();
const valIter = map.values();
const itemIter = map.entries();

console.log(keyIter); // [Map Iterator] { 'a', 'b', 'c' }
console.log(valIter); // [Map Iterator] { 1, 2, 3 }
console.log(itemIter); // [Map Entries] { [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] }
console.log(mapIter); // [Map Entries] { [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] }
```

-   한 가지 더 신기한 것은, 이터레이터 객체는 `Symbol.iterator` 을 가지고 있음
    -   즉, 자기 자신을 이터레이터로 반환한다.

```jsx
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3],
]);

const mapKeyIt = map[Symbol.iterator]();
const mapKeyIt2 = mapKeyIt[Symbol.iterator]();

// [Map Entries] { [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] }
// [Map Entries] { [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] }

console.log(mapKeyIt.next().value); // [ 'a', 1 ]
console.log(mapKeyIt2.next().value); // [ 'b', 2 ]
console.log(mapKeyIt.next().value); // [ 'c', 3 ]
```

# 사용자 정의 이터러블

-   `[Symbol.iterator]` key값을 가지는 `iterable`을 만들어보자..

```jsx
const iterable = {
	[Symbol.iterator]() {
		let i = 3;
		return {
			next() {
				return i == 0
					? { value: undefined, done: true }
					: { value: i--, done: false };
			},
		};
	},
};

const it = iterable[Symbol.iterator]();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());

for (const a of iterable) console.log(a);
```

-   `iterator`는 진행하다가 이후 시점부터 `for..of`를 할 수 있음.

# well formed iterator

-   정의
    -   이터레이터 객체를 이터러블 하게 만드는 것 👍👍
    -   이터레이터가 자기 자신을 반환하는 `Symbol.iterator` 메소드를 가지고 있을 때
-   목적
    -   현재까지 진행 된 상태를 기억해야, 무의미한 순회를 방지 및 오류 예방

```jsx
const iterable = {
	[Symbol.iterator]() {
		let i = 3;
		return {
			next() {
				return i == 0
					? { value: undefined, done: true }
					: { value: i--, done: false };
			},
			[Symbol.iterator]() {
				return this;
			},
		};
	},
};

const it = iterable[Symbol.iterator]();
console.log(it.next()); // 3
console.log(it.next()); // 2
for (const a of it) console.log(a); // 마지막 1만 진행 됨..
```

# 이터러블/이터레이터 프로토콜의 추세

-   순회가 가능한 대부분의 `Web API`도 이터러블/이터레이터 프로토콜을 따르고 있음
-   이터러블 여부를 확인하기 위해서 `[Symbol.iterator]`을 key값으로 가지고 있는지 확인해봐라.

```jsx
cosnt $elList = document.querySelectorAll('h1');

$elList.next();
// ...
```
