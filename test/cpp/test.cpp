
#include <iostream>
#include <vector>
#include "njsDefs.h"
#include "njsValue.h"
#include "njsNode.h"
#include "test.h"

int main()
{

    std::cout << "Start test.";

    std::vector<njsValue> v(10);
	int i = 0;
	v[i++] = 234;
	v[i++] = 6000000000;
	v[i++] = 345.f;
	v[i++] = 5666.045;
	v[i++] = "Stroka";
	v[i++] = std::string("Comment");
	v[i++] = true;
	v[i++] = false;

	std::cout <<  "Result:\n";
    for (njsValue& val : v) {
        std::cout << njsGetTypeName(val.GetType()) << ": " << val.ToString() << "\n";
    }
 
	njsNode root("Root");
	root["Node_1"] = std::string("First node");
	root["Node_1"]["Node_1_1"] = 555;

	root["Node_2"] = std::string("Second node");
	root["Node_2"]["Node_2_2"] = true;
	root["Node_2"]["Node_2_2"]["Node_2_3"] = 3.14f;
	root["item"] = 44;
	root["item"] = 55;
	//root["item"]["sub_item"] = 88; // Wrong. Node with key name 'item' can not be consist childs!

	std::cout << "Out:\n";
	std::cout << root.ToString() << "Out:\n";
    std::cout << "End test.";
    return 0;
}

