/**************************
 * Test for JavaScript 
 * 
 *************************/


const NotJson = require('../src/js/NotJson.js');

//NotJson.njsNode.debug = true;

var root = NotJson.new();
var node;

root.child("Item_1", "27").child("Item_1_1", "dd");

node = root.child("Item_2", "88");

node._("Item_2_2")._("Item_2_2_2", "99_2"); // short alias for .child()

node.child("Item_3_0", 33);
node.child("Item_3_0", 333); // replace exists item 

//root.child("Item_2").child("Item_2_2", "000"); // replace exists item fro null -> "000"
root.child("Item_1", "77_new", true); // add new item in tail
root.child("Item_1", null, true); // add new item in tail
root.child("Item_1", "", true); // add new item in tail

root["sss"] = 9.6;
root["sss2"]["sss2_2"]["sss2_2_3"] = "rrr";
root[""] = "nn"; // empty key_name -> NoName
root.child(null, "nn2", true);// null key_name -> NoName
root["last"] = 5; 
root["last"].value += 9; // must value -> 14

console.log("");
console.log("ToString")
console.log( root.toString()); // dump

console.log("");
console.log("Hand Iterations");

for (var node_1 of  root)
{
    console.log(node_1.key_name + ": " + node_1.value);

    for (var node_2 of  node_1)
    {
        console.log("  " + node_2.key_name + ": " + node_2.value);

        for (var node_3 of  node_2)
        {
            console.log("    " + node_3.key_name + ": " + node_3.value);
        }
    }
}

console.log("");
console.log("Hand Iterations recursive all tree"); // test againe 
console.log("");

function ReursIterat(node, level = 0)
{
    console.log('  '.repeat(level) + node.key_name + ": " + node.value);
    for (var node_child of  node)
    {
        ReursIterat(node_child, level + 1);
    }
}

ReursIterat(root);

// init object;
myObj = {
    "name":"John",
    "age":30,
    "cars": [
        { "name":"Ford", "models":[ "Fiesta", "Focus", "Mustang" ] },
        { "name":"BMW", "models":[ "320", "X3", "X5" ] },
        { "name":"Fiat", "models":[ "500", "Panda" ] }
    ]
 }


root.InitFormObj(myObj);

console.log("");
console.log("Initialized from Object")
console.log( root.toString(0, false)); // do not show [type] 

