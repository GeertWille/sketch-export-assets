@import 'library/sandbox.js'

var com = {};
com.geertwille = {
    type: '',
    baseDir: '',
    factors: {},
    layerVisibility: [],
    document: undefined,
    selection: undefined,

    export: function(type, factors, document, selection) {
        this.type = type;
        this.factors = factors;
        this.document = document;
        this.selection = selection;
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

        // Hide all layers except the ones we are slicing
        for (var i = 0; i < [selection count]; i++) {
            var layer = selection[i];
            // Make sure we don't get errors if no artboard exists.
            // currentPage inerits from MSLayerGroup so it's basicly the same as an artboard
            var artboard = layer.parentArtboard() ? layer.parentArtboard() : this.document.currentPage();
            this.layerVisibility = [];

            artboard.deselectAllLayers();

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
            artboard.selectLayers(selection);
        }

        // Open finder window with assets exported
        if (this.baseDir.indexOf('/res') > -1 && this.type == "android") {
            library.sandbox.openInFinder(this.baseDir);
        } else {
            library.sandbox.openInFinder(this.baseDir + "/assets");
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

            version = this.copyLayerWithFactor(slice, factor);

            // If we place the assets in the res folder don't place it in an assets/android folder
            if (this.baseDir.indexOf('/res') > -1 && this.type == "android") {
                fileName = this.baseDir + "/" + name + "/" + prefix + sliceName + suffix + ".png";
            } else {
                fileName = this.baseDir + "/assets/" + this.type + "/" + name + "/" + prefix+ sliceName + suffix + ".png";
            }

            var document = com.geertwille.document;
            [document saveArtboardOrSlice: version toFile:fileName];

            log("Saved " + fileName);
        }
    },

    copyLayerWithFactor: function(originalSlice, factor) {
        var copy  = [originalSlice duplicate],
            frame = [copy frame],
            rect  = [copy absoluteInfluenceRect]
        ;

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