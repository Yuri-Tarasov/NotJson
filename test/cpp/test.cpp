
#include <iostream>
#include <vector>
//#include "njsDefs.h"
//#include "njsValue.h"
#include "njsNode.h"
#include "test.h"

int main()
{

    std::cout << "Start test.";

 
	njsNode root("Root");
	root["Node_1"] = std::string("First node");
	root["Node_1"]["Node_1_1"] = 555;

	root["Node_2"] = std::string("Second node");
	root["Node_2"]["Node_2_2"] = true;
	root["Node_2"]["Node_2_2"]["Node_2_3"] = 3.14f;

	njsNode& nodeArr = root.AddChild("nodeArr", njsChildTypeEnum::Array);

	nodeArr[""] = 44;
	nodeArr[""] = 55.2f;
	nodeArr["item"] = 566;
	nodeArr.AddChild("item88", njsChildTypeEnum::Array)["sub_it_1"] = 66.f;
	nodeArr["item88"]["sub_it_2"] = 77.f;
	nodeArr.AddChild("item")["sub_it_3"] = 33.f;
	nodeArr.AddChild("item") = "88.2"; // string
	root["item"]["sub_item"] = 88; // Add sub-node in first node - "item"!

	std::cout << "Out String:\n";
	std::cout << root.ToString() << "Out:\n";

	std::cout << "Out Json:\n";
	std::cout << root.ToJson() << "Out:\n";

	njsBuffer oBuf;
	std::cout << "Write to Buffer:\n";
	root.WriteToBuffer(oBuf);

	njsNode RootFromBuf("RootFromBuf");
	std::cout << "Read from Buffer:\n";
	RootFromBuf.ReadFromBuffer(oBuf);
	std::cout << RootFromBuf.ToJson() << "Out:\n";

    std::cout << "End test.";
    return 0;
}

