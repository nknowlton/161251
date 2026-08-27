import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// A deliberately small DOM shim lets CI exercise every renderer without
// requiring a browser binary. It checks that the controls, figures, summaries,
// and tables can be constructed; the deployed pages still use the real DOM.
class FakeNode {
  constructor(tagName) {
    this.tagName = tagName;
    this.nodeType = 1;
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.listeners = {};
    this.textContent = '';
    this.className = '';
    this.value = '';
    this.classList = {
      add: (...names) => names.forEach(name => this._setClass(name, true)),
      remove: (...names) => names.forEach(name => this._setClass(name, false)),
      toggle: (name, force) => {
        const next = force === undefined ? !this.className.split(/\s+/).includes(name) : force;
        this._setClass(name, next);
        return next;
      },
      contains: name => this.className.split(/\s+/).includes(name)
    };
  }

  _setClass(name, enabled) {
    const classes = new Set(this.className.split(/\s+/).filter(Boolean));
    if (enabled) classes.add(name); else classes.delete(name);
    this.className = [...classes].join(' ');
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') this.className = String(value);
    if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
  }

  append(...children) {
    children.filter(Boolean).forEach(child => { if (child && typeof child === 'object') child.parentNode = this; this.children.push(child); });
  }
  appendChild(child) { if (child && typeof child === 'object') child.parentNode = this; this.children.push(child); return child; }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  addEventListener(name, callback) { this.listeners[name] = callback; }
}

globalThis.document = {
  createElement: tagName => new FakeNode(tagName),
  createElementNS: (_namespace, tagName) => new FakeNode(tagName),
  createTextNode: text => Object.assign(new FakeNode('#text'), { nodeType: 3, textContent: String(text) })
};
globalThis.window = { location: { search: '' } };

const { mountHub, mountLab } = await import('../js/labs.js?ui-test');
const map = JSON.parse(fs.readFileSync(new URL('../lecture-map.json', import.meta.url), 'utf8'));

test('every mapped lab mounts its accessible shell', () => {
  for (const id of Object.keys(map.labs)) {
    const root = mountLab(id);
    assert.equal(root.className, 'lab-shell', id);
    assert.ok(root.children.length >= 7, `${id} should contain controls, figure, summary, and table regions`);
  }
});

test('the hub mounts a searchable card grid for every lab', () => {
  const root = mountHub();
  assert.equal(root.className, 'lab-shell');
  const cards = root.children[1].children;
  assert.equal(cards.length, Object.keys(map.labs).length);
  assert.equal(root.children[0].children[0].tagName, 'input');
});

test('lecture presets remain valid control states', () => {
  for (const lecture of ['05', '06', '07', '25', '26']) {
    const entry = map.lectures[lecture];
    window.location.search = `?lecture=${lecture}&mode=${encodeURIComponent(entry.mode)}`;
    const root = mountLab(entry.lab);
    assert.ok(!String(root.children[5].innerHTML).includes('undefined'), `lecture ${lecture} should select a valid preset`);
  }
  window.location.search = '';
});

test('model studio exposes an SVG with linked point, residual, and row hover', () => {
  const root = mountLab('model-studio');
  const figure = root.children[4].children[0];
  const details = root.children[6].children[0];
  assert.equal(figure.tagName, 'svg');
  assert.equal(figure.attributes.width, '760');
  assert.equal(figure.attributes.height, '350');
  assert.equal(figure._labPointNodes.length, 32);
  assert.equal(figure._labResidualNodes.length, 32);
  assert.equal(details.tagName, 'details');
  figure._labPointNodes[3].listeners.mouseenter();
  assert.ok(figure._labPointNodes[3].classList.contains('is-highlighted'));
  assert.ok(figure._labResidualNodes[3].classList.contains('is-highlighted'));
  assert.ok(details._labRowNodes[3].classList.contains('is-highlighted'));
  figure._labPointNodes[3].listeners.mouseleave();
  assert.ok(!details._labRowNodes[3].classList.contains('is-highlighted'));
  figure._labPointNodes[4].listeners.click();
  assert.equal(details.open, true);
  assert.ok(details._labRowNodes[4].classList.contains('is-highlighted'));
});

test('model studio sample size changes point density and group tab adds coloured points', () => {
  const root = mountLab('model-studio');
  const controls = root.children[2];
  const sampleSizeField = controls.children[1].children[1];
  sampleSizeField.value = '60';
  sampleSizeField.listeners.input();
  assert.equal(root.children[4].children[0]._labPointNodes.length, 60);

  controls.children[0].children[1].listeners.click();
  const groupedFigure = root.children[4].children[0];
  assert.ok(groupedFigure._labPointNodes.some(point => point.className.includes('group-a')));
  assert.ok(groupedFigure._labPointNodes.some(point => point.className.includes('group-b')));
});

test('group builder expands its domain to reveal a distant added point', () => {
  const root = mountLab('model-studio');
  const controls = root.children[2];
  controls.children[0].children[1].listeners.click();
  const xField = controls.children[5].children[1];
  const yField = controls.children[6].children[1];
  xField.value = '14'; xField.listeners.input();
  yField.value = '24'; yField.listeners.input();
  root.children[3].children[1].children[0].listeners.click();
  const geometry = root.children[4].children[0]._labGeometry;
  assert.ok(geometry.xDomain[1] > 14);
  assert.ok(geometry.yDomain[1] > 24);
});

test('prediction intervals can be toggled independently without moving the prediction slider', () => {
  const root = mountLab('prediction-uncertainty');
  const controls = root.children[2];
  const meanToggle = controls.children[2].children[0];
  meanToggle.checked = false;
  meanToggle.listeners.change();
  let figure = root.children[4].children[0];
  assert.ok(!descendants(figure).some(item => item.className === 'mean-interval'));
  assert.ok(descendants(figure).some(item => item.className === 'prediction-interval'));
  const predictionToggle = controls.children[3].children[0];
  predictionToggle.checked = false;
  predictionToggle.listeners.change();
  figure = root.children[4].children[0];
  assert.ok(!descendants(figure).some(item => item.className === 'prediction-interval'));
});

test('F test shows a reference density, observed marker, and p-value', () => {
  const root = mountLab('f-tests');
  const stack = root.children[4].children[0];
  assert.equal(stack.className, 'lab-figure-stack');
  assert.ok(descendants(stack).some(item => item.className === 'f-density'));
  assert.ok(descendants(stack).some(item => item.className === 'f-observed'));
  assert.match(root.children[5].innerHTML, /p =/);
});

test('matrix lab renders projection vectors and a changing column-space diagram', () => {
  const root = mountLab('matrix-geometry');
  assert.ok(descendants(root.children[4]).some(item => item.className === 'vector-residual'));
  const mode = root.children[2].children[0].children[1];
  mode.value = 'operations'; mode.listeners.change();
  assert.ok(descendants(root.children[4]).some(item => item.className === 'column-area'));
});

test('weights lab exposes lasso selection and marks weighted observations', () => {
  const root = mountLab('weighted-least-squares');
  const figure = root.children[4].children[0];
  const surface = descendants(figure).find(item => item.className === 'lasso-surface');
  assert.ok(surface);
  assert.equal(figure._labPointNodes.filter(point => point.classList.contains('is-selected')).length, 3);
  const first = figure._labPointNodes[0].attributes;
  const x = Number(first.cx); const y = Number(first.cy);
  surface.listeners.pointerdown({ clientX: x - 12, clientY: y - 12 });
  surface.listeners.pointermove({ clientX: x + 12, clientY: y - 12 });
  surface.listeners.pointermove({ clientX: x + 12, clientY: y + 12 });
  surface.listeners.pointermove({ clientX: x - 12, clientY: y + 12 });
  surface.listeners.pointerup({ clientX: x - 12, clientY: y - 12 });
  const selectedAfterLasso = root.children[4].children[0]._labPointNodes.filter(point => point.classList.contains('is-selected'));
  assert.equal(selectedAfterLasso.length, 1);
});

const descendants = node => [node, ...(node.children || []).flatMap(descendants)];
const fingerprint = node => JSON.stringify({
  tag: node && node.tagName,
  className: node && node.className,
  attrs: node && node.attributes,
  text: node && node.textContent,
  html: node && node.innerHTML,
  children: node && node.children ? node.children.map(fingerprint) : []
});
const outputFingerprint = root => [4, 5, 6].map(index => fingerprint(root.children[index])).join('|');

test('each enabled primary control changes its lab output', () => {
  const labIds = Object.keys(map.labs).filter(id => id !== 'model-studio');
  for (const id of labIds) {
    const probe = mountLab(id);
    const controlCount = descendants(probe.children[2]).filter(item => item.tagName === 'input' || item.tagName === 'select').length;
    for (let controlIndex = 0; controlIndex < controlCount; controlIndex += 1) {
      const root = mountLab(id);
      const fields = descendants(root.children[2]).filter(item => item.tagName === 'input' || item.tagName === 'select');
      const field = fields[controlIndex];
      if (field.disabled) continue;
      const before = outputFingerprint(root);
      if (field.tagName === 'select') {
        const current = field.children.find(option => option.selected);
        const alternate = field.children.find(option => option !== current);
        field.value = alternate.attributes.value;
        field.listeners.change();
      } else if (field.attributes.type === 'checkbox') {
        field.checked = !field.checked;
        field.listeners.change();
      } else {
        const current = Number(field.attributes.value);
        const min = Number(field.attributes.min);
        const max = Number(field.attributes.max);
        field.value = String(Math.abs(current - max) > 1e-9 ? max : min);
        field.listeners.input();
      }
      assert.notEqual(outputFingerprint(root), before, `${id} control ${controlIndex + 1} should change the output`);
    }
  }
});
