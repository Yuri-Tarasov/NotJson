

console.log("Start Test");
//import njsNode from '../src/js/NotJson.js';
const NotJson = require("../../src/js/NotJson.js");

//njsNode.debug = true;



var root = new NotJson.njsNode();
var node;

root.GetOrMakeChild("Node_1", "27").GetOrMakeChild("Node_1_1", "dd");

node = root.GetOrMakeChild("Node_2", "88"); // set string

node["Node_2_2"]["Node_2_2_2", "99_2"]; // short alias for .GetOrMakeChild()

node.GetOrMakeChild("Node_3_0", 33); // set int
node.GetOrMakeChild("Node_3_0", 333); // replace exists item 

//root.GetOrMakeChild("Node_2").GetOrMakeChild("Node_2_2", "000"); // replace exists item fro null -> "000"
root.GetOrMakeChild("Node_1", "77_new", true); // add new item in tail
root.GetOrMakeChild("Node_1", null, true); // add new item in tail
root.GetOrMakeChild("Node_1", "", true); // add new item in tail

root["sss"] = 9.6; // set float
root["sss2"]["sss2_2"]["sss2_2_3"] = "rrr";
root[""] = "nn"; // empty key_name -> NoName
root.GetOrMakeChild(null, "nn2", true);// null key_name -> NoName
root["last"] = 5;
root["last"].value += 9; // must value -> 14

root.AddChild("item").value = "value for item first";  // add String
root.AddChild("item").value = "value for item second";  
root.AddChild("item").value = 32767; // add Int16   
root.AddChild("item").value = 32768; // add Int32   
root.AddChild("item").value = 2147483647; // add Int32   
root.AddChild("item").value = 2147483648; // add Int64   

root["Float data"].AddChild("item").value= 3.14; // add Float32   
root["Float data"].AddChild("item").value = 3.402823466e+39 + 1.2e+39; // add Float64 




console.log("");
console.log("ToString");
console.log(root.toString()); // dump

console.log("");
console.log("Hand Iterations");

for (var node_1 of root) {
    console.log(node_1.key_name + ": " + node_1.value);

    for (var node_2 of node_1) {
        console.log("  " + node_2.key_name + ": " + node_2.value);

        for (var node_3 of node_2) {
            console.log("    " + node_3.key_name + ": " + node_3.value);
        }
    }
}

console.log("");
console.log("Iterations for all tree"); // test againe 
console.log("");

function RecursIterat(node, level = 0) {
    console.log("  ".repeat(level) + node.key_name + ": " + node.value);
    for (var node_child of node) {
        RecursIterat(node_child, level + 1);
    }
}
RecursIterat(root);

// init object;
var myObj = {
    "name": "John",
    "age": 30,
    "cars": {
        "Ford": ["Fiesta", "Focus", "Mustang"],
        "BMW": ["320", "X3", {"X5": {"Colors" : ["Red", "Black"]}}] ,
        "Fiat": ["500", "Panda"]
    }
};


root.InitFormObj(myObj);

console.log("");
console.log("Initialized from Object");
console.log(root.toString(0, false)); // do not show [type] 
console.log("");

root.Clear("Cars");

root["Models"]["Ford"]["Fiesta"] = "Comment for Fiesta";  
root["Models"]["Ford"]["Focus"] = "Comment for Focus";
root["Models"]["Ford"]["Mustang"] = "Comment for Mustang";

root["Models"]["BMW"]["320"] = "Comment for 320"; 
root["Models"]["BMW"]["X3"] = "Comment for X3";
root["Models"]["BMW"]["X5"] = "Comment for X5";

root["Models"]["Fiat"]["500"] = "Comment for 500"; 
root["Models"]["Fiat"]["Panda"] = "Comment for Panda";

root["Models"] = "Comment for group Models";
root["Models"]["BMW"] = "Comment for group Models/BMW";

// use reserved key - "item" for append to end
root["item"] = "value for item first";  // add String
root["item"] = "value for item second";  
root["item"] = 32767; // add Int16   
root["item"] = 32768; // add Int32   
root["item"] = 2147483647; // add Int32   
root["item"] = 2147483648; // add Int64   
root["Float data"]["item"] = 3.14; // add Float32   
root["Float data"]["item"] = 3.402823466e+39 + 1.2e+39; // add Float64  

root["Models"]["Жигули"]["Веста"] = "Это тоже машина!";

console.log(root.toString(0, false)); // do not show [type] 
console.log(root);

var buf = new NotJson.njsBuffer();
root.WriteToBuffer(buf);

var rootRet = new NotJson.njsNode();
var bRet = rootRet.ReadFromBuffer(buf);
console.log("\x1b[43m", "Read from buffer ", bRet);
console.log(rootRet);

/* 
for (var i = 0; i < 1000; ++i)
{
    rootRet["item"] = "sss_" + i;
} 
*/

console.log("\x1b[43m", "Save to file");
rootRet.SaveToFile("./test.dat");

console.log("\x1b[43m", "Load from file");
rootRet.LoadFromFile("./test.dat");
console.log(rootRet);

console.log("End Test");
