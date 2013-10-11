/*
*
* OSCONV
*	Based on Equations Provided by Ordnance Survey:
*	A Guide to Coordinate Systems in Great Britain (Dec 2010, D00659 v2.1)
* https://github.com/cblanc/osconv
*
*/

/* 
 * UTILITY FUNCTIONS 
 * These functions have been factored out and named to assist readability
 * when used in conjunction with the equations provided by Ordnance Survey
 *
 */

"use strict";

function OSPoint (northings, eastings) {
	this.northings = parseInt(northings, 10),
	this.eastings = parseInt(eastings, 10);
}

OSPoint.toRadians = function (degrees) {
	return toRadians(degrees);
}

OSPoint.toDegrees = function (radians) {
	return toDegrees(radians);
}

OSPoint.nu = function (a, F0, e2, lat) {
	var x = a * F0,
			y = 1 - (e2 * sin2(lat));

	return (x * Math.pow(y, -0.5));
}

OSPoint.rho = function (a, F0, e2, lat) {
	var x = a * F0,
			y = 1 - e2,
			z = 1 - (e2 * sin2(lat));
	return x * y * Math.pow(z, -1.5);
}

OSPoint.e2 = function (a, b) {
	return (a*a - b*b) / (a*a);
}

OSPoint.M = function (a, b, F0, lat, lat0) {
	var n = (a - b) / (a + b),
			n2 = n * n,
			n3 = n * n * n;

	var w = (1 + n + (5/4)*n2 + (5/4)*n3) * (lat - lat0),
			x = (3*n + 3*n2 + (21/8)*n3) * sin(lat - lat0) * cos(lat + lat0),
			y = ((15/8)*n2 + (15/8)*n3) * sin(2*(lat -lat0)) * cos(2*(lat + lat0)),
			z = (35/24)*n3 * sin(3*(lat - lat0)) * cos(3*(lat+lat0));
	return b * F0 * (w - x + y - z);
}

OSPoint.eta2 = function (nu, rho) {
	return (nu / rho) - 1;
}

OSPoint.toDecimalFromDMS = function (degrees, minutes, seconds) {
	return toDecimalFromDMS(degrees, minutes, seconds);
}

var sin = function (radians) {
	return Math.sin(radians);
}

var sin2 = function (radians) {
	return Math.pow(Math.sin(radians), 2);
}

var cos = function (radians) {
	return Math.cos(radians);
}

var tan = function (radians) {
	return Math.tan(radians);
}

var tan2 = function (radians) {
	return Math.pow(Math.tan(radians), 2);
}

var tan4 = function (radians) {
	return Math.pow(Math.tan(radians), 4);
}

var tan6 = function (radians) {
	return Math.pow(Math.tan(radians), 6);
}

var arctan = function (radians) {
	return Math.atan(radians);
}

var sec = function (radians) {
	return Math.pow(Math.cos(radians), -1);
}

var toRadians = function (degrees) {
	return (degrees / 180) * Math.PI;
}

var toDegrees = function (radians) {
	return (radians / Math.PI) * 180;
}

var toDecimalFromDMS = function (degrees, minutes, seconds) {
	return degrees + (minutes / 60) + (seconds / 3600);
}

var toRadiansFromDMS = function (degrees, minutes, seconds) {
	return toRadians(toDecimalFromDMS(degrees, minutes, seconds));
}

/*
 *
 * Real Work Starts Here
 *
 */

var ELLIPSOID = {
	airy1830: {
		a: 6377563.396, // Semi-major axis
		b: 6356256.909  // Semi-minor axis
	},
	grs80: {
		a: 6378137.000,
		b: 6356752.3141
	},
	airy1830_modified: {
		a: 6377340.189,
		b: 6356034.447
	}
};

var MERCATOR_PROJECTIONS = {
	national_grid: {
		scaleFactor: 0.9996012717,
		trueOrigin: {
			longitude: toRadiansFromDMS(-2, 0, 0),
			latitude: toRadiansFromDMS(49, 0, 0),
			eastings: 400000,
			northings: -100000
		},
		ellipsoid: 'airy1830'
	},
	irish_national_grid: {
		scaleFactor: 1.000035,
		trueOrigin: {
			longitude: toRadiansFromDMS(-8, 0, 0),
			latitude: toRadiansFromDMS(53, 30, 0),
			eastings: 200000,
			northings: 250000
		},
		ellipsoid: 'airy1830_modified'
	}
};

OSPoint.prototype.toOSGB36 = function (projection) {
	// Use default projection
	var result = toLongLat(this.northings, this.eastings, projection);
	return {
		longitude: OSPoint.toDegrees(result.longitude),
		latitude: OSPoint.toDegrees(result.latitude)
	};
}

OSPoint.prototype.toETRS89 = function (projection) {
	var osgb36 = this.toLongLat(this.northings, this.eastings, projection),
			height = 0,
			osgbTransform = OSPoint.toCartesian(osgb36.longitude, osgb36.latitude, height),
			point = OSPoint.helmertTransformation(osgbTransform),
			result = OSPoint.toLatLon(point.x, point.y, point.z, 'grs80');
	return {
		longitude: OSPoint.toDegrees(result.longitude),
		latitude: OSPoint.toDegrees(result.latitude)
	};
}

OSPoint.prototype.toWGS84 = function () {
	// To implement
	return {
		longitude: undefined,
		latitude: undefined
	};
}

OSPoint.prototype.toLongLat = function () {
	return toLongLat(this.northings, this.eastings);
}

OSPoint.toCartesian = function (lon, lat, H, ellipsoid) {
	var ellipsoid = ELLIPSOID[ellipsoid] || ELLIPSOID['airy1830'],
			a = ellipsoid.a,
			b = ellipsoid.b,
			e2 = OSPoint.e2(a, b),
			v = a * Math.pow(1 - e2 * sin2(lat), -0.5),
			x = (v + H) * cos(lat) * cos(lon),
			y = (v + H) * cos(lat) * sin(lon),
			z = ((1-e2)*v + H) * sin(lat);

	return {
		x: x,
		y: y,
		z: z
	};
}

OSPoint.toLatLon = function (x, y, z, ellipsoid) {
	var ellipsoid = ELLIPSOID[ellipsoid] || ELLIPSOID['airy1830'],
			a = ellipsoid.a,
			b = ellipsoid.b,
			e2 = OSPoint.e2(a, b),
			lon = arctan(y / x),
			p = Math.pow(x*x + y*y, 0.5),
			initialLat = arctan(z / (p * (1-e2) )),
			estimateV = function (lat) {
				return a * Math.pow(1 - e2 * sin2(lat), -0.5);
			},
			v = estimateV(initialLat),
			estimateLat = function (v, prevLat) {
				return arctan( (z + e2*v*sin(prevLat)) / p);
			},
			lat = estimateLat(v, initialLat),
			TOLERANCE = 0.0000000001;

	while (Math.abs(lat - initialLat) > TOLERANCE) {
		v = estimateV(lat);
		initialLat = lat;
		lat = estimateLat(v, initialLat);
	}

	var height = (p / cos(lat)) - v;

	return {
		latitude: lat,
		longitude: lon,
		height: height
	};
}

/*
 * The Helmert Transformation, a reference
 *
 * [Xb]   [tx]   [ 1+s -rz ry  ]   [Xa]
 * [Yb] = [ty] + [ rz  1+s -rx ] * [Ya]
 * [Zb]   [tz]   [ -ry rx  1+s ]   [Za]
 *
 */

var HELMERT_TRANSFORMATIONS = {
	etrs89: {
		to_osgb36: {
			tx: -446.448,		// metres
			ty: 125.157,		// metres
			tz: -542.060,		// metres
			rx: -0.1502,		// seconds
			ry: -0.2470,		// seconds
			rz: -0.8421,		// seconds
			s: 20.4894			// ppm
		}
	},
	osgb36: {
		to_etrs89: {
			tx: 446.448,
			ty: -125.157,
			tz: 542.060,
			rx: 0.1502,
			ry: 0.2470,
			rz: 0.8421,
			s: -20.4894
		}
	}
};

OSPoint.helmertTransformation = function (point, transformation) {
	var t = transformation || HELMERT_TRANSFORMATIONS.osgb36.to_etrs89,
			xa = point.x,
			ya = point.y,
			za = point.z,
			tx = t.tx,
			ty = t.ty,
			tz = t.tz,
			rx = OSPoint.toRadians(t.rx / 3600),
			ry = OSPoint.toRadians(t.ry / 3600),
			rz = OSPoint.toRadians(t.rz / 3600),
			s  = t.s * 0.000001,
			xb = tx + (1+s)*xa + (-rx*ya) + (ry * za),
			yb = ty + rz*xa + (1+s)*ya + (-rx)*za,
			zb = tz + (-ry)*xa + rx*ya + (1+s)*za;

	return {
		x: xb,
		y: yb,
		z: zb
	};
}

var toLongLat = function (northings, eastings, projection) {
	var projection = MERCATOR_PROJECTIONS[projection] || MERCATOR_PROJECTIONS['national_grid'],
			ellipsoid = ELLIPSOID[projection.ellipsoid],
			E = eastings,
			N = northings,
			a = ellipsoid.a,
			b = ellipsoid.b,
			e2 = OSPoint.e2(a, b),
			F0 = projection.scaleFactor,
			N0 = projection.trueOrigin.northings,
			E0 = projection.trueOrigin.eastings,
			lat0 = projection.trueOrigin.latitude,
			lon0 = projection.trueOrigin.longitude,
			latDashed = ((N - N0) / (a * F0)) + lat0, // Equation C6
			M = OSPoint.M(a, b, F0, latDashed, lat0);

	while (N - N0 - M >= 0.0001) {
		latDashed = ((N - N0 - M) / (a * F0)) + latDashed; // Equation C7
		M = OSPoint.M(a, b, F0, latDashed, lat0);	
	}
	
	var rho = OSPoint.rho(a, F0, e2, latDashed),
			nu = OSPoint.nu(a, F0, e2, latDashed),
			eta2 = OSPoint.eta2(nu, rho),

			VII = function (latDashed, nu, rho) {
				return tan(latDashed) / (2 * rho * nu);
			}(latDashed, nu, rho),

			VIII = function (latDashed, nu, rho, eta2) {
				var x = tan(latDashed) / (24 * rho * Math.pow(nu, 3)),
						y = 5 + 3*tan2(latDashed) + eta2 - (9*tan2(latDashed)*eta2);
				return x * y;
			}(latDashed, nu, rho, eta2),

			IX = function (latDashed, nu, rho) {
				var x = tan(latDashed) / (720 * rho * Math.pow(nu, 5)),
						y = 61 + 90*tan2(latDashed) + 45*tan4(latDashed);
				return x * y;
			}(latDashed, nu, rho),

			X = function (latDashed, nu) {
				return sec(latDashed) / nu;
			}(latDashed, nu),

			XI = function (latDashed, nu ,rho) {
				var x = sec(latDashed) / (6 * Math.pow(nu, 3)),
						y = (nu / rho) + (2 * tan2(latDashed));
				return x * y;
			}(latDashed, nu ,rho),

			XII = function (latDashed, nu) {
				var x = sec(latDashed) / (120 * Math.pow(nu, 5)),
						y = 5 + 28*tan2(latDashed) + 24*tan4(latDashed);
				return x * y;
			}(latDashed, nu),

			XIII = function (latDashed, nu) {
				var x = sec(latDashed) / (5040 * Math.pow(nu, 7)),
						y = 61 + 662*tan2(latDashed) + 1320*tan4(latDashed) + 720*tan6(latDashed);
				return x * y;
			}(latDashed, nu),
			E = E - E0,
			E2 = E  * E,
			E3 = E2 * E,
			E4 = E3 * E,
			E5 = E4 * E,
			E6 = E5 * E,
			E7 = E6 * E,
			lat = latDashed - VII*E2 + VIII*E4 - IX*E6,
			lon = lon0 + X*E - XI*E3 + XII*E5 - XIII*E7;
	
	return {
		latitude: lat,
		longitude: lon
	};
}

module.exports = OSPoint;
