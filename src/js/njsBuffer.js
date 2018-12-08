/*
 * Project: NotJson (https://github.com/Yuri-Tarasov/NotJson)
 * Version: v1.0.12
 * File: njsBuffer.js
 * Author: Yuri Tarasov
 */

const { utf16to8,  utf8to16 } = require("./njsUtil.js");
const {njsTypeEnum, njsDefs} = require("./njsDefs.js");


class njsBuffer {
   
    constructor(arrayBuffer = null, nInitCapacity = null, nInitGrow = null) {
        this._initialCapacity = 1024;
        this._initialGrowSize = 1024; 
        this._capacity = nInitCapacity ? nInitCapacity :  this._initialCapacity;
        this._growSize = nInitGrow ? nInitGrow :  this._initialGrowSize;
        this.Clear(arrayBuffer);  
        this._lendian = true;   

        //var g = NJS_TYPE_FLOAT32;
    }

    Clear(arrayBuffer = null) {
        if (arrayBuffer) {
            this._buf = arrayBuffer;
        } else {
            this._buf = new ArrayBuffer(this._capacity);
        }
        this.ResetPtrWrite();  // write pointer
        this.ResetPtrRead(); // read pointer
        this._DataView = new DataView(this._buf);
        this._arUint8 = new Uint8Array(this._buf);
    }

    ResetPtrRead(){
        this._ptrR = 0;
    }
    ResetPtrWrite(){
        this._ptrW = 0;
    }

    // return count byte
    get size  ()  {
        return this._ptrW; // size = from 0 to write pointer position
    }
    
    // capacity size in byte
    GetCapacityLen() {
        return this._capacity;
    }

    _Resize(newSize) {
        this._capacity = newSize + this._growSize;
        //console.log("resize to " + this._capacity);        
        var newBuf = new ArrayBuffer(this._capacity);
        var newUint8Array = new Uint8Array(newBuf);
        newUint8Array.set(this._arUint8);

        this._DataView = new DataView(newBuf);

        this._buf = newBuf;
        this._arUint8 = newUint8Array;

    }

    _CheckSize(lenAppend)
    {
        var newSize = this._ptrW + lenAppend;
        if (newSize >= this._capacity) {
            this._Resize(newSize);
        }
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

        switch (type ) {
        case njsTypeEnum["Int8"]: 
        case njsTypeEnum["Int16"]: 
        case njsTypeEnum["Int32"]: 
        case njsTypeEnum["Int64"]:
        case njsTypeEnum["Float32"]:
        case njsTypeEnum["Float64"]:         
        case njsTypeEnum["Bool"]:
        case njsTypeEnum["Null"]: 
            this._CheckSize(8);
            break;
        }  

        switch (type) {
        case njsTypeEnum["String"]: return this._WriteString(val);
        case njsTypeEnum["Int8"]: return this._WriteInt8(val);
        case njsTypeEnum["Int16"]: return this._WriteInt16(val);
        case njsTypeEnum["Int32"]: return this._WriteInt32(val);
        case njsTypeEnum["Int64"]: return this._WriteInt64(val);
        case njsTypeEnum["Float32"]: return this._WriteFloat32(val);
        case njsTypeEnum["Float64"]: return this._WriteFloat64(val);          
        case njsTypeEnum["Bool"]: return this._WriteBool(val);
        case njsTypeEnum["Binary"]: return this._WriteBinary(val);
        case njsTypeEnum["Null"]: return this._WriteNull(val);
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
        case njsTypeEnum["String"]: return this._ReadString();
        case njsTypeEnum["Int8"]: return this._ReadInt8();
        case njsTypeEnum["Int16"]: return this._ReadInt16();
        case njsTypeEnum["Int32"]: return this._ReadInt32();
        case njsTypeEnum["Int64"]: return this._ReadInt64();
        case njsTypeEnum["Float32"]: return this._ReadFloat32();
        case njsTypeEnum["Float64"]: return this._ReadFloat64();        
        case njsTypeEnum["Bool"]: return this._ReadBool();
        case njsTypeEnum["Binary"]: return this._ReadBinary();
        case njsTypeEnum["Null"]: return this._ReadNull();
        }



        throw Error("Read Not found type_arg '" + type_arg +"', type  '" + type +"'");
    }

    _WriteInt8(val) {
        this._DataView.setInt8(this._ptrW, val, this._lendian);
        this._ptrW += 1; 
    }

    _WriteInt16(val) {
        this._DataView.setInt16(this._ptrW, val, this._lendian);
        this._ptrW += 2; 
    }

    _WriteInt32(val) {  
        this._DataView.setInt32(this._ptrW, val, this._lendian);
        this._ptrW += 4; 
    }

    _WriteInt64(val) {  
        this._DataView.setFloat64(this._ptrW, val, this._lendian);
        this._ptrW += 8; 
    }

    _WriteFloat32(val) { 
        this._DataView.setFloat32(this._ptrW, val, this._lendian);
        this._ptrW += 4; 
    }

    _WriteFloat64(val) {  
        this._DataView.setFloat64(this._ptrW, val, this._lendian);
        this._ptrW += 8; 
    }

    _WriteBool(val) {  
        this._WriteInt8(val ? 1: 0); 
    }

    _WriteNull() {  
        return true;
    }    

    _WriteString(str16) {
        var str8 = utf16to8(str16);  
        var len = str8.length;
        if (len > njsDefs.NJS_MAX_STRING_CHARS) {
            throw Error("Too long String! Max chars is: " + njsDefs.NJS_MAX_STRING_CHARS);
        }   
        this.Write(len, "Int32");  
        this._CheckSize(len);    
        this._arUint8.set(str8, this._ptrW);
        this._ptrW += len;
    }

    _ReadInt8() {
        var val = this._DataView.getInt8(this._ptrR, this._lendian);
        this._ptrR += 1; 
        return val;
    }     

    _ReadInt16() {
        var val = this._DataView.getInt16(this._ptrR, this._lendian);
        this._ptrR += 2; 
        return val;
    } 

    _ReadInt32() {
        var val = this._DataView.getInt32(this._ptrR, this._lendian);
        this._ptrR += 4; 
        return val;
    }    

    _ReadInt64() {
        var val = this._DataView.getFloat64(this._ptrR, this._lendian);
        this._ptrR += 8; 
        return val;
    } 

    _ReadFloat32() {
        var val = this._DataView.getFloat32(this._ptrR, this._lendian);
        this._ptrR += 4; 
        return val;
    }    

    _ReadFloat64() {
        var val = this._DataView.getFloat64(this._ptrR, this._lendian);
        this._ptrR += 8; 
        return val;
    } 

    _ReadBool() {
        return (this._ReadInt8() == 1);
    }
	
    _ReadNull() {
        return null;
    }  
    
    _ReadString() {
        var len = this._ReadInt32();
        if (len > njsDefs.NJS_MAX_STRING_CHARS) {
            throw Error("Bad Format. Too long String! Max chars is: " + njsDefs.NJS_MAX_STRING_CHARS);
        }          
        var str8 = this._arUint8.subarray(this._ptrR, this._ptrR + len);
        //console.log("str9 ", str8);
        var str16 = utf8to16(str8);
        this._ptrR += len; 
        return str16;
    }
}

module.exports = {
    njsBuffer: njsBuffer,
    
};