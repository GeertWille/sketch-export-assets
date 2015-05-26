# sketch-export-assets

Export assets for Android, iOS, Windows Phone in Sketch.

Also check [my new sketch plugin] to export assets for iOS directly from Sketch into Xcodes assets catalog.

[my new sketch plugin]:https://github.com/GeertWille/sketch-to-xcode-assets-catalog

## Installation

The actual location of your Sketch plugins directory will vary. To open it just click on the `Reveal Plugins Folder` under the `Plugins` menu in sketch.

Run following command after going to the sketch plugins folder:

`git clone git@github.com:GeertWille/sketch-export-assets.git sketch-export-assets.sketchplugin`

OR

Create a new directory called `sketch-export-assets.sketchplugin` and place the content of this repository in it.

Once you have checked out the plugin repository into the relevant directory, you'll find the plugin functions under the Plugins menu in Sketch.

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
