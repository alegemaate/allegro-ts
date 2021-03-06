// Pi
export const PI = 3.14159265;

// Pi * 2
export const PI2 = 2 * 3.14159265;

// Pi / 2
export const PI_2 = 3.14159265 / 2;

// Pi / 3
export const PI_3 = 3.14159265 / 3;

// Pi / 4
export const PI_4 = 3.14159265 / 4;

/**
 * Converts degrees to radians.
 * Also, changes clockwise to anticlockwise.
 * @param d - value in degrees to be converted
 * @returns -d*PI/180.0f
 */
export function RAD(d: number): number {
  return (-d * PI) / 180.0;
}

/**
 * Converts radians to degrees.
 * Also, changes anticlockwise to clockwise.
 * @param r - value in radians to be converted
 * @returns -r*180.0f/PI
 */
export function DEG(r: number): number {
  return (-r * 180.0) / PI;
}

/**
 * Returns the floored number of float input
 * Result is always integer.
 * @returns floored integer
 */
export function floor(num: number): number {
  return Math.floor(num);
}

/**
 * Returns a random number from 0 to 65535
 * Result is always integer. Use modulo (%) operator to create smaller values i.e. rand()%256 will return a random number from 0 to 255 inclusive.
 * @returns a random number in 0-65535 inclusive range
 */
export function rand(): number {
  return Math.floor(65536 * Math.random());
}

export function AL_RAND(): number {
  return rand();
}

/**
 * Returns a random number from -2147483648 to 2147483647
 * Result is always integer. Use abs() if you only want positive values.
 * @returns a random number in -2147483648-2147483648 inclusive range
 */
export function rand32(): number {
  return rand() | (rand() << 16);
}

/**
 * Returns a random number from 0.0 to 1.0
 * This one is float. Use multiply (*) operator to get higher values. i.e. frand()*10 will return a value from 0.0 to 10.0
 * @returns a random floating point value from 0.0 to 1.0
 */
export function frand(): number {
  return Math.random();
}

/**
 * Returns absolute value of a
 * Removes minus sign from the value, should there be any.
 * @param a - value to be absoluted
 * @returns absolute value of a
 */
export function abs(a: number): number {
  return a < 0 ? -a : a;
}

/**
 * Returns length of a vector
 * @param x - x coordinate
 * @param y - y coordinate
 * @returns length of the vector
 */
export function length_(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/**
 * Calculates distance between two points
 * @param x1 - first point x
 * @param y1 - first point y
 * @param x2 - second point x
 * @param y2 - second point y
 * @returns distance between the points
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

/**
 * Calculates squared distance between two points
 * This version is just a tad faster
 * @param x1 - first point x
 * @param y1 - first point y
 * @param x2 - second point x
 * @param y2 - second point y
 * @returns distance between the points
 */
export function distance2(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
}

/**
 * Distance between a point  and a line segment
 * @param ex1 - first end of line segment
 * @param ey1 - first end of line segment
 * @param ex2 - second end of line segment
 * @param ey2 - second end of line segment
 * @param x - point coordinates
 * @param y - point coordinates
 * @returns distance of point x,y from line ex1,ey1-ex2,ey2
 */
export function linedist(
  ex1: number,
  ey1: number,
  ex2: number,
  ey2: number,
  x: number,
  y: number
): number {
  const px = ex2 - ex1;
  const py = ey2 - ey1;
  let u = ((x - ex1) * px + (y - ey1) * py) / (px * px + py * py);
  if (u > 1) u = 1;
  else if (u < 0) u = 0;

  const dx = ex1 + u * px - x;
  const dy = ey1 + u * py - y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Linear interpolation between two values
 * Returns a value midway between from and to specified by progress
 * @param from - number to lerp from
 * @param to - number to lerp to
 * @param progress - amount of lerp
 * @returns lerped value
 */
export function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

/**
 * Returns a dot product of two vectors
 * Dot product is equal to cosine of angle between two vectors times their lengths. With normalised, length 1.0, vectors, the value would be 1.0 if vectors are the same, 0.0 if they are perpendicular, and -1.0 if they point the opposite direction. It helps to determine angle differences.
 * @param x1 - first point x
 * @param y1 - first point y
 * @param x2 - second point x
 * @param y2 - second point y
 * @returns dot product of the vectors
 */
export function dot(x1: number, y1: number, x2: number, y2: number): number {
  return x1 * x2 + y1 * y2;
}

/**
 * Returns sign of value
 * Will return -1 if it's negative, 1 if positive and 0 if zero
 * @param a - value
 * @returns sign of a
 */
export function sgn(a: number): number {
  if (a < 0) {
    return -1;
  }
  if (a > 0) {
    return 1;
  }
  return 0;
}

/**
 * Returns an angle between two vectors
 * @param x1 - first point x
 * @param y1 - first point y
 * @param x2 - second point x
 * @param y2 - second point y
 * @returns angle in degrees, snapped to 0-360
 */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
  const a = DEG(Math.atan2(y2 - y1, x2 - x1));
  return a < 0 ? a + 360 : a;
}

/**
 * Returns a difference between angles
 * @param a - angle 1
 * @param b - angle 2
 * @returns angle difference, in -180 to 180 range
 */
export function anglediff(a: number, b: number): number {
  let diff = b - a;
  diff /= 360;
  diff = (diff - floor(diff)) * 360;
  if (diff > 180) {
    diff -= 360;
  }
  return diff;
}

/**
 * Clamps a value
 * Min doesn't really have to be smaller than max
 * @param value - value to be clamped
 * @param min - min value to clamp between
 * @param max - max value to clamp between
 * @returns clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  if (max > min) {
    if (value < min) return min;
    else if (value > max) return max;
    return value;
  }
  if (value < max) return max;
  else if (value > min) return min;
  return value;
}

/**
 * Scales a value from one range to another
 * @param value - value to be scaled
 * @param min - max bound to scale from
 * @param max - max bound to scale from
 * @param min2 - max bound to scale clamp to
 * @param max2 - max bound to scale clamp to
 * @returns scaled value
 */
export function scale(
  value: number,
  min: number,
  max: number,
  min2: number,
  max2: number
): number {
  return min2 + ((value - min) / (max - min)) * (max2 - min2);
}

/**
 * Scales value from one range to another and clamps it down
 * @param value - value to be scaled
 * @param min - max bound to scale from
 * @param max - max bound to scale from
 * @param min2 - max bound to scale clamp to
 * @param max2 - max bound to scale clamp to
 * @returns scaled and clamped value
 */
export function scaleclamp(
  value: number,
  min: number,
  max: number,
  min2: number,
  max2: number
): number {
  let cmp_val = min2 + ((value - min) / (max - min)) * (max2 - min2);
  if (max2 > min2) {
    cmp_val = cmp_val < max2 ? cmp_val : max2;
    return cmp_val > min2 ? cmp_val : min2;
  }
  cmp_val = cmp_val < min2 ? cmp_val : min2;
  return cmp_val > max2 ? cmp_val : max2;
}
