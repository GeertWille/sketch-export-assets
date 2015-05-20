var library = {};
library.sandbox = {
    // Utility: display a modal with message
    debug: function(message) {
        var app = [NSApplication sharedApplication];
        [app displayDialog:message withTitle:"Hey"];
    },
    // each-like iterator for Obj-C types
    forEachObj: function(array, callback, factors) {
        // var thisArg = (typeof thisArg === "undefined") ? this : thisArg;
        var count = array.count();
        for (var i = 0; i < count; i++){
            var el = array[i];
            callback(el);
        }
    },
    openInFinder: function(path) {
        var finderTask = [[NSTask alloc] init],
            openFinderArgs = [NSArray arrayWithObjects:"-R", path, nil];

        [finderTask setLaunchPath:"/usr/bin/open"];
        [finderTask setArguments:openFinderArgs];
        [finderTask launch];
    }
}