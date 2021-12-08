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

// hof
const addX = x => y => x + y;

const add3 = addX(3);
console.log(add3(10)); // 13

const apply = f => f(1);
console.log(apply(add3)); // 4
