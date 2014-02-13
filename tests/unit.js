var	assert = require('chai').assert,
		OSPoint = require('../index.js');
		roughEquals = require("./helpers").equal,

describe("OSPoint", function () {
	it ("should return correct eastings and northings", function () {
		var	northings= 12345678,
				eastings= 12345678;
				point = new OSPoint(northings, eastings);
		assert.equal(point.northings, northings);
		assert.equal(point.eastings, eastings);
	});
});

describe("#toDecimalFromDMS", function () {
	it ("should correctly convert to decimal from DMS", function () {
		assert.equal(0, OSPoint.toDecimalFromDMS(0, 0, 0));
		assert.equal(30, OSPoint.toDecimalFromDMS(30, 0, 0));
		assert.equal(roughEquals(OSPoint.toDecimalFromDMS(15,0,3), 15.00083333333333), true);
	});
});

describe("#toRadians", function () {
	it("should convert degrees to radians", function () {
		assert.equal(roughEquals(OSPoint.toRadians(180), Math.PI), true);
		assert.equal(roughEquals(OSPoint.toRadians(0), 0), true);
		assert.equal(roughEquals(OSPoint.toRadians(90), Math.PI / 2), true);
	});
});

describe("#toDegrees", function () {
	it ("should convert radians to degrees", function () {
		assert.equal(roughEquals(OSPoint.toDegrees(Math.PI), 180), true);
		assert.equal(roughEquals(OSPoint.toDegrees(0), 0), true);
		assert.equal(roughEquals(OSPoint.toDegrees(Math.PI / 2), 90), true);
	})
})

describe("#nu", function () {
	it ("should return the correct value of nu", function () {
		// Airy 1830 Ellipsoid, National Grid example
		var a = 6377563.396, 
				F0 = 0.9996012717,
				e2 = OSPoint.e2(a, 6356256.909), 
				lat = OSPoint.toRadians(OSPoint.toDecimalFromDMS(52, 39, 27.2531)),
				expected = 6388502.3333,
				result = OSPoint.nu(a, F0, e2, lat);
		assert.equal(roughEquals(expected, result), true);
	});
});

describe("#rho", function () {
	it ("should return the correct value of rho", function () {
		// Airy 1830 Ellipsoid, National Grid example
		var a = 6377563.396,
				F0 = 0.9996012717,
				e2 = OSPoint.e2(a, 6356256.909), 
				lat = OSPoint.toRadians(OSPoint.toDecimalFromDMS(52, 39, 27.2531)),
				expected = 6372756.4399,
				result = OSPoint.rho(a, F0, e2, lat);
		assert.equal(roughEquals(expected, result), true);
	});
});

describe("#eta2", function () {
	it ("should return the correct value of eta squared", function () {
		// Airy 1830 Ellipsoid, National Grid example
		var a = 6377563.396,
				F0 = 0.9996012717,
				e2 = OSPoint.e2(a, 6356256.909), 
				lat = OSPoint.toRadians(OSPoint.toDecimalFromDMS(52, 39, 27.2531)),
				rho = OSPoint.rho(a, F0, e2, lat),
				nu = OSPoint.nu(a, F0, e2, lat),
				expected = 0.0024708136169,
				result = OSPoint.eta2(nu, rho);
		assert.equal(roughEquals(expected, result), true);
	});
});

describe("#M", function () {
	it ("should return the correct value of M", function () {
		// Airy 1830 Ellipsoid, National Grid example
		var a = 6377563.396,
				b = 6356256.909,
				F0 = 0.9996012717,
				lat = OSPoint.toRadians(OSPoint.toDecimalFromDMS(52, 39, 27.2531)),
				lat0 = OSPoint.toRadians(OSPoint.toDecimalFromDMS(49, 0, 0)),
				expected = 406688.29596,
				result = OSPoint.M(a, b, F0, lat, lat0);
		assert.equal(roughEquals(expected, result), true);
	});
});

describe("#mercatorToLatLon", function () {
	it ("should return the correct longitude and latitude", function () {
		// Airy 1830 Ellipsoid, National Grid example
		var NORTHINGS = 313177.270,
				EASTINGS = 651409.903,
				expected_lat = OSPoint.toDecimalFromDMS(52, 39, 27.2531),
				expected_lon = OSPoint.toDecimalFromDMS(1, 43, 4.5177),
				result = new OSPoint(NORTHINGS, EASTINGS).mercatorToLatLon();
		assert.equal(roughEquals(OSPoint.toDegrees(result.longitude), expected_lon), true);
		assert.equal(roughEquals(OSPoint.toDegrees(result.latitude), expected_lat), true);
	});
});

describe("#toCartesian", function () {
	it ("should correctly map lon, lat & height to 3D cartesian points", function () {
		var	lon = OSPoint.toRadians(OSPoint.toDecimalFromDMS(1, 43, 4.5177)),
				lat = OSPoint.toRadians(OSPoint.toDecimalFromDMS(52, 39, 27.2531)),
				height = 24.7,
				expected_x = 3874938.849,
				expected_y = 116218.624,
				expected_z = 5047168.208,
				result = OSPoint.toCartesian(lon, lat, height);
		assert.equal(roughEquals(expected_x, result.x), true);
		assert.equal(roughEquals(expected_y, result.y), true);
		assert.equal(roughEquals(expected_z, result.z), true);
	});
});

describe("#toLatLon", function () {
	it ("should correctly map 3d cartiesian points to lon, lat & height given ellipsoid", function () {
		var	expected_lon = OSPoint.toDecimalFromDMS(1, 43, 4.5177),
				expected_lat = OSPoint.toDecimalFromDMS(52, 39, 27.2531),
				expected_height = 24.7,
				x = 3874938.849,
				y = 116218.624,
				z = 5047168.208,
				result = OSPoint.toLatLon(x, y ,z);
		assert.equal(roughEquals(expected_lat, OSPoint.toDegrees(result.latitude)), true);
		assert.equal(roughEquals(expected_lon, OSPoint.toDegrees(result.longitude)), true);
		assert.equal(expected_height - result.height < 0.001, true); // To nearest mm=
	});
});
