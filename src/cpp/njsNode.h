#pragma once

#include <vector>
#include "njsBuffer.h"
#include "njsValue.h"

class njsNode
{
public:
    njsNode(const std::string& sKeyName, const njsChildTypeEnum& enChildType = njsChildTypeEnum::Object);
	~njsNode();
	void Clear();

	njsNode& operator[](const std::string& sKeyName);
    njsNode& GetOrMakeChild(const std::string& sKeyName, const njsChildTypeEnum& enChildType = njsChildTypeEnum::Object);
    njsNode& AddChild(const std::string& sKeyName, const njsChildTypeEnum& enChildType = njsChildTypeEnum::Object);

    bool IsChildExists(const std::string& sKeyName);

	template<class T>
	njsNode& operator=(const T& val);

	std::string ToString();
	std::string ToJson();
    const njsChildTypeEnum &GetChildType();

    std::vector<njsNode>& GetChilds() {return m_vChild;}
    const std::string& GetKeyName() {return m_sKeyName;}
    njsValue& GetValue() {return m_oValue;}

	// Serialize
	bool SaveToFile(const std::string& sFileName);
	bool LoadFromFile(const std::string& sFileName);
	bool WriteToBuffer(njsBuffer& oBuf);
	bool ReadFromBuffer(njsBuffer& oBuf);

private:
    njsNode& _GetChild(const std::string& sKeyName, const njsChildTypeEnum& enChildType = njsChildTypeEnum::Object);
	void _ToString(int nLevel, std::string& sRet);
    void _ToJson(int nLevel, std::string& sRet, bool bParentArray);
    njsNode& _MakeNode(const std::string& sKeyName, const njsChildTypeEnum& enChildType = njsChildTypeEnum::Object);

private:
	std::string m_sKeyName;
	njsValue m_oValue;
	std::vector<njsNode> m_vChild;
    njsChildTypeEnum  m_enChildType;

};

template<class T>
inline njsNode & njsNode::operator=(const T & val)
{
	//std::cout << "njsNode::operator = " << val << "\n";
	m_oValue = val;
	return *this;
}
