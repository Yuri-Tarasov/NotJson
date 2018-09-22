/*
 * NotJson for JavaScript
 *
*/

const K_NO_NAME = "NoName";
const K_ROOT_NAME = "Root";

const njsNode_hndl =
{
    'get': function (target, name) {
        var type = typeof name;
        if (type !== 'string') {
            return target[name];
        }

        if (name in target) {
            //console.log("ret ext " + name);
            return target[name];
        }
        //console.log("get " + name );

        return target.child(name);
    },

    'set': function (target, name, val) {

        //console.log("f set(" + target.key_name + ") " + name + " = " + val);
        if (name === "value") {
            var type = typeof val;
            if (type === 'number') {
                if (Number.isInteger(val)) {
                    type = "int64";
                } else {
                    type = "float";
                }
            }
            target._type = type;
        }
        if (name in target) {
            target[name] = val;
        } else {
            //console.log("not found property " + name);
            target.child(name, val);
        }
        return true;
    },

    //'ownKeys': function(target) {
    //}

}


class njsNode {
    constructor(key_name) {

        this.key_name = key_name;
        this._type = "null";
        this._childs = [];
        this.value = null;
        var vv = new Proxy(this, njsNode_hndl);
        return vv;
    }

    Clear(key_name) {
        this.key_name = key_name ? key_name : K_ROOT_NAME;
        this._type = "null";
        this._childs = [];
        this.value = null;
        this._childs = [];
    }


    // Private
    // get last node
    _getLast() {
        var last = null;
        if (this._childs.length) {
            last = this._childs[this._childs.length];
        }
        return last;
    }

    // Private
    // make last node
    _makeLast(key_name) {
        var id = this._childs.length;
        var node = new njsNode(key_name);
        this._childs[id] = node;
        return node;
    }

    _getChild(key_name) {
        var node = null;
        for (var i = 0; i < this._childs.length; ++i) {
            if (key_name === this._childs[i].key_name) {
                node = this._childs[i];
                break;
            }
        }
        return node;
    }

    _getOrMakeChild(key_name) {
        var node = this._getChild(key_name);
        if (!node) {
            node = this._makeLast(key_name);
        }
        return node;
    }

    child(key_name, value, bAllowDuplicate = false) {
        if (!key_name) {
            key_name = K_NO_NAME;
        }
        var node = null;
        if (bAllowDuplicate) {
            node = this._makeLast(key_name);
        } else {
            node = this._getChild(key_name);
        }
        var type = typeof value;
        if (value === null) {
            type = "null";
        }

        if (njsNode.debug && type === 'undefined' && !node) {
            console.log("Not found key_name - '" + key_name + "'");
        }

        if (!node) {
            node = this._makeLast(key_name);
        }

        if (type !== 'undefined') {
            //console.log("type = ", type, ", val ", value);
            node.value = value;
        }
        return node;
    }

    // short alias for .child()
    _(key_name, value, bAllowDuplicate = false) {
        return this.child(key_name, value, bAllowDuplicate);
    }

    toString(n = 0, bSowType = true) {
        var str = "";
        str += '  '.repeat(n);
        var val;
        if (this._type === 'number') {
            val = this.value;
        } else if (this._type === 'string') {
            val = "'" + this.value + "'";
        } else {
            val = this.value;
        }

        str += this.key_name + ": " + (val !== null ? val : "");
        if (bSowType) {
            str += " [" + this._type + "]";
        }
        str += "\n";
        for (var i = 0; i < this._childs.length; ++i) {
            str += this._childs[i].toString(n + 1, bSowType);
        }
        return str;
    }

    [Symbol.iterator]() {
        var arChilds = this._childs;
        return {
            next: function () {
                var i = this.i++;
                if (i < this.arChilds.length) {
                    return { value: this.arChilds[i], done: false };
                } else {
                    //this.i = 0;
                    return { done: true };
                }
            },
            'i': 0,
            'arChilds': arChilds
        }
    }
};

njsNode.prototype.InitFormObj = function (objInit, node = null) {
    if (!node) {
        console.log("start init fron obj");
        node = this;
        node.Clear();
        node.key_name = K_ROOT_NAME;
    }
    if (Array.isArray(objInit)) {
        for (var i = 0; i < objInit.length; ++i) {
            var item = objInit[i];
            this.InitFormObj(item, node.child("item_" + i, null, true));
        }
    }
    else if (typeof (objInit) === 'object') {
        for (var prop in objInit) {
            //console.log("prop", prop);
            this.InitFormObj(objInit[prop], node.child(prop, null, true));
        }
    } else {
        node.value = objInit;
    }
}

njsNode.debug = false;




function NotJson(key_name) {
    return new njsNode(key_name ? key_name : "Root");
}



module.exports = {
    njsNode
}

