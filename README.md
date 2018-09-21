Base element of NotJson - njsNode object.

njsNode:
 - value (String, Int16, Int32, Int64, Float, Double, Binary, Null)
 - childs (list ref objects njsNode)


`let`Init for JS
```javascript
var root = new njsNode("Cars");

// Magic! Not throw 'TypeError: Cannot set property of undefined'
root["Models"]["Ford"]["Fiesta"] = "Comment for Fiesta";  
root["Models"]["Ford"]["Focus"] = "Comment for Focus";
root["Models"]["Ford"]["Mustang"] = "Comment for Mustang";

root["Models"]["BMW"]["320"] = "Comment for 320"; 
root["Models"]["BMW"]["X3"] = "Comment for X3";
root["Models"]["BMW"]["X5"] = "Comment for X5";

root["Models"]["Fiat"]["500"] = "Comment for 500"; 
root["Models"]["Fiat"]["Panda"] = "Comment for Panda";

// Output
console.log(root.toString(0, false)); // do not show [type] 
```
`let` Result
```text
Cars: 
  Models: 
    Ford: 
      Fiesta: 'Comment for Fiesta'
      Focus: 'Comment for Focus'
      Mustang: 'Comment for Mustang'
    BMW: 
      320: 'Comment for 320'
      X3: 'Comment for X3'
      X5: 'Comment for X5'
    Fiat: 
      500: 'Comment for 500'
      Panda: 'Comment for Panda'
```





 
