

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


const NJS_TYPE_STRING = 100;
const NJS_TYPE_INT8 = 101;
const NJS_TYPE_INT16 = 102;
const NJS_TYPE_INT32 = 103;
const NJS_TYPE_INT64 = 104;
const NJS_TYPE_FLOAT32 = 105;
const NJS_TYPE_FLOAT64 = 106;
const NJS_TYPE_BOOL = 107;
const NJS_TYPE_BINARY = 108;
const NJS_TYPE_NULL = 109;

var njsTypeEnum = {
    "String" : NJS_TYPE_STRING,
    "Int8" : NJS_TYPE_INT8,
    "Int16" : NJS_TYPE_INT16,
    "Int32" : NJS_TYPE_INT32,
    "Int64" : NJS_TYPE_INT64,
    "Float32" : NJS_TYPE_FLOAT32,
    "Float64" : NJS_TYPE_FLOAT64,
    "Bool" : NJS_TYPE_BOOL,
    "Binary" : NJS_TYPE_BINARY,
    "Null" : NJS_TYPE_NULL,
    
    "MinValue" : NJS_TYPE_STRING,
    "MaxValue" : NJS_TYPE_NULL
};

/* njsBuffer */

class njsBuffer {
   
    constructor(nInitCapacity = null) {
        this._initialCapacity = 1000000;//1024;
        //this._initialGrowSize = 1024; 
        this._capacity = nInitCapacity ? nInitCapacity :  this._initialCapacity;
        this.Clear();  
        this._lendian = true;   
    }

    Clear() {
        this._size = 0;
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
        //console.log("type_of = ", type_of);
        
        if (type_of === "string") {
            return "String";
        } else if (type_of === "number") {
            //if (Number.isInteger(val)) {
            if (Number.isSafeInteger(val)) {    
                if (val >= -128 && val <= 127) {
                    return "Int8";
                } else if (val >= -32768 && val <= 32767) {
                    return "Int16";
                } else if (val >= -2147483648 && val <= 2147483647)  {
                    return "Int32";
                } else if (val >= -9223372036854775808 && val <= 9223372036854775807) {
                    return "Int64";
                } else {
                    console.log("not found int ", val);
                }
            } 
            if (val >= 1.175494351e-38 && val <= 3.402823466e+38)  {
                return "Float32";
            } else if (val >= 2.2250738585072014e-308 && val <= 1.7976931348623157e+308) {
                return "Float64";
            } else {
                console.log("not found float ", val);
            }    
        }
        return "Null";
    }

    Write(val, type_arg) {
        var type = type_arg;
        if (typeof type_arg === "string") {
            type = njsTypeEnum[type_arg];
        }

        switch (type) {
        case njsTypeEnum["String"]: return this.WriteString(val);
        case njsTypeEnum["Int8"]: return this.WriteInt8(val);
        case njsTypeEnum["Int16"]: return this.WriteInt16(val);
        case njsTypeEnum["Int32"]: return this.WriteInt32(val);
        case njsTypeEnum["Int64"]: return this.WriteInt64(val);
        case njsTypeEnum["Float32"]: return this.WriteFloat32(val);
        case njsTypeEnum["Float64"]: return this.WriteFloat64(val);          
        case njsTypeEnum["Bool"]: return this.WriteBool(val);
        case njsTypeEnum["Binary"]: return this.WriteBinary(val);
        case njsTypeEnum["Null"]: return this.WriteNull(val);
        }
        throw Error("Write Not found type_arg '" + type_arg +"', type  '" + type +"'");
        //return  false;
    }

    Read(type_arg) {
        var type = type_arg;
        if (typeof type_arg === "string") {
            type = njsTypeEnum[type_arg];
        }
        switch (type ) {
        case njsTypeEnum["String"]: return this.ReadString();
        case njsTypeEnum["Int8"]: return this.ReadInt8();
        case njsTypeEnum["Int16"]: return this.ReadInt16();
        case njsTypeEnum["Int32"]: return this.ReadInt32();
        case njsTypeEnum["Int64"]: return this.ReadInt64();
        case njsTypeEnum["Float32"]: return this.ReadFloat32();
        case njsTypeEnum["Float64"]: return this.ReadFloat64();        
        case njsTypeEnum["Bool"]: return this.ReadIntBool();
        case njsTypeEnum["Binary"]: return this.ReadBinary();
        case njsTypeEnum["Null"]: return this.ReadNull();
        }
        throw Error("Read Not found type_arg '" + type_arg +"', type  '" + type +"'");
        //return null;
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
        this._DataView.setFloat64(this._ptrW, val, this._lendian);
        this._ptrW += 8; 
    }

    WriteFloat32(val) { 
        console.log("WriteFloat32 ", val);  
        this._DataView.setFloat32(this._ptrW, val, this._lendian);
        this._ptrW += 4; 
    }

    WriteFloat64(val) {  
        console.log("WriteFloat64 ", val);  
        this._DataView.setFloat64(this._ptrW, val, this._lendian);
        this._ptrW += 8; 
    }

    WriteNull(val = null) {  
        return true;
    }    

    WriteString(str16) {
        var str8 = utf16to8(str16);  
        //console.log("str8 ", str8);      
        var len = str8.length;
        this.WriteInt32(len);        
        this._arUint8.set(str8, this._ptrW);
        this._ptrW += len;
    }

    ReadInt8() {
        var val = this._DataView.getInt8(this._ptrR, this._lendian);
        this._ptrR += 1; 
        return val;
    }     

    ReadInt16() {
        var val = this._DataView.getInt16(this._ptrR, this._lendian);
        this._ptrR += 2; 
        return val;
    } 

    ReadInt32() {
        var val = this._DataView.getInt32(this._ptrR, this._lendian);
        this._ptrR += 4; 
        return val;
    }    

    ReadInt64() {
        var val = this._DataView.getFloat64(this._ptrR, this._lendian);
        this._ptrR += 8; 
        return val;
    } 
    ReadFloat32() {
        var val = this._DataView.getFloat32(this._ptrR, this._lendian);
        this._ptrR += 4; 
        return val;
    }    

    ReadFloat64() {
        var val = this._DataView.getFloat64(this._ptrR, this._lendian);
        this._ptrR += 8; 
        return val;
    } 

    ReadNull() {
        return null;
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
                target.child("item", val, true);
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
     
    WriteToBuffer(oBuf = null) {

        if (!oBuf) {
            oBuf = new njsBuffer();            
        }            
        console.log("save for ", this.key_name);
        oBuf.Write(this.key_name, "String"); // write key name
        oBuf.Write(njsTypeEnum[this._type], "Int8");          
        oBuf.Write(this.value, this._type); // write value 
        oBuf.Write(this._childs.length, "Int32");   
        for (var i = 0; i < this._childs.length; ++i) {
            this._childs[i].WriteToBuffer(oBuf);                
        }
      


        return oBuf;
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
        this.key_name = oBuf.Read("String"); 
        var typeInt = oBuf.Read("Int8");
        this._type = this._getTypeStr(typeInt);
        console.log("read type ", this._type);
        this.value = oBuf.Read(typeInt); 
        var nChilds = oBuf.Read("Int32"); 
        for (var i = 0; i < nChilds; ++i) {
            var newNode = new njsNode();
            newNode.ReadFromBuffer(oBuf);
            this._childs.push(newNode);
        }
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
    njsNode,
    njsBuffer
};

