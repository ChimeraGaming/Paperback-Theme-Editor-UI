# Device previews

Checked November 20, 2026.

## Compatibility sources

The [Paperback App Store listing](https://apps.apple.com/us/app/paperback-comic-manga-reader/id1626613373)
lists iOS 13.0 and iPadOS 13.0 as the minimum versions for the public release.
The listing reports version 0.8.11. This does not establish the requirements
for the 0.9 beta shown in the supplied screenshots.

The catalog includes iPhones from the 6s and first SE onward, plus compatible
iPad, Air, mini, and Pro families. Older models are included because they can
run the listed minimum OS, not because a current beta was tested on them.
iPod touch, Mac, and Vision devices are outside this selector's scope.

Sources used to identify model families:

- [Apple's iOS 13 device support](https://support.apple.com/en-us/103211)
- [Current iPhone models supported by iOS 27](https://support.apple.com/guide/iphone/iphone-models-compatible-with-ios-27-iphe3fa5df43/ios)
- [Current iPad models supported by iPadOS 27](https://support.apple.com/guide/ipad/ipad-models-compatible-with-ipados-27-ipad213a25b2/ipados)
- [Identify your iPad model](https://support.apple.com/en-us/108043)
- [iPhone Duo technical specifications](https://support.apple.com/en-us/148588)

## How the preview works

Select iPhone or iPad, then a model. Rotate preview swaps its width and height.
The choice and rotation are saved in this browser, separately from theme files.
Device choices do not change the exported colors.

Presets use approximate logical layout sizes in `src/devices.js`. They are not
a verified database of native app viewports. Models with similar layouts share
a size. Duo uses separate open and closed presets based on the published
display aspect ratios. Its logical sizes are estimates.

## Dimension and fitting checks

The model note shows the logical width and height plus the scale used to fit
the page. These are app layout points, not inches on your monitor. Browser zoom,
Display Zoom, multitasking, and safe-area settings can change the apparent size.

The iPad mini A20 Pro has a separate 756 x 1158 preset. Apple publishes
[1512 x 2316 display pixels](https://support.apple.com/en-us/149482), while the
[A17 Pro mini](https://support.apple.com/en-us/121456) uses 1488 x 2266 pixels
and a 744 x 1133 layout. They must not share dimensions.

Other reference checks include the
[11-inch M5 Pro display](https://support.apple.com/en-us/125406),
[iPhone Air](https://support.apple.com/en-us/125092),
[iPhone 17e](https://support.apple.com/en-us/126470),
[iPhone 18 Pro](https://support.apple.com/en-us/148590), and
[18 Pro Max](https://support.apple.com/en-us/148591). Physical display pixels
and logical layout points are different units. Some iPhones, including mini
and older Plus models, use display scaling, so dividing native pixels by three
does not always give the default logical viewport.

The shared fitting function uses a single scale for both axes, swaps the
logical dimensions on rotation, and allows for the frame border. Automated
checks cover all 84 presets in two orientations at three available widths,
including phone height limits and wider tablet layouts. This checks geometry;
it does not establish that Paperback renders identically on every device.

The sample screen scales uniformly within the editor panel. Selecting iPad
expands the preview column beside a narrower, scrolling color editor. The
file controls sit above the workspace. Tablet size follows available
width without a phone-height cap, so portrait models may need page scrolling.
The open iPhone Duo also uses this expanded workspace and has no phone-height
cap. Its closed display keeps the regular phone workspace.

At 920 pixels and below, the expanded workspace stacks the color controls above
the preview. Between 641 and 920 pixels, the color fields use two columns.
Smaller screens use one column. The preview receives the full available row.
This preserves differences in content density between phones and tablets. A small editor
window can make tablet text quite small. This is a layout preview, not an iOS
simulator. Text size settings, safe areas, system materials, and app-specific
device behavior may differ.

The supplied iPad title screenshots guide the split details layout, with title
information on the left and chapters on the right. The original sample title
and artwork are retained. Other iPad screens and the open Duo layout are
approximations pending screenshots or device checks.

## Comparing screen sizes

The default **Compare screen sizes** mode uses one shared display-size scale
across the iPad catalog. Mini displays use 326 pixels per inch; other listed
iPads use 264. Native screen pixels are twice the stored layout dimensions.
Converting these to screen inches prevents a high-density mini from appearing
as large as a Pro simply because it has many pixels. This compares screen area,
not enclosure size or thickness. It is not calibrated to physical inches on
your monitor.

**Fill available space** scales each model independently for readability.
Several iPads can therefore have the same on-page width in that mode.

Display-density references:

- [Mini 4: 326 ppi](https://support.apple.com/en-us/112002)
- [Mini A17 Pro: 326 ppi](https://support.apple.com/en-us/121456)
- [Mini A20 Pro: 326 ppi](https://support.apple.com/en-us/149482)
- [11-inch M5 Pro: 264 ppi](https://support.apple.com/en-us/125406)
- [13-inch M5 Pro: 264 ppi](https://support.apple.com/en-us/125407)
- [11-inch M4 Air: 264 ppi](https://support.apple.com/en-us/126471)
