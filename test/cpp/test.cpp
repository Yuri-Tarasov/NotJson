
#include <iostream>
#include <vector>
#include "njsDefs.h"
#include "njsValue.h"

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
        std::cout << njsGetTypeName(val.GetType()) << ": " << val.GetString() << "\n";
    }
 

    std::cout << "End test.";
    return 0;
}

