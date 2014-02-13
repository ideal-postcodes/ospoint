	var fs = require("fs"),
			path = require("path"),
			OSPoint = require("../index"),
			assert = require("chai").assert,
			roughEquals = require("./helpers").equal,
			testDataPath = path.join(__dirname, "data/irish_national_grid.json"),
			testData;

var testData = JSON.parse(fs.readFileSync(testDataPath)).data;

describe("Transformation", function () {	
	// Lack OSGB test data for Irish locations
	//
	// it ("should have the right OSGB36 conversion", function () {
	// 	var testPoint, osgb36, t;
	// 	for (var i = 0; i < testData.length; i += 1) {
	// 		t = testData[i];
	// 		testPoint = new OSPoint(t.northings, t.eastings);
	// 		osgb36 = testPoint.toOSGB36("irish_national_grid");
	// 		assert.equal(roughEquals(osgb36.latitude, t.osgb36.latitude), true);
	// 		assert.equal(roughEquals(osgb36.longitude, t.osgb36.longitude), true);
	// 	}
	// });
	it ("should have the right ETRS89 conversion", function () {
		var testPoint, etrs89, t;
		for (var i = 0; i < testData.length; i += 1) {
			t = testData[i];
			testPoint = new OSPoint(t.northings, t.eastings);
			etrs89 = testPoint.toETRS89("irish_national_grid");
			assert.equal(roughEquals(etrs89.latitude, t.etrs89.latitude), true);
			assert.equal(roughEquals(etrs89.longitude, t.etrs89.longitude), true);
		}
	});

	it ("should have the right WGS84 conversion", function () {
		var testPoint, wgs84, t;
		for (var i = 0; i < testData.length; i += 1) {
			t = testData[i];
			testPoint = new OSPoint(t.northings, t.eastings);
			wgs84 = testPoint.toWGS84("irish_national_grid");
			assert.equal(roughEquals(wgs84.latitude, t.etrs89.latitude), true);
			assert.equal(roughEquals(wgs84.longitude, t.etrs89.longitude), true);
		}
	});
});