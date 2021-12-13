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
