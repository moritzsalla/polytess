// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/delaunator/index.d.ts

declare class Delaunator<A extends ArrayLike<number>> {
	/**
	 * A Uint32Array array of triangle vertex indices (each group of three numbers forms a triangle).
	 * All triangles are directed counterclockwise.
	 */
	triangles: Uint32Array;

	/**
	 * A Int32Array array of triangle half-edge indices that allows you to traverse the triangulation.
	 * i-th half-edge in the array corresponds to vertex triangles[i] the half-edge is coming from.
	 * halfedges[i] is the index of a twin half-edge in an adjacent triangle (or -1 for outer half-edges on the convex hull).
	 *
	 * The flat array-based data structures might be counterintuitive, but they're one of the key reasons this library is fast.
	 */
	halfedges: Int32Array;

	/**
	 * A Uint32Array array of indices that reference points on the convex hull of the input data, counter-clockwise.
	 */
	hull: Uint32Array;

	/**
	 * An array of input coordinates in the form [x0, y0, x1, y1, ....], of the type provided in the constructor (or Float64Array if you used Delaunator.from).
	 */
	coords: A;

	/**
	 * Constructs a delaunay triangulation object given a typed array of point coordinates of the form: [x0, y0, x1, y1, ...].
	 * (use a typed array for best performance).
	 * Optionally pass an end index `maxEdgeLength` to cut off the triangulation at a given edge length.
	 */
	constructor(points: A, maxEdgeLength?: number);

	/**
	 * Constructs a delaunay triangulation object given an array of points ([x, y] by default).
	 */
	static from(points: ArrayLike<ArrayLike<number>>): Delaunator<Float64Array>;

	/**
	 * Constructs a delaunay triangulation object given an array of custom points. Duplicate points are skipped.
	 * getX and getY are optional functions for custom point formats. Duplicate points are skipped.
	 */
	static from<P>(
		points: ArrayLike<P>,
		getX: (point: P) => number,
		getY: (point: P) => number,
	): Delaunator<Float64Array>;

	/**
	 * Updates the triangulation if you modified delaunay.coords values in place, avoiding expensive memory
	 * allocations. Useful for iterative relaxation algorithms such as Lloyd's.
	 */
	update(): void;
}

export = Delaunator;
