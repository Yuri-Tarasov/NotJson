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

root.child("Item_2").child("Item_2_2", "000"); // replace exists item fro null -> "000"
root.child("Item_1", "77_new", true); // add new item in tail
root.child("Item_1", null, true); // add new item in tail
root.child("Item_1", "", true); // add new item in tail

root["sss"] = 9.6;
root["sss2"]["sss2_2"]["sss2_2_3"] = "rrr";
root[""] = "nn"; // empty key_name -> NoName
root.child(null, "nn2", true);// null key_name -> NoName
root["last"] = 5; 
root["last"].value += 9; // value -> 14
console.log( root.toString()); // dump


var val = root["last"].value; // val -> dd


console.log("val = ", val);

/*
Root: null
  Item_1: 77
    Item_1_1: dd
  Item_2: 88_new
    Item_2_2: null
      Item_2_2_2: 99_2
    Item_3_0: 333
  Item_1: 77_new
  Item_1: 77_new2
*/

