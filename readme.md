# css-analyzer

[![NPM Version](https://img.shields.io/npm/v/@projectwallace/css-analyzer.svg)](https://www.npmjs.com/package/@projectwallace/css-analyzer)
![Node.js CI](https://github.com/projectwallace/css-analyzer/workflows/Node.js%20CI/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/projectwallace/css-analyzer/badge.svg)](https://snyk.io/test/github/projectwallace/css-analyzer)
[![Coverage Status](https://coveralls.io/repos/github/projectwallace/css-analyzer/badge.svg?branch=master)](https://coveralls.io/github/projectwallace/css-analyzer?branch=master)
![Dependencies Status](https://img.shields.io/david/projectwallace/css-analyzer.svg)
![Dependencies Status](https://img.shields.io/david/dev/projectwallace/css-analyzer.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Project: Wallace](https://img.shields.io/badge/Project-Wallace-29c87d.svg)](https://www.projectwallace.com/oss)

> Analyze your CSS

A module that goes through your CSS to find all kinds of relevant statistics,
like the amount of rules, the amount of `!important`s, unique colors, and so on.

## Install

```sh
npm install @projectwallace/css-analyzer
```

or

```sh
yarn add @projectwallace/css-analyzer
```

## Usage

````js
const analyze = require('@projectwallace/css-analyzer');

analyze(`
	p {
		color: blue;
		font-size: 100%;
	}

	.component[data-state="loading"] {
		background-color: whitesmoke;
	}
`)
  .then(result => console.log(result))
  .catch(error => console.error(error))
}
```

```json
{ "TODO": true }
````

## Related projects

- [Wallace CLI](https://github.com/bartveneman/wallace-cli) - CLI tool for
  @projectwallace/css-analyzer
- [Constyble](https://github.com/bartveneman/constyble) - CSS Complexity linter
- [Color Sorter](https://github.com/bartveneman/color-sorter) - Sort CSS colors
  by hue, saturation, lightness and opacity
