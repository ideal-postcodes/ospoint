# Ordnance Survey Point Converter

Converts Ordnance Survey grid points (UK National Grid) into latitude and longitude (OSGB36, ETRS89 & WGS84)

## Getting Started

todo

## How it Works

National Grid (Mercator Traverse Projection) -> 3D Coordinate System (Longitude/Latitude OSGB36, based on Airy 1830 Ellipsoid) -> ETRS89, WGS84


## Helper Methods

Some API's necessary for the transformations are also exposed

### toCartesian(longitude, latitude, height [,ellipsoid])

Converts latitude, longitude and height (and optional ellipsoid) and converts to cartesian X,Y,Z coordinates using ellipsoid centre as origin. Defaults to Airy 1830 Ellipsoid.

### toLatLon(x, y, z [,ellipsoid])

Converts converts cartesian X,Y,Z coordinates to longitude, latitude and height. Defaults to Airy 1830 Ellipsoid.

### helmertDatumTransformation(startPoint, transformation)

Performs a Helmert Transformation given a starting point and transformation object

## License

MIT

## Contributions