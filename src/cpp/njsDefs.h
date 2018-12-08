#pragma once

#include <cinttypes>
#include <string>




#define NJS_TYPE_STRING 100
#define NJS_TYPE_INT8 101
#define NJS_TYPE_INT16 102
#define NJS_TYPE_INT32 103
#define NJS_TYPE_INT64 104
#define NJS_TYPE_FLOAT32 105
#define NJS_TYPE_FLOAT64 106
#define NJS_TYPE_BOOL 107
#define NJS_TYPE_BINARY 108
#define NJS_TYPE_NULL 109

#define NJS_MAX_STRING_CHARS =  32767
#define NJS_MAX_CHILDS 0x800000 // 8 388 608


#define NJS_CHILD_TYPE_OBJECT 200
#define NJS_CHILD_TYPE_ARRAY 201

// type for value
enum  class njsTypeEnum : int8_t {
    String = NJS_TYPE_STRING,
    Int8 = NJS_TYPE_INT8,
    Int16 = NJS_TYPE_INT16,
    Int32 = NJS_TYPE_INT32,
    Int64 = NJS_TYPE_INT64,
    Float32 = NJS_TYPE_FLOAT32,
    Float64 = NJS_TYPE_FLOAT64,
    Bool = NJS_TYPE_BOOL,
    Binary = NJS_TYPE_BINARY,
    Null = NJS_TYPE_NULL,

    MinValue = NJS_TYPE_STRING,
    MaxValue = NJS_TYPE_NULL
};

// type for chil
enum  class njsChildTypeEnum : int16_t {
    Object = NJS_CHILD_TYPE_OBJECT,
    Array = NJS_CHILD_TYPE_ARRAY
};




#define NJS_DEBUG_LOG 

