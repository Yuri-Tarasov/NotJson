# NotJson
**NotJson** is a Tree like data structure with binary serialization to socket or file! 

# Why use NotJson?
In Json, each node can be a real value - String, Number, Bool and another object or Array.

In NotJson: 
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
root["item"] = "value for item first"; // will be rename to -> item_0
root["item"] = "value for item second";  // will be rename to -> item_1

console.log(root.toString(0, false)); // do not show [type] 
```
### Result
```text
Cars: 
  Models: 'Comment for group Models'
    Ford: 
      Fiesta: 'Comment for Fiesta'
      Focus: 'Comment for Focus'
      Mustang: 'Comment for Mustang'
    BMW: 'Comment for group Models/BMW'
      320: 'Comment for 320'
      X3: 'Comment for X3'
      X5: 'Comment for X5'
    Fiat: 
      500: 'Comment for 500'
      Panda: 'Comment for Panda'
  item_0: 'value for item first'
  item_1: 'value for item second
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
 
