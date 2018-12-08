#pragma once

#include <vector>
#include "njsValue.h"

class njsBuffer
{
public:
	njsBuffer();
	~njsBuffer();

	void Reset();
	void ResetPtrWrite();
	void ResetPtrRead();

	bool Write(const njsValue& oVal);
	bool Write(const int8_t& val);
	bool Write(const int16_t& val);
	bool Write(const int32_t& val);
	bool Write(const int64_t& val);
	bool Write(const float& val);
	bool Write(const double& val);
	bool Write(const std::string& val);
	bool Write(const char* val);
	bool Write(const bool val);
	bool Write(const std::vector<int8_t>& val);
	bool WriteNull();

	bool Read(njsValue& oVal);
	int8_t ReadInt8();
	int16_t ReadInt16();
	int32_t ReadInt32();
	int64_t ReadInt64();
	float ReadFloat();
	double ReadDouble();
	bool ReadString(std::string& val);
	bool ReadBool();
	bool ReadBinary(std::vector<int8_t>& val);
	bool ReadNull();

private:
	void _Resize(const uint32_t& newSize);
	void _CheckSize(const uint32_t& lenAppend);

private:
	std::vector<int8_t> m_vec;
	int8_t* m_pData;
	uint32_t m_ptrW;
	uint32_t m_ptrR;
};

