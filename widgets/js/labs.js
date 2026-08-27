/* Shared OJS runtime for the 161.251 concept labs.
 *
 * The pages import mountLab() from OJS cells. The implementation deliberately
 * uses native controls and SVG so every visual state has a keyboard and text
 * equivalent.
 */

const LABS = {
  'model-studio': {
    title: 'Regression Model Studio',
    description: 'Change the data-generating model and see how the fitted line, residual variation, and sampling information respond.'
  },
  'diagnostics-influence': {
    title: 'Diagnostics and Influence',
    description: 'Introduce one model problem at a time and inspect the diagnostic evidence.'
  },
  'prediction-uncertainty': {
    title: 'Prediction and Uncertainty',
    description: 'Compare uncertainty about a mean response with uncertainty about a new individual observation.'
  },
  'partial-effects': {
    title: 'Multiple Regression and Partial Effects',
    description: 'Separate a predictor’s marginal relationship from its adjusted contribution.'
  },
  'f-tests': {
    title: 'Sums of Squares and F Tests',
    description: 'Compare fit improvement with parameter cost.'
  },
  'matrix-geometry': {
    title: 'Matrix and Projection Geometry',
    description: 'See fitted values as projections and collinearity as collapsing geometric area.'
  },
  'curve-bases': {
    title: 'Curve and Basis Workbench',
    description: 'Compare several ways to represent a nonlinear mean function.'
  },
  'factor-models': {
    title: 'Factor Models and Comparisons',
    description: 'Connect group means, indicators, constraints, and multiple comparisons.'
  },
  'factorial-interactions': {
    title: 'Factorial Design and Interactions',
    description: 'See how balance and interactions change a factorial model.'
  },
  'general-linear-models': {
    title: 'General Linear Model Lines',
    description: 'Choose which slopes and intercepts a factor-covariate model can have.'
  },
  'selection-shrinkage': {
    title: 'Selection, Collinearity, and Shrinkage',
    description: 'Explore the bias-variance trade-off and coefficient stabilisation.'
  },
  'weighted-least-squares': {
    title: 'Weights and Precision',
    description: 'Give more influence to observations carrying more information.'
  },
  'time-regression': {
    title: 'Time-Indexed Regression',
    description: 'Build mean structure first, then investigate dependent errors.'
  },
  'r-object-lab': {
    title: 'R Object and Indexing Lab',
    description: 'Trace a safe set of basic R expressions.'
  },
  'transformations-nonlinear': {
    title: 'Transformations and Nonlinear Fitting',
    description: 'Distinguish changing the scale from changing the fitting algorithm.'
  }
};

const DATA_FILES = {
  pulse: { file: 'pulse.csv', x: ['height'], y: ['pulse'], label: 'Pulse and height' },
  hills: { file: 'hills.csv', x: ['dist'], y: ['time'], label: 'Scottish hill races' },
  boiling: { file: 'boiling.csv', x: ['pressure'], y: ['bpt', 'boiling'], label: 'Boiling point' },
  climate: { file: 'climate.csv', x: ['Lat', 'lat'], y: ['MnJlyTemp', 'mnjlytemp'], label: 'New Zealand climate' },
  everest: { file: 'Everest.csv', x: ['Year'], y: ['Fatalities'], label: 'Everest fatalities' },
  caffeine: { file: 'caffeine.csv', x: ['Dose', 'dose'], y: ['Taps', 'taps'], label: 'Caffeine tapping' },
  fev: { file: 'fev.csv', x: ['Age', 'age'], y: ['FEV', 'fev'], label: 'Child lung function' },
  lions: { file: 'lions.csv', x: ['Year', 'year'], y: ['Crowd', 'crowd'], label: 'Brisbane Lions crowds' },
  indianapolis: { file: 'Indianap500.csv', x: ['Year', 'year'], y: ['Speed', 'speed'], label: 'Indianapolis 500' },
  'tooth-growth': { file: 'ToothGrowth.csv', x: ['dose'], y: ['len'], label: 'Vitamin C tooth growth' },
  rats: { file: 'ratgene.csv', x: ['Rat'], y: ['Weight', 'weight'], label: 'Fostered rats' },
  cows: { file: 'cows.csv', x: ['Age', 'age'], y: ['Butterfat', 'butterfat'], label: 'Dairy cattle' },
  ratdiet: { file: 'ratdiet.csv', x: ['Amount', 'amount'], y: ['Gain', 'gain'], label: 'Rat diet' },
  samara: { file: 'samara.csv', x: ['Load', 'load'], y: ['Velocity', 'velocity'], label: 'Samara' },
  simulation1: { file: 'simulation1.csv', x: ['A', 'a'], y: ['Yield', 'yield'], label: 'Selection simulation' },
  electric: { file: 'electric.csv', x: ['Area', 'area'], y: ['Bill', 'bill'], label: 'Electricity bills' },
  cps5: { file: 'CPS5grouped.csv', x: ['EDgroup', 'ED', 'ed'], y: ['AvWage', 'WG', 'wg'], label: 'Grouped CPS5 wages' },
  swim: { file: 'swim.csv', x: ['Shirt'], y: ['Time'], label: 'Swimming times' },
  'ski-sales': { file: 'SkiSales.csv', x: ['PDI', 'pdi'], y: ['Sales', 'sales'], label: 'Ski sales' },
  electricity: { file: 'Electricity.csv', x: ['Time', 'time'], y: ['Bill', 'bill'], label: 'Electricity bills over time' },
  'money-stock': { file: 'MoneyStock.csv', x: ['MoneyStk', 'moneystk'], y: ['ConsExp', 'consexp'], label: 'Money stock and expenditure' },
  tourism: { file: 'motel.csv', x: ['Time', 'time'], y: ['RoomNights', 'roomnights'], label: 'Victoria tourism' },
  wind: { file: 'TenMinuteWinds.csv', x: ['TenMinEarlier', 'SpeedLag', 'speedlag'], y: ['Speed', 'speed'], label: 'Manawatu wind' },
  onions: { file: 'Onions.csv', x: ['density'], y: ['yield'], label: 'Onions' },
  manhours: { file: 'Manhours.csv', x: ['Cases', 'cases'], y: ['ManHours', 'manhours'], label: 'Hospital manhours' },
  seoul: { file: 'seoul_bike_daily.csv', x: ['mean_temperature', 'temperature', 'Temperature'], y: ['rented_bike_count', 'RentedBikeCount'], label: 'Seoul Bike daily' }
};

const number = function (value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const fmt = function (value, digits) {
  if (!Number.isFinite(value)) return '—';
  const d = digits === undefined ? 2 : digits;
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: d,
    minimumFractionDigits: d
  });
};

const esc = function (value) {
  return String(value).replace(/[&<>"']/g, function (char) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
  });
};

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set(['svg', 'title', 'desc', 'line', 'text', 'path', 'circle', 'rect', 'polygon', 'polyline']);

const node = function (tag, attrs, children) {
  const isSvg = SVG_TAGS.has(tag);
  const item = isSvg ? document.createElementNS(SVG_NAMESPACE, tag) : document.createElement(tag);
  Object.entries(attrs || {}).forEach(function (entry) {
    const key = entry[0];
    const value = entry[1];
    if (value === undefined || value === null) return;
    if (key === 'class') item.setAttribute('class', value);
    else if (key === 'text') item.textContent = value;
    else if (key === 'html') item.innerHTML = value;
    else if (key === 'checked') item.checked = Boolean(value);
    else item.setAttribute(key, value);
  });
  (children || []).forEach(function (child) {
    if (child !== null && child !== undefined) item.append(child.nodeType ? child : document.createTextNode(String(child)));
  });
  return item;
};

const seeded = function (seed) {
  let state = (Number(seed) >>> 0) || 12345;
  return function () {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const normal = function (random) {
  const u = Math.max(random(), 1e-12);
  const v = Math.max(random(), 1e-12);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const quantile = function (values, p) {
  const sorted = values.slice().sort(function (a, b) { return a - b; });
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (position - lower) * (sorted[upper] - sorted[lower]);
};

const mean = function (values) {
  return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
};

const makePoints = function (n, intercept, slope, sigma, seed, issue, severity) {
  const random = seeded(seed);
  const strength = Math.max(0, number(severity, 1));
  const points = [];
  let previousError = 0;
  for (let i = 0; i < n; i += 1) {
    const x = -2.8 + 5.6 * i / Math.max(1, n - 1);
    let spread = sigma;
    let expected = intercept + slope * x;
    const position = i / Math.max(1, n - 1);
    if (issue === 'curvature') expected += 0.62 * strength * (x * x - 2.7);
    if (issue === 'fan') spread = sigma * Math.max(0.15, 1 + strength * (1.5 * position - 0.6));
    let error;
    if (issue === 'autocorrelation') {
      const phi = Math.min(0.96, 0.15 + 0.75 * strength);
      error = phi * previousError + sigma * Math.sqrt(1 - phi * phi) * normal(random);
      previousError = error;
    } else {
      error = spread * normal(random);
    }
    points.push({ x: x, y: expected + error, expected: expected, error: error });
  }
  if (issue === 'outlier') {
    const index = Math.floor(n * 0.78);
    points[index].y += sigma * (2.5 + 3.5 * strength);
  }
  return points;
};

const ols = function (points, weightKey) {
  let sw = 0; let sx = 0; let sy = 0; let sxx = 0; let sxy = 0;
  points.forEach(function (p) {
    const w = weightKey ? Math.max(0.01, number(p[weightKey], 1)) : 1;
    sw += w; sx += w * p.x; sy += w * p.y; sxx += w * p.x * p.x; sxy += w * p.x * p.y;
  });
  const denominator = sw * sxx - sx * sx || 1e-12;
  const slope = (sw * sxy - sx * sy) / denominator;
  const intercept = (sy - slope * sx) / sw;
  const fitted = points.map(function (p) { return intercept + slope * p.x; });
  const residuals = points.map(function (p, i) { return p.y - fitted[i]; });
  const rss = points.reduce(function (sum, p, i) {
    const w = weightKey ? Math.max(0.01, number(p[weightKey], 1)) : 1;
    return sum + w * residuals[i] * residuals[i];
  }, 0);
  const ybar = sy / sw;
  const tss = points.reduce(function (sum, p) {
    const w = weightKey ? Math.max(0.01, number(p[weightKey], 1)) : 1;
    return sum + w * (p.y - ybar) * (p.y - ybar);
  }, 0);
  return { intercept: intercept, slope: slope, fitted: fitted, residuals: residuals, rss: rss, tss: tss, r2: 1 - rss / Math.max(tss, 1e-12), n: sw };
};

const extent = function (values, padding) {
  const low = Math.min.apply(null, values);
  const high = Math.max.apply(null, values);
  const span = Math.max(high - low, 1);
  const pad = span * (padding === undefined ? 0.1 : padding);
  return [low - pad, high + pad];
};

const expandedDomain = function (values, baseLow, baseHigh) {
  const low = Math.min(baseLow, Math.min.apply(null, values));
  const high = Math.max(baseHigh, Math.max.apply(null, values));
  if (low === baseLow && high === baseHigh) return [baseLow, baseHigh];
  const pad = Math.max(0.4, (high - low) * 0.07);
  return [low - pad, high + pad];
};

const logGamma = function (z) {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  let x = 0.9999999999998099;
  const shifted = z - 1;
  coefficients.forEach(function (coefficient, i) { x += coefficient / (shifted + i + 1); });
  const t = shifted + coefficients.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(x);
};

const betaContinuedFraction = function (a, b, x) {
  const maxIterations = 200;
  const epsilon = 3e-12;
  const tiny = 1e-300;
  const qab = a + b; const qap = a + 1; const qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < epsilon) break;
  }
  return h;
};

const regularizedBeta = function (x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const front = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) return front * betaContinuedFraction(a, b, x) / a;
  return 1 - front * betaContinuedFraction(b, a, 1 - x) / b;
};

const fUpperTail = function (value, df1, df2) {
  if (value <= 0) return 1;
  const x = df2 / (df2 + df1 * value);
  return Math.max(0, Math.min(1, regularizedBeta(x, df2 / 2, df1 / 2)));
};

const fDensity = function (value, df1, df2) {
  if (value <= 0) return 0;
  const a = df1 / 2; const b = df2 / 2;
  const logValue = a * Math.log(df1 / df2) + (a - 1) * Math.log(value) -
    (a + b) * Math.log(1 + df1 * value / df2) - (logGamma(a) + logGamma(b) - logGamma(a + b));
  return Math.exp(logValue);
};

const csvRows = function (text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(function (x) { return x.trim().replace(/^"|"$/g, ''); });
  return lines.slice(1).map(function (line) {
    const cells = line.split(',').map(function (x) { return x.trim().replace(/^"|"$/g, ''); });
    const row = {};
    headers.forEach(function (h, i) { row[h] = cells[i]; });
    return row;
  });
};

const findColumn = function (rows, candidates) {
  if (!rows.length) return null;
  const names = Object.keys(rows[0]);
  for (const candidate of candidates || []) {
    const found = names.find(function (name) { return name.toLowerCase() === candidate.toLowerCase(); });
    if (found) return found;
  }
  return names.find(function (name) {
    return rows.filter(function (row) { return Number.isFinite(Number(row[name])); }).length > rows.length * 0.8;
  }) || null;
};

const dataFor = async function (dataset) {
  const spec = DATA_FILES[dataset];
  if (!spec) return null;
  try {
    const url = new URL('../../data/' + spec.file, document.baseURI);
    const response = await fetch(url.href);
    if (!response.ok) return null;
    const rows = csvRows(await response.text());
    const xColumn = findColumn(rows, spec.x);
    const yColumn = findColumn(rows, spec.y);
    if (!xColumn || !yColumn) return null;
    const points = rows.map(function (row) {
      return { x: Number(row[xColumn]), y: Number(row[yColumn]) };
    }).filter(function (p) { return Number.isFinite(p.x) && Number.isFinite(p.y); });
    return points.length > 4 ? points : null;
  } catch (error) {
    return null;
  }
};

const query = function () {
  return new URLSearchParams(window.location.search);
};

const input = function (label, value, min, max, step, onChange, type) {
  const id = 'lab-' + Math.random().toString(36).slice(2);
  const control = node('div', { class: 'lab-control' });
  const labelNode = node('label', { for: id, text: label });
  const controlType = type || 'range';
  const field = node('input', { id: id, type: controlType, min: min, max: max, step: step, value: value });
  const output = node('output', { for: id, text: String(value) });
  field.addEventListener('input', function () {
    output.textContent = field.value;
    onChange(number(field.value, value));
  });
  control.append(labelNode, field, output);
  return { root: control, field: field, output: output };
};

const select = function (label, values, selected, onChange) {
  const id = 'lab-' + Math.random().toString(36).slice(2);
  const control = node('div', { class: 'lab-control' });
  const labelNode = node('label', { for: id, text: label });
  const field = node('select', { id: id });
  values.forEach(function (value) {
    const option = node('option', { value: value.value === undefined ? value : value.value, text: value.label || value });
    if ((value.value === undefined ? value : value.value) === selected) option.selected = true;
    field.append(option);
  });
  field.addEventListener('change', function () { onChange(field.value); });
  control.append(labelNode, field);
  return { root: control, field: field };
};

const checkbox = function (label, checked, onChange) {
  const id = 'lab-' + Math.random().toString(36).slice(2);
  const control = node('div', { class: 'lab-control lab-check-control' });
  const field = node('input', { id: id, type: 'checkbox', checked: checked });
  const labelNode = node('label', { for: id, text: label });
  field.addEventListener('change', function () { onChange(Boolean(field.checked)); });
  control.append(field, labelNode);
  return { root: control, field: field };
};

const button = function (label, onClick, secondary) {
  const item = node('button', { type: 'button', class: secondary ? 'secondary' : '', text: label });
  item.addEventListener('click', onClick);
  return item;
};

const svgPlot = function (points, lines, options) {
  const opts = options || {};
  const width = 760; const height = 350;
  const margin = { top: 24, right: 22, bottom: 48, left: 56 };
  const xValues = points.map(function (p) { return p.x; }).concat((lines || []).flatMap(function (line) { return line.map(function (p) { return p.x; }); }));
  const yValues = points.map(function (p) { return p.y; }).concat((lines || []).flatMap(function (line) { return line.map(function (p) { return p.y; }); }));
  const xDomain = opts.xDomain || extent(xValues, 0.08);
  const yDomain = opts.yDomain || extent(yValues, 0.12);
  const xScale = function (x) { return margin.left + (x - xDomain[0]) / (xDomain[1] - xDomain[0]) * (width - margin.left - margin.right); };
  const yScale = function (y) { return height - margin.bottom - (y - yDomain[0]) / (yDomain[1] - yDomain[0]) * (height - margin.top - margin.bottom); };
  const svg = node('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-labelledby': opts.titleId || 'plot-title' });
  const title = node('title', { id: opts.titleId || 'plot-title', text: opts.ariaLabel || 'Interactive regression plot' });
  const desc = node('desc', { text: opts.ariaDescription || 'The plot is accompanied by the exact data table below.' });
  svg.append(title, desc);
  [0, 0.25, 0.5, 0.75, 1].forEach(function (fraction) {
    const x = margin.left + fraction * (width - margin.left - margin.right);
    const y = height - margin.bottom - fraction * (height - margin.top - margin.bottom);
    svg.append(node('line', { x1: x, y1: margin.top, x2: x, y2: height - margin.bottom, class: 'grid' }));
    svg.append(node('line', { x1: margin.left, y1: y, x2: width - margin.right, y2: y, class: 'grid' }));
    svg.append(node('text', { x: x, y: height - margin.bottom + 18, 'text-anchor': 'middle', class: 'tick-label', text: fmt(xDomain[0] + fraction * (xDomain[1] - xDomain[0]), 1) }));
    svg.append(node('text', { x: margin.left - 8, y: y + 4, 'text-anchor': 'end', class: 'tick-label', text: fmt(yDomain[0] + fraction * (yDomain[1] - yDomain[0]), 1) }));
  });
  svg.append(node('line', { x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom, class: 'axis' }));
  svg.append(node('line', { x1: margin.left, y1: margin.top, x2: margin.left, y2: height - margin.bottom, class: 'axis' }));
  svg.append(node('text', { x: width / 2, y: height - 8, 'text-anchor': 'middle', text: opts.xLabel || 'x' }));
  const yLabel = node('text', { x: 15, y: height / 2, 'text-anchor': 'middle', transform: 'rotate(-90 15 ' + height / 2 + ')', text: opts.yLabel || 'y' });
  svg.append(yLabel);
  const residualNodes = [];
  if (opts.residuals) {
    points.forEach(function (p, i) {
      const residual = node('line', {
        x1: xScale(p.x), y1: yScale(p.y),
        x2: xScale(p.x), y2: yScale(opts.residuals[i]),
        class: 'residual', 'data-row-index': i,
        'aria-label': 'Residual for observation ' + (i + 1) + ': ' + fmt(p.y - opts.residuals[i])
      });
      residualNodes.push(residual);
      svg.append(residual);
    });
  }
  (lines || []).forEach(function (line, lineIndex) {
    const pathData = line.map(function (p, i) { return (i ? 'L' : 'M') + xScale(p.x) + ' ' + yScale(p.y); }).join(' ');
    const lineClass = opts.lineClasses && opts.lineClasses[lineIndex] ? opts.lineClasses[lineIndex] : (lineIndex === 0 ? 'fit' : 'fit-alt');
    const lineLabel = opts.lineLabels && opts.lineLabels[lineIndex] ? opts.lineLabels[lineIndex] : 'Fitted line ' + (lineIndex + 1);
    svg.append(node('path', { d: pathData, class: lineClass, 'aria-label': lineLabel }));
  });
  const pointNodes = [];
  points.forEach(function (p, i) {
    const groupClass = p.group ? ' group-' + String(p.group).toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    const selectedClass = p.selected ? ' is-selected' : '';
    const circle = node('circle', { cx: xScale(p.x), cy: yScale(p.y), r: p.r || 4.5, class: (p.alert ? 'point alert' : 'point') + groupClass + selectedClass });
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('role', 'img');
    circle.setAttribute('data-row-index', i);
    circle.setAttribute('aria-label', 'Observation ' + (i + 1) + ': x ' + fmt(p.x) + ', y ' + fmt(p.y));
    if (opts.pointHover) {
      circle.addEventListener('mouseenter', function () { opts.pointHover(i); });
      circle.addEventListener('mouseleave', function () { opts.pointHover(-1); });
      circle.addEventListener('focus', function () { opts.pointHover(i); });
      circle.addEventListener('blur', function () { opts.pointHover(-1); });
    }
    if (opts.pointSelect) {
      circle.addEventListener('click', function () { opts.pointSelect(i); });
      circle.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          opts.pointSelect(i);
        }
      });
    }
    pointNodes.push(circle);
    svg.append(circle);
  });
  svg._labPointNodes = pointNodes;
  svg._labResidualNodes = residualNodes;
  svg._labGeometry = { width: width, height: height, margin: margin, xDomain: xDomain, yDomain: yDomain, xScale: xScale, yScale: yScale };
  return svg;
};

const table = function (rows, columns, options) {
  const opts = options || {};
  const tableNode = node('table', { class: 'lab-table' });
  const thead = node('thead'); const tr = node('tr');
  columns.forEach(function (column) { tr.append(node('th', { scope: 'col', text: column.label })); });
  thead.append(tr);
  const tbody = node('tbody');
  const rowNodes = [];
  const maxRows = opts.maxRows === undefined ? 25 : opts.maxRows;
  const visibleRows = Number.isFinite(maxRows) ? rows.slice(0, maxRows) : rows;
  visibleRows.forEach(function (row, index) {
    const rowNode = node('tr');
    if (opts.rowHover) {
      rowNode.setAttribute('tabindex', '0');
      rowNode.setAttribute('role', 'button');
      rowNode.setAttribute('aria-label', 'Observation ' + (index + 1));
      rowNode.setAttribute('data-row-index', index);
      rowNode.addEventListener('mouseenter', function () { opts.rowHover(index); });
      rowNode.addEventListener('mouseleave', function () { opts.rowHover(-1); });
      rowNode.addEventListener('focus', function () { opts.rowHover(index); });
      rowNode.addEventListener('blur', function () { opts.rowHover(-1); });
    }
    if (opts.rowSelect) {
      rowNode.addEventListener('click', function () { opts.rowSelect(index); });
      rowNode.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          opts.rowSelect(index);
        }
      });
    }
    columns.forEach(function (column) { rowNode.append(node('td', { text: column.format ? column.format(row) : String(row[column.key]) })); });
    rowNodes.push(rowNode);
    tbody.append(rowNode);
  });
  tableNode.append(thead, tbody);
  tableNode._labRowNodes = rowNodes;
  if (!opts.collapsible) return tableNode;
  const details = node('details', { class: 'lab-details' });
  const summary = node('summary', { text: opts.summary || 'Show exact values' });
  details.append(summary, tableNode);
  details._labRowNodes = rowNodes;
  return details;
};

const makeShell = function (id) {
  const meta = LABS[id];
  const root = node('section', { class: 'lab-shell', 'aria-labelledby': 'lab-title-' + id });
  const heading = node('h2', { id: 'lab-title-' + id, text: meta.title });
  const intro = node('p', { class: 'lab-help', text: meta.description });
  const controls = node('div', { class: 'lab-controls', 'aria-label': 'Lab controls' });
  const actions = node('div', { class: 'lab-actions' });
  const figure = node('div', { class: 'lab-figure', 'aria-label': 'Interactive figure' });
  const summary = node('div', { class: 'lab-summary', 'aria-live': 'polite' });
  const tableWrap = node('div', { class: 'lab-table-wrap' });
  const status = node('p', { class: 'sr-only', 'aria-live': 'polite' });
  root.append(heading, intro, controls, actions, figure, summary, tableWrap, status);
  return { root: root, controls: controls, actions: actions, figure: figure, summary: summary, tableWrap: tableWrap, status: status };
};

const render = function (shell, state, renderer) {
  const result = renderer(state);
  shell.figure.replaceChildren(result.figure);
  shell.summary.innerHTML = result.summary;
  shell.tableWrap.replaceChildren(result.table || node('p', { class: 'lab-help', text: 'The exact values are shown in the interpretation above.' }));
  shell.status.textContent = result.status || result.summary.replace(/<[^>]+>/g, '');
};

const modeValue = function (id, defaults, allowed) {
  const params = query();
  const value = params.get('mode');
  return value && (!allowed || allowed.includes(value)) ? value : defaults;
};

const renderModel = function (state) {
  if (state.view === 'groups') return renderGroupBuilder(state);
  const points = state.course || makePoints(state.n, 0.4, state.slope, state.sigma, state.seed, 'clean');
  const fit = ols(points);
  const xMin = Math.min.apply(null, points.map(function (p) { return p.x; }));
  const xMax = Math.max.apply(null, points.map(function (p) { return p.x; }));
  const line = [{ x: xMin, y: fit.intercept + fit.slope * xMin }, { x: xMax, y: fit.intercept + fit.slope * xMax }];
  let pointNodes = [];
  let residualNodes = [];
  let rowNodes = [];
  let dataTable;
  const paintHighlight = function (index) {
    const active = index >= 0 ? index : state.selectedIndex;
    pointNodes.forEach(function (item, i) { item.classList.toggle('is-highlighted', i === active); });
    residualNodes.forEach(function (item, i) { item.classList.toggle('is-highlighted', i === active); });
    rowNodes.forEach(function (item, i) { item.classList.toggle('is-highlighted', i === active); });
  };
  const selectObservation = function (index) {
    state.selectedIndex = index;
    if (dataTable) dataTable.open = true;
    paintHighlight(index);
  };
  const figure = svgPlot(points.map(function (p, i) { return Object.assign({}, p, { alert: i === state.highlight }); }), [line], {
    xLabel: 'predictor x', yLabel: 'response y',
    ariaLabel: 'Scatterplot with least-squares line and residuals',
    ariaDescription: 'The fitted line minimises squared vertical residuals. Hover or focus a point to highlight its residual and matching table row.',
    residuals: fit.fitted,
    pointHover: paintHighlight,
    pointSelect: selectObservation,
    xDomain: state.course ? undefined : [-3.3, 3.3]
  });
  pointNodes = figure._labPointNodes;
  residualNodes = figure._labResidualNodes;
  dataTable = table(points.map(function (p, i) { return { i: i + 1, x: p.x, y: p.y, fitted: fit.fitted[i], residual: fit.residuals[i] }; }), [
    { key: 'i', label: 'Row' },
    { key: 'x', label: 'x', format: function (r) { return fmt(r.x); } },
    { key: 'y', label: 'y', format: function (r) { return fmt(r.y); } },
    { key: 'fitted', label: 'Fitted', format: function (r) { return fmt(r.fitted); } },
    { key: 'residual', label: 'Residual', format: function (r) { return fmt(r.residual); } }
  ], { rowHover: paintHighlight, rowSelect: selectObservation, collapsible: true, maxRows: Infinity, summary: 'Show data rows and residuals' });
  rowNodes = dataTable._labRowNodes;
  paintHighlight(-1);
  return {
    figure: figure,
    summary: '<strong>Fitted equation:</strong> E(Y) = ' + fmt(fit.intercept) + ' + ' + fmt(fit.slope) + 'x. ' +
      '<strong>RSS:</strong> ' + fmt(fit.rss) + '; <strong>R²:</strong> ' + fmt(fit.r2 * 100, 1) + '%. ' +
      'Changing the noise changes the residual spread, while changing the slope changes the mean function.',
    table: dataTable,
    status: 'Least-squares slope ' + fmt(fit.slope) + ', residual sum of squares ' + fmt(fit.rss) + '.'
  };
};

const defaultGroupPoints = function () {
  return [
    { x: -2.6, y: -1.2, group: 'A' }, { x: -1.8, y: -0.1, group: 'A' },
    { x: -1.0, y: 0.8, group: 'A' }, { x: -0.2, y: 1.5, group: 'A' },
    { x: 0.2, y: 5.8, group: 'B' }, { x: 1.0, y: 5.2, group: 'B' },
    { x: 1.8, y: 4.5, group: 'B' }, { x: 2.6, y: 4.0, group: 'B' }
  ];
};

const renderGroupBuilder = function (state) {
  const points = state.groupPoints;
  const xDomain = expandedDomain(points.length ? points.map(function (p) { return p.x; }) : [0], -4, 4);
  const yDomain = expandedDomain(points.length ? points.map(function (p) { return p.y; }) : [0], -5, 10);
  if (points.length < 2) {
    return {
      figure: svgPlot(points, [], { xDomain: xDomain, yDomain: yDomain, xLabel: 'predictor x', yLabel: 'response y', ariaLabel: 'Grouped point builder' }),
      summary: '<strong>Add at least two points</strong> to fit a pooled regression line. Use different colours to represent groups whose mean structures may differ.',
      table: table(points.map(function (p, i) { return { i: i + 1, group: p.group, x: p.x, y: p.y }; }), [
        { key: 'i', label: 'Row' }, { key: 'group', label: 'Group' },
        { key: 'x', label: 'x', format: function (r) { return fmt(r.x); } },
        { key: 'y', label: 'y', format: function (r) { return fmt(r.y); } }
      ], { collapsible: true, maxRows: Infinity, summary: 'Show grouped data rows' }),
      status: 'Add points to begin the grouped regression.'
    };
  }
  const pooled = ols(points);
  const xMin = xDomain[0]; const xMax = xDomain[1];
  const lines = [[{ x: xMin, y: pooled.intercept + pooled.slope * xMin }, { x: xMax, y: pooled.intercept + pooled.slope * xMax }]];
  const lineClasses = ['fit'];
  const lineLabels = ['Pooled fitted line'];
  const groupFits = [];
  ['A', 'B', 'C'].forEach(function (group) {
    const subset = points.filter(function (p) { return p.group === group; });
    if (subset.length >= 2 && new Set(subset.map(function (p) { return p.x; })).size > 1) {
      const fit = ols(subset);
      groupFits.push({ group: group, fit: fit });
      lines.push([{ x: xMin, y: fit.intercept + fit.slope * xMin }, { x: xMax, y: fit.intercept + fit.slope * xMax }]);
      lineClasses.push('fit-group-' + group.toLowerCase());
      lineLabels.push('Group ' + group + ' fitted line');
    }
  });
  let pointNodes = []; let residualNodes = []; let rowNodes = []; let dataTable;
  const paintHighlight = function (index) {
    const active = index >= 0 ? index : state.selectedIndex;
    pointNodes.forEach(function (item, i) { item.classList.toggle('is-highlighted', i === active); });
    residualNodes.forEach(function (item, i) { item.classList.toggle('is-highlighted', i === active); });
    rowNodes.forEach(function (item, i) { item.classList.toggle('is-highlighted', i === active); });
  };
  const selectObservation = function (index) {
    state.selectedIndex = index;
    if (dataTable) dataTable.open = true;
    paintHighlight(index);
  };
  const figure = svgPlot(points, lines, {
    xDomain: xDomain, yDomain: yDomain, xLabel: 'predictor x', yLabel: 'response y',
    ariaLabel: 'Grouped points with pooled and group-specific regression lines',
    ariaDescription: 'Point colours identify groups. The solid red line is pooled; coloured dashed lines are fitted within groups.',
    residuals: pooled.fitted, pointHover: paintHighlight, pointSelect: selectObservation,
    lineClasses: lineClasses, lineLabels: lineLabels
  });
  pointNodes = figure._labPointNodes; residualNodes = figure._labResidualNodes;
  dataTable = table(points.map(function (p, i) {
    return { i: i + 1, group: p.group, x: p.x, y: p.y, fitted: pooled.fitted[i], residual: pooled.residuals[i] };
  }), [
    { key: 'i', label: 'Row' }, { key: 'group', label: 'Group' },
    { key: 'x', label: 'x', format: function (r) { return fmt(r.x); } },
    { key: 'y', label: 'y', format: function (r) { return fmt(r.y); } },
    { key: 'fitted', label: 'Pooled fitted', format: function (r) { return fmt(r.fitted); } },
    { key: 'residual', label: 'Pooled residual', format: function (r) { return fmt(r.residual); } }
  ], { rowHover: paintHighlight, rowSelect: selectObservation, collapsible: true, maxRows: Infinity, summary: 'Show grouped rows and pooled residuals' });
  rowNodes = dataTable._labRowNodes;
  paintHighlight(-1);
  const groupText = groupFits.map(function (item) { return 'Group ' + item.group + ' slope ' + fmt(item.fit.slope); }).join('; ');
  return {
    figure: figure,
    summary: '<strong>Pooled slope: ' + fmt(pooled.slope) + '.</strong> ' + (groupText || 'Add two distinct x values within a group to show its line.') +
      '. If group-specific lines differ from the pooled line, a single regression is off specification because group membership or an interaction is missing.',
    table: dataTable,
    status: 'Pooled slope ' + fmt(pooled.slope) + '. ' + groupText
  };
};

const renderDiagnostics = function (state) {
  const points = makePoints(40, 0.4, 0.9, state.sigma, state.seed, state.issue, state.patternStrength);
  const fit = ols(points);
  const residualPoints = points.map(function (p, i) {
    return {
      x: state.issue === 'autocorrelation' ? i + 1 : fit.fitted[i],
      y: fit.residuals[i],
      alert: state.issue === 'outlier' && Math.abs(fit.residuals[i]) > state.sigma * (1.8 + state.patternStrength)
    };
  });
  const zero = [{ x: Math.min.apply(null, residualPoints.map(function (p) { return p.x; })), y: 0 },
    { x: Math.max.apply(null, residualPoints.map(function (p) { return p.x; })), y: 0 }];
  const maxResidual = Math.max.apply(null, residualPoints.map(function (p) { return Math.abs(p.y); }));
  const residualMean = mean(fit.residuals);
  const lagNumerator = fit.residuals.slice(1).reduce(function (sum, value, i) { return sum + (value - residualMean) * (fit.residuals[i] - residualMean); }, 0);
  const lagDenominator = fit.residuals.reduce(function (sum, value) { return sum + Math.pow(value - residualMean, 2); }, 0);
  const lagCorrelation = lagNumerator / Math.max(lagDenominator, 1e-12);
  const issueText = {
    clean: 'The residuals have no intentional structure.',
    curvature: 'A curved residual pattern suggests the mean function is not linear.',
    fan: 'The widening residual spread suggests non-constant variance.',
    outlier: 'The highlighted point has an unusually large residual and may be influential.',
    autocorrelation: 'Long runs of residuals with the same sign suggest dependence over the observation order.'
  }[state.issue];
  return {
    figure: svgPlot(residualPoints, [zero], {
      xLabel: state.issue === 'autocorrelation' ? 'observation order' : 'fitted value',
      yLabel: 'residual', ariaLabel: 'Residual diagnostic plot', ariaDescription: issueText,
      xDomain: state.issue === 'autocorrelation' ? [0, points.length + 1] : undefined
    }),
    summary: '<strong>' + issueText + '</strong> Maximum absolute residual: ' + fmt(maxResidual) +
      '; lag-1 residual correlation: ' + fmt(lagCorrelation, 2) + '. Pattern strength is ' + fmt(state.patternStrength, 2) +
      '. Check the pattern, not just one threshold. A transformation, added predictor, weighted fit, or time-error model may be more appropriate depending on the failure.',
    table: table(residualPoints.map(function (p, i) { return { i: i + 1, order: i + 1, fitted: fit.fitted[i], residual: p.y }; }), [
      { key: 'i', label: 'Row' },
      { key: 'order', label: 'Order' },
      { key: 'fitted', label: 'Fitted', format: function (r) { return fmt(r.fitted); } },
      { key: 'residual', label: 'Residual', format: function (r) { return fmt(r.residual); } }
    ]),
    status: issueText
  };
};

const renderPrediction = function (state) {
  const points = makePoints(38, 0.5, 0.95, 0.65, 71, 'clean');
  const fit = ols(points);
  const xbar = mean(points.map(function (p) { return p.x; }));
  const sxx = points.reduce(function (sum, p) { return sum + (p.x - xbar) * (p.x - xbar); }, 0);
  const s = Math.sqrt(fit.rss / (points.length - 2));
  const leverage = 1 / points.length + Math.pow(state.x0 - xbar, 2) / sxx;
  const t = state.level === '99' ? 2.72 : state.level === '90' ? 1.68 : 2.03;
  const meanWidth = t * s * Math.sqrt(leverage);
  const predictionWidth = t * s * Math.sqrt(1 + leverage);
  const prediction = fit.intercept + fit.slope * state.x0;
  const vertical = [{ x: state.x0 - 0.08, y: prediction - predictionWidth }, { x: state.x0 - 0.08, y: prediction + predictionWidth }];
  const meanLine = [{ x: state.x0 + 0.08, y: prediction - meanWidth }, { x: state.x0 + 0.08, y: prediction + meanWidth }];
  const fitLine = [{ x: -5.2, y: fit.intercept + fit.slope * -5.2 }, { x: 5.2, y: fit.intercept + fit.slope * 5.2 }];
  const yDomain = extent(points.map(function (p) { return p.y; }).concat(vertical.map(function (p) { return p.y; }), fitLine.map(function (p) { return p.y; })), 0.12);
  const lines = [fitLine];
  const lineClasses = ['fit'];
  const lineLabels = ['Fitted regression line'];
  if (state.showPrediction) {
    lines.push(vertical);
    lineClasses.push('prediction-interval');
    lineLabels.push('New-observation prediction interval');
  }
  if (state.showMean) {
    lines.push(meanLine);
    lineClasses.push('mean-interval');
    lineLabels.push('Mean-response confidence interval');
  }
  return {
    figure: svgPlot(points.concat([{ x: state.x0, y: prediction, group: 'prediction', r: 6 }]), lines, {
      xLabel: 'predictor x', yLabel: 'response y', ariaLabel: 'Fitted line and prediction point',
      ariaDescription: 'At the selected predictor value, the purple interval is for a new observation and the shorter amber interval is for the mean response. Each interval can be hidden independently.',
      xDomain: [-5.5, 5.5],
      yDomain: yDomain,
      lineClasses: lineClasses,
      lineLabels: lineLabels
    }),
    summary: '<strong>Prediction at x₀ = ' + fmt(state.x0) + ':</strong> ' + fmt(prediction) +
      '. Mean-response interval half-width: ' + fmt(meanWidth) +
      '; prediction-interval half-width: ' + fmt(predictionWidth) +
      '. The prediction interval is wider because it includes new-observation error.',
    table: table([{ quantity: 'Mean response', estimate: prediction, halfWidth: meanWidth }, { quantity: 'New observation', estimate: prediction, halfWidth: predictionWidth }], [
      { key: 'quantity', label: 'Quantity' },
      { key: 'estimate', label: 'Estimate', format: function (r) { return fmt(r.estimate); } },
      { key: 'halfWidth', label: 'Half-width', format: function (r) { return fmt(r.halfWidth); } }
    ]),
    status: 'Prediction ' + fmt(prediction) + '; mean interval half-width ' + fmt(meanWidth) + '; prediction interval half-width ' + fmt(predictionWidth) + '.'
  };
};

const renderPartial = function (state) {
  const random = seeded(42);
  const points = [];
  for (let i = 0; i < 38; i += 1) {
    const x1 = -2 + 4 * i / 37;
    const x2 = state.rho * x1 + Math.sqrt(1 - state.rho * state.rho) * normal(random);
    const y = 0.3 + 1.1 * x1 + 0.8 * x2 + 0.55 * normal(random);
    points.push({ x: x1, y: y, x2: x2 });
  }
  const simple = ols(points.map(function (p) { return { x: p.x, y: p.y }; }));
  const adjusted = 1.1 + 0.8 * state.rho;
  const line = [{ x: -2.2, y: simple.intercept + simple.slope * -2.2 }, { x: 2.2, y: simple.intercept + simple.slope * 2.2 }];
  return {
    figure: svgPlot(points, [line], { xLabel: 'x₁', yLabel: 'y', ariaLabel: 'Marginal relationship between x1 and y', ariaDescription: 'The displayed line is the marginal slope. The adjusted effect is reported in text after holding x2 constant.' }),
    summary: '<strong>Marginal slope:</strong> ' + fmt(simple.slope) + '. <strong>Adjusted slope for x₁:</strong> 1.10 (the data-generating value). When x₁ and x₂ are correlated at ρ = ' + fmt(state.rho, 2) + ', the marginal slope absorbs part of x₂’s contribution. The added-variable plot removes that shared information.',
    table: table([{ quantity: 'Correlation', value: state.rho }, { quantity: 'Marginal slope', value: simple.slope }, { quantity: 'Adjusted x₁ slope', value: 1.1 }], [
      { key: 'quantity', label: 'Quantity' },
      { key: 'value', label: 'Value', format: function (r) { return fmt(r.value); } }
    ]),
    status: 'Marginal slope ' + fmt(simple.slope) + '; adjusted slope 1.10.'
  };
};

const renderF = function (state) {
  const rss0 = 120; const rss1 = Math.max(5, rss0 - state.improvement);
  const numerator = state.improvement / state.parameters;
  const denominator = rss1 / state.df;
  const f = numerator / denominator;
  const pValue = fUpperTail(f, state.parameters, state.df);
  const probabilityText = pValue < 0.0001 ? '&lt; 0.0001' : fmt(pValue, 4);
  const figure = node('div', { class: 'lab-figure-stack' });
  figure.append(
    fDistributionFigure(f, state.parameters, state.df, pValue),
    barFigure([
      { label: 'Null RSS', value: rss0, className: 'fit-alt' },
      { label: 'Extended RSS', value: rss1, className: 'fit' },
      { label: 'Improvement', value: state.improvement, className: 'point' }
    ], 'Residual sum of squares and improvement')
  );
  return {
    figure: figure,
    summary: '<strong>F(' + state.parameters + ', ' + state.df + ') = ' + fmt(f) + '; p = ' + probabilityText + '.</strong> ' +
      'The shaded right tail is P(F ≥ ' + fmt(f) + ') if the extra terms have no effect. The model reduces RSS by ' + fmt(state.improvement) +
      ' at a cost of ' + state.parameters + ' parameter(s); moving any slider changes both our location on the reference distribution and its tail probability.',
    table: table([{ name: 'Null model', rss: rss0, df: state.df + state.parameters, f: NaN, p: NaN }, { name: 'Extended versus null', rss: rss1, df: state.df, f: f, p: pValue }], [
      { key: 'name', label: 'Model' },
      { key: 'rss', label: 'RSS', format: function (r) { return fmt(r.rss); } },
      { key: 'df', label: 'Residual df', format: function (r) { return fmt(r.df, 0); } },
      { key: 'f', label: 'F', format: function (r) { return fmt(r.f); } },
      { key: 'p', label: 'p-value', format: function (r) { return r.p < 0.0001 ? '< 0.0001' : fmt(r.p, 4); } }
    ]),
    status: 'F statistic ' + fmt(f) + ' with ' + state.parameters + ' and ' + state.df + ' degrees of freedom; p-value ' + (pValue < 0.0001 ? 'less than 0.0001' : fmt(pValue, 4)) + '.'
  };
};

const fDistributionFigure = function (observed, df1, df2, pValue) {
  const width = 760; const height = 330;
  const margin = { top: 35, right: 30, bottom: 52, left: 58 };
  let referenceEnd = 1;
  while (fUpperTail(referenceEnd, df1, df2) > 0.002 && referenceEnd < 10000) referenceEnd *= 1.35;
  const xMax = Math.max(3, referenceEnd * 1.08);
  const samples = [];
  for (let i = 0; i <= 320; i += 1) {
    const x = xMax * (i + 0.35) / 320.35;
    samples.push({ x: x, y: fDensity(x, df1, df2) });
  }
  const yMax = Math.max.apply(null, samples.map(function (point) { return point.y; }));
  const xScale = function (x) { return margin.left + x / xMax * (width - margin.left - margin.right); };
  const yScale = function (y) { return height - margin.bottom - y / Math.max(yMax, 1e-12) * (height - margin.top - margin.bottom); };
  const svg = node('svg', { class: 'f-distribution', viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': 'F distribution with observed statistic and right-tail probability' });
  svg.append(node('title', { text: 'F distribution with observed F statistic and p-value' }));
  svg.append(node('desc', { text: 'The vertical line marks F equals ' + fmt(observed) + '. The right-tail probability is ' + fmt(pValue, 4) + '.' }));
  [0, 0.25, 0.5, 0.75, 1].forEach(function (fraction) {
    const x = margin.left + fraction * (width - margin.left - margin.right);
    svg.append(node('line', { x1: x, y1: margin.top, x2: x, y2: height - margin.bottom, class: 'grid' }));
    svg.append(node('text', { x: x, y: height - margin.bottom + 19, 'text-anchor': 'middle', class: 'tick-label', text: fmt(fraction * xMax, 1) }));
  });
  const curve = samples.map(function (point, i) { return (i ? 'L' : 'M') + xScale(point.x) + ' ' + yScale(point.y); }).join(' ');
  const tail = samples.filter(function (point) { return point.x >= observed; });
  if (tail.length) {
    const tailPath = 'M' + xScale(observed) + ' ' + (height - margin.bottom) + ' ' + tail.map(function (point) { return 'L' + xScale(point.x) + ' ' + yScale(point.y); }).join(' ') + ' L' + xScale(xMax) + ' ' + (height - margin.bottom) + ' Z';
    svg.append(node('path', { d: tailPath, class: 'f-tail' }));
  }
  svg.append(node('path', { d: curve, class: 'f-density' }));
  svg.append(node('line', { x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom, class: 'axis' }));
  const markerX = xScale(Math.min(observed, xMax));
  svg.append(node('line', { x1: markerX, y1: margin.top, x2: markerX, y2: height - margin.bottom, class: 'f-observed' }));
  svg.append(node('text', { x: Math.min(markerX + 8, width - 165), y: margin.top + 15, class: 'f-label', text: 'Observed F = ' + fmt(observed) + (observed > xMax ? ' (off scale)' : '') }));
  svg.append(node('text', { x: width - margin.right, y: margin.top + 37, 'text-anchor': 'end', class: 'f-probability', text: 'Right-tail p = ' + (pValue < 0.0001 ? '< 0.0001' : fmt(pValue, 4)) }));
  svg.append(node('text', { x: width / 2, y: height - 10, 'text-anchor': 'middle', text: 'F statistic under H₀' }));
  svg.append(node('text', { x: 16, y: height / 2, 'text-anchor': 'middle', transform: 'rotate(-90 16 ' + height / 2 + ')', text: 'density' }));
  return svg;
};

const barFigure = function (bars, label) {
  const width = 760; const height = 330;
  const values = bars.map(function (b) { return b.value; });
  const low = Math.min(0, Math.min.apply(null, values));
  const high = Math.max(0, Math.max.apply(null, values));
  const span = Math.max(high - low, 1e-9);
  const yScale = function (value) { return 260 - (value - low) / span * 220; };
  const baseline = yScale(0);
  const svg = node('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': label });
  svg.append(node('title', { text: label }));
  bars.forEach(function (bar, i) {
    const x = 60 + i * (width - 100) / bars.length;
    const valueY = yScale(bar.value);
    svg.append(node('rect', { x: x, y: Math.min(valueY, baseline), width: 90, height: Math.max(2, Math.abs(valueY - baseline)), class: 'bar ' + (bar.className || 'fit') }));
    svg.append(node('text', { x: x + 45, y: 302, 'text-anchor': 'middle', text: bar.label }));
    svg.append(node('text', { x: x + 45, y: bar.value >= 0 ? valueY - 8 : valueY + 16, 'text-anchor': 'middle', text: fmt(bar.value) }));
  });
  svg.append(node('line', { x1: 45, y1: baseline, x2: 720, y2: baseline, class: 'axis' }));
  return svg;
};

const renderMatrix = function (state) {
  const angle = state.angle * Math.PI / 180;
  if (state.mode === 'projection') {
    const yAngle = state.yAngle * Math.PI / 180;
    const unit = { x: Math.cos(angle), y: Math.sin(angle) };
    const response = { x: state.yLength * Math.cos(yAngle), y: state.yLength * Math.sin(yAngle) };
    const coefficient = response.x * unit.x + response.y * unit.y;
    const fitted = { x: coefficient * unit.x, y: coefficient * unit.y };
    const residual = { x: response.x - fitted.x, y: response.y - fitted.y };
    const residualLength = Math.hypot(residual.x, residual.y);
    const explained = coefficient * coefficient / Math.max(state.yLength * state.yLength, 1e-12);
    return {
      figure: projectionFigure(unit, response, fitted, residual),
      summary: '<strong>ŷ is the perpendicular projection of y onto the model space.</strong> The coefficient along this basis is ' + fmt(coefficient) +
        '; ‖e‖ = ' + fmt(residualLength) + '; geometric explained proportion = ' + fmt(100 * explained, 1) + '%. ' +
        'Rotate the model-space line or response vector: the residual remains perpendicular and y = ŷ + e.',
      table: table([
        { vector: 'y', first: response.x, second: response.y, length: state.yLength },
        { vector: 'ŷ = Hy', first: fitted.x, second: fitted.y, length: Math.abs(coefficient) },
        { vector: 'e = (I−H)y', first: residual.x, second: residual.y, length: residualLength }
      ], [
        { key: 'vector', label: 'Vector' },
        { key: 'first', label: 'Component 1', format: function (r) { return fmt(r.first); } },
        { key: 'second', label: 'Component 2', format: function (r) { return fmt(r.second); } },
        { key: 'length', label: 'Length', format: function (r) { return fmt(r.length); } }
      ]),
      status: 'Projection coefficient ' + fmt(coefficient) + '; residual length ' + fmt(residualLength) + '; fitted and residual vectors are perpendicular.'
    };
  }
  const first = { x: 2, y: 0 };
  const second = { x: 1.55 * Math.cos(angle), y: 1.55 * Math.sin(angle) };
  const determinant = first.x * second.y - first.y * second.x;
  const sine = Math.abs(Math.sin(angle));
  return {
    figure: columnSpaceFigure(first, second, state.angle),
    summary: '<strong>The shaded parallelogram has area |det(X)| = ' + fmt(Math.abs(determinant)) + '.</strong> As the predictor columns become parallel, the area collapses toward zero and their separate coefficients become unstable. ' +
      (sine < 0.12 ? 'These columns are nearly dependent: the design is close to rank deficient.' : 'The columns still span a two-dimensional space.'),
    table: table([
      { vector: 'x₁', first: first.x, second: first.y },
      { vector: 'x₂', first: second.x, second: second.y }
    ], [
      { key: 'vector', label: 'Column' },
      { key: 'first', label: 'Component 1', format: function (r) { return fmt(r.first); } },
      { key: 'second', label: 'Component 2', format: function (r) { return fmt(r.second); } }
    ]),
    status: 'Column angle ' + fmt(state.angle, 0) + ' degrees; absolute determinant ' + fmt(Math.abs(determinant)) + '.'
  };
};

const geometryBase = function (label, description) {
  const width = 760; const height = 500;
  const origin = { x: 300, y: 270 }; const scale = 78;
  const svg = node('svg', { class: 'geometry-figure', viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': label });
  svg.append(node('title', { text: label }), node('desc', { text: description }));
  svg.append(node('line', { x1: 45, y1: origin.y, x2: 555, y2: origin.y, class: 'geometry-axis' }));
  svg.append(node('line', { x1: origin.x, y1: 35, x2: origin.x, y2: 470, class: 'geometry-axis' }));
  svg.append(node('circle', { cx: origin.x, cy: origin.y, r: 3.5, class: 'geometry-origin' }));
  return { svg: svg, origin: origin, scale: scale };
};

const projectionFigure = function (unit, response, fitted, residual) {
  const base = geometryBase('Projection of response onto model space', 'The response vector splits into a fitted vector along the model space and a perpendicular residual vector.');
  const svg = base.svg; const origin = base.origin; const scale = base.scale;
  const screen = function (vector) { return { x: origin.x + scale * vector.x, y: origin.y - scale * vector.y }; };
  const yEnd = screen(response); const fitEnd = screen(fitted);
  svg.append(node('line', { x1: origin.x - unit.x * 310, y1: origin.y + unit.y * 310, x2: origin.x + unit.x * 310, y2: origin.y - unit.y * 310, class: 'model-space' }));
  svg.append(node('line', { x1: origin.x, y1: origin.y, x2: yEnd.x, y2: yEnd.y, class: 'vector-y' }));
  svg.append(node('circle', { cx: yEnd.x, cy: yEnd.y, r: 6, class: 'vector-y-point' }));
  svg.append(node('line', { x1: origin.x, y1: origin.y, x2: fitEnd.x, y2: fitEnd.y, class: 'vector-fit' }));
  svg.append(node('circle', { cx: fitEnd.x, cy: fitEnd.y, r: 5, class: 'vector-fit-point' }));
  svg.append(node('line', { x1: fitEnd.x, y1: fitEnd.y, x2: yEnd.x, y2: yEnd.y, class: 'vector-residual' }));
  const residualSign = residual.x * (-unit.y) + residual.y * unit.x >= 0 ? 1 : -1;
  const corner = [
    { x: fitted.x + unit.x * 0.18, y: fitted.y + unit.y * 0.18 },
    { x: fitted.x + unit.x * 0.18 - unit.y * residualSign * 0.18, y: fitted.y + unit.y * 0.18 + unit.x * residualSign * 0.18 },
    { x: fitted.x - unit.y * residualSign * 0.18, y: fitted.y + unit.x * residualSign * 0.18 }
  ].map(screen);
  svg.append(node('polyline', { points: corner.map(function (point) { return point.x + ',' + point.y; }).join(' '), class: 'right-angle' }));
  svg.append(node('text', { x: yEnd.x + 10, y: yEnd.y - 8, class: 'vector-label', text: 'y' }));
  svg.append(node('text', { x: fitEnd.x + 10, y: fitEnd.y + 18, class: 'vector-label', text: 'ŷ = Hy' }));
  svg.append(node('text', { x: (fitEnd.x + yEnd.x) / 2 + 9, y: (fitEnd.y + yEnd.y) / 2, class: 'vector-label', text: 'e' }));
  svg.append(node('text', { x: 585, y: 105, class: 'geometry-legend model-space-text', text: 'model space C(X)' }));
  svg.append(node('text', { x: 585, y: 140, class: 'geometry-legend vector-y-text', text: 'response y' }));
  svg.append(node('text', { x: 585, y: 175, class: 'geometry-legend vector-fit-text', text: 'fitted ŷ' }));
  svg.append(node('text', { x: 585, y: 210, class: 'geometry-legend vector-residual-text', text: 'residual e' }));
  return svg;
};

const columnSpaceFigure = function (first, second, angle) {
  const base = geometryBase('Predictor columns and spanned area', 'Two predictor columns form a parallelogram whose area collapses as the columns become collinear.');
  const svg = base.svg; const origin = base.origin; const scale = base.scale;
  const screen = function (vector) { return { x: origin.x + scale * vector.x, y: origin.y - scale * vector.y }; };
  const firstEnd = screen(first); const secondEnd = screen(second);
  const sumEnd = screen({ x: first.x + second.x, y: first.y + second.y });
  svg.append(node('polygon', { points: [origin, firstEnd, sumEnd, secondEnd].map(function (point) { return point.x + ',' + point.y; }).join(' '), class: 'column-area' }));
  svg.append(node('line', { x1: origin.x, y1: origin.y, x2: firstEnd.x, y2: firstEnd.y, class: 'column-one' }));
  svg.append(node('line', { x1: origin.x, y1: origin.y, x2: secondEnd.x, y2: secondEnd.y, class: 'column-two' }));
  svg.append(node('line', { x1: firstEnd.x, y1: firstEnd.y, x2: sumEnd.x, y2: sumEnd.y, class: 'column-copy' }));
  svg.append(node('line', { x1: secondEnd.x, y1: secondEnd.y, x2: sumEnd.x, y2: sumEnd.y, class: 'column-copy' }));
  svg.append(node('circle', { cx: firstEnd.x, cy: firstEnd.y, r: 6, class: 'column-one-point' }));
  svg.append(node('circle', { cx: secondEnd.x, cy: secondEnd.y, r: 6, class: 'column-two-point' }));
  svg.append(node('text', { x: firstEnd.x + 8, y: firstEnd.y + 18, class: 'vector-label', text: 'x₁' }));
  svg.append(node('text', { x: secondEnd.x + 8, y: secondEnd.y - 8, class: 'vector-label', text: 'x₂' }));
  svg.append(node('text', { x: 575, y: 125, class: 'geometry-callout', text: 'column angle = ' + fmt(angle, 0) + '°' }));
  svg.append(node('text', { x: 575, y: 165, class: 'geometry-callout', text: 'area = |det(X)|' }));
  svg.append(node('text', { x: 575, y: 205, class: 'geometry-callout', text: 'area → 0 means' }));
  svg.append(node('text', { x: 575, y: 228, class: 'geometry-callout', text: 'collinearity' }));
  return svg;
};

const renderCurves = function (state) {
  const points = [];
  const lines = [[], []];
  for (let i = 0; i < 45; i += 1) {
    const x = -2.8 + 5.6 * i / 44;
    const truth = 0.3 + 0.8 * x - 0.22 * x * x + 0.055 * x * x * x;
    const y = truth + 0.35 * normal(seeded(700 + i));
    points.push({ x: x, y: y });
    let selected;
    if (state.basis === 'piecewise') {
      const knotEffect = 0.35 + state.degree * 0.08;
      selected = 0.15 + 0.35 * x + knotEffect * Math.max(0, x + 0.8) - knotEffect * 0.75 * Math.max(0, x - 0.9);
    } else if (state.basis === 'natural spline') {
      const boundaryWeight = Math.max(0, 1 - Math.pow(Math.abs(x) / 3.1, 3));
      selected = 0.3 + 0.8 * x - 0.22 * x * x + 0.055 * x * x * x * boundaryWeight * Math.min(1, state.degree / 3);
    } else if (state.basis === 'loess') {
      const smooth = 0.3 + 0.8 * x - 0.22 * x * x;
      selected = (1 - state.span) * truth + state.span * smooth + (1 - state.span) * 0.08 * Math.sin(4 * x);
    } else {
      selected = 0.3 + 0.8 * x;
      if (state.degree >= 2) selected -= 0.22 * x * x;
      if (state.degree >= 3) selected += 0.055 * x * x * x;
      if (state.degree >= 4) selected += (state.degree - 3) * 0.004 * (Math.pow(x, 4) - 12);
    }
    lines[0].push({ x: x, y: truth });
    lines[1].push({ x: x, y: selected });
  }
  const basisExplanation = state.basis === 'orthogonal'
    ? 'Orthogonal and raw polynomial coordinates give the same fitted curve at the same degree; only coefficient stability changes.'
    : state.basis === 'loess'
      ? 'A larger LOESS span produces a smoother, less local curve.'
      : state.basis === 'piecewise'
        ? 'Piecewise regression joins linear segments at knots.'
        : state.basis === 'natural spline'
          ? 'A natural spline becomes linear toward the boundaries.'
          : 'Raw powers become increasingly flexible and can be unstable near the boundaries.';
  return {
    figure: svgPlot(points, lines, {
      xLabel: 'x', yLabel: 'mean response', ariaLabel: 'Data, underlying curve, and selected curve representation',
      ariaDescription: 'The solid line is the data-generating curve and the dashed line is the selected basis or smoother.',
      xDomain: [-3.1, 3.1], lineLabels: ['Underlying curve', 'Selected ' + state.basis + ' curve']
    }),
    summary: '<strong>' + state.basis + ' model.</strong> ' + basisExplanation + ' Selected flexibility: ' + state.degree + '; LOESS span: ' + fmt(state.span, 2) + '.',
    table: table([{ quantity: 'Basis', value: state.basis }, { quantity: 'Flexibility', value: state.degree }, { quantity: 'LOESS span', value: state.span }], [
      { key: 'quantity', label: 'Setting' }, { key: 'value', label: 'Value' }
    ]),
    status: 'Curve flexibility ' + state.degree + '; basis ' + state.basis + '.'
  };
};

const renderFactor = function (state) {
  const means = [100, 100 + state.low, 100 + state.high];
  const points = [];
  const random = seeded(84);
  means.forEach(function (m, group) {
    for (let i = 0; i < 10; i += 1) points.push({ x: group + 1, y: m + normal(random) * state.spread });
  });
  const figure = factorFigure(means, points, 'Factor-level means and observations');
  return {
    figure: figure,
    summary: '<strong>Reference group: ' + state.reference + '.</strong> The fitted intercept is the reference mean; the other coefficients are differences from that mean. The overall factor test asks whether all group means are equal, while pairwise tests ask more specific questions and need multiplicity control.',
    table: table(means.map(function (value, i) { return { group: ['Zero', 'Low', 'High'][i], mean: value, effect: value - means[state.reference === 'Zero' ? 0 : 1] }; }), [
      { key: 'group', label: 'Dose' }, { key: 'mean', label: 'Mean', format: function (r) { return fmt(r.mean); } }, { key: 'effect', label: 'Difference from reference', format: function (r) { return fmt(r.effect); } }
    ]),
    status: 'Group means are ' + means.map(fmt).join(', ') + '.'
  };
};

const factorFigure = function (means, points, label) {
  const width = 760; const height = 340; const yDomain = extent(points.map(function (p) { return p.y; }), 0.12);
  const yScale = function (y) { return 285 - (y - yDomain[0]) / (yDomain[1] - yDomain[0]) * 235; };
  const svg = node('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': label });
  svg.append(node('title', { text: label }));
  ['Zero', 'Low', 'High'].forEach(function (name, i) {
    const x = 180 + i * 200;
    svg.append(node('line', { x1: x, y1: 40, x2: x, y2: 285, class: 'grid' }));
    svg.append(node('text', { x: x, y: 315, 'text-anchor': 'middle', text: name }));
    svg.append(node('line', { x1: x - 38, y1: yScale(means[i]), x2: x + 38, y2: yScale(means[i]), class: i === 0 ? 'fit' : 'fit-alt' }));
  });
  points.forEach(function (p, i) {
    svg.append(node('circle', { cx: 180 + (p.x - 1) * 200 + ((i % 5) - 2) * 7, cy: yScale(p.y), r: 4, class: 'point', 'aria-label': nameFor(i) + ' observation ' + fmt(p.y) }));
  });
  return svg;
};

const nameFor = function (i) { return ['Zero', 'Low', 'High'][Math.floor(i / 10)]; };

const renderFactorial = function (state) {
  const cells = [
    { a: 'A−', b: 'B−', mean: 100 },
    { a: 'A+', b: 'B−', mean: 100 + state.a },
    { a: 'A−', b: 'B+', mean: 100 + state.b },
    { a: 'A+', b: 'B+', mean: 100 + state.a + state.b + state.interaction }
  ];
  return {
    figure: factorialFigure(cells, 'Two-factor cell means'),
    summary: '<strong>Interaction = ' + fmt(state.interaction) + '.</strong> In an additive model, the combined cell would equal the baseline plus both main effects. The interaction is the extra departure from that additive expectation. With balanced cells, the main effects are orthogonal; with imbalance, order can affect sequential sums of squares.',
    table: table(cells, [
      { key: 'a', label: 'A' }, { key: 'b', label: 'B' }, { key: 'mean', label: 'Cell mean', format: function (r) { return fmt(r.mean); } }
    ]),
    status: 'Combined cell mean ' + fmt(cells[3].mean) + '; interaction ' + fmt(state.interaction) + '.'
  };
};

const factorialFigure = function (cells, label) {
  const width = 760; const height = 340; const svg = node('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': label });
  svg.append(node('title', { text: label }));
  const yDomain = extent(cells.map(function (cell) { return cell.mean; }), 0.2);
  const xPositions = [210, 550];
  const yScale = function (value) { return 275 - (value - yDomain[0]) / (yDomain[1] - yDomain[0]) * 225; };
  [0, 0.5, 1].forEach(function (fraction) {
    const y = 275 - fraction * 225;
    svg.append(node('line', { x1: 120, y1: y, x2: 640, y2: y, class: 'grid' }));
    svg.append(node('text', { x: 105, y: y + 4, 'text-anchor': 'end', class: 'tick-label', text: fmt(yDomain[0] + fraction * (yDomain[1] - yDomain[0]), 1) }));
  });
  const bMinus = [cells[0], cells[1]];
  const bPlus = [cells[2], cells[3]];
  [bMinus, bPlus].forEach(function (series, seriesIndex) {
    const path = 'M' + xPositions[0] + ' ' + yScale(series[0].mean) + ' L' + xPositions[1] + ' ' + yScale(series[1].mean);
    svg.append(node('path', { d: path, class: seriesIndex === 0 ? 'fit' : 'fit-alt', 'aria-label': seriesIndex === 0 ? 'B minus line' : 'B plus line' }));
    series.forEach(function (cell, i) {
      svg.append(node('circle', { cx: xPositions[i], cy: yScale(cell.mean), r: 8, class: seriesIndex === 0 ? 'point group-a' : 'point group-b', 'aria-label': cell.a + ', ' + cell.b + ', mean ' + fmt(cell.mean) }));
    });
  });
  svg.append(node('text', { x: xPositions[0], y: 310, 'text-anchor': 'middle', text: 'A−' }));
  svg.append(node('text', { x: xPositions[1], y: 310, 'text-anchor': 'middle', text: 'A+' }));
  svg.append(node('text', { x: 665, y: 75, text: 'Solid: B−' }));
  svg.append(node('text', { x: 665, y: 100, text: 'Dashed: B+' }));
  svg.append(node('text', { x: 25, y: 170, transform: 'rotate(-90 25 170)', 'text-anchor': 'middle', text: 'cell mean' }));
  return svg;
};

const renderGLM = function (state) {
  const lines = [];
  const points = [];
  const random = seeded(12);
  const hasSlope = state.model !== 'null';
  const hasGroup = state.model === 'parallel' || state.model === 'separate';
  const hasInteraction = state.model === 'separate';
  const intercepts = [100, 100 + (hasGroup ? state.interceptShift : 0)];
  const slopes = [hasSlope ? state.slope : 0, hasSlope ? state.slope + (hasInteraction ? state.slopeShift : 0) : 0];
  for (let group = 0; group < 2; group += 1) {
    for (let i = 0; i < 16; i += 1) {
      const x = -2.4 + 4.8 * i / 15;
      points.push({ x: x, y: intercepts[group] + slopes[group] * x + normal(random) * 1.5, group: group === 0 ? 'A' : 'B', alert: false });
    }
    lines.push([{ x: -2.5, y: intercepts[group] + slopes[group] * -2.5 }, { x: 2.5, y: intercepts[group] + slopes[group] * 2.5 }]);
  }
  return {
    figure: svgPlot(points, lines, {
      xLabel: 'covariate x', yLabel: 'response y', ariaLabel: 'Two group regression lines',
      ariaDescription: 'Green points and solid line are group A; purple points and dashed line are group B.',
      xDomain: [-2.8, 2.8], lineClasses: ['fit-group-a', 'fit-group-b'], lineLabels: ['Group A line', 'Group B line']
    }),
    summary: '<strong>Model: ' + state.model + '.</strong> ' + (state.model === 'separate' ? 'The interaction permits a different slope for each factor level.' : state.model === 'parallel' ? 'The slopes are constrained to be equal while intercepts differ.' : state.model === 'single' ? 'The factor is omitted, so both groups share one sloping line.' : 'The null model gives every observation the same fitted mean.') + ' Centre x when the intercept at x = 0 is not scientifically meaningful.',
    table: table([{ group: 'A', intercept: intercepts[0], slope: slopes[0] }, { group: 'B', intercept: intercepts[1], slope: slopes[1] }], [
      { key: 'group', label: 'Group' }, { key: 'intercept', label: 'Intercept', format: function (r) { return fmt(r.intercept); } }, { key: 'slope', label: 'Slope', format: function (r) { return fmt(r.slope); } }
    ]),
    status: 'Group A slope ' + fmt(slopes[0]) + '; group B slope ' + fmt(slopes[1]) + '.'
  };
};

const renderSelection = function (state) {
  const raw = [1.8, 1.2, 0.7, -0.5];
  const shrink = state.method === 'ridge' ? raw.map(function (b) { return b * 1 / (1 + state.lambda); }) : raw.map(function (b) { return Math.sign(b) * Math.max(0, Math.abs(b) - state.lambda * 0.35); });
  return {
    figure: barFigure(raw.map(function (value, i) { return { label: 'β' + (i + 1), value: shrink[i], className: Math.abs(shrink[i]) < 0.01 ? 'point' : 'fit' }; }), state.method + ' coefficients'),
    summary: '<strong>' + state.method + ' with λ = ' + fmt(state.lambda, 2) + '.</strong> Ridge shrinks all coefficients smoothly. Lasso uses a threshold and can set coefficients exactly to zero. The same penalty can improve stability without answering a causal question.',
    table: table(shrink.map(function (value, i) { return { name: 'β' + (i + 1), ols: raw[i], penalised: value }; }), [
      { key: 'name', label: 'Coefficient' }, { key: 'ols', label: 'OLS', format: function (r) { return fmt(r.ols); } }, { key: 'penalised', label: 'Penalised', format: function (r) { return fmt(r.penalised); } }
    ]),
    status: state.method + ' coefficient values ' + shrink.map(function (x) { return fmt(x); }).join(', ') + '.'
  };
};

const pointInPolygon = function (point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x; const yi = polygon[i].y;
    const xj = polygon[j].x; const yj = polygon[j].y;
    const crosses = ((yi > point.y) !== (yj > point.y)) &&
      point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || 1e-12) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
};

const enableLasso = function (svg, points, onSelection) {
  const geometry = svg._labGeometry;
  const surface = node('rect', {
    x: geometry.margin.left, y: geometry.margin.top,
    width: geometry.width - geometry.margin.left - geometry.margin.right,
    height: geometry.height - geometry.margin.top - geometry.margin.bottom,
    class: 'lasso-surface', role: 'application',
    'aria-label': 'Drag a loop around observations to select them for weighting'
  });
  const path = node('path', { class: 'lasso-path', d: '' });
  let polygon = [];
  const position = function (event) {
    const bounds = svg.getBoundingClientRect ? svg.getBoundingClientRect() : { left: 0, top: 0, width: geometry.width, height: geometry.height };
    return {
      x: (event.clientX - bounds.left) * geometry.width / Math.max(bounds.width, 1),
      y: (event.clientY - bounds.top) * geometry.height / Math.max(bounds.height, 1)
    };
  };
  const draw = function () {
    path.setAttribute('d', polygon.map(function (point, i) { return (i ? 'L' : 'M') + point.x + ' ' + point.y; }).join(' ') + (polygon.length > 2 ? ' Z' : ''));
  };
  surface.addEventListener('pointerdown', function (event) {
    polygon = [position(event)];
    if (surface.setPointerCapture && event.pointerId !== undefined) surface.setPointerCapture(event.pointerId);
    draw();
  });
  surface.addEventListener('pointermove', function (event) {
    if (!polygon.length) return;
    const next = position(event);
    const previous = polygon[polygon.length - 1];
    if (Math.hypot(next.x - previous.x, next.y - previous.y) >= 3) polygon.push(next);
    draw();
  });
  const finish = function () {
    if (polygon.length >= 3) {
      const selected = points.map(function (point, index) {
        return pointInPolygon({ x: geometry.xScale(point.x), y: geometry.yScale(point.y) }, polygon) ? index : -1;
      }).filter(function (index) { return index >= 0; });
      onSelection(selected);
    }
    polygon = [];
    path.setAttribute('d', '');
  };
  surface.addEventListener('pointerup', finish);
  surface.addEventListener('pointercancel', function () { polygon = []; path.setAttribute('d', ''); });
  svg.append(surface, path);
  svg.append(node('text', { x: geometry.margin.left + 8, y: geometry.margin.top + 16, class: 'lasso-instruction', text: 'Drag a loop around points, then change their weight' }));
};

const renderWeights = function (state) {
  const selected = new Set(state.selectedIndices);
  const points = makePoints(24, 0.4, 0.85, 0.8, 52, 'fan', 1).map(function (p, i) {
    const isSelected = selected.has(i);
    return Object.assign({}, p, { weight: isSelected ? state.selectedWeight : 1, selected: isSelected, r: isSelected ? 4.5 + Math.sqrt(state.selectedWeight) * 2.2 : 5 });
  });
  const unweighted = ols(points); const weighted = ols(points, 'weight');
  const xMin = -3; const xMax = 3;
  const figure = svgPlot(points, [
    [{ x: xMin, y: weighted.intercept + weighted.slope * xMin }, { x: xMax, y: weighted.intercept + weighted.slope * xMax }],
    [{ x: xMin, y: unweighted.intercept + unweighted.slope * xMin }, { x: xMax, y: unweighted.intercept + unweighted.slope * xMax }]
  ], {
    xLabel: 'predictor x', yLabel: 'response y', ariaLabel: 'Lasso-selected weighted and unweighted regression lines',
    ariaDescription: 'Orange-ringed observations receive the selected weight. The solid line is weighted and the dashed line is unweighted.',
    xDomain: [-3.3, 3.3], lineClasses: ['fit', 'fit-alt'], lineLabels: ['Weighted least-squares line', 'Unweighted least-squares line']
  });
  enableLasso(figure, points, state.onSelection);
  return {
    figure: figure,
    summary: '<strong>' + state.selectedIndices.length + ' observations selected; their weight is ' + fmt(state.selectedWeight, 2) + '.</strong> The weighted slope is ' + fmt(weighted.slope) +
      ' and the unweighted slope is ' + fmt(unweighted.slope) + '. Encircle a different cluster, then move the slider to see exactly which observations pull the fitted line.',
    table: table([{ model: 'OLS', intercept: unweighted.intercept, slope: unweighted.slope, selected: 0, weight: 1 }, { model: 'WLS', intercept: weighted.intercept, slope: weighted.slope, selected: state.selectedIndices.length, weight: state.selectedWeight }], [
      { key: 'model', label: 'Fit' },
      { key: 'intercept', label: 'Intercept', format: function (r) { return fmt(r.intercept); } },
      { key: 'slope', label: 'Slope', format: function (r) { return fmt(r.slope); } },
      { key: 'selected', label: 'Selected n', format: function (r) { return fmt(r.selected, 0); } },
      { key: 'weight', label: 'Selected weight', format: function (r) { return fmt(r.weight, 2); } }
    ]),
    status: state.selectedIndices.length + ' observations selected with weight ' + fmt(state.selectedWeight, 2) + '. Weighted slope ' + fmt(weighted.slope) + '; unweighted slope ' + fmt(unweighted.slope) + '.'
  };
};

const renderTime = function (state) {
  const random = seeded(33); const points = []; const fitLine = []; let previous = 0;
  for (let i = 0; i < 60; i += 1) {
    const trend = 40 + 0.18 * i;
    const season = state.harmonic * Math.sin(2 * Math.PI * i / 12);
    const innovation = Math.sqrt(Math.max(0, 1 - state.phi * state.phi)) * normal(random);
    previous = state.phi * previous + innovation;
    points.push({ x: i, y: trend + season + previous * 2 });
    fitLine.push({ x: i, y: trend + season });
  }
  const residuals = points.map(function (point, i) { return point.y - fitLine[i].y; });
  const residualMean = mean(residuals);
  const lagNumerator = residuals.slice(1).reduce(function (sum, value, i) { return sum + (value - residualMean) * (residuals[i] - residualMean); }, 0);
  const lagDenominator = residuals.reduce(function (sum, value) { return sum + Math.pow(value - residualMean, 2); }, 0);
  const lag1 = lagNumerator / Math.max(lagDenominator, 1e-12);
  return {
    figure: svgPlot(points, [fitLine], { xLabel: 'time index', yLabel: 'response', ariaLabel: 'Time-indexed response and fitted mean', ariaDescription: 'The solid line is the trend plus seasonal mean; remaining serial structure is controlled by phi.' }),
    summary: '<strong>Mean structure:</strong> linear trend plus a seasonal harmonic of amplitude ' + fmt(state.harmonic) + '. <strong>Error dependence:</strong> φ = ' + fmt(state.phi, 2) + ', producing a sample lag-1 residual correlation of ' + fmt(lag1, 2) + '. Positive φ creates runs that remain after the mean has been fitted; GLS models that covariance rather than pretending rows are independent.',
    table: table([{ quantity: 'Trend at final time', value: fitLine[fitLine.length - 1].y }, { quantity: 'Seasonal amplitude', value: state.harmonic }, { quantity: 'AR(1) phi', value: state.phi }, { quantity: 'Sample residual lag-1 correlation', value: lag1 }], [
      { key: 'quantity', label: 'Quantity' }, { key: 'value', label: 'Value', format: function (r) { return fmt(r.value); } }
    ]),
    status: 'Seasonal amplitude ' + fmt(state.harmonic) + '; AR(1) phi ' + fmt(state.phi, 2) + '.'
  };
};

const renderRObjects = function (state) {
  const examples = {
    vector: { code: 'x <- c(2, 4, 6); x + 1', output: '[1] 3 5 7', explanation: 'Vector arithmetic is element-by-element.' },
    sequence: { code: '1:5', output: '[1] 1 2 3 4 5', explanation: 'The colon operator creates a regular sequence.' },
    logical: { code: 'x <- c(2, 4, 6); x[x > 3]', output: '[1] 4 6', explanation: 'A logical index keeps only TRUE positions.' },
    frame: { code: 'df[1, 2]', output: 'The value in row 1, column 2', explanation: 'A data frame is a collection of equal-length columns.' }
  };
  const example = examples[state.example];
  return {
    figure: codeFigure(example.code, example.output),
    summary: '<strong>' + example.explanation + '</strong> R stores the result of an assignment, while a bare expression prints its value. The command shown is intentionally limited to a safe teaching example.',
    table: table([{ item: 'Expression', value: example.code }, { item: 'Result', value: example.output }], [
      { key: 'item', label: 'Item' }, { key: 'value', label: 'Value' }
    ]),
    status: example.explanation + ' Result: ' + example.output
  };
};

const codeFigure = function (code, output) {
  const pre = node('pre', { style: 'padding: 2rem; font-size: 1.1rem; white-space: pre-wrap; background: #f8f6f0; border: 1px solid #c9d3d5;', 'aria-label': 'R expression and output' });
  pre.textContent = '> ' + code + '\\n' + output;
  return pre;
};

const renderTransformations = function (state) {
  const points = []; const line = []; const fit = [];
  for (let i = 0; i < 42; i += 1) {
    const x = 0.2 + 4.8 * i / 41;
    const y = state.transform === 'log' ? Math.log(1 + 1.4 * x) : state.transform === 'sqrt' ? Math.sqrt(1.4 * x) : 1.4 * x;
    points.push({ x: x, y: y + normal(seeded(90 + i)) * 0.08 });
    line.push({ x: x, y: y });
    const nonlinear = state.transform === 'log' ? Math.exp(y) - 1 : state.transform === 'sqrt' ? y * y : y;
    fit.push({ x: x, y: nonlinear });
  }
  return {
    figure: svgPlot(points, [line], { xLabel: 'x', yLabel: state.transform + '(y)', ariaLabel: 'Transformed response and fitted relationship', ariaDescription: 'The displayed line is straight on the selected transformed scale. Back-transforming returns to the original response scale.' }),
    summary: '<strong>Response transform: ' + state.transform + '.</strong> A relationship can be linear in transformed coordinates while curved in the original units. Judge the transformation by residual behaviour and interpret predictions after back-transformation.',
    table: table([{ quantity: 'Scale', value: state.transform }, { quantity: 'Example transformed response at x = 2.5', value: points[20].y }, { quantity: 'Back-transformed fitted value', value: fit[20].y }], [
      { key: 'quantity', label: 'Quantity' }, { key: 'value', label: 'Value', format: function (r) { return typeof r.value === 'number' ? fmt(r.value) : r.value; } }
    ]),
    status: 'Transformation ' + state.transform + '; transformed fitted value ' + fmt(points[20].y) + '.'
  };
};

const setupModel = function (shell, params) {
  const state = {
    view: params.get('view') === 'groups' ? 'groups' : 'sampling', n: 32, slope: 0.9, sigma: 0.75,
    seed: number(params.get('seed'), 41), highlight: -1, selectedIndex: -1, course: null,
    groupPoints: defaultGroupPoints(), newGroup: 'A', newX: 0, newY: 0
  };
  const tabs = node('div', { class: 'lab-tabs', role: 'tablist', 'aria-label': 'Regression studio views' });
  const samplingTab = node('button', { type: 'button', role: 'tab', 'aria-selected': 'true', class: 'is-active', text: 'Sampling model' });
  const groupsTab = node('button', { type: 'button', role: 'tab', 'aria-selected': 'false', text: 'Grouped point builder' });
  tabs.append(samplingTab, groupsTab);
  const n = input('Sample size', state.n, 12, 70, 1, function (value) { state.n = value; state.course = null; state.selectedIndex = -1; render(shell, state, renderModel); });
  const slope = input('True slope', state.slope, -2, 2, 0.1, function (value) { state.slope = value; state.course = null; render(shell, state, renderModel); });
  const sigma = input('Error SD', state.sigma, 0.05, 2, 0.05, function (value) { state.sigma = value; state.course = null; render(shell, state, renderModel); });
  const group = select('Point group', ['A', 'B', 'C'], state.newGroup, function (value) { state.newGroup = value; });
  const newX = input('New point x', state.newX, -15, 15, 0.1, function (value) { state.newX = value; });
  const newY = input('New point y', state.newY, -20, 25, 0.1, function (value) { state.newY = value; });
  const samplingControls = [n.root, slope.root, sigma.root];
  const groupControls = [group.root, newX.root, newY.root];
  groupControls.forEach(function (item) { item.hidden = true; });
  shell.controls.append(tabs, ...samplingControls, ...groupControls);
  const samplingActions = node('div', { class: 'lab-action-set' });
  const groupActions = node('div', { class: 'lab-action-set' });
  samplingActions.append(
    button('Resample', function () { state.seed += 1; state.course = null; state.selectedIndex = -1; render(shell, state, renderModel); }),
    button('Reset', function () {
      state.n = 32; state.slope = 0.9; state.sigma = 0.75; state.seed = 41; state.course = null; state.selectedIndex = -1;
      n.field.value = state.n; n.output.textContent = state.n;
      slope.field.value = state.slope; slope.output.textContent = state.slope;
      sigma.field.value = state.sigma; sigma.output.textContent = state.sigma;
      render(shell, state, renderModel);
    }, true)
  );
  groupActions.hidden = true;
  groupActions.append(
    button('Add point', function () {
      state.groupPoints.push({ x: state.newX, y: state.newY, group: state.newGroup });
      state.selectedIndex = state.groupPoints.length - 1;
      render(shell, state, renderModel);
    }),
    button('Remove selected', function () {
      if (state.selectedIndex >= 0 && state.selectedIndex < state.groupPoints.length) state.groupPoints.splice(state.selectedIndex, 1);
      state.selectedIndex = -1;
      render(shell, state, renderModel);
    }, true),
    button('Clear points', function () { state.groupPoints = []; state.selectedIndex = -1; render(shell, state, renderModel); }, true),
    button('Reset groups', function () { state.groupPoints = defaultGroupPoints(); state.selectedIndex = -1; render(shell, state, renderModel); }, true)
  );
  shell.actions.append(samplingActions, groupActions);
  const showView = function (view) {
    state.view = view;
    state.selectedIndex = -1;
    const sampling = view === 'sampling';
    samplingControls.forEach(function (item) { item.hidden = !sampling; });
    groupControls.forEach(function (item) { item.hidden = sampling; });
    samplingActions.hidden = !sampling;
    groupActions.hidden = sampling;
    samplingTab.classList.toggle('is-active', sampling);
    groupsTab.classList.toggle('is-active', !sampling);
    samplingTab.setAttribute('aria-selected', sampling ? 'true' : 'false');
    groupsTab.setAttribute('aria-selected', sampling ? 'false' : 'true');
    render(shell, state, renderModel);
  };
  samplingTab.addEventListener('click', function () { showView('sampling'); });
  groupsTab.addEventListener('click', function () { showView('groups'); });
  showView(state.view);
  dataFor(params.get('dataset') || '').then(function (data) { if (data && state.view === 'sampling') { state.course = data; state.n = data.length; n.field.value = data.length; n.output.textContent = data.length; render(shell, state, renderModel); } });
};

const setupDiagnostics = function (shell, params) {
  const diagnosticPresets = { assumptions: 'clean', influence: 'outlier', remedies: 'curvature' };
  const requestedIssue = params.get('mode');
  const validIssues = ['clean', 'curvature', 'fan', 'outlier', 'autocorrelation'];
  const issueDefault = diagnosticPresets[requestedIssue] || (validIssues.includes(requestedIssue) ? requestedIssue : 'outlier');
  const state = { issue: issueDefault, sigma: 0.75, patternStrength: 1, seed: number(params.get('seed'), 44) };
  const issue = select('Problem to introduce', ['clean', 'curvature', 'fan', 'outlier', 'autocorrelation'].map(function (x) { return { value: x, label: x }; }), state.issue, function (value) { state.issue = value; render(shell, state, renderDiagnostics); });
  const errorScale = input('Background error SD', state.sigma, 0.15, 1.5, 0.05, function (value) { state.sigma = value; render(shell, state, renderDiagnostics); });
  const pattern = input('Pattern strength', state.patternStrength, 0, 1.25, 0.05, function (value) { state.patternStrength = value; render(shell, state, renderDiagnostics); });
  shell.controls.append(issue.root, errorScale.root, pattern.root);
  shell.actions.append(button('New sample', function () { state.seed += 1; render(shell, state, renderDiagnostics); }), button('Reset', function () {
    state.issue = 'outlier'; state.sigma = 0.75; state.patternStrength = 1;
    issue.field.value = state.issue;
    errorScale.field.value = state.sigma; errorScale.output.textContent = state.sigma;
    pattern.field.value = state.patternStrength; pattern.output.textContent = state.patternStrength;
    render(shell, state, renderDiagnostics);
  }, true));
  render(shell, state, renderDiagnostics);
};

const setupPrediction = function (shell) {
  const state = { x0: 0, level: '95', showMean: true, showPrediction: true };
  const x = input('Prediction x₀', state.x0, -5, 5, 0.1, function (value) { state.x0 = value; render(shell, state, renderPrediction); });
  const level = select('Confidence level', ['90', '95', '99'], state.level, function (value) { state.level = value; render(shell, state, renderPrediction); });
  const showMean = checkbox('Show CI for model mean', state.showMean, function (value) { state.showMean = value; render(shell, state, renderPrediction); });
  const showPrediction = checkbox('Show interval for new observation', state.showPrediction, function (value) { state.showPrediction = value; render(shell, state, renderPrediction); });
  shell.controls.append(x.root, level.root, showMean.root, showPrediction.root);
  shell.actions.append(button('Reset', function () {
    state.x0 = 0; state.level = '95'; state.showMean = true; state.showPrediction = true;
    x.field.value = 0; x.output.textContent = 0; level.field.value = '95';
    showMean.field.checked = true; showPrediction.field.checked = true;
    render(shell, state, renderPrediction);
  }, true));
  render(shell, state, renderPrediction);
};

const setupPartial = function (shell) {
  const state = { rho: 0.75 };
  const rho = input('Predictor correlation ρ', state.rho, -0.95, 0.95, 0.05, function (value) { state.rho = value; render(shell, state, renderPartial); });
  shell.controls.append(rho.root);
  shell.actions.append(button('Reset', function () { state.rho = 0.75; rho.field.value = 0.75; render(shell, state, renderPartial); }, true));
  render(shell, state, renderPartial);
};

const setupF = function (shell) {
  const state = { improvement: 35, parameters: 3, df: 28 };
  const improvement = input('RSS improvement', state.improvement, 1, 100, 1, function (value) { state.improvement = value; render(shell, state, renderF); });
  const parameters = input('Extra parameters', state.parameters, 1, 10, 1, function (value) { state.parameters = value; render(shell, state, renderF); });
  const df = input('Residual df', state.df, 5, 100, 1, function (value) { state.df = value; render(shell, state, renderF); });
  shell.controls.append(improvement.root, parameters.root, df.root);
  shell.actions.append(button('Reset', function () { state.improvement = 35; state.parameters = 3; state.df = 28; improvement.field.value = 35; parameters.field.value = 3; df.field.value = 28; render(shell, state, renderF); }, true));
  render(shell, state, renderF);
};

const setupMatrix = function (shell) {
  const state = { mode: modeValue('matrix-geometry', 'projection', ['operations', 'projection']), angle: 35, yAngle: 112, yLength: 2.6 };
  let mode;
  const angle = input('Model/column angle (degrees)', state.angle, 3, 177, 1, function (value) { state.angle = value; render(shell, state, renderMatrix); });
  const yAngle = input('Response-vector angle', state.yAngle, 5, 175, 1, function (value) { state.yAngle = value; render(shell, state, renderMatrix); });
  const yLength = input('Response-vector length', state.yLength, 0.5, 3, 0.1, function (value) { state.yLength = value; render(shell, state, renderMatrix); });
  const updateAvailability = function () {
    const projection = state.mode === 'projection';
    yAngle.field.disabled = !projection; yAngle.root.classList.toggle('is-disabled', !projection);
    yLength.field.disabled = !projection; yLength.root.classList.toggle('is-disabled', !projection);
  };
  mode = select('View', [{ value: 'projection', label: 'Projection: y = ŷ + e' }, { value: 'operations', label: 'Columns, rank, and collinearity' }], state.mode, function (value) {
    state.mode = value; updateAvailability(); render(shell, state, renderMatrix);
  });
  shell.controls.append(mode.root, angle.root, yAngle.root, yLength.root);
  shell.actions.append(button('Reset', function () {
    state.mode = 'projection'; state.angle = 35; state.yAngle = 112; state.yLength = 2.6;
    mode.field.value = state.mode;
    angle.field.value = state.angle; angle.output.textContent = state.angle;
    yAngle.field.value = state.yAngle; yAngle.output.textContent = state.yAngle;
    yLength.field.value = state.yLength; yLength.output.textContent = state.yLength;
    updateAvailability(); render(shell, state, renderMatrix);
  }, true));
  updateAvailability();
  render(shell, state, renderMatrix);
};

const setupCurves = function (shell) {
  const state = { degree: 3, span: 0.6, basis: 'raw' };
  const degree = input('Polynomial degree', state.degree, 1, 6, 1, function (value) { state.degree = value; render(shell, state, renderCurves); });
  const span = input('LOESS span', state.span, 0.15, 1, 0.05, function (value) { state.span = value; render(shell, state, renderCurves); });
  let basis;
  const updateAvailability = function () {
    const loess = state.basis === 'loess';
    degree.field.disabled = loess;
    span.field.disabled = !loess;
    degree.root.classList.toggle('is-disabled', loess);
    span.root.classList.toggle('is-disabled', !loess);
  };
  basis = select('Basis', ['raw', 'orthogonal', 'piecewise', 'natural spline', 'loess'], state.basis, function (value) {
    state.basis = value; updateAvailability(); render(shell, state, renderCurves);
  });
  shell.controls.append(degree.root, span.root, basis.root);
  shell.actions.append(button('Reset', function () {
    state.degree = 3; state.span = 0.6; state.basis = 'raw';
    degree.field.value = 3; degree.output.textContent = 3;
    span.field.value = 0.6; span.output.textContent = 0.6;
    basis.field.value = 'raw'; updateAvailability(); render(shell, state, renderCurves);
  }, true));
  updateAvailability();
  render(shell, state, renderCurves);
};

const setupFactor = function (shell) {
  const state = { low: 1.6, high: 3.5, spread: 2, reference: 'Zero' };
  const low = input('Low-dose effect', state.low, -5, 8, 0.1, function (value) { state.low = value; render(shell, state, renderFactor); });
  const high = input('High-dose effect', state.high, -5, 8, 0.1, function (value) { state.high = value; render(shell, state, renderFactor); });
  const spread = input('Within-group SD', state.spread, 0.2, 6, 0.1, function (value) { state.spread = value; render(shell, state, renderFactor); });
  const reference = select('Reference group', ['Zero', 'Low'], state.reference, function (value) { state.reference = value; render(shell, state, renderFactor); });
  shell.controls.append(low.root, high.root, spread.root, reference.root);
  render(shell, state, renderFactor);
};

const setupFactorial = function (shell) {
  const state = { a: 6, b: 10, interaction: 8 };
  const a = input('Main effect A', state.a, -20, 20, 1, function (value) { state.a = value; render(shell, state, renderFactorial); });
  const b = input('Main effect B', state.b, -20, 20, 1, function (value) { state.b = value; render(shell, state, renderFactorial); });
  const interaction = input('Interaction', state.interaction, -20, 20, 1, function (value) { state.interaction = value; render(shell, state, renderFactorial); });
  shell.controls.append(a.root, b.root, interaction.root);
  render(shell, state, renderFactorial);
};

const setupGLM = function (shell) {
  const glmPresets = { families: 'parallel', nested: 'separate' };
  const requestedModel = query().get('mode');
  const initialModel = glmPresets[requestedModel] || (['null', 'single', 'parallel', 'separate'].includes(requestedModel) ? requestedModel : 'parallel');
  const state = { model: initialModel, interceptShift: 8, slope: 7, slopeShift: 3 };
  let model;
  const intercept = input('Group intercept shift', state.interceptShift, -20, 20, 1, function (value) { state.interceptShift = value; render(shell, state, renderGLM); });
  const slope = input('Baseline slope', state.slope, -10, 15, 1, function (value) { state.slope = value; render(shell, state, renderGLM); });
  const slopeShift = input('Slope interaction', state.slopeShift, -10, 10, 1, function (value) { state.slopeShift = value; render(shell, state, renderGLM); });
  const updateAvailability = function () {
    const hasSlope = state.model !== 'null';
    const hasGroup = state.model === 'parallel' || state.model === 'separate';
    const hasInteraction = state.model === 'separate';
    intercept.field.disabled = !hasGroup; intercept.root.classList.toggle('is-disabled', !hasGroup);
    slope.field.disabled = !hasSlope; slope.root.classList.toggle('is-disabled', !hasSlope);
    slopeShift.field.disabled = !hasInteraction; slopeShift.root.classList.toggle('is-disabled', !hasInteraction);
  };
  model = select('Model form', ['null', 'single', 'parallel', 'separate'], state.model, function (value) {
    state.model = value; updateAvailability(); render(shell, state, renderGLM);
  });
  shell.controls.append(model.root, intercept.root, slope.root, slopeShift.root);
  updateAvailability();
  render(shell, state, renderGLM);
};

const setupSelection = function (shell) {
  const state = { method: 'ridge', lambda: 0.3 };
  const method = select('Penalty', ['ridge', 'lasso'], state.method, function (value) { state.method = value; render(shell, state, renderSelection); });
  const lambda = input('λ', state.lambda, 0, 2, 0.05, function (value) { state.lambda = value; render(shell, state, renderSelection); });
  shell.controls.append(method.root, lambda.root);
  render(shell, state, renderSelection);
};

const setupWeights = function (shell) {
  const state = { selectedWeight: 0.35, selectedIndices: [18, 22, 23], onSelection: null };
  state.onSelection = function (indices) { state.selectedIndices = indices; render(shell, state, renderWeights); };
  const weight = input('Weight for lasso selection', state.selectedWeight, 0.05, 4, 0.05, function (value) { state.selectedWeight = value; render(shell, state, renderWeights); });
  shell.controls.append(weight.root);
  shell.actions.append(
    button('Clear selection', function () { state.selectedIndices = []; render(shell, state, renderWeights); }, true),
    button('Select upper-right cluster', function () { state.selectedIndices = [18, 22, 23]; render(shell, state, renderWeights); }, true),
    button('Reset', function () {
      state.selectedWeight = 0.35; state.selectedIndices = [18, 22, 23];
      weight.field.value = state.selectedWeight; weight.output.textContent = state.selectedWeight;
      render(shell, state, renderWeights);
    }, true)
  );
  render(shell, state, renderWeights);
};

const setupTime = function (shell) {
  const state = { harmonic: 8, phi: 0.7 };
  const harmonic = input('Seasonal amplitude', state.harmonic, 0, 20, 1, function (value) { state.harmonic = value; render(shell, state, renderTime); });
  const phi = input('AR(1) φ', state.phi, -0.9, 0.9, 0.05, function (value) { state.phi = value; render(shell, state, renderTime); });
  shell.controls.append(harmonic.root, phi.root);
  render(shell, state, renderTime);
};

const setupRObjects = function (shell) {
  const state = { example: 'vector' };
  const example = select('Expression', [
    { value: 'vector', label: 'Vector arithmetic' },
    { value: 'sequence', label: 'Regular sequence' },
    { value: 'logical', label: 'Logical indexing' },
    { value: 'frame', label: 'Data-frame indexing' }
  ], state.example, function (value) { state.example = value; render(shell, state, renderRObjects); });
  shell.controls.append(example.root);
  render(shell, state, renderRObjects);
};

const setupTransformations = function (shell) {
  const state = { transform: 'log' };
  const transform = select('Response scale', ['identity', 'sqrt', 'log'], state.transform, function (value) { state.transform = value; render(shell, state, renderTransformations); });
  shell.controls.append(transform.root);
  render(shell, state, renderTransformations);
};

export const mountLab = function (id) {
  const params = query();
  const shell = makeShell(id);
  const setup = {
    'model-studio': setupModel,
    'diagnostics-influence': setupDiagnostics,
    'prediction-uncertainty': setupPrediction,
    'partial-effects': setupPartial,
    'f-tests': setupF,
    'matrix-geometry': setupMatrix,
    'curve-bases': setupCurves,
    'factor-models': setupFactor,
    'factorial-interactions': setupFactorial,
    'general-linear-models': setupGLM,
    'selection-shrinkage': setupSelection,
    'weighted-least-squares': setupWeights,
    'time-regression': setupTime,
    'r-object-lab': setupRObjects,
    'transformations-nonlinear': setupTransformations
  }[id];
  if (!setup) return node('p', { text: 'Unknown lab: ' + id });
  setup(shell, params);
  return shell.root;
};

export const mountHub = function () {
  const root = node('div', { class: 'lab-shell' });
  const filter = node('div', { class: 'lab-filter' });
  const search = node('input', { type: 'search', placeholder: 'Filter labs by name or concept', 'aria-label': 'Filter interactive labs' });
  filter.append(search);
  const grid = node('div', { class: 'lab-card-grid' });
  const cards = Object.entries(LABS).map(function (entry) {
    const id = entry[0]; const lab = entry[1];
    const card = node('article', { class: 'lab-card', 'data-search': (id + ' ' + lab.title + ' ' + lab.description).toLowerCase() });
    card.append(node('h3', { text: lab.title }), node('p', { text: lab.description }));
    const link = node('a', { href: 'labs/' + id + '.html', text: 'Open lab' });
    card.append(link);
    grid.append(card);
    return card;
  });
  search.addEventListener('input', function () {
    const value = search.value.toLowerCase().trim();
    cards.forEach(function (card) { card.hidden = value && !card.dataset.search.includes(value); });
  });
  root.append(filter, grid);
  return root;
};

// Keep the small pure numerical helpers available to the Node smoke tests. The
// page-facing API remains mountLab()/mountHub(); these exports do not require a
// browser DOM and make regressions in the teaching calculations easy to catch.
export { ols, makePoints, fUpperTail, pointInPolygon };
