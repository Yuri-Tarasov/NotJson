#pragma once

#include <vector>

#include "njsValue.h"

class njsNode
{
public:
	njsNode(const std::string& sKeyName);
	~njsNode();

	njsNode& operator[](const std::string& sKeyName);

	template<class T>
	njsNode& operator=(const T& val);

	std::string ToString();

private:
	njsNode& _GetChild(const std::string& sKeyName);
	void _ToString(int nLevel, std::string& sRet);
	njsNode& _MakeNode(const std::string& sKeyName);

private:
	std::string m_sKeyName;
	njsValue m_oValue;
	std::vector<njsNode> m_vChild;

};

template<class T>
inline njsNode & njsNode::operator=(const T & val)
{
	std::cout << "njsNode::operator = " << val << "\n";
	m_oValue = val;
	return *this;
}
