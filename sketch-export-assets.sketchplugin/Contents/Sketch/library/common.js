@import 'library/sandbox.js'
@import 'library/functions.js'

var com = {};
com.geertwille = {
    type: '',
    baseDensity: 0,
    baseDir: '',
    factors: {},
    layerVisibility: [],
    document: undefined,
    selection: undefined,

    export: function(type, factors, document, selection, baseDensity) {
        this.type = type;
        this.factors = factors;
        this.document = document;
        this.selection = selection;
        this.baseDensity = baseDensity;
        this.baseDir = this.getDirFromPrompt();

        if (this.baseDir == null) {
            this.alert("Not saving any assets");
            return;
        }

        // If nothing is selected tell the user so
        if ([selection count] == 0) {
            this.document.showMessage('Please select one or more layers to export.')
            return;
        }

        if (this.baseDensity == 0) {
            this.baseDensity = this.getDensityScaleFromPrompt();
        }

        // Hide all layers except the ones we are slicing
        for (var i = 0; i < [selection count]; i++) {
            var layer = selection[i];
            // Make sure we don't get errors if no artboard exists.
            // currentPage inerits from MSLayerGroup so it's basicly the same as an artboard
            var artboard = layer.parentArtboard() ? layer.parentArtboard() : this.document.currentPage();

            artboard.deselectAllLayers();

            var layerArray = [layer];
            [artboard selectLayers:layerArray];

            // Process the slice
            this.processSlice(layer);

            // Restore selection
            artboard.selectLayers(selection);
        }

        // Open finder window with assets exported
        if (this.baseDir.indexOf('/res') > -1 && this.type == "android") {
            helpers.openInFinder(this.baseDir);
        } else {
            helpers.openInFinder(this.baseDir + "/assets");
        }
    },

    alert: function(msg) {
        var app = [NSApplication sharedApplication];
        [app displayDialog:msg];
    },

    // Let the user specify a directory
    getDirFromPrompt: function() {
        var panel = [NSOpenPanel openPanel];
        [panel setMessage:"Where do you want to place your assets?"];
        [panel setCanChooseDirectories: true];
        [panel setCanChooseFiles: false];
        [panel setCanCreateDirectories: true];
        var defaultDir = com.geertwille.document.fileURL().URLByDeletingLastPathComponent();
        [panel setDirectoryURL:defaultDir];


        if ([panel runModal] == NSOKButton) {
            var message = [panel filename];
            return message;
        }
    },

    //Let the user select design density
    getDensityScaleFromPrompt: function() {
        var folders       = helpers.readPluginPath(),
            accessory     = [[NSComboBox alloc] initWithFrame:NSMakeRect(0, 0, 200, 25)],
            alert         = [[NSAlert alloc] init],
            responseCode
        ;
        [accessory addItemsWithObjectValues:['@1x', '@2x', '@3x']];
        [accessory selectItemAtIndex: 0];

        [alert setMessageText:'Select screen density'];
        [alert addButtonWithTitle:'OK'];
        [alert setAccessoryView:accessory];

        responseCode = [alert runModal];
        var densityScale = [accessory indexOfSelectedItem] + 1;
        helpers.saveJsonToFile([NSDictionary dictionaryWithObjectsAndKeys:densityScale, @"density-scale", nil], folders.sketchPluginsPath + folders.pluginFolder + '/config.json');

        return densityScale;
    },

    processSlice: function(slice) {
            var frame = [slice frame],
            sliceName = [slice name];

        if (this.type == "android") {
            sliceName = sliceName.trim().toLowerCase().replace(/\s/,'_').replace(/-+/g,'_').replace(/[^0-9a-z_]/,'');
        }

        for (var i = 0; i < this.factors.length; i++) {
            var fileName = '',
                name     = this.factors[i].folder,
                factor   = this.factors[i].scale,
                prefix   = '',
                suffix   = '',
                version  = undefined;

            if (this.type == "android") {
                prefix = this.factors[i].prefix;
            }
            suffix = this.factors[i].suffix;

            log("Processing " + this.type + " slices: " + sliceName + " " + name + " (" + factor + ")");

            version = this.makeSliceAndResizeWithFactor(slice, factor);

            if (prefix == null) {
                prefix = ''
            }

            // If we place the assets in the res folder don't place it in an assets/android folder
            if (this.baseDir.indexOf('/res') > -1 && this.type == "android") {
                fileName = this.baseDir + "/" + name + "/" + prefix + sliceName + suffix + ".png";
            } else {
                fileName = this.baseDir + "/assets/" + this.type + "/" + name + "/" + prefix+ sliceName + suffix + ".png";
            }

            [(com.geertwille.document) saveArtboardOrSlice: version toFile:fileName];

            log("Saved " + fileName);
        }
    },

    makeSliceAndResizeWithFactor: function(layer, factor) {
        var loopLayerChildren = [[layer children] objectEnumerator],
            rect = [MSSliceTrimming trimmedRectForSlice:layer],
            useSliceLayer = false,
            slice
        ;

        // Check for MSSliceLayer and overwrite the rect if present
        while (layerChild = [loopLayerChildren nextObject]) {
            if ([layerChild class] == 'MSSliceLayer') {
                rect  = [MSSliceTrimming trimmedRectForSlice:layerChild];
                useSliceLayer = true;
            }
        }

        slice = [MSExportRequest requestWithRect:rect scale:(factor / this.baseDensity)];
        if (!useSliceLayer) {
            slice.shouldTrim = true;
        }
        // slice.saveForWeb = true;
        // slice.compression = 0;
        // slice.includeArtboardBackground = false;
        return slice;
    },

    readConfig: function() {
        var folders = helpers.readPluginPath();
        return helpers.jsonFromFile(folders.sketchPluginsPath + folders.pluginFolder + '/config.json', true);
    },

    updateBaseDensity: function() {
        this.getDensityScaleFromPrompt();
    }
}
