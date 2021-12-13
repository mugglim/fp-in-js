# 함수형 프로그래밍 원칙

-   `외부 세계`에 영향을 미치는 구문은 사용하지 않기를 권장
-   `인자`와 `반환값` 으로 소통하기를 권장

    ```jsx
    // 👍 Good
    const x => x+1;

    // ⛔ BAD
    const changeUserName= user => {
    	user .name = "11";
    	console.log(user );
    }
    ```

# map

> **map(f, iterable)**

-   **이터러블 객체를 특정 형태로 반환**
-   `Array`를 상속 받은 객체가 아니면 `.map(f)` 을 사용하지 못한다. (Prototype에 선언되어 있지 않음 ⇒ 개발자도구에서 `__proto__` 를 확인해보자.)
-   그런데, `이터러블 프로토콜`을 따르는 경우, 이터레이터가 존재하여 순회가 가능하다! 제너레이터를 통해 map 사용 가능

```jsx
const products = [
	{ name: '반팔티', price: 1000 },
	{ name: '긴팔티', price: 2000 },
	{ name: '후드티', price: 3000 },
	{ name: '바지', price: 4000 },
];

const map = (f, iter) => {
	let res = [];
	for (const a of iter) res.push(f(a));
	return res;
};

console.log(map(p => p.name, products));
```

# filter

> **filter(f, iter)**

-   **이터러블 객체에서 특정 값을 포함하지 않고 반환**

```jsx
const filter = (f, iter) => {
	let res = [];

	for (const a of iter) {
		if (f(a)) res.push(a);
	}

	return res;
};

const products = [
	{ name: '반팔티', price: 1000 },
	{ name: '긴팔티', price: 2000 },
	{ name: '후드티', price: 3000 },
	{ name: '바지', price: 4000 },
];

console.log(filter(p => p.price >= 2000, products));
```

-   제너레이트를 통해 즉시실행함수로 이터러블을 만들어 사용 가능!

```jsx
console.log(
	filter(
		n => n % 2,
		(function* () {
			yield* [1, 2, 3, 4, 5];
		})(),
	),
);
```

# reduce

> **reduce(f, [,initValue], iter)**

-   **이터러블 객체에서 누적된 하나의 값으로 평가**

```jsx
const reduce = (f, acc, iter) => {
	if (!iter) {
		iter = acc[Symbol.iterator]();
		acc = iter.next().value;
	}

	for (const a of iter) {
		acc = f(acc, a);
	}

	return acc;
};

const nums = [1, 2, 3, 4, 5];
const products = [
	{ name: '반팔티', price: 1000 },
	{ name: '긴팔티', price: 2000 },
	{ name: '후드티', price: 3000 },
	{ name: '바지', price: 4000 },
];

console.log(reduce((a, b) => a + b, nums));
console.log(reduce((a, b) => a + b, 125, nums));
console.log(reduce((acc, product) => acc + product.price, 0, products));
```

# map, filter, reduce을 통한 함수형 사고

```jsx
const products = [
	{ name: '반팔티', price: 1000 },
	{ name: '긴팔티', price: 2000 },
	{ name: '후드티', price: 3000 },
	{ name: '바지', price: 4000 },
];

// price가 2000 이상인 모든 제품의 price

const add = (a, b) => a + b;
const priceMap = product => product.price;
const filter2000 = price => price >= 2000;

console.log(reduce(add, 0, map(priceMap, filter(filter2000, products))));
```

# go

> **go(args)**

-   reduce와 유사하게, 여러 개의 인자를 **하나의 값으로 평가하여 반환**한다.
-   실행 순서는 위에서 아래로 읽으면 된다! (가독성 ⬆)
-   첫 번째 인자는, 초기값으로 설정

```jsx
const go = (...args) => args.reduce((acc, f) => f(acc));

const result = go(
	0,
	a => a + 1,
	a => a + 10,
	a => a + 100,
);

console.log(result);
```

# pipe

> **pipe(args)**

-   **함수의 인자를 받기 까지 평가하지 않음 !!!!!!!!!!**
-   여러 개의 인자를 평가 후 **함수의 형태**로 반환

```jsx
// go 함수는 값을 반환
const go = (...args) => args.reduce((a, f) => f(a));

// pipe 함수는 함수를 반환
// 인자가 2개 이상인 경우를 위해, as를 rest로 처리
const pipe =
	(f, ...fs) =>
	(...as) =>
		go(f(...as), ...fs);

const _p = pipe(
	(a, b) => a + b,
	a => a + 10,
	a => a + 100,
);

const res = _p(1, 100);
```

# 이전의 로직을 go를 통해 개선해보자

```jsx
const products = [
	{ name: '반팔티', price: 1000 },
	{ name: '긴팔티', price: 2000 },
	{ name: '후드티', price: 3000 },
	{ name: '바지', price: 4000 },
];

// 👎 Before
const add = (a, b) => a + b;
const priceMap = product => product.price;
const filter2000 = price => price >= 2000;

const res = reduce(add, 0, map(priceMap, filter(filter2000, products))));

// 👍 After
go(
	products,
	products => map(priceMap, products),
	products => filter(filter2000, products),
	prices => reduce(add, prices),
);
```

# Curry

-   **모든 인자의 개수가 만족될 때 함수가 실행**, **단 함수를 반환**한다.

```jsx
// 1) 첫 번째 인자로 함수를 받음
// 2) 두 번째 인자로 값을 받음.
// 3-1) 인자의 개수가 2개면 바로 곱셈
// 3-2) 인자의 개수가 1개 라면, 1번 더 기다림.

const curry =
			f
			=> (a, ..._)
			=> _.length ? f(a, ..._) : (..._) => f(a, ..._);

const mul = curry((a, b) => a * b);
const mul3 = mul(3);

console.log(mul(10, 20));
console.log(mul3(10));
```

### Curry를 통한 인자 명시 제거

-   `map, filter, reduce` 을 curry로 감싸 명시된 인자를 제거해보자.

```jsx
// 👎 Before
go(
	products,
	products => map(priceMap, products),
	products => filter(filter2000, products),
	prices => reduce(add, prices),
);

// 👍 After
go(products, map(priceMap), filter(filter2000), reduce(add));
```

# pipe를 통해 중복된 함수를 줄여보자.

```jsx
// 👎 before
go(
	products,
	filter(p => p.price < 2000),
	map(p => p.price),
	reduce(add)
	log
);

go(
	products,
	filter(p => p.price > 2000),
	map(p => p.price),
	reduce(add)
);

// 👍 after

const totalPrice = pipe(
	map(p => p.price),
	reduce(add)
)

go(
	products,
	filter(p => p.price < 2000),
	totalPrice,
);

go(
	products,
	filter(p => p.price > 2000),
	totalPrice,
);
```

### 좀 더 줄여보자

```jsx
const best_totalprice = predi => pipe(filter(predi), total_price);

// 👎 before
go(
	products,
	filter(p => p.price < 2000),
	totalPrice,
);

// 👍 after
go(
	products,
	best_totalprice(p => p.price < 2000),
);
```
