/**************************
 * Test for JavaScript 
 * 
 *************************/


const NotJson = require('../src/js/NotJson.js');


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
console.log( root.toString()); // dump

console.log("Hand Iterations");
for (var key of  root.keys())
{
    console.log("key = " + key);
    console.log("val = " + root[key].value);

    for (var key2 of  root[key].keys())
    {
        console.log("  key2 = " + key2);
        console.log("  val2 = " + root[key][key2].value);

        for (var key3 of  root[key][key2].keys())
        {
            console.log("    key3 = " + key3);
            console.log("    val3 = " + root[key][key2][key3].value);
        }
    }
}
