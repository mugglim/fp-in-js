// well-formed iterator를 만드는 것은 너무 귀찮다..
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

// 위와 동일한 코드이다!! 와우! 🚀
function* gen() {
	yield 1;
	yield 2;
	yield 3;
}

const iterator1 = obj[Symbol.iterator]();
const iterator2 = gen();

console.log(...iterator1);
console.log(...iterator2);
