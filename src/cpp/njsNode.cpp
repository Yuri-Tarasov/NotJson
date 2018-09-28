
#include <iostream>
#include "njsNode.h"



njsNode::njsNode(const std::string& sKeyName)
{
	m_sKeyName = sKeyName;
}


njsNode::~njsNode()
{

}

njsNode & njsNode::operator[](const std::string & sKeyName)
{
	std::cout << "njsNode::operator['" << sKeyName << "'])\n";
	return _GetChild(sKeyName);
}

std::string njsNode::ToString()
{
	std::string sRet;
	_ToString(0, sRet);
	return sRet;
}

void njsNode::_ToString(int nLevel, std::string & sRet)
{
	sRet += std::string(nLevel * 2, ' ');
	sRet += m_sKeyName + ": ";
	if (m_oValue.m_enType == njsTypeEnum::String) {
		sRet += "'";
	}
	sRet += m_oValue.ToString();
	if (m_oValue.m_enType == njsTypeEnum::String) {
		sRet += "'";
	}
	sRet += " [";
	sRet += njsGetTypeName(m_oValue.m_enType) + "]\n";
	size_t nSize = m_vChild.size();
	for (int i = 0; i < nSize; ++i) {
		m_vChild[i]._ToString(nLevel + 1, sRet);
	}
}

njsNode & njsNode::_MakeNode(const std::string & sKeyName)
{
	m_vChild.push_back(njsNode(sKeyName));
	return m_vChild[m_vChild.size() - 1];	
}



njsNode&
njsNode::_GetChild(const std::string & sKeyName)
{
	if (m_sKeyName == "item") {
		std::cerr << "Node with key name 'item' can not be consist childs!" << "\n";
		return njsNode("Wrong");
	}

	if (sKeyName != "item") {
		size_t nSize = m_vChild.size();
		for (int i = 0; i < nSize; ++i) {
			if (sKeyName == m_vChild[i].m_sKeyName) {
				return  m_vChild[i];
			}
		}
	}


	return _MakeNode(sKeyName);
}


