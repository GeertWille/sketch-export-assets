#import 'library/sandbox.js'

var com = {};
com.geertwille = {
    type: '',
    baseDir: '',
    factors: {},
    layerVisibility: [],

    export: function(type, factors) {
        this.type = type;
        this.factors = factors;
        this.baseDir = this.getDirFromPrompt();

        if (this.baseDir == null) {
            this.alert("Not saving any assets");
            return;
        }

        // If nothing is selected tell the user so
        if ([selection count] == 0) {
            this.alert("No layer(s) selected");
            return;
        }

        // Hide all layers except the ones we are slicing
        for (var i = 0; i < [selection count]; i++) {
            var layer = [selection objectAtIndex:i];
            // Make sure we don't get errors if no artboard exists.
            // currentPage inerits from MSLayerGroup so it's basicly the same as an artboard
            var artboard = [layer parentArtboard] ? [layer parentArtboard] : [doc currentPage];
            this.layerVisibility = [];

            [artboard deselectAllLayers];

            var layerArray = [layer];
            [artboard selectLayers:layerArray];

            var root = artboard;

            this.hideLayers(root, layer);

            // Process the slice
            this.processSlice(layer);

            // Restore layers visibility
            for (var m = 0; m < this.layerVisibility.length; m++) {
                var dict = this.layerVisibility[m];
                var layer = [dict objectForKey:"layer"];
                var visibility = [dict objectForKey:"visible"];

                if (visibility == 0) {
                    [layer setIsVisible:false];
                } else {
                    [layer setIsVisible:true];
                }
            }

            // Restore selection
            [artboard selectLayers:selection];
        }

        // Open finder window with assets exported
        library.sandbox.openInFinder(this.baseDir + "/assets");
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
        var defaultDir = [[doc fileURL] URLByDeletingLastPathComponent];
        [panel setDirectoryURL:defaultDir];


        if ([panel runModal] == NSOKButton) {
            var message = [panel filename];
            return message;
        }
    },

    processSlice: function(slice) {
        var frame = [slice frame];
        var sliceName = [slice name].toLowerCase().replace(/\s/,'_').replace(/-/g,'_').replace(/[^0-9a-z_]/,'');

        for (var i = 0; i < factors.length; i++) {
            var name   = this.factors[i].folder;
            var factor = this.factors[i].scale;
            var prefix = this.factors[i].prefix;
            var suffix = this.factors[i].suffix;

            log("Processing " + this.type + " slices: " + sliceName + " " + name + " (" + factor + ")");
            var version = this.copyLayerWithFactor(slice, factor);
            var fileName = this.baseDir + "/assets/" + this.type + "/" + name + "/" + prefix+ sliceName + suffix + ".png";
            [doc saveArtboardOrSlice: version toFile:fileName];
            log("Saved " + fileName);
        }
    },

    copyLayerWithFactor: function(originalSlice, factor) {
        var copy = [originalSlice duplicate];
        var frame = [copy frame];
        var rect = [[copy absoluteRect] rect];
        slice = [MSExportRequest requestWithRect:rect scale:factor];
        [copy removeFromParent];

        return slice;
    },

    // I used this code from https://github.com/nickstamas/Sketch-Better-Android-Export
    // and has been written by Nick Stamas
    // Cheers to him :)
    // Addapted it a bit for my plugin
    hideLayers: function(root, target) {
        // Hide all layers except for selected and store visibility
        for (var k = 0; k < [[root layers] count]; k++) {
            var currentLayer = [[root layers] objectAtIndex:k];
            if ([currentLayer containsSelectedItem] && currentLayer != target) {
                this.hideLayers(currentLayer, target);
            } else if (!(currentLayer == target)) {
                var dict = [[NSMutableDictionary alloc] init];
                [dict addObject:currentLayer forKey:"layer"];
                [dict addObject:[currentLayer isVisible] forKey:"visible"];

                this.layerVisibility.push(dict);
                [currentLayer setIsVisible: false];
            }
        }
    }
}