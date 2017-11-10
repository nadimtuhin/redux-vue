'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _normalizeProps = require('./normalizeProps');

var _normalizeProps2 = _interopRequireDefault(_normalizeProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('normalize props', function () {
	it('should normalize array props', function () {
		(0, _expect2.default)((0, _normalizeProps2.default)(['a', 'b'])).toEqual({ a: null, b: null });
	});

	it('should normalize object props', function () {
		var props = { 'a': { type: String }, 'b': null };
		(0, _expect2.default)((0, _normalizeProps2.default)(props)).toEqual(props);
	});
});