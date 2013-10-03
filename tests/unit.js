var assert = require('chai').assert,
		OSPoint = require('../index.js');

describe("OSPoint", function () {
	it ("should return correct eastings and northings", function () {
		osdata = {
			northings: 12345678,
			eastings: 12345678
		}
		point = new OSPoint(osdata);
		assert.equal(point.northings, osdata.northings);
		assert.equal(point.eastings, osdata.eastings);
	});
});