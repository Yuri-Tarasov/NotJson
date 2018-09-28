
#pragma once

#include "njsDefs.h"
#include <string>
#include <vector>

class njsValue
{
public:
    njsValue();
    ~njsValue();
    void _Clear();
    njsTypeEnum GetType();
    std::string GetString();

    void operator= (const int8_t& val);
    void operator= (const int16_t& val);
    void operator= (const int32_t& val);
    void operator= (const int64_t& val);
    void operator= (const float& val);
    void operator= (const double& val);
    void operator= (const std::string& val);
    void operator= (const char* val);
    void operator= (const bool val);
    void operator= (const std::vector<int8_t>& val);

    void SetNull();
    void SetBinary(const int8_t *pData, const int& nLen);
private:
    njsTypeEnum m_enType;
    int64_t m_valInt;
    double m_valFloat;
    std::string m_valStrinUtf8;
    std::vector<int8_t> m_valBinary;
};


