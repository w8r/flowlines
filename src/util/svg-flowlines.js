function perpendicularSegment(a, b, length, p) {
  var d, u, v, vnorm;
  v = [b[0] - a[0], b[1] - a[1]];
  vnorm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  u = [v[0] / vnorm, v[1] / vnorm];
  u = [-u[1], u[0]];
  d = [u[0] * length / 2, u[1] * length / 2];
  return [[+p[0] + d[0], +p[1] + d[1]], [+p[0] - d[0], +p[1] - d[1]]];
}

function vsubtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function norm(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

var gap = 0.5;
var arrowheadLength = 2;  // as ratio of the thickness
var arrowheadWidth = 0.75;

function pointBetween(a, b, distFromB) {
  var d, len, normalized;
  d = vsubtract(a, b);
  len = norm(d);
  normalized = [d[0] / len, d[1] / len];
  return [b[0] + distFromB * normalized[0], b[1] + distFromB * normalized[1]];
}

export function flowLinePath(origin, dest, thickness, shortenOriginBy, shortenDestBy) {
  var p = flowLinePoints(origin, dest, thickness, shortenOriginBy, shortenDestBy);
  return (
    'M' + p[0][0] + ',' + p[0][1] + ' L' + p[1][0] + ',' + p[1][1] + ' L' + p[2][0] + ',' + p[2][1] +
    ' L' + p[3][0] + ',' + p[3][1] + ' L' + p[4][0] + ',' + p[4][1] + ' Z'
  );
}

export function flowLinePoints(origin, dest, thickness, shortenOriginBy, shortenDestBy) {
  var a, b, p0, p1, p2, p3, p4, p_, len;
  if (shortenOriginBy == null) {
    shortenOriginBy = 6;
  }
  if (shortenDestBy == null) {
    shortenDestBy = 6;
  }
  a = origin; b = dest;
  b = pointBetween(a, b, shortenDestBy);
  a = pointBetween(b, a, shortenOriginBy);
  p0 = perpendicularSegment(a, b, gap * 2, a)[1];
  p1 = perpendicularSegment(a, b, (gap + thickness) * 2, a)[1];
  p_ = perpendicularSegment(a, b, (gap + thickness) * 2, b)[1];

  len = norm(vsubtract(p1, p_));

  p2 = pointBetween(p1, p_, Math.min(arrowheadLength * thickness, len * 0.7));  // the arrow head shouldn't be longer
                                                                            // than 0.7 of the arrow length
  p3 = perpendicularSegment(p1, p_, thickness * 2 * arrowheadWidth, p2)[1];
  p4 = perpendicularSegment(a, b, gap * 2, b)[1];
  return [ p0, p1, p2, p3, p4, p0 ]
}

