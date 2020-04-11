const csstree = require('css-tree')

function selector(str) {
	return {
		value: str,
		specificity: {
			a: 0,
			b: 0,
			c: 0,
			d: 0
		},
		isBrowserHack: false,
		isId: false,
		isAttribute: false,
		isUniversal: false,
		isJavaScript: false,
		isAccessibility: false,
		complexity: 0
	}
}

function property(str) {
	return {
		name: str,
		isBrowserHack: false,
		isVendorPrefixed: false,
		isCustom: str.startsWith('--'),
		complexity: 0
	}
}

function declaration(decl) {
	return {
		isImportant: Boolean(decl.important),
		property: property(decl.property),
		value: decl.value.value,
		complexity: 0
	}
}

function atrule(atr, { key, declarations }) {
	return {
		name: atr.name,
		key: key || (atr.prelude && atr.prelude.value), // @unique
		arguments: (atr.prelude && atr.prelude.value) || undefined,
		isVendorPrefixed: false,
		isBrowserHack: false,
		declarations
	}
}

module.exports = (css, options = {}) => {
	let rules = []
	let atrules = []

	return new Promise((resolve, reject) => {
		const ast = csstree.parse(css, {
			parseValue: false,
			parseRulePrelude: false,
			parseAtrulePrelude: false,
			onParseError: function(error) {
				reject(error)
			}
		})

		csstree.walk(ast, {
			visit: 'Rule',
			enter(node, item, list) {
				// SELECTORS
				const _selectors = node.prelude.value
					.split(',')
					.filter(Boolean)
					.map(s => s.trim())
					.map(selector)

				// DECLARATIONS
				let _declarations = []
				node.block.children.map(child => {
					_declarations = [..._declarations, declaration(child)]
				})

				// THE RULE ITSELF
				rules = [
					...rules,
					{
						selectors: _selectors,
						declarations: _declarations
					}
				]
			}
		})

		csstree.walk(ast, {
			visit: 'Atrule',
			enter(node) {
				let _key
				let _declarations = []

				node.block.children
					.filter(c => c.type === 'Declaration')
					.map(child => {
						const dec = declaration(child)
						_declarations = [..._declarations, dec]

						if (dec.property.name === 'src') {
							_key = dec.value
						}
					})

				atrules = atrules.concat(
					atrule(node, { key: _key, declarations: _declarations })
				)
			}
		})

		resolve({
			atrules,
			rules,
			selectors: rules.map(rule => rule.selectors).flat(),
			declarations: rules.map(rule => rule.declarations).flat()
		})
	})
}
