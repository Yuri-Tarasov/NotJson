/*
 * Project: NotJson (https://github.com/Yuri-Tarasov/NotJson)
 * Version: v1.0.12
 * File: NotJson.js
 * Author: Yuri Tarasov
 */

const {njsBuffer} = require("./njsBuffer.js");
const { njsTypeEnum, njsDefs} = require("./njsDefs.js");



/* njsNode */
const K_NO_NAME = "NoName";
const K_ROOT_NAME = "Root";

const njsNode_hndl =
{
    "get": function (target, name) {
        var type = typeof name;
        if (type !== "string") {
            //console.log("ret symbol " + name.toString());
            return target[name];
        }

        //console.log("get " + name );
     
        if (name in target) {
            //console.log("ret ext " + name);
            return target[name];
        } 
        return  target.GetOrMakeChild(name); 
    },

    "set": function (target, name, val) {

        //console.log("f set(" + target.key_name + ") " + name + " = " + val);

        if (name in target) {
            target[name] = val;
        } else {
            //console.log("not found property " + name);
            target.GetOrMakeChild(name, val); 
        }
        return true;
    },

    //'ownKeys': function(target) {
    //}

};


class njsNode {
    constructor(key_name) {
        this.Clear(key_name);
        var vv = new Proxy(this, njsNode_hndl);
        return vv;
    }

    Clear(key_name) {
        this.key_name = key_name ? key_name : K_ROOT_NAME;
        this._type = "Null";
        this._childs = [];
        this._value = null;
    }

    get value ()
    {
        return this._value;
    }
    
    set value (val)
    {
        this._type = njsBuffer.GetType(val);
        this._value = val;
    }

    get childs ()
    {
        return this._childs;
    }

    set childs (val)
    {
        
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
        if (!key_name) {
            key_name = K_NO_NAME;
        }           
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

    AddChild(key_name, value) {
        var node = this._makeLast(key_name);
        if (typeof type !== "undefined") {
            //console.log("type = ", type, ", val ", value);
            node.value = value;
        }
        return node;
    }

    GetOrMakeChild(key_name, value) {

        var node = this._getChild(key_name);
        if (!node) {
            node = this._makeLast(key_name);
        }
        var type = typeof value;
        if (value === null) {
            type = "null";
        }

        if (njsNode.debug && type === "undefined" && !node) {
            console.log("Not found key_name - '" + key_name + "'");
        }

        if (!node) {
            node = this._makeLast(key_name);
        }

        if (type !== "undefined") {
            //console.log("type = ", type, ", val ", value);
            node.value = value;
        }
        return node;
    }


    toString(n = 0, bSowType = true) {
        var str = "";
        str += "  ".repeat(n);
        var val;
        if (this._type === "String") {
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
    inspect() {
        return this.toString();
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
            "i": 0,
            "arChilds": arChilds
        };
    }
    InitFormObj(objInit, node = null) {
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
        else if (typeof (objInit) === "object") {
            for (var prop in objInit) {
                //console.log("prop", prop);
                this.InitFormObj(objInit[prop], node.child(prop, null, true));
            }
        } else {
            node.value = objInit;
        }
    }
     
    WriteToBuffer(oBuf) {
        try {
            if (oBuf._ptrW === 0) {
                // write riff header           
            }            
            //console.log("save for ", this.key_name);
            oBuf.Write(this.key_name, "String"); // write key name
            oBuf.Write(njsTypeEnum[this._type], "Int8");          
            oBuf.Write(this.value, this._type); // write value 
            if (this._childs.length > njsDefs.NJS_MAX_CHILDS) {
                throw Error("Too many childs! Max childs is: " + njsDefs.NJS_MAX_CHILDS);
            }
            oBuf.Write(this._childs.length, "Int32");   
            for (var i = 0; i < this._childs.length; ++i) {
                var ret = this._childs[i].WriteToBuffer(oBuf); 
                if (!ret) {
                    return false;
                }               
            }
        } catch(e) {
            console.error(e.stack);
            return false;
        }
        return true;
    }
    _getTypeStr(typeInt)
    {
        var typeStr = null;
        for(var key in njsTypeEnum){
            if (typeInt === njsTypeEnum[key]){
                typeStr = key;
                break;
            }
        }
        if (!typeStr)
            throw Error("Not found key for '" + typeInt + "'");
        return typeStr;
    }

    ReadFromBuffer(oBuf) {
        try {
            this.key_name = oBuf.Read("String"); 
            var typeInt = oBuf.Read("Int8");
            if (typeInt < njsTypeEnum.MinValue  || typeInt > njsTypeEnum.MaxValue ) {
                throw Error("Bad format");
            }
            this._type = this._getTypeStr(typeInt);            
            this._value = oBuf.Read(typeInt); 
            var nChilds = oBuf.Read("Int32"); 
            if (nChilds > njsDefs.NJS_MAX_CHILDS) {
                throw Error("Bad format. Too many childs! Max childs is: " + njsDefs.NJS_MAX_CHILDS);
            }            
            for (var i = 0; i < nChilds; ++i) {
                var newNode = new njsNode();
                var ret = newNode.ReadFromBuffer(oBuf);
                if (!ret) {
                    return false;
                }
                this._childs.push(newNode);
            }
        } catch(e) {
            console.error(e.stack);
            return false;
        }
        return true;
    }   

    SaveToFile (fileName) {
        try {
            var buffer = new njsBuffer();
            var ret = this.WriteToBuffer(buffer);
            if (!ret) {
                return false;
            }

            require("fs").writeFileSync(fileName, buffer._arUint8.subarray(0, buffer.size));
            console.log("The file has been saved!");
        } catch(e) {
            console.error(e.stack);
            return false;
        }
        return true;
    }


    LoadFromFile (fileName) {
        try {
            this.Clear();
            var contents = require("fs").readFileSync(fileName);
            console.log("The file has been loaded!");

            var arrayBuffer = new Uint8Array(contents).buffer;
            var buffer = new njsBuffer(arrayBuffer);
            this.ReadFromBuffer(buffer); 
        } catch(e) {
            console.error(e.stack);
            return false;
        } 
        return true;  
    }
}


njsNode.prototype.InitFormObj = function (objInit, node = null) {
    if (!node) {
        console.log("start init from obj");
        node = this;
        node.Clear();
        node.key_name = K_ROOT_NAME;
    }
    if (Array.isArray(objInit)) {
        for (var i = 0; i < objInit.length; ++i) {
            var item = objInit[i];
            this.InitFormObj(item, node.AddChild("item" , null));
        }
    }
    else if (typeof (objInit) === "object") {
        for (var prop in objInit) {
            //console.log("prop", prop);
            this.InitFormObj(objInit[prop], node.AddChild(prop, null));
        }
    } else {
        node.value = objInit;
    }
};

njsNode.debug = false;




function NotJson(key_name) {
    return new njsNode(key_name ? key_name : "Root");
}



module.exports = {
    NotJson,
    njsNode,
    njsBuffer
};

