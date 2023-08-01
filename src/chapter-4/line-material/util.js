export function gosper(a, b) {

  function rt(x) {
    turtle[2] += x;
  }

  function lt(x) {
    turtle[2] -= x;
  }

  function fd(dist) {
    // ctx.beginPath();
    points.push({
      x: turtle[0],
      y: turtle[1],
      z: Math.sin(count) * 5
    });
    // ctx.moveTo(turtle[0], turtle[1]);

    var dir = turtle[2] * (Math.PI / 180);
    turtle[0] += Math.cos(dir) * dist;
    turtle[1] += Math.sin(dir) * dist;

    points.push({
      x: turtle[0],
      y: turtle[1],
      z: Math.sin(count) * 5
    });
    // ctx.lineTo(turtle[0], turtle[1]);
    // ctx.stroke();
  }

  function rg(st, ln, turtle) {
    st--;
    ln = ln / 2.6457;
    if (st > 0) {
      // ctx.strokeStyle = '#111';
      rg(st, ln, turtle);
      rt(60);
      gl(st, ln, turtle);
      rt(120);
      gl(st, ln, turtle);
      lt(60);
      rg(st, ln, turtle);
      lt(120);
      rg(st, ln, turtle);
      rg(st, ln, turtle);
      lt(60);
      gl(st, ln, turtle);
      rt(60);
    }
    if (st == 0) {
      fd(ln);
      rt(60);
      fd(ln);
      rt(120);
      fd(ln);
      lt(60);
      fd(ln);
      lt(120);
      fd(ln);
      fd(ln);
      lt(60);
      fd(ln);
      rt(60)
    }
  }

  function gl(st, ln, turtle) {
    st--;
    ln = ln / 2.6457;
    if (st > 0) {
      // ctx.strokeStyle = '#555';
      lt(60);
      rg(st, ln, turtle);
      rt(60);
      gl(st, ln, turtle);
      gl(st, ln, turtle);
      rt(120);
      gl(st, ln, turtle);
      rt(60);
      rg(st, ln, turtle);
      lt(120);
      rg(st, ln, turtle);
      lt(60);
      gl(st, ln, turtle);
    }
    if (st == 0) {
      lt(60);
      fd(ln);
      rt(60);
      fd(ln);
      fd(ln);
      rt(120);
      fd(ln);
      rt(60);
      fd(ln);
      lt(120);
      fd(ln);
      lt(60);
      fd(ln);
    }
  }

  const turtle = [0, 0, 0];
  const points = [];
  const count = 0;

  rg(a, b, turtle);

  return points;

}