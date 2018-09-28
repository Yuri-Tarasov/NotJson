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

#define NJS_MAX_STRING_CHARS =  32767,
#define NJS_MAX_CHILDS 0x800000 // 8 388 608


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

static
std::string njsGetTypeName(const njsTypeEnum& en) {
    switch (en) {
    case njsTypeEnum::String:  return "String";        
    case njsTypeEnum::Int8:    return "Int8";
    case njsTypeEnum::Int16:   return "Int16";
    case njsTypeEnum::Int32:   return "Int32";
    case njsTypeEnum::Int64:   return "Int64";
    case njsTypeEnum::Float32: return "Float32";
    case njsTypeEnum::Float64: return "Float64";
    case njsTypeEnum::Bool:    return "Bool";
    case njsTypeEnum::Binary:  return "Binary";
    case njsTypeEnum::Null:    return "Null";
    }
    return "UNDEFINED";
}

#define NJS_DEBUG_LOG 

