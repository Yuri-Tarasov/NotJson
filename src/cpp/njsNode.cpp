
#include <iostream>
#include "njsNode.h"


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

njsNode::njsNode(const std::string& sKeyName, const njsChildTypeEnum& enChildType /* def Object*/)
{
	m_sKeyName = sKeyName;
    m_enChildType = enChildType;
}


njsNode::~njsNode()
{

}

njsNode & njsNode::operator[](const std::string & sKeyName)
{
	//std::cout << "njsNode::operator['" << sKeyName << "'])\n";
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
    for (size_t i = 0; i < nSize; ++i) {
		m_vChild[i]._ToString(nLevel + 1, sRet);
	}
}

std::string njsNode::ToJson()
{
	std::string sRet;// = "{\n";
    _ToJson(0, sRet, (m_enChildType == njsChildTypeEnum::Array));
	//sRet += "\n}\n";
	sRet += "\n";
    return sRet;
}

const njsChildTypeEnum &njsNode::GetChildType()
{
    return m_enChildType;
}

void njsNode::_ToJson(int nLevel, std::string & sRet, bool bParentArray)
{
	std::string sDop = std::string(nLevel * 2, ' ');
	sRet += "\n";
	sRet += sDop;
    if (nLevel && !bParentArray) {
		sRet += "\"" + m_sKeyName + "\": ";
	}
	size_t nSize = m_vChild.size();
    bool bIsArray = m_enChildType == njsChildTypeEnum::Array;

	if (nSize) {
		if (nLevel && !bParentArray) {
			sRet += "\n";
		    sRet += sDop;
		}

        if (bIsArray) {
          sRet += "[";
        } else {
          sRet += "{";
        }

	} else {

		if (m_oValue.m_enType == njsTypeEnum::String) {
			sRet += "\"";
		}
		sRet += m_oValue.ToString();
		if (m_oValue.m_enType == njsTypeEnum::String) {
			sRet += "\"";
		}
	}

    for (size_t i = 0; i < nSize; ++i) {
        m_vChild[i]._ToJson(nLevel + 1, sRet, bIsArray);
		if ((i + 1) < nSize) {
			sRet += ",";
			//sRet += "\n";
		}
		
	}

	if (nSize) {
		sRet += "\n";
		sRet += sDop;
        if (bIsArray) {
          sRet += "]";
        } else {
          sRet += "}";
        }
	}

	
}

njsNode & njsNode::_MakeNode(const std::string & sKeyName, const njsChildTypeEnum& enChildType /* def Object*/)
{
    m_vChild.push_back(njsNode(sKeyName, enChildType));
	return m_vChild[m_vChild.size() - 1];	
}


njsNode & 
njsNode::AddChild(const std::string & sKeyName, const njsChildTypeEnum& enChildType /* def Object*/)
{
    return _MakeNode(sKeyName, enChildType);
}


njsNode & 
njsNode::GetOrMakeChild(const std::string & sKeyName, const njsChildTypeEnum& enChildType /* def Object*/)
{
    return _GetChild(sKeyName, enChildType);
}

njsNode&
njsNode::_GetChild(const std::string & sKeyName, const njsChildTypeEnum& enChildType /* def Object*/)
{

	size_t nSize = m_vChild.size();
    for (size_t i = 0; i < nSize; ++i) {
		if (sKeyName == m_vChild[i].m_sKeyName) {
			return  m_vChild[i];
		}
	}
    return _MakeNode(sKeyName, enChildType);
}

bool
njsNode::IsChildExists(const std::string& sKeyName)
{
    size_t nSize = m_vChild.size();
    for (size_t i = 0; i < nSize; ++i) {
        if (sKeyName == m_vChild[i].m_sKeyName) {
            return  true;
        }
    }
    return false;
}


