


//import njsNode from '../src/js/NotJson.js';
const NotJson = require("../src/js/NotJson.js");

//njsNode.debug = true;



var root = new NotJson.njsNode();
var node;

root.child("Node_1", "27").child("Node_1_1", "dd");

node = root.child("Node_2", "88"); // set string

node._("Node_2_2")._("Node_2_2_2", "99_2"); // short alias for .child()

node.child("Node_3_0", 33); // set int
node.child("Node_3_0", 333); // replace exists item 

//root.child("Node_2").child("Node_2_2", "000"); // replace exists item fro null -> "000"
root.child("Node_1", "77_new", true); // add new item in tail
root.child("Node_1", null, true); // add new item in tail
root.child("Node_1", "", true); // add new item in tail

root["sss"] = 9.6; // set float
root["sss2"]["sss2_2"]["sss2_2_3"] = "rrr";
root[""] = "nn"; // empty key_name -> NoName
root.child(null, "nn2", true);// null key_name -> NoName
root["last"] = 5;
root["last"].value += 9; // must value -> 14

root["item"] = 3; // if use key 'item' -> push end node, will be rename to -> item_0
root["item"] = 5; // append to back new node  will be rename to -> item_1
root["item"] = 7; // append to back new node  will be rename to -> item_2
//root["item"].value += 9; // throw



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
console.log("Hand Iterations recursive all tree"); // test againe 
console.log("");

function ReursIterat(node, level = 0) {
    console.log("  ".repeat(level) + node.key_name + ": " + node.value);
    for (var node_child of node) {
        ReursIterat(node_child, level + 1);
    }
}

ReursIterat(root);

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
root["item"] = "value for item first";  
root["item"] = "value for item second";  

console.log(root);
console.log(root.toString(0, false)); // do not show [type] 

var buf = root.WriteoBuffer();

var m = "Чтение: ";
for (var i = 0; i < 10; ++i)
{
    buf.WriteInt32(i + 30);    
    buf.WriteString("strЯ_" + i);

    var n = buf.ReadInt32();
    console.log(m, n);
    var str = buf.ReadString();
    console.log("str = ", str);
}

