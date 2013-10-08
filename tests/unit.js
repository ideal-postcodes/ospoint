var assert = require('chai').assert,
		OSPoint = require('../index.js');

var TOLERANCE = 0.000001,
		roughEquals = function (a, b) {
			if (a == 0 && b == 0) {
				return true;
			} else if (b == 0) {
				return (Math.abs(a) < TOLERANCE);
			} else if (a == 0) {
				return (Math.abs(b) < TOLERANCE);
			}
			return (Math.abs(a/b - 1) < TOLERANCE);
		}

describe("OSPoint", function () {
	it ("should return correct eastings and northings", function () {
		var	northings= 12345678,
				eastings= 12345678;
				point = new OSPoint(northings, eastings);
		assert.equal(point.northings, northings);
		assert.equal(point.eastings, eastings);
	});
});

describe("#toDecFromDMS", function () {
	it ("should correctly convert to decimal from DMS", function () {
		assert.equal(0, OSPoint.toDecFromDMS(0, 0, 0));
		assert.equal(30, OSPoint.toDecFromDMS(30, 0, 0));
		assert.equal(roughEquals(OSPoint.toDecFromDMS(15,0,3), 15.00083333333333), true);
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
				lat = OSPoint.toRadians(OSPoint.toDecFromDMS(52, 39, 27.2531)),
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
				lat = OSPoint.toRadians(OSPoint.toDecFromDMS(52, 39, 27.2531)),
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
				lat = OSPoint.toRadians(OSPoint.toDecFromDMS(52, 39, 27.2531)),
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
				lat = OSPoint.toRadians(OSPoint.toDecFromDMS(52, 39, 27.2531)),
				lat0 = OSPoint.toRadians(OSPoint.toDecFromDMS(49, 0, 0)),
				expected = 406688.29596,
				result = OSPoint.M(a, b, F0, lat, lat0);
		assert.equal(roughEquals(expected, result), true);
	});
});

describe("#toLongLat", function () {
	it ("should return the correct longitude and latitude", function () {
		// Airy 1830 Ellipsoid, National Grid example
		var NORTHINGS = 313177.270,
				EASTINGS = 651409.903,
				expected_lat = OSPoint.toDecFromDMS(52, 39, 27.2531),
				expected_lon = OSPoint.toDecFromDMS(1, 43, 4.5177),
				result = new OSPoint(NORTHINGS, EASTINGS).toLongLat();
		assert.equal(roughEquals(result.longitude, expected_lon), true);
		assert.equal(roughEquals(result.latitude, expected_lat), true);
	});
});

describe("#toCartesian", function () {
	it ("should correctly map lon, lat & height to 3D cartesian points", function () {
		var	lon = OSPoint.toRadians(OSPoint.toDecFromDMS(1, 43, 4.5177)),
				lat = OSPoint.toRadians(OSPoint.toDecFromDMS(52, 39, 27.2531)),
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
		var	expected_lon = OSPoint.toDecFromDMS(1, 43, 4.5177),
				expected_lat = OSPoint.toDecFromDMS(52, 39, 27.2531),
				expected_height = 24.7,
				x = 3874938.849,
				y = 116218.624,
				z = 5047168.208,
				result = OSPoint.toLatLon(x, y ,z);
		assert.equal(roughEquals(expected_lat, result.latitude), true);
		assert.equal(roughEquals(expected_lon, result.longitude), true);
		assert.equal(expected_height - result.height < 0.001, true); // To nearest mm
	});
})

// var test_data = [
// 	{
// 		postcode: "CF99 1NA",
// 		eastings: 319399,
// 		northings: 0174573,
// 		etrs89: {
// 			latitude: 51.4643670362,
// 			longitude: -3.1616631629
// 		},
// 		osgb36: {
// 			latitude: 51.4638950367,
// 			longitude: -3.1603970279
// 		}
// 	},
// 	{
// 		postcode: "IP13 6DA",
// 		eastings: 629119,
// 		northings: 0252222,
// 		etrs89: {
// 			latitude: 52.1208165091,
// 			longitude: 1.3454667496
// 		},
// 		osgb36: {
// 			latitude: 52.1203364624,
// 			longitude: 1.3472378240
// 		}
// 	},
// 	{
// 		postcode: "CO11 2AS",
// 		eastings: 609254,
// 		northings: 0230944,
// 		etrs89: {
// 			latitude: 51.9376510518,
// 			longitude: 1.0427504990
// 		},
// 		osgb36: {
// 			latitude: 51.9371588651,
// 			longitude: 1.0444789920
// 		}
// 	},
// 	{
// 		postcode: "SA31 1BA",
// 		eastings: 241289,
// 		northings: 0220062,
// 		etrs89: {
// 			latitude: 51.8565245535,
// 			longitude: -4.3060147321
// 		},
// 		osgb36: {
// 			latitude: 51.8561041316,
// 			longitude: -4.3048547458
// 		}
// 	}
// ]

// describe("Transformation", function () {
// 	var test_point, osgb36, etrs89, wgs84, t;

// 	for (var i = 0; i < test_data.length; i += 1) {
// 		t = test_data[i];

// 		test_point = new OSPoint({
// 			northings: t.northings,
// 			easting: t.eastings
// 		});

// 		it ("should have the right ETRS89 conversion", function () {
// 			etrs89 = test_point.toETRS89();
// 			assert.equal(etrs89.latitude, t.etrs89.latitude);
// 			assert.equal(etrs89.longitude, t.etrs89.longitude);
// 		});
		
// 		it ("should have the right OSGB36 conversion", function () {
// 			osgb36 = test_point.toOSGB36();
// 			assert.equal(osgb36.latitude, t.osgb36.latitude);
// 			assert.equal(osgb36.longitude, t.osgb36.longitude);
// 		});
// 	}
// });
