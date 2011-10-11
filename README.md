**﻿Quick Form是一个用来显示并编辑数据的组件。**  

# API：  
**Form.create( node )**  
@param node: （符合HTML语法的）字符串/DOM节点，必选。  
@return form，拥有某些特殊方法（fill，fetch，clean）的DOM节点。  

**form.fill( data )**  
在合适的表单元素中填充数据。  
@param data 对象，必填。如 data = {"user": { "name": "sofosogo" }} 将会使用"sofosogo"作为name属性为user.name的表单元素的值。  
@return form，返回自身。 
  
**form.fetch()**  
获取所有合适的表单元素的值。  
@return data，JSON类型的数据。  

**form.clean()**  
将所有合适的表单元素的值清空。  
@return form，返回自身。  

# Q && A  
1. 所有可以的处理的节点类型有哪些？  
input，除了type属性为image，file，reset，button和submit不处理以外，其他的如text，radio，checkbox，hidden**等**都会处理。  
textarea 所有，  
select（single，multiple） 所有。 