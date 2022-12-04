const background = require('./index.js');

test('Check background color of a test image', async () => {
	expect(await background('test/test.png')).toBe('#00224c');
	expect(await background('test/test.png', 0.4)).toBe('#fdfdfd');
});
