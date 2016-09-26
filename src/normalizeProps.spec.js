import expect from 'expect';
import normalizeProps from './normalizeProps';

describe('normalize props', () => {
	it('should normalize array props', () => {
		expect(normalizeProps(['a', 'b'])).toEqual({a: null, b: null});
	});

	it('should normalize object props', () => {
		const props = {'a': {type: String}, 'b': null};
		expect(normalizeProps(props)).toEqual(props);
	});
});