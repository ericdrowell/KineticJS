///////////////////////////////////////////////////////////////////////
//  Container
///////////////////////////////////////////////////////////////////////
/**
 * Container constructor.&nbsp; Containers are used to contain nodes or other containers
 * @constructor
 * @augments Kinetic.Node
 * @param {Object} config
 * @param {Number} [config.x]
 * @param {Number} [config.y]
 * @param {Boolean} [config.visible]
 * @param {Boolean} [config.listening] whether or not the node is listening for events
 * @param {String} [config.id] unique id
 * @param {String} [config.name] non-unique name
 * @param {Number} [config.alpha] determines node opacity.  Can be any number between 0 and 1
 * @param {Object} [config.scale]
 * @param {Number} [config.scale.x]
 * @param {Number} [config.scale.y]
 * @param {Number} [config.rotation] rotation in radians
 * @param {Number} [config.rotationDeg] rotation in degrees
 * @param {Object} [config.offset] offsets default position point and rotation point
 * @param {Number} [config.offset.x]
 * @param {Number} [config.offset.y]
 * @param {Boolean} [config.draggable]
 * @param {String} [config.dragConstraint] can be vertical, horizontal, or none.  The default
 *  is none
 * @param {Object} [config.dragBounds]
 * @param {Number} [config.dragBounds.top]
 * @param {Number} [config.dragBounds.right]
 * @param {Number} [config.dragBounds.bottom]
 * @param {Number} [config.dragBounds.left]
 */
Kinetic.Container = function(config) {
    this._containerInit(config);
};

Kinetic.Container.prototype = {
    _containerInit: function(config) {
        this.children = [];
        Kinetic.Node.call(this, config);
    },
    /**
     * get children
     * @name getChildren
     * @methodOf Kinetic.Container.prototype
     */
    getChildren: function() {
        return this.children;
    },
    /**
     * remove all children
     * @name removeChildren
     * @methodOf Kinetic.Container.prototype
     */
    removeChildren: function() {
        while(this.children.length > 0) {
            this.children[0].remove();
        }
    },
    /**
     * add node to container
     * @name add
     * @methodOf Kinetic.Container.prototype
     * @param {Node} child
     */
    add: function(child) {
        child._id = Kinetic.Global.idCounter++;
        child.index = this.children.length;
        child.parent = this;

        this.children.push(child);
        var stage = child.getStage();

        if(!stage) {
            Kinetic.Global._addTempNode(child);
        }
        else {
            stage._addId(child);
            stage._addName(child);

            /*
             * pull in other nodes that are now linked
             * to a stage
             */
            var go = Kinetic.Global;
            go._pullNodes(stage);
        }

        // chainable
        return this;
    },
    /**
     * return an array of nodes that match the selector.  Use '#' for id selections
     * and '.' for name selections
     * ex:
     * var node = stage.get('#foo'); // selects node with id foo
     * var nodes = layer.get('.bar'); // selects nodes with name bar inside layer
     * @name get
     * @methodOf Kinetic.Container.prototype
     * @param {String} selector
     */
    get: function(selector) {
        var collection = new Kinetic.Collection();
        // ID selector
        if(selector.charAt(0) === '#') {
        	var node = this._getNodeById(selector.slice(1));
        	if (node) collection.push(node);
        }
        // name selector
        else if(selector.charAt(0) === '.') {
        	var nodeList = this._getNodesByName(selector.slice(1));
        	Kinetic.Collection.apply(collection, nodeList);
        }
        // unrecognized selector, pass to children
        else {
            var retArr = [];
            var children = this.getChildren();
            for(var n = 0; n < children.length; n++) {
                retArr = retArr.concat(children[n]._get(selector));
            }
            Kinetic.Collection.apply(collection, retArr);
        }
        return collection;
    },
    _getNodeById: function(key) {
        var stage = this.getStage();
        if(stage.ids[key] !== undefined && this.isAncestorOf(stage.ids[key])) {
            return stage.ids[key];
        }
        return null;
    },
    _getNodesByName: function(key) {
        var arr = this.getStage().names[key] || [];
		return this._getDescendants(arr);
    },
    _get: function(selector) {
        var retArr = Kinetic.Node.prototype._get.call(this, selector);
        var children = this.getChildren();
        for(var n = 0; n < children.length; n++) {
            retArr = retArr.concat(children[n]._get(selector));
        }
        return retArr;
    },
    // extenders
    toObject: function() {
        var obj = Kinetic.Node.prototype.toObject.call(this);

        obj.children = [];

        var children = this.getChildren();
        for(var n = 0; n < children.length; n++) {
            var child = children[n];
            obj.children.push(child.toObject());
        }

        return obj;
    },
    _getDescendants: function(arr) {
    	var retArr = [];
        for(var n = 0; n < arr.length; n++) {
            var node = arr[n];
            if(this.isAncestorOf(node)) {
                retArr.push(node);
            }
        }

        return retArr;
    },
    /**
     * determine if node is an ancestor
     * of descendant
     * @name isAncestorOf
     * @methodOf Kinetic.Container.prototype
     * @param {Kinetic.Node} node
     */
    isAncestorOf: function(node) {
        var parent = node.getParent();
        while(parent) {
            if(parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }

        return false;
    },
    /**
     * clone node
     * @name clone
     * @methodOf Kinetic.Container.prototype
     * @param {Object} attrs override attrs
     */
    clone: function(obj) {
        // call super method
        var node = Kinetic.Node.prototype.clone.call(this, obj)

        // perform deep clone on containers
        for(var key in this.children) {
            node.add(this.children[key].clone());
        }
        return node;
    },
    /**
     * get shapes that intersect a point
     * @name getIntersections
     * @methodOf Kinetic.Container.prototype
     * @param {Object} point
     */
    getIntersections: function() {
        var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
        var arr = [];
        var shapes = this.get('Shape');

        for(var n = 0; n < shapes.length; n++) {
            var shape = shapes[n];
            if(shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        }

        return arr;
    },
    /**
     * set children indices
     */
    _setChildrenIndices: function() {
        for(var n = 0; n < this.children.length; n++) {
            this.children[n].index = n;
        }
    }
};
Kinetic.Global.extend(Kinetic.Container, Kinetic.Node);
