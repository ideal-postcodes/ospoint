[![Build Status](https://travis-ci.org/cblanc/ospoint.svg?branch=master)](https://travis-ci.org/cblanc/ospoint)
[![Dependency Status](https://gemnasium.com/cblanc/ospoint.png)](https://gemnasium.com/cblanc/ospoint)

# Ordnance Survey Point Converter

Converts Ordnance Survey grid points (UK National Grid, Northings & Eastings) into latitude and longitude

For anyone who has ever tried to get useful location data from [Ordnance Survey's Code-Point Open](https://www.ordnancesurvey.co.uk/opendatadownload/products.html) but was stuck with Northings and Eastings, you can use this package to convert those numbers into longitude and latitude.

OSPoint will allow you to convert Northings and Eastings into OSGB36, ETRS89 or WGS84 coordinates. If you're not sure which one you need, you probably just want WGS84.

This package is based on equations provided by the people at the Ordance Survey.

OSPoint will accruately translate Northings and Eastings for the United Kingdom. 

**New** Now supports conversion of Irish National Grid coordinates. Please take care when transforming Irish coordinates - you will need to pass in the name of the [proper mercator projection](http://en.wikipedia.org/wiki/Irish_grid_reference_system) (as demonstrated below).

## Getting Started

```javascript

var OSPoint = require('ospoint');

// Create a new OSPoint instance, with Northings & Eastings
var point = new OSPoint("NORTHINGS", "EASTINGS");

// Retrieve OSGB coordinates
point.toOSGB36();

// Retrieve ETRS89 coordinates
point.toETRS89();

// Retrieve WGS84 coordinates
point.toWGS84();

```

If your Northings and Eastings data is a Irish National Grid coordinate, be sure to pass in "irish_national_grid" when converting. OSPoint will then use the appropriate mercator projection. For example:

```javascript

var OSPoint = require('ospoint');

// Create a new OSPoint instance, with Irish Northings & Eastings
var point = new OSPoint("NORTHINGS", "EASTINGS");

// Retrieve ETRS89 coordinates
point.toETRS89("irish_national_grid");

// Retrieve WGS84 coordinates
point.toWGS84("irish_national_grid");

```

**Things to note**
- Northings and Eastings must be a number (no grid letters)
- To be safe, you should pass in raw Northings and Eastings as strings. They occasionally come with a leading 0s from the OS dataset, which javascript will interpret as a base-8 number (I'm not joking...)
- All transformation methods return an object with longitude and latitude properties in decimal degrees

## Testing

```shell
npm test
```

## Note on ETRS89 and WGS84 Coordinate Systems

ETRS89 is a variation of WGS84 that takes into account the slow North Easterly drifting of the Eurasian tectonic plate. The WGS84 and ETRS89 coordinate systems coincided in 1989 (hence the name) and have drifted apart at a rate of ~2.5cm per year due to tectonic movements.

toWGS84() is currently hard-coded to output the same coordinates as toETRS89(). But in reality WGS and ETRS are [off by ~50-60cm in 2013](http://www.killetsoft.de/t_1009_e.htm). I will implement a more accurate version of toWGS84() some time soon - but this shouldn't really matter given the 5m accuracy of the OSGB36 -> ETRS89 transformation.

## Which Coordinate System do I want to translate Northings and Eastings into?

95% of the time, people want WGS84

## License

MIT
