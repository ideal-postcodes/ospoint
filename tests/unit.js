var assert = require('chai').assert,
		OSPoint = require('../index.js');

var TOLERANCE = 0.00001,
		roughEquals = function (a, b) {
			absA = Math.abs(a);
			absB = Math.abs(b);
			var diff = Math.abs(a - b);

			if (a == b) {
				return true;
			} else if (a * b == 0) {
				return diff < TOLERANCE * TOLERANCE;
			} else {
				return (diff / (absA + absB)) < TOLERANCE;
			}
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

describe("#helmertDatumTransformation", function () {
	it ("should correctly transform coordinates from one datum to another", function () {

	});
});

var test_data = [
	{
		postcode: "NW1 9HZ",
		eastings: "529404",
		northings: "0184524",
		etrs89: {
			latitude: 51.544783154944,
			longitude: -0.135276077351
		},
		osgb36: {
			latitude: 51.5442771915,
			longitude: -0.1336688927
		}
	},
	{
		postcode: "PR0 2SP",
		eastings: "355008",
		northings: "0429378",
		etrs89: {
			latitude: 53.758805090828,
			longitude: -2.683907021034
		},
		osgb36: {
			latitude: 53.7585958482,
			longitude: -2.6825100535
		}
	},
	{
		postcode: "DN2 5HS",
		eastings: "459159",
		northings: "0403295",
		etrs89: {
			latitude: 53.523001805421,
			longitude: -1.109147509169
		},
		osgb36: {
			latitude: 53.5227418024,
			longitude: -1.1075705475
		}
	},
	{
		postcode: "CV10 7HH",
		eastings: "434739",
		northings: "0290733",
		etrs89: {
			latitude: 52.513383912173,
			longitude: -1.489540169119
		},
		osgb36: {
			latitude: 52.5130114397,
			longitude: -1.4880502263
		}
	},
	{
		postcode: "EX12 4AB",
		eastings: "325504",
		northings: "0089994",
		etrs89: {
			latitude: 50.704792591055,
			longitude: -3.056320818135
		},
		osgb36: {
			latitude: 50.7042316399,
			longitude: -3.0550762331
		}
	},
	{
		postcode: "TN19 7BG",
		eastings: "568230",
		northings: "0124997",
		etrs89: {
			latitude: 50.999773245709,
			longitude: 0.396165563528
		},
		osgb36: {
			latitude: 50.9991957299,
			longitude: 0.3978104386
		}
	},
	{
		postcode: "HP7 9TB",
		eastings: "497980",
		northings: "0197802",
		etrs89: {
			latitude: 51.670457934396,
			longitude: -0.584558659291
		},
		osgb36: {
			latitude: 51.6699736171,
			longitude: -0.5829976678
		}
	},
	{
		postcode: "WN7 5HT",
		eastings: "364225",
		northings: "0401771",
		etrs89: {
			latitude: 53.511395303404,
			longitude: -2.540928765517
		},
		osgb36: {
			latitude: 53.5111549423,
			longitude: -2.5395242499
		}
	},
	// FIX IRELAND
	// {
	// 	postcode: "BT65 5HT",
	// 	eastings: "135906",
	// 	northings: "486048",
	// 	etrs89: {
	// 		latitude: 54.201949270797,
	// 		longitude: -6.050986159206
	// 	},
	// 	osgb36: {
	// 		latitude: 54.4417963770,
	// 		longitude: -6.3674760932
	// 	}
	// },
	{
		postcode: "DY1 3LG",
		eastings: "393430",
		northings: "0292062",
		etrs89: {
			latitude: 52.526390146896,
			longitude: -2.098269628082
		},
		osgb36: {
			latitude: 52.5260280345,
			longitude: -2.0968506023
		}
	},
	{
		postcode: "SA5 8HX",
		eastings: "263290",
		northings: "0195174",
		etrs89: {
			latitude: 51.638707177807,
			longitude: -3.976954712328
		},
		osgb36: {
			latitude: 51.6382662551,
			longitude: -3.9757859793
		}
	}
]

describe("Transformation", function () {	
	it ("should have the right OSGB36 conversion", function () {
		var test_point, osgb36, t;
		for (var i = 0; i < test_data.length; i += 1) {
			t = test_data[i];
			test_point = new OSPoint(t.northings, t.eastings);
			osgb36 = test_point.toOSGB36();
			assert.equal(roughEquals(osgb36.latitude, t.osgb36.latitude), true);
			assert.equal(roughEquals(osgb36.longitude, t.osgb36.longitude), true);
		}
	});
	it ("should have the right ETRS89 conversion", function () {
		var test_point, etrs89, t;
		for (var i = 0; i < test_data.length; i += 1) {
			t = test_data[i];
			test_point = new OSPoint(t.northings, t.eastings);
			etrs89 = test_point.toETRS89();
			assert.equal(roughEquals(etrs89.latitude, t.etrs89.latitude), true);
			assert.equal(roughEquals(etrs89.longitude, t.etrs89.longitude), true);
		}
	});
});
