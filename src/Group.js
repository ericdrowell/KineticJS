///////////////////////////////////////////////////////////////////////
//  Group
///////////////////////////////////////////////////////////////////////
/**
 * Group constructor.  Groups are used to contain shapes or other groups.
 * @constructor
 * @augments Kinetic.Container
 * @param {Object} config
 */
Kinetic.Group = Kinetic.Container.extend({
    init: function(config) {
        this.nodeType = 'Group';

        // call super constructor
        this._super(config);
    },
    draw: function(canvas) {
        this._draw(canvas);
    },
    _draw: function(canvas) {
        if(this.attrs.visible) {
            this._drawChildren(canvas);
        }
    }
});
