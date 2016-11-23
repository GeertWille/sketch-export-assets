# sketch-export-assets

Export assets for Android, iOS, Windows Phone in Sketch.

### [Sign up for an improved version of this plugin]

[Sign up for an improved version of this plugin]:http://sketchexporter.co/

<a href='https://pledgie.com/campaigns/31173'><img alt='Click here to lend your support to: Sketch plugin research and development funding and make a donation at pledgie.com !' src='https://pledgie.com/campaigns/31173.png?skin_name=chrome' border='0' ></a>

## Installation

The actual location of your Sketch plugins directory will vary. To open it just click on the `Reveal Plugins Folder` under the `Plugins` menu in sketch.

Run following command after going to the sketch plugins folder:

`git clone git@github.com:GeertWille/sketch-export-assets.git`

OR

Use [Sketch Toolbox]

Once you have checked out the plugin repository into the relevant directory, you'll find the plugin functions under the Plugins menu in Sketch.

## Configure
  - Base density

## Shortcuts

* iOS Export: ctrl + alt + shift + 1
* Android Export: ctrl + alt + shift + 2
* Windows Export: ctrl + alt + shift + 3

## Adding Padding to slices
From now on you can manually decide how big you want your exported asset to be. Just include a slicelayer in the group of that asset and it will not use the size of the group but the size of that slicelayer...

## Credits
This plugin is based on [zmaltalker's] project [sketch-android-assets]. I needed to export my assets to multiple platforms that's why I extended his project to cover other platforms.


[sketch-android-assets]:https://github.com/zmalltalker/sketch-android-assets
[zmaltalker's]:https://github.com/zmalltalker
[Sketch Toolbox]:http://sketchtoolbox.com
