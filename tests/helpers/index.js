var TOLERANCE = 0.00001;

exports.equal = function (a, b) {
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
