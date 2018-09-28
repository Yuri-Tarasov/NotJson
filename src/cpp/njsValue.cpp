#include "njsValue.h"



njsValue::njsValue()
{
    _Clear();
}

njsValue::~njsValue()
{

}

void njsValue::_Clear()
{
    m_enType = njsTypeEnum::Null;
    m_valStrinUtf8.clear();
    m_valBinary.clear();
}


njsTypeEnum njsValue::GetType()
{
    return m_enType;
}

std::string njsValue::GetString()
{
    std::string sRet;
    switch (m_enType) {
    case njsTypeEnum::String:
        return m_valStrinUtf8;
        break;
    case njsTypeEnum::Int8:
    case njsTypeEnum::Int16:
    case njsTypeEnum::Int32:
    case njsTypeEnum::Int64:
        sRet = std::to_string(m_valInt);
        break;
    case njsTypeEnum::Float32:
    case njsTypeEnum::Float64:
        sRet = std::to_string(m_valFloat);
        break;
    case njsTypeEnum::Bool:
        sRet = m_valInt == 1 ? "true" : "false";
		break;
    case njsTypeEnum::Binary:
        sRet = "BINARY";
        break;
    case njsTypeEnum::Null:
        sRet = "null";
        break;
    }
    return sRet;
}

void njsValue::operator=(const int8_t & val)
{
    m_enType = njsTypeEnum::Int8;
    m_valInt = val;
}

void njsValue::operator=(const int16_t & val)
{
    m_enType = njsTypeEnum::Int16;
    m_valInt = val;
}

void njsValue::operator=(const int32_t & val)
{
    m_enType = njsTypeEnum::Int32;
    m_valInt = val;
}

void njsValue::operator=(const int64_t & val)
{
    m_enType = njsTypeEnum::Int64;
    m_valInt = val;
}

void njsValue::operator=(const float & val)
{
    m_enType = njsTypeEnum::Float32;
    m_valFloat = val;
}

void njsValue::operator=(const double & val)
{
    m_enType = njsTypeEnum::Float64;
    m_valFloat = val;
}

void njsValue::operator=(const std::string & val)
{
    m_enType = njsTypeEnum::String;
    m_valStrinUtf8 = val;
}

void njsValue::operator=(const char * val)
{
    m_enType = njsTypeEnum::String;
    m_valStrinUtf8 = std::string(val);
}

void njsValue::operator=(const bool val)
{
    m_enType = njsTypeEnum::Bool;
    m_valInt = val ? 1 : 0;
}

void njsValue::operator=(const std::vector<int8_t>& val)
{
    m_enType = njsTypeEnum::Binary;

}

void njsValue::SetNull()
{
    _Clear(); 
}

void njsValue::SetBinary(const int8_t * pData, const int & nLen)
{
    m_enType = njsTypeEnum::Binary;
}


