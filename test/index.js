const test = require('ava')
const analyze = require('../')

test('rejects on error', async t => {
	await t.throwsAsync(
		analyze(`
		a { color red }
	`)
	)
})

test('multiple selectors', async t => {
	const actual = await analyze(`
		.h1,
		h2 {
			color: blue;
		}
	`)

	t.deepEqual(
		actual.selectors.map(s => s.value),
		['.h1', 'h2']
	)
})

test('selector list with comments', async t => {
	const actual = await analyze(`
		#a,
		/* COMMENT */
		b {
			color: red;
		}
	`)
	t.deepEqual(
		actual.selectors.map(s => s.value),
		[
			'#a',
			`/* COMMENT */
		b`
		]
	)
})

test('selector with trailing comma', async t => {
	const actual = await analyze(`
		h1, {
			color: blue;
		}
	`)
	t.deepEqual(
		actual.selectors.map(s => s.value),
		['h1']
	)
})

test('declaration - importants', async t => {
	const actual = (
		await analyze(`
		a {
			color: red;
			color: red !important;
			color:red!important;
			color: red!important;
			color: red    !important;
			content: '!important';
		}

		b{color:red!important}
	`)
	).declarations.map(d => d.isImportant)

	const expected = [false, true, true, true, true, false, true]
	t.deepEqual(actual, expected)
})

test('properties', async t => {
	const actual = (
		await analyze(`
		a {
			color: red;
			-webkit-box-shadow: 0 0 0 #000;
			_background: green;
			*zoom: 1;
		}
	`)
	).declarations.map(({ property }) => property.name)

	t.deepEqual(actual, ['color', '-webkit-box-shadow', '_background', '*zoom'])
})

test('custom properties', async t => {
	const actual = await analyze(`
		a {
			--root: 1em;
			font-size: var(--root);
		}
	`)

	t.true(actual.declarations[0].property.isCustom)
	t.false(actual.declarations[1].property.isCustom)
})

test('rules - empty', async t => {
	const actual = await analyze(`
		a{}
		b { color: red }
	`)

	t.deepEqual(
		actual.rules.map(rule => rule.declarations.length),
		[0, 1]
	)
})

test('@media', async t => {
	const actual = await analyze(`
		@media (min-width: 320px) {
			a { content: 'a' }
		}

		@media (min-width: 480px and max-width: 640px) {
			b { content: 'b' }
		}

		@media (screen) {
			@media (print) {
				c { content: 'c' }
			}
		}

		@supports (display: grid) {
			@media (min-width: 768px) {
				d { content: 'd' }
			}
		}
	`)

	t.true(actual.atrules.every(atrule => atrule.declarations.length === 0))
})

test('@keyframes', async t => {
	const actual = await analyze(`
		@keyframes test {
			from {
				top: 0;
			}
			to {
				top: 100%;
			}
		}

		@-webkit-keyframes testWebkit {}

		@media (min-width: 320px) {
			@keyframes jump {}
		}
	`)

	t.true(actual.atrules.every(atrule => atrule.declarations.length === 0))
})

test('@font-face', async t => {
	const actual = await analyze(`
		@font-face {
			src: url(URL);
			font-family: 'Teko';
		}
	`)

	t.is(actual.atrules[0].declarations.length, 2)
})
