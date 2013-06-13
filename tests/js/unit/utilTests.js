Test.Modules.UTIL = {
    'test extend function': function(containerId) {
        var circle = new Kinetic.Circle();
        test(circle instanceof Kinetic.Circle);
        test(circle instanceof Kinetic.Shape);

    }
};