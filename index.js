/*
*
*	Based on equations provided by Ordnance Survey:
*	A Guide to Coordinate Systems in Great Britain (Dec 2010, D00659 v2.1)
*
*/

var ELLIPSOID = {
	airy1830: {
		a: 6377563.396, // Semi-major axis
		b: 6356256.909  // Semi-minor axis
	}
}

var MERCATOR_PROJECTIONS = {
	national_grid: {
		scaleFactor: 0.9996012717,
		trueOrigin: {
			longitude: 49.0,
			latitude: -2.0,
			eastings: 400000,
			northings: -100000
		},
		ellipsoid: 'airy1830'
	}
}

function OSPoint (point) {
	this.northings = point.northings,
	this.eastings = point.eastings;
}

OSPoint.prototype.toOSGB36 = function () {
	// To implement
	return {
		longitude: undefined,
		latitude: undefined
	};
}

OSPoint.prototype.toWGS84 = function () {
	// To implement
	return {
		longitude: undefined,
		latitude: undefined
	};
}

OSPoint.prototype.toETRS89 = function () {
	// To implement
	return {
		longitude: undefined,
		latitude: undefined
	};
}

/* UTILITY FUNCTIONS */

OSPoint.toRadians = function (degrees) {
	return toRadians(degrees);
}

OSPoint.nu = function (a, F0, e2, lat) {
	return nu(a, F0, e2, lat);
}

OSPoint.rho = function (a, F0, e2, lat) {
	return rho(a, F0, e2, lat);	
}

OSPoint.e2 = function (a, b) {
	return e2(a, b);
}

OSPoint.M = function (a, b, F0, lat, lat0) {
	return M(a, b, F0, lat, lat0);
}

OSPoint.eta2 = function (nu, rho) {
	return eta2(nu, rho);
}

OSPoint.toDecFromDMS = function (degrees, minutes, seconds) {
	return toDecFromDMS(degrees, minutes, seconds);
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

var toRadians = function (degrees) {
	return degrees / 180 * Math.PI;
}

var toDecFromDMS = function (degrees, minutes, seconds) {
	return degrees + (minutes / 60) + (seconds / 3600);
}

/* C2 Equations */
var e2 = function (a, b) {
	return (a*a - b*b) / (a*a);
}

var nu = function (a, F0, e2, lat) {
	var x = a * F0,
			y = 1 - (e2 * sin2(lat));

	return (x * Math.pow(y, -0.5));
}

var rho = function (a, F0, e2, lat) {
	var x = a * F0,
			y = 1 - e2,
			z = 1 - (e2 * sin2(lat));
	return x * y * Math.pow(z, -1.5);
}

var eta2 = function (nu, rho) {
	return (nu / rho) - 1;
}

/* C3 Equation */

var M = function (a, b, F0, lat, lat0) {
	var n = (a - b) / (a + b),
			n2 = n * n,
			n3 = n * n * n;

	var w = (1 + n + (5/4)*n2 + (5/4)*n3) * (lat - lat0),
			x = (3*n + 3*n2 + (21/8)*n3) * sin(lat - lat0) * cos(lat + lat0),
			y = ((15/8)*n2 + (15/8)*n3) * sin(2*(lat -lat0)) * cos(2*(lat + lat0)),
			z = (35/24)*n3 * sin(3*(lat - lat0)) * cos(3*(lat+lat0));
	return b * F0 * (w - x + y - z);
}

/*********************/


var mercatorToGPS = function (point, options) {
	var projection = MERCATOR_PROJECTIONS['national_grid'],
			eastings = point.eastings,
			northings = point.northings,
			ellipsoid = ELLIPSOID[projection.ellipsoid],
			semiMajor = ellipsoid.a,
			semiMinor = ellipsoid.b,
			ellipsoidEccentricity = ((semiMajor * semiMajor) - (semiMinor * semiMinor)) / (semiMajor * semiMajor),
			trueNorthings = projection.trueOrigin.northings,
			trueEastings = projection.trueOrigin.eastings,
			trueLatitude = toRadians(projection.trueOrigin.latitude),
			trueLongitude = toRadians(projection.trueOrigin.longitude);
}


module.exports = OSPoint;