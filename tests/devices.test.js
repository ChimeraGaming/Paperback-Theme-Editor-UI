import test from 'node:test';
import assert from 'node:assert/strict';
import { devices, fitDevice, tabletComparisonScale } from '../src/devices.js';

/* ==============================
   DEVICE FIT AND PROPORTIONS
   ============================== */

test('every device fits without stretching in either orientation', () => {
  for (const [family, models] of Object.entries(devices)) {
    assert.equal(new Set(models.map(model => model.id)).size, models.length);
    for (const device of models) {
      assert.ok(device.width > 0 && device.height > 0, device.name);
      for (const landscape of [false, true]) {
        for (const availableWidth of [280, 600, 1600]) {
          const availableHeight = family === 'iPad' ? Infinity : 650;
          const fit = fitDevice(device, { landscape, availableWidth, availableHeight });
          assert.ok(fit.scale > 0 && fit.scale <= 1, device.name);
          assert.ok(fit.outerWidth <= availableWidth + 1e-6, device.name);
          assert.ok(fit.outerHeight <= availableHeight + 1e-6, device.name);
          const screenRatio = (fit.outerWidth - 8) / (fit.outerHeight - 8);
          const expectedRatio = landscape ? device.height / device.width : device.width / device.height;
          assert.ok(Math.abs(screenRatio - expectedRatio) < 1e-9, device.name);
        }
      }
    }
  }
});

test('rotation swaps the layout dimensions without changing the model', () => {
  const device = devices.iPad.find(model => model.name === 'iPad Pro 11-inch (M5)');
  const fit = fitDevice(device, { landscape: true, availableWidth: 2000 });
  assert.equal(fit.width, 1210);
  assert.equal(fit.height, 834);
  assert.equal(device.width, 834);
  assert.equal(device.height, 1210);
});

test('new mini uses its own display dimensions instead of the older mini preset', () => {
  const newer = devices.iPad.find(model => model.name === 'iPad mini (A20 Pro)');
  const older = devices.iPad.find(model => model.name === 'iPad mini (A17 Pro)');
  // Apple publishes native 1512 x 2316 and 1488 x 2266 respectively.
  assert.equal(newer.width * 2, 1512);
  assert.equal(newer.height * 2, 2316);
  assert.equal(older.width * 2, 1488);
  assert.equal(older.height * 2, 2266);
});

test('tablet size comparison keeps a mini physically smaller than an 11-inch Pro', () => {
  const mini = devices.iPad.find(model => model.name === 'iPad mini (A17 Pro)');
  const pro = devices.iPad.find(model => model.name === 'iPad Pro 11-inch (M5)');
  for (const availableWidth of [320, 900, 2000]) {
    for (const landscape of [false, true]) {
      const options = { availableWidth, landscape };
      const small = fitDevice(mini, { ...options, scaleLimit: tabletComparisonScale(mini, options) });
      const large = fitDevice(pro, { ...options, scaleLimit: tabletComparisonScale(pro, options) });
      assert.ok(small.outerWidth < large.outerWidth);
      // Published native dimensions divided by published display density.
      const expectedRatio = landscape ? (2266 / 326) / (2420 / 264) : (1488 / 326) / (1668 / 264);
      assert.ok(Math.abs((small.outerWidth - 8) / (large.outerWidth - 8) - expectedRatio) < 1e-9);
    }
  }
});
