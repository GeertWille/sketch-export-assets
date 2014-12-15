#import 'library/sandbox.js'

var com = {};
com.geertwille = {
    type: '',
    baseDir: '',
    factors: {},

    export: function(type, factors) {
        this.type = type;
        this.factors = factors;
        this.baseDir = this.getCwd();

        var fileUrl = [doc fileURL];
        if (fileUrl == null) {
            this.alert("You need to save your document for me to know where to save it");
            return;
        }

        if (this.getDirFromPrompt() == null) {
            this.alert("Not saving any assets");
            return;
        }

        //process the selected slices
        var slicesToOutput = selection;

        // Loop over all slices to export
        var count = [slicesToOutput count];
        for (var i = 0; i < count; i++) {
            var slice = [slicesToOutput objectAtIndex: i];
            this.processSlice(slice);
        }

        // Open finder window with assets exported
        library.sandbox.openInFinder(this.baseDir + "/assets");
    },

    createSelect: function(msg, items, selectedItemIndex){
        selectedItemIndex = selectedItemIndex || 0

        var accessory = [[NSComboBox alloc] initWithFrame:NSMakeRect(0, 0, 200, 25)]
        [accessory addItemsWithObjectValues:items]
        [accessory selectItemAtIndex:selectedItemIndex]

        var alert = [[NSAlert alloc] init]
        [alert setMessageText:msg]
        [alert addButtonWithTitle:'OK']
        [alert addButtonWithTitle:'Cancel']
        [alert setAccessoryView:accessory]

        var responseCode = [alert runModal]
        var sel = [accessory indexOfSelectedItem]

        return [responseCode, sel]
    },

    alert: function(msg) {
        var app = [NSApplication sharedApplication];
        [app displayDialog:msg];
    },

    // Return current working directory
    // This works better for the designer's workflow, as they mostly want to
    // save assets in the current directory
    getCwd: function() {
        var fileUrl = [doc fileURL],
        filePath = [fileUrl path],
        baseDir = filePath.split([doc displayName])[0];
        return baseDir;
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
        var sliceName = [slice name];

        for (var i = 0; i < factors.length; i++) {
            var name   = this.factors[i].folder;
            var factor = this.factors[i].scale;
            var suffix = this.factors[i].suffix;

            log("Processing " + this.type + " slices: " + sliceName + " " + name + " (" + factor + ")");
            var version = this.copyLayerWithFactor(slice, factor);
            var fileName = this.baseDir + "/assets/" + this.type + "/" + name + "/" + sliceName + suffix + ".png";
            [doc saveArtboardOrSlice: version toFile:fileName];
            log("Saved " + fileName);
        }
    },

    copyLayerWithFactor: function(originalSlice, factor) {
        var copy = [originalSlice duplicate];
        var frame = [copy frame];
        var rect = [copy absoluteDirtyRect]
        slice = [MSExportRequest requestWithRect:rect scale:factor];
        [copy removeFromParent];

        return slice;
    }
}