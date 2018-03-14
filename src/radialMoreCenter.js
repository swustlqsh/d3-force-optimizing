/**
 * Created by liqiusheng@b.360.cn on 2018/3/14.
 */
import constant from "./constant";

export default function (radius, x, y) {
  var nodes,
    strength = constant(0.1),
    strengths,
    radiuses,
    xPosition,
    yPosition,
    xDistance,
    yDistance;

  if (typeof radius !== "function") radius = constant(+radius);

  if (typeof x !== "function") xDistance = constant(+x);

  if (typeof y !== "function") yDistance = constant(+y);

  if (x == null) xDistance = constant(0);

  if (y == null) yDistance = constant(0);

  function force (alpha) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[ i ],
        dx = node.x - xPosition[ i ] || 1e-6,
        dy = node.y - yPosition[ i ] || 1e-6,
        r = Math.sqrt(dx * dx + dy * dy),
        k = (radiuses[ i ] - r) * strengths[ i ] * alpha / r;
      node.vx += dx * k;
      node.vy += dy * k;
    }
  }

  function initialize () {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    radiuses = new Array(n);
    xPosition = new Array(n), initializeXPosition();
    yPosition = new Array(n), initializeYPosition();
    for (i = 0; i < n; ++i) {
      radiuses[ i ] = +radius(nodes[ i ], i, nodes);
      strengths[ i ] = isNaN(radiuses[ i ]) ? 0 : +strength(nodes[ i ], i, nodes);
    }
  }

  function initializeXPosition () {
    if (!nodes) return;

    for (var i = 0, n = nodes.length; i < n; ++i) {
      xPosition[ i ] = +xDistance(nodes[ i ], i, nodes);
    }
  }

  function initializeYPosition () {
    if (!nodes) return;

    for (var i = 0, n = nodes.length; i < n; ++i) {
      yPosition[ i ] = +yDistance(nodes[ i ], i, nodes);
    }
  }

  force.initialize = function (_) {
    nodes = _, initialize();
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
  };

  // force.x = function (_) {
  //   return arguments.length ? (x = +_, force) : x;
  // };

  force.x = function (_) {
    return arguments.length ? (xDistance = typeof _ === "function" ? _ : constant(+_), initializeXPosition(), force) : xDistance;
  };

  // force.y = function (_) {
  //   return arguments.length ? (y = +_, force) : y;
  // };

  force.y = function (_) {
    return arguments.length ? (yDistance = typeof _ === "function" ? _ : constant(+_), initializeYPosition(), force) : yDistance;
  };

  return force;
}
