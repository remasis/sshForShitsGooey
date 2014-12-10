/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('home section', function() {
	beforeEach(module('sshfs.home'));

	it('should have a dummy test', inject(function() {
		console.log("this is my test HAHAHA");
		expect(true).toBeTruthy();
	}));

	it('should pass a second test', function() {
		expect(false).not.toBeTruthy();
	});
});