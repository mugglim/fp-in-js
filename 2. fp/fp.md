함수형 프로그래밍에 대해 좀 더 공부하고 싶어, [KAIST CS320](https://hjaem.info/articles/main)의 내용을 참조하였습니다. 해당 글에서는 모든 내용이 `Scala` 언어 기반으로 작성되었기에, 이를 `JavaScript`로 변환하여 작성했습니다.

## 1. 함수형 프로그래밍이란?

-   수정 가능한 변수를 사용하지 않는다. (불변성)
-   `부수 효과(side effect)` 가 없는 `순수 함수` 만을 사용한다.

## 2. 불변성의 장점은?

### 1. 논증이 쉽다.

```js
var x = 1;
// ....
console.log('이 시점에서 x는 정말 1일까요?');
```

위 코드에서 변수 `x`가 가변 데이터 타입이라고 생각하면, x가 1인지 확인하기 위해 중간에 위치한 코드를 뒤져야만 한다.

### 2. 함수 호출 시 인자를 복사할 필요가 없다.

```js
const f = _ => _.map(x => x + 2);

var a = [1, 2, 3, 4];
var clonedA = [...a];

// ...
console.log(f(clonedA));
```

함수 `f`가 불리는 시점에서 `a`는 `[1,2,3,4]` 여야만 한다고 가정해보자. 데이터가 수정 가능하다면, `a`의 값을 clone 해 두어야 한다.

### 3. 여러 스레드에서 안전하게 접근이 가능하다.

```js
// read and write
var name = 'Hello';

// only read
const noWriteName = 'Hello';

const g = x => '';
const k = x => '';
```

2번과 유사하게, 데이터가 수정 가능하다고 생각해보자. 둘 다 `name`으로 `Hello`를 받는다고 가정했을 때, `g` 함수를 처리하는 과정에서 `name`이 `World`로 변경되면 `k` 함수에서 오류가 발생할 것이다. 반면, 데이터를 읽기만 가능하면 이러한 문제를 예방할 수 있다.

### 3. 일급 함수란 무엇인가?

-   함수 호출의 인자로 사용될 수 있다.
-   함수의 결과값으로 사용될 수 있다.
-   변수로 함수를 할당할 수 있다.

```js
// 1. 인자로 함수를 받을 수 있다.
// 2. 함수를 결과값으로 사용할 수 있다.
const f = () => x => x;
const g = h => h;

// 3. 변수로 함수를 할당할 수 있다.
const h = f();
console.log(h); // func

const h0 = h(0);
const g0 = g(h0);
console.log(g0); // value
```

### 4. 고차 함수란?

-   함수를 반환하는 함수
-   함수를 인자로 받아 실행하는 함수

```js
// 함수를 반환
const addX = x => y => x + y;

const add3 = addX(3);
console.log(add3(10)); // 13

// 함수를 인자로 받아서 실행
const apply = f => f(1);
console.log(apply(add3)); // 4
```
