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
		eastings: 529404,
		northings: 0184524,
		etrs89: {
			latitude: 51.5447854882,
			longitude: -0.1352501434
		},
		osgb36: {
			latitude: 51.5442771915,
			longitude: -0.1336688927
		}
	},
	{
		postcode: "PR0 2SP",
		eastings: 355008,
		northings: 0429378,
		etrs89: {
			latitude: 53.7588208583,
			longitude: -2.6839040541
		},
		osgb36: {
			latitude: 53.7585958482,
			longitude: -2.6825100535
		}
	},
	{
		postcode: "DN2 5HS",
		eastings: 459159,
		northings: 0403295,
		etrs89: {
			latitude: 53.5230220318,
			longitude: -1.1091500125
		},
		osgb36: {
			latitude: 53.5227418024,
			longitude: -1.1075705475
		}
	},
	{
		postcode: "CV10 7HH",
		eastings: 434739,
		northings: 0290733,
		etrs89: {
			latitude: 52.5134009573,
			longitude: -1.4895317568
		},
		osgb36: {
			latitude: 52.5130114397,
			longitude: -1.4880502263
		}
	},
	{
		postcode: "EX12 4AB",
		eastings: 325504,
		northings: 0089994,
		etrs89: {
			latitude: 50.7047805998,
			longitude: -3.0563290225
		},
		osgb36: {
			latitude: 50.7042316399,
			longitude: -3.0550762331
		}
	},
	{
		postcode: "TN19 7BG",
		eastings: 568230,
		northings: 0124997,
		etrs89: {
			latitude: 50.9997697099,
			longitude: 0.3961933869
		},
		osgb36: {
			latitude: 50.9991957299,
			longitude: 0.3978104386
		}
	},
	{
		postcode: "HP7 9TB",
		eastings: 497980,
		northings: 0197802,
		etrs89: {
			latitude: 51.6704619411,
			longitude: -0.5845362102
		},
		osgb36: {
			latitude: 51.6699736171,
			longitude: -0.5829976678
		}
	},
	{
		postcode: "WN7 5HT",
		eastings: 364225,
		northings: 0401771,
		etrs89: {
			latitude: 53.5114112469,
			longitude: -2.5409279366
		},
		osgb36: {
			latitude: 53.5111549423,
			longitude: -2.5395242499
		}
	},
	{
		postcode: "BT65 5HT",
		eastings: 135906,
		northings: 486048,
		etrs89: {
			latitude: 54.4419336023,
			longitude: -6.3683857237
		},
		osgb36: {
			latitude: 54.4417963770,
			longitude: -6.3674760932
		}
	},
	{
		postcode: "DY1 3LG",
		eastings: 393430,
		northings: 0292062,
		etrs89: {
			latitude: 52.5264053427,
			longitude: -2.0982638699
		},
		osgb36: {
			latitude: 52.5260280345,
			longitude: -2.0968506023
		}
	},
	{
		postcode: "SA5 8HX",
		eastings: 263290,
		northings: 0195174,
		etrs89: {
			latitude: 51.6387121087,
			longitude: -3.9769733171
		},
		osgb36: {
			latitude: 51.6382662551,
			longitude: -3.9757859793
		}
	}
]

describe("Transformation", function () {	
	it ("should have the right OSGB36 conversion", function () {
		var test_point, osgb36, etrs89, wgs84, t;
		for (var i = 0; i < test_data.length; i += 1) {
			t = test_data[i];
			test_point = new OSPoint(t.northings, t.eastings);

			it ("should have the right ETRS89 conversion", function () {
				etrs89 = test_point.toETRS89();
				assert.equal(etrs89.latitude, t.etrs89.latitude);
				assert.equal(etrs89.longitude, t.etrs89.longitude);
			});

			it ("should have the right OSGB36 conversion", function () {
				osgb36 = test_point.toOSGB36();
				assert.equal(roughEquals(osgb36.latitude, t.osgb36.latitude), true);
				assert.equal(roughEquals(osgb36.longitude, t.osgb36.longitude), true);
			});
		}
	});
});
