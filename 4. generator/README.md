# 제터레이터

-   이터러블이자 이면서 이터레이터인 `well-formed iterator`를 생성하는 함수 (너무 좋음..)
-   function 키워드 뒤에 `*(asterisk)` 기호를 명시

```jsx
// (1) 직접 well-formed iterator를 생성
const obj = {
	[Symbol.iterator]() {
		let i = 1;
		return {
			next() {
				return i <= 3
					? { done: false, value: i++ }
					: { done: true, value: undefined };
			},
			[Symbol.iterator]() {
				return this;
			},
		};
	},
};

// (2) 제너레이터를 사용한 방법 (so cool...
function* gen() {
	yield 1;
	yield 2;
	yield 3;
}

const iterator1 = obj[Symbol.iterator]();
const iterator2 = gen();

console.log(...iterator1);
console.log(...iterator2);
```

# 제너레이터 합성

-   `yield*` 키워드를 통해 제너레이터를 합성할 수 있다.

```jsx
function* range(from, to) {
	for (let i = from; i <= to; i++) yield i;
}

function* generateAlphaNum() {
	// 0-9
	yield* range(48, 57);

	// a-z
	yield* range(97, 122);

	// A-Z
	yield* range(65, 90);
}

for (const n of generateAlphaNum()) {
	console.log(String.fromCharCode(n));
}
```

### 참고) for..of, 전개 연산자, 구조 분해, 나머지 연산자

-   `이터러블/이터레이터 프로토콜`을 활용할 수 있음

```jsx
const list = [1, 2, 3, 4, 5];

const [head, ...tail] = list;
const [a, b, ...rest] = list;

console.log(head, tail); // 1 [ 2, 3, 4, 5 ]
console.log(a, b, rest); // 1 2 [ 3, 4, 5 ]
```
