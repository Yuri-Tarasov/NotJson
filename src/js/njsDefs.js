/*
 * Project: NotJson (https://github.com/Yuri-Tarasov/NotJson)
 * Version: v1.0.12
 * File: njsDefs.js
 * Author: Yuri Tarasov
 */

var njsDefs = {
    "NJS_TYPE_STRING" : 100,
    "NJS_TYPE_INT8" :  101,
    "NJS_TYPE_INT16" :  102,
    "NJS_TYPE_INT32" :  103,
    "NJS_TYPE_INT64" :  104,
    "NJS_TYPE_FLOAT32" :  105,
    "NJS_TYPE_FLOAT64" :  106,
    "NJS_TYPE_BOOL" :  107,
    "NJS_TYPE_BINARY" :  108,
    "NJS_TYPE_NULL" :  109
};

var njsTypeEnum = {
    "String" : njsDefs.NJS_TYPE_STRING,
    "Int8" : njsDefs.NJS_TYPE_INT8,
    "Int16" : njsDefs.NJS_TYPE_INT16,
    "Int32" : njsDefs.NJS_TYPE_INT32,
    "Int64" : njsDefs.NJS_TYPE_INT64,
    "Float32" : njsDefs.NJS_TYPE_FLOAT32,
    "Float64" : njsDefs.NJS_TYPE_FLOAT64,
    "Bool" : njsDefs.NJS_TYPE_BOOL,
    "Binary" : njsDefs.NJS_TYPE_BINARY,
    "Null" : njsDefs.NJS_TYPE_NULL,
    
    "MinValue" : njsDefs.NJS_TYPE_STRING,
    "MaxValue" : njsDefs.NJS_TYPE_NULL
};

module.exports = {
    njsTypeEnum : njsTypeEnum,
    njsDefs : njsDefs,
};
