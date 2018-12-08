
#include "njsBuffer.h"


njsBuffer::njsBuffer()
{
	Reset();
	Resize(1024);
}


njsBuffer::~njsBuffer()
{

}

void njsBuffer::Reset()
{
	ResetPtrWrite();
	ResetPtrRead();
}

void njsBuffer::ResetPtrWrite()
{
	m_ptrW = 0;
}

void njsBuffer::ResetPtrRead()
{
	m_ptrR = 0;
}


void
njsBuffer::Resize(const uint32_t& newSize)
{
	m_vec.reserve(newSize);
	m_pData = m_vec.data();
}

void
njsBuffer::_CheckSize(const uint32_t& lenAppend)
{
	uint32_t newSize = m_ptrW + lenAppend;
	if (newSize >= m_vec.capacity()) {
		Resize(newSize);
	}
}

bool njsBuffer::Write(const njsValue & oVal)
{
	switch (oVal.GetType())
	{
	case njsTypeEnum::String:
		return Write(oVal.m_valStrinUtf8);
		break;
	case njsTypeEnum::Int8:
		return Write((int8_t)oVal.m_valInt);
		break;
	case njsTypeEnum::Int16:
		return Write((int16_t)oVal.m_valInt);
		break;
	case njsTypeEnum::Int32:
		return Write((int32_t)oVal.m_valInt);
		break;
	case njsTypeEnum::Int64:
		return Write(oVal.m_valInt);
		break;
	case njsTypeEnum::Float32:
		return Write((float)oVal.m_valFloat);
		break;
	case njsTypeEnum::Float64:
		return Write(oVal.m_valFloat);
		break;
	case njsTypeEnum::Bool:
		return Write(oVal.m_valInt == 1);
		break;
	case njsTypeEnum::Binary:
		return Write(oVal.m_valBinary);
		break;
	case njsTypeEnum::Null:
		return WriteNull();
		break;
	default:
		break;
	}
	return true;
}

bool njsBuffer::Write(const int8_t & val)
{
	_CheckSize(8);
	memcpy(m_pData + m_ptrW, &val, 1);
	m_ptrW += 1;
	return true;
}

bool njsBuffer::Write(const int16_t & val)
{
	_CheckSize(8);
	memcpy(m_pData + m_ptrW, &val, 2);
	m_ptrW += 2;
	return true;
}

bool njsBuffer::Write(const int32_t & val)
{
	_CheckSize(8);
	memcpy(m_pData + m_ptrW, &val, 4);
	m_ptrW += 4;
	return true;
}

bool njsBuffer::Write(const int64_t & val)
{
	_CheckSize(8);
	memcpy(m_pData + m_ptrW, &val, 8);
	m_ptrW += 8;
	return true;
}

bool njsBuffer::Write(const float & val)
{
	_CheckSize(8);
	memcpy(m_pData + m_ptrW, &val, 4);
	m_ptrW += 4;
	return true;
}

bool njsBuffer::Write(const double & val)
{
	_CheckSize(8);
	memcpy(m_pData + m_ptrW, &val, 8);
	m_ptrW += 8;
	return true;
}

bool njsBuffer::Write(const std::string & val)
{
	int32_t nLen = (int32_t)val.size();
	if (nLen > NJS_MAX_STRING_CHARS) {
		NJS_LOG_ERR("Bad format. Too many chars in string! NJS_MAX_STRING_CHARS is : " << NJS_MAX_CHILDS);
		return false;
	}
	Write(nLen);
	_CheckSize(nLen);
	memcpy(m_pData + m_ptrW, val.c_str(), nLen);
	m_ptrW += nLen;
	return true;
}

bool njsBuffer::Write(const char * val)
{
	int32_t nLen = (int32_t)strlen(val);
	if (nLen > NJS_MAX_STRING_CHARS) {
		NJS_LOG_ERR("Bad format. Too many chars in string! NJS_MAX_STRING_CHARS is : " << NJS_MAX_CHILDS);
		return false;
	}
	Write(nLen);
	_CheckSize(nLen);
	memcpy(m_pData + m_ptrW, &val, nLen);
	m_ptrW += nLen;
	return true;
}

bool njsBuffer::Write(const bool val)
{
	int8_t nVal = val ? 1 : 0;
	return Write(nVal);
}

bool njsBuffer::Write(const std::vector<int8_t>& val)
{
	int32_t nLen = (int32_t)val.size();
	Write(nLen);
	_CheckSize(nLen);
	memcpy(m_pData + m_ptrW, val.data(), nLen);
	m_ptrW += nLen;
	return true;
}

bool njsBuffer::WriteNull()
{
	return true;
}

bool njsBuffer::Read(njsValue & oVal)
{
	switch (oVal.GetType())
	{
	case njsTypeEnum::String:
		return ReadString(oVal.m_valStrinUtf8);
		break;
	case njsTypeEnum::Int8:
		oVal.m_valInt = ReadInt8();
		break;
	case njsTypeEnum::Int16:
		oVal.m_valInt = ReadInt16();
		break;
	case njsTypeEnum::Int32:
		oVal.m_valInt = ReadInt32();
		break;
	case njsTypeEnum::Int64:
		oVal.m_valInt = ReadInt64();
		break;
	case njsTypeEnum::Float32:
		oVal.m_valFloat = ReadFloat();
		break;
	case njsTypeEnum::Float64:
		oVal.m_valFloat = ReadDouble();
		break;
	case njsTypeEnum::Bool:
		oVal.m_valInt = ReadBool();
		break;
	case njsTypeEnum::Binary:
		ReadBinary(oVal.m_valBinary);
		break;
	case njsTypeEnum::Null:
		return ReadNull();
		break;
	default:
		break;
	}
	return true;
}

int8_t njsBuffer::ReadInt8()
{
	int8_t val;
	memcpy(&val, m_pData + m_ptrR, 1);
	m_ptrR += 1;
	return val;
}

int16_t njsBuffer::ReadInt16()
{
	int16_t val;
	memcpy(&val, m_pData + m_ptrR, 2);
	m_ptrR += 2;
	return val;
}

int32_t njsBuffer::ReadInt32()
{
	int32_t val;
	memcpy(&val, m_pData + m_ptrR, 4);
	m_ptrR += 4;
	return val;
}

int64_t njsBuffer::ReadInt64()
{
	int64_t val;
	memcpy(&val, m_pData + m_ptrR, 8);
	m_ptrR += 8;
	return val;
}

float njsBuffer::ReadFloat()
{
	float val;
	memcpy(&val, m_pData + m_ptrR, 4);
	m_ptrR += 4;
	return val;
}

double njsBuffer::ReadDouble()
{
	double val;
	memcpy(&val, m_pData + m_ptrR, 8);
	m_ptrR += 8;
	return val;
}

bool njsBuffer::ReadString(std::string& val)
{
	int32_t nSize = ReadInt32();
	//NJS_LOG_ERR("ReadString size = " << nSize);
	
	if (nSize > NJS_MAX_STRING_CHARS) {
		NJS_LOG_ERR("Bad format. Too many chars in string! NJS_MAX_STRING_CHARS is : " << NJS_MAX_CHILDS);
		return false;
	}
	val.clear();
	val.resize(nSize);
	int8_t* pData = (int8_t*)val.data();
	memcpy(pData, m_pData + m_ptrR, nSize);
	m_ptrR += nSize;
	return true;
}

bool njsBuffer::ReadBool()
{
	bool val;
	int8_t nVal = ReadInt8();
	val = (nVal == 1);
	return val;
}

bool njsBuffer::ReadBinary(std::vector<int8_t>& val)
{
	int32_t nSize = ReadInt32();
	val.clear();
	val.resize(nSize);
	int8_t* pData = (int8_t*)val.data();
	memcpy(pData, m_pData + m_ptrR, nSize);
	m_ptrR += nSize;
	return true;
}

bool njsBuffer::ReadNull()
{
	return true;
}

int8_t * njsBuffer::GetData()
{
	return m_pData;
}

uint32_t njsBuffer::GetDataLen()
{
	return m_ptrW;
}

