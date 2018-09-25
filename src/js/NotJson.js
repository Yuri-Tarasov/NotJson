

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView


/*
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
*/
  


function utf16to8(str) {
    var out, i, len, c;


    len = str.length;
    out = [];    
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out[out.length] = c;    
        } else if (c > 0x07FF) {
            out[out.length] = (0xE0 | ((c >> 12) & 0x0F));
            out[out.length] = (0x80 | ((c >>  6) & 0x3F));
            out[out.length] = (0x80 | ((c >>  0) & 0x3F));
        } else {
            out[out.length] = (0xC0 | ((c >>  6) & 0x1F));
            out[out.length] = (0x80 | ((c >>  0) & 0x3F));
        }
    }
    return new Uint8Array (out);
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
        c = str[i++];
        switch(c >> 4)
        { 
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
            out += String.fromCharCode(str[i-1]);
            break;
        case 12: case 13:
        // 110x xxxx   10xx xxxx
            char2 = str[i++];
            out  += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
        case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = str[i++];
            char3 = str[i++];
            out  += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
            break;
        }
    }

    return out;
}

var njsTypeEnum = {
    "String" : 100,
    "Int8" : 101,
    "Int16" : 102,
    "Int32" : 103,
    "Int64" : 104,
    "Float32" : 105,
    "Float64" : 106,
    "Bool" : 107,
    "Binary" : 108,
    "Null" : 109,
    
    "MinValue" : 100,
    "MaxValue" : 109
};

/* njsBuffer */

class njsBuffer {
   
    constructor(nInitCapacity = null) {
        this._initialCapacity = 1024;
        this._initialGrowSize = 1024; 
        this._capacity = nInitCapacity ? nInitCapacity :  this._initialGrowSize;
        this.Clear();  
        this._lendian = true;   
    }

    Clear() {
        this._size = 0;
        //console.log("this._capacity = ", this._capacity);
        this._buf = new ArrayBuffer(this._capacity);
        this._ptrW = 0; // write pointer
        this._ptrR = 0; // read pointer
        this._DataView = new DataView(this._buf);
        this._arUint8 = new Uint8Array(this._buf);
    }

    // return count byte
    get GetDataLen  ()  {
        return this._size;
    }
    
    // capacity size in byte
    GetCapacityLen() {
        return this._capacity;
    }
    //////
    static GetType(val) {
        if (val === null || val === "undefined") {
            return "Null";
        }
        var type_of = typeof val;
        if (type_of === "string") {
            return "String";
        } else if (type_of === "number") {
            if (Number.isInteger(val)) {
                if (val >= -128 && val <= 127) {
                    return "Int8";
                } else if (val >= -32768 && val <= 32767) {
                    return "Int16";
                } else if (val >= -2147483648 && val <= 2147483647)  {
                    return "Int32";
                } else if (val >= -9223372036854775808 && val <= 9223372036854775807) {
                    return "Int64";
                }
            } else {
                if (val >= 1.175494351e-38 && val <= 3.402823466e+38)  {
                    return "Float32";
                } else if (val >= 2.2250738585072014e-308 && val <= 1.7976931348623158e+308) {
                    return "Float64";
                }
            }

        }
        return "Null";
    }

    Write(val) {
        var type = this.GetType(val);
        switch (njsTypeEnum[type] ) {
        case njsTypeEnum["String"]: return this.WriteString(val);
        case njsTypeEnum["Int8"]: return this.WriteInt8(val);
        case njsTypeEnum["Int16"]: return this.WriteInt16(val);
        case njsTypeEnum["Int32"]: return this.WriteInt32(val);
        case njsTypeEnum["Int64"]: return this.WriteInt64(val);
        case njsTypeEnum["Bool"]: return this.WriteBool(val);
        case njsTypeEnum["Binary"]: return this.WriteBinary(val);
        case njsTypeEnum["Null"]: return this.WriteNull(val);
        }
    }

    Read(val) {
        var type = this.GetType(val);
        switch (njsTypeEnum[type] ) {
        case njsTypeEnum["String"]: return this.ReadString();
        case njsTypeEnum["Int8"]: return this.ReadInt8();
        case njsTypeEnum["Int16"]: return this.ReadInt16();
        case njsTypeEnum["Int32"]: return this.ReadInt32();
        case njsTypeEnum["Int64"]: return this.ReadInt64();
        case njsTypeEnum["Bool"]: return this.ReadIntBool();
        case njsTypeEnum["Binary"]: return this.ReadBinary();
        case njsTypeEnum["Null"]: return this.ReadIntNull();
        }
        return null;
    }

    WriteInt8(val) {
        this._DataView.setInt8(this._ptrW, val, this._lendian);
        this._ptrW += 1; 
    }

    WriteInt16(val) {
        this._DataView.setInt16(this._ptrW, val, this._lendian);
        this._ptrW += 2; 
    }

    WriteInt32(val) {  
        this._DataView.setInt32(this._ptrW, val, this._lendian);
        this._ptrW += 4; 
    }

    WriteInt64(val) {  
        this._DataView.setInt64(this._ptrW, val, this._lendian);
        this._ptrW += 8; 
    }

    ReadInt32() {
        var val = this._DataView.getInt32(this._ptrR, this._lendian);
        this._ptrR += 4; 
        return val;
    }    

    WriteString(str16) {
        var str8 = utf16to8(str16);  
        //console.log("str8 ", str8);      
        var len = str8.length;
        this.WriteInt32(len);        
        this._arUint8.set(str8, this._ptrW);
        this._ptrW += len;
    }

    ReadString() {
        var len = this.ReadInt32();
        var str8 = this._arUint8.subarray(this._ptrR, this._ptrR + len);
        //console.log("str9 ", str8);
        var str16 = utf8to16(str8);
        this._ptrR += len; 
        return str16;
    }
}


/* njsNode */
const K_NO_NAME = "NoName";
const K_ROOT_NAME = "Root";

const njsNode_hndl =
{
    "get": function (target, name) {
        var type = typeof name;
        if (type !== "string") {
            return target[name];
        }

        if (name in target) {
            //console.log("ret ext " + name);
            return target[name];
        }
        if (name === "item") {
            throw("Reserved key - 'item', use this for only push node to end");

        }
        //console.log("get " + name );
        return  target.child(name); 
    },

    "set": function (target, name, val) {

        //console.log("f set(" + target.key_name + ") " + name + " = " + val);
        if (name === "value") {
            target._type = njsBuffer.GetType(val);
        }
        if (name in target) {
            target[name] = val;
        } else {
            //console.log("not found property " + name);
            if (name === "item") {
                target.child("item_" + target._itemCount++, val, true);
            } else {
                target.child(name, val); 
            }            
            
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
        this.value = null;
        this._itemCount = 0;
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

    // short alias for .child()
    _(key_name, value, bAllowDuplicate = false) {
        return this.child(key_name, value, bAllowDuplicate);
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
     
    WriteoBuffer(oBuf = null) {
        if (!oBuf) {
            oBuf = new njsBuffer();            
        }
        return oBuf;
    }
}


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
    else if (typeof (objInit) === "object") {
        for (var prop in objInit) {
            //console.log("prop", prop);
            this.InitFormObj(objInit[prop], node.child(prop, null, true));
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
    njsNode
};

