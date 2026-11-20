/* ==============================
   DEVICE PRESETS
   ============================== */

// Layout sizes are approximate CSS points, not physical display pixels.
// See docs/devices.md for compatibility sources and preview limits.
const iphone = [];
const ipad = [];
function add(list, names, width, height, frame = 'notch') {
  for (const name of names) {
    const ppi = list === ipad ? (name.startsWith('iPad mini') ? 326 : 264) : null;
    list.push({ id: name, name, width, height, frame, ppi });
  }
}

add(iphone, ['iPhone Duo (open)'], 890, 626, 'island');
add(iphone, ['iPhone Duo (closed)'], 466, 678, 'island');
add(iphone, ['iPhone 18 Pro Max', 'iPhone 17 Pro Max', 'iPhone 16 Pro Max'], 440, 956, 'island');
add(iphone, ['iPhone 18 Pro', 'iPhone 17 Pro', 'iPhone 17'], 402, 874, 'island');
add(iphone, ['iPhone Air'], 420, 912, 'island');
add(iphone, ['iPhone 17e', 'iPhone 16e'], 390, 844);
add(iphone, ['iPhone 16 Pro'], 402, 874, 'island');
add(iphone, ['iPhone 16 Plus', 'iPhone 15 Plus', 'iPhone 15 Pro Max', 'iPhone 14 Pro Max'], 430, 932, 'island');
add(iphone, ['iPhone 16', 'iPhone 15', 'iPhone 15 Pro', 'iPhone 14 Pro'], 393, 852, 'island');
add(iphone, ['iPhone 14 Plus', 'iPhone 13 Pro Max', 'iPhone 12 Pro Max'], 428, 926);
add(iphone, ['iPhone 14', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 12', 'iPhone 12 Pro'], 390, 844);
add(iphone, ['iPhone 13 mini', 'iPhone 12 mini'], 375, 812);
add(iphone, ['iPhone 11', 'iPhone XR'], 414, 896);
add(iphone, ['iPhone 11 Pro Max', 'iPhone XS Max'], 414, 896);
add(iphone, ['iPhone 11 Pro', 'iPhone XS', 'iPhone X'], 375, 812);
add(iphone, ['iPhone SE (3rd generation)', 'iPhone SE (2nd generation)', 'iPhone 8', 'iPhone 7', 'iPhone 6s'], 375, 667, 'home');
add(iphone, ['iPhone 8 Plus', 'iPhone 7 Plus', 'iPhone 6s Plus'], 414, 736, 'home');
add(iphone, ['iPhone SE (1st generation)'], 320, 568, 'home');

add(ipad, ['iPad Pro 13-inch (M5)', 'iPad Pro 13-inch (M4)'], 1032, 1376, 'tablet');
add(ipad, ['iPad Pro 11-inch (M5)', 'iPad Pro 11-inch (M4)'], 834, 1210, 'tablet');
add(ipad, ['iPad Air 13-inch (M4)', 'iPad Air 13-inch (M3)', 'iPad Air 13-inch (M2)'], 1024, 1366, 'tablet');
add(ipad, ['iPad Air 11-inch (M4)', 'iPad Air 11-inch (M3)', 'iPad Air 11-inch (M2)', 'iPad Air (5th generation)', 'iPad Air (4th generation)', 'iPad (A16)', 'iPad (10th generation)'], 820, 1180, 'tablet');
add(ipad, ['iPad mini (A20 Pro)'], 756, 1158, 'tablet');
add(ipad, ['iPad mini (A17 Pro)', 'iPad mini (6th generation)'], 744, 1133, 'tablet');
add(ipad, ['iPad mini (5th generation)', 'iPad mini 4'], 768, 1024, 'tablet-home');
add(ipad, ['iPad (9th generation)', 'iPad (8th generation)', 'iPad (7th generation)'], 810, 1080, 'tablet-home');
add(ipad, ['iPad (6th generation)', 'iPad (5th generation)', 'iPad Air 2', 'iPad Pro 9.7-inch'], 768, 1024, 'tablet-home');
add(ipad, ['iPad Air (3rd generation)', 'iPad Pro 10.5-inch'], 834, 1112, 'tablet-home');
add(ipad, ['iPad Pro 11-inch (4th generation)', 'iPad Pro 11-inch (3rd generation)', 'iPad Pro 11-inch (2nd generation)', 'iPad Pro 11-inch (1st generation)'], 834, 1194, 'tablet');
add(ipad, ['iPad Pro 12.9-inch (6th generation)', 'iPad Pro 12.9-inch (5th generation)', 'iPad Pro 12.9-inch (4th generation)', 'iPad Pro 12.9-inch (3rd generation)'], 1024, 1366, 'tablet');
add(ipad, ['iPad Pro 12.9-inch (2nd generation)', 'iPad Pro 12.9-inch (1st generation)'], 1024, 1366, 'tablet-home');

const naturalOrder = new Intl.Collator('en', { numeric: true });
export function deviceGroup(name) {
  if (name.startsWith('iPhone X')) return 'iPhone X';
  if (name.startsWith('iPhone')) return name.match(/^iPhone (\d+s?|SE|Air|Duo)/)?.[0] || name;
  return name.match(/^iPad (?:Pro|Air) \d+(?:\.\d+)?-inch/)?.[0]
    || name.match(/^iPad (?:Pro|Air|mini)/)?.[0] || 'iPad';
}

function phoneOrder(a, b) {
  const groupA = deviceGroup(a.name);
  const groupB = deviceGroup(b.name);
  const generation = group => group === 'iPhone Duo' ? 19 : group === 'iPhone Air' ? 17 : group === 'iPhone X' ? 10 : Number(group.match(/\d+/)?.[0]) || 0;
  const numberA = generation(groupA);
  const numberB = generation(groupB);
  if (numberA !== numberB) return numberB - numberA;
  if (groupA !== groupB) {
    const rank = group => group.includes('Duo') ? 0 : group.includes('Air') ? 1 : group.includes('SE') ? 3 : 2;
    return rank(groupA) - rank(groupB) || naturalOrder.compare(groupA, groupB);
  }
  if (groupA === 'iPhone SE') return naturalOrder.compare(b.name, a.name);
  const variant = name => name.includes('Pro Max') ? 5 : name.includes('Pro') ? 4 : name.includes('Plus') ? 3 : name.includes('mini') ? 2 : /\d+e$/.test(name) ? 1 : 0;
  return variant(a.name) - variant(b.name) || naturalOrder.compare(a.name, b.name);
}

iphone.sort(phoneOrder);
ipad.sort((a, b) => {
  const rank = name => name.startsWith('iPad Pro') ? 0 : name.startsWith('iPad Air') ? 1 : name.startsWith('iPad mini') ? 2 : 3;
  return rank(a.name) - rank(b.name)
    || naturalOrder.compare(deviceGroup(a.name), deviceGroup(b.name))
    || naturalOrder.compare(b.name, a.name);
});

export const devices = { iPhone: iphone, iPad: ipad };

/* ==============================
   UNIFORM SCREEN SCALING
   ============================== */

export function fitDevice(device, { landscape = false, availableWidth, availableHeight = Infinity, scaleLimit = 1 }) {
  const width = landscape ? device.height : device.width;
  const height = landscape ? device.width : device.height;
  const border = 4;
  const scale = Math.min(Math.max(0, availableWidth - border * 2) / width,
    Math.max(0, availableHeight - border * 2) / height, scaleLimit, 1);
  return { width, height, scale, outerWidth: width * scale + border * 2, outerHeight: height * scale + border * 2 };
}

// All tablet presets use two native pixels per layout point. Using the display
// density also accounts for a mini's smaller physical screen at similar points.
export function tabletComparisonScale(device, { landscape = false, availableWidth }) {
  const screenWidthsInches = ipad.map(model => (landscape ? model.height : model.width) * 2 / model.ppi);
  const pixelsPerInch = Math.min(Math.max(0, availableWidth - 8) / Math.max(...screenWidthsInches),
    ...ipad.map(model => model.ppi / 2));
  return pixelsPerInch * 2 / device.ppi;
}
