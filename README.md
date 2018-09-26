# NotJson
**NotJson** is a Tree like data structure with binary serialization to socket or file! 

### Why use NotJson?
In Json, each node can be a real value - String, Number, Bool and another object or Array.

**In NotJson:** 
- Each node contains Only real values.
- Multidimensional associative array.
- Transmitted data  on the network in Binary form.
- Do not waste resources on parsing.
- Store binary data in tree node.

Base element of NotJson - **njsNode** object.

njsNode:
 - value (String, Int8, Int16, Int32, Int64, Float32, Float64, Bool,  Binary, Null)
 - childs (list ref objects njsNode)


### Init for JS
```javascript
var root = new njsNode("Cars");

// Magic! No throw 'TypeError: Cannot set property of undefined'
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

console.log(root.toString(0, false)); // do not show [type] 
```
### Result
```text
Cars:  [Null]
  Models: 'Comment for group Models' [String]
    Ford:  [Null]
      Fiesta: 'Comment for Fiesta' [String]
      Focus: 'Comment for Focus' [String]
      Mustang: 'Comment for Mustang' [String]
    BMW: 'Comment for group Models/BMW' [String]
      320: 'Comment for 320' [String]
      X3: 'Comment for X3' [String]
      X5: 'Comment for X5' [String]
    Fiat:  [Null]
      500: 'Comment for 500' [String]
      Panda: 'Comment for Panda' [String]
  item: 'value for item first' [String]
  item: 'value for item second' [String]
  item: 32767 [Int16]
  item: 32768 [Int32]
  item: 2147483647 [Int32]
  item: 2147483648 [Int64]
  Float data:  [Null]
    item: 3.140000104904175 [Float32]
    item: 4.602823466e+39 [Float64]
```
### Iteration for all tree

```javascript
function RecursIterat(node, level = 0) {
    console.log("  ".repeat(level) + node.key_name + ": " + node.value);
    for (var node_child of node) {
        RecursIterat(node_child, level + 1);
    }
}

RecursIterat(root);
```

LICENSE
=======

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 
