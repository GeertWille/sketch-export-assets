# sketch-export-assets

Export assets for Android, iOS, Windows Phone in Sketch.

Also check [my new sketch plugin] to export assets for iOS directly from Sketch into Xcodes assets catalog.

[my new sketch plugin]:https://github.com/GeertWille/sketch-to-xcode-assets-catalog

## Installation

The basic procedure is the same regardless of which version of Sketch
you're running, and how you installed it; simply check out this
repository into your Sketch plugins directory and you're good to go.

The actual location of your Sketch plugins directory will vary,
however, depending on how you installed Sketch:

* Sketch 2: not supported anymore

* If you bought Sketch 3 from the App Store, use the
  ` ~/Library/Containers/com.bohemiancoding.sketch3/Data/Library/Application Support/com.bohemiancoding.sketch3/Plugins`
  directory
* If you downloaded Sketch 3 from the Bohemian Coding site, use the
  `~/Library/Application Support/com.bohemiancoding.sketch3/Plugins`
  directory

Once you have checked out the plugin repository into the relevant
directory, you'll find the plugin functions under the Plugins menu in Sketch.

## Assumptions

The plugin assumes you design your layouts in mdpi, which means 1px = 1dp

## Shortcuts

* iOS Export: ctrl + alt + shift + 1
* Android Export: ctrl + alt + shift + 2
* Windows Export: ctrl + alt + shift + 3


## Credits
This plugin is based on [zmaltalker's] project [sketch-android-assets]. I needed to export my assets to multiple platforms that's why I extended his project to cover other platforms.


[sketch-android-assets]:https://github.com/zmalltalker/sketch-android-assets
[zmaltalker's]:https://github.com/zmalltalker
