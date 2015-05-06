
// needs work.

document.body.innerHTML += '<style>*:focus { outline: 4px solid blue; }</style>';

function nav(el, dir) {
  var targets = document.querySelectorAll('a[href], area[href], input:enabled, select:enabled, textarea:enabled, button:enabled, iframe, object, embed, *[tabindex], *[contenteditable]');
  targets = Array.prototype.slice.call(targets,0);
  
  var occlusion = 0;
  var distance = Infinity;
  var offset = Infinity;
  var rect = el.getBoundingClientRect();
  var centerX = (rect.left + rect.right)/2;
  var centerY = (rect.top + rect.bottom)/2;
  
  var winner = null;
  
  targets.forEach(function (tEl) {
    if (tEl === el) {
      return;
    }
    var tgt = tEl.getBoundingClientRect();
    
    var cx = (tgt.left + tgt.right)/2;
    var cy = (tgt.top + tgt.bottom)/2;

    var dx;
    var dy;
    var off;
    var a1;
    var a2;
    var b1;
    var b2;
    var dim1;
    var dim2;
    switch (dir) {
      case 'up':
        dx = centerX - cx;
        dy = rect.top - tgt.bottom;
        off = dy;
        a1 = rect.left;
        a2 = tgt.left;
        b1 = rect.right;
        b2 = tgt.right;
        dim1 = rect.right - rect.left;
        dim2 = tgt.right - tgt.left;
        break;
      case 'down':
        dx = centerX - cx;
        dy = tgt.top - rect.bottom;
        off = dy;
        a1 = rect.left;
        a2 = tgt.left;
        b1 = rect.right;
        b2 = tgt.right;
        dim1 = rect.right - rect.left;
        dim2 = tgt.right - tgt.left;
        break;
      case 'left':
        dy = centerY - cy;
        dx = rect.left - tgt.right;
        a1 = rect.top;
        a2 = tgt.top;
        b1 = rect.bottom;
        b2 = tgt.bottom;
        off = dx;
        dim1 = rect.bottom - rect.top;
        dim2 = tgt.bottom - tgt.top;
        break;
      case 'right':
        dy = centerY - cy;
        dx = tgt.left - rect.right;
        a1 = rect.top;
        a2 = tgt.top;
        b1 = rect.bottom;
        b2 = tgt.bottom;
        off = dx;
        dim1 = rect.bottom - rect.top;
        dim2 = tgt.bottom - tgt.top;
        break;
    }
    
    if (off < 0) {
      return;
    }
    
    var d = Math.sqrt(dx * dx + dy * dy);
    
    var occ = 0;
    if (a1 <= b2 && b2 <= b1) {
      occ = (b2 - a1) / dim1;
    }
    if (a1 <= a2 && a2 <= b1) {
      occ = (b1 - a2) / dim1;
    }
    if (a1 <= a2 && a2 <= b1 && a1 <= b2 && b2 <= b1) {
      occ = dim2 / dim1;
    }
    if (a2 <= a1 && b1 <= b2) {
      occ = 1;
    }
    if (occ === 0 && occlusion === 0) {
      if (off < offset ||
          (d < distance && off / offset < 1.2)
         ) {
        winner = tEl;
        offset = off;
        distance = d;
        occlusion = occ;
      }
    } else {
      if (occ > 0 && occlusion === 0) {
        winner = tEl;
        offset = off;
        distance = d;
        occlusion = occ;
      } else if (off < offset && occ > 0) {
        winner = tEl;
        offset = off;
        distance = d;
        occlusion = occ;
      } else if (off === offset && occ > occlusion) {
        winner = tEl;
        offset = off;
        distance = d;
        occlusion = occ;
      }
    }
  });
  if (winner) {
    winner.focus();
  }
}

document.body.addEventListener('keypress', function (e) {
  var sTime = Date.now();
  if (e.key === 'ArrowUp' && document.activeElement) {
    e.preventDefault();
    nav(document.activeElement, 'up');
  }
  if (e.key === 'ArrowLeft' && document.activeElement) {
    e.preventDefault();
    nav(document.activeElement, 'left');
  }
  if (e.key === 'ArrowRight' && document.activeElement) {
    e.preventDefault();
    nav(document.activeElement, 'right');
  }
  if (e.key === 'ArrowDown' && document.activeElement) {
    e.preventDefault();
    nav(document.activeElement, 'down');
  }
  console.log(Date.now() - sTime);
});
