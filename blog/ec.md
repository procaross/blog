---
slug: /ec
title: 深入理解：ECMAScript 3中的执行上下文
authors: Proca
keywords: [tutorials, 执行上下文, this, 作用域链]
tags: [tutorials, 执行上下文, this, 作用域链]
date: 2022-09-02 23:50:00 +0800
---



## 导语

如果你已经接触了一段时间的JavaScript，你或多或少地会接触到一个名为“**执行上下文**”的术语。跟我们在进行文学鉴赏时涉及的“上下文”不同，执行上下文（**Execution Context**）指的是JavaScript引擎解析**可执行代码片段**时创造的一种环境，因此，执行上下文也被称为执行环境.

但是，“由JavaScript引擎创造的一种环境”？，好像理解起来还是有些抽象：以什么机制创造的？创造了什么样的环境？有这些疑惑很正常，这也正是本文所要解决的问题.

让我们先从古老的 *ECMAScript 3 规范* 中的执行上下文了解起
<!--truncate-->
## 执行上下文的类型


上面提到，执行上下文是JavaScript引擎在解析**可执行代码片段**时创造的一种环境，**可执行代码**有三种类型：

1. 全局代码
2. 函数代码
3. Eval代码

因此，执行上下文（执行环境）也有三种类型：

1. 全局执行上下文
2. 函数执行上下文
3. Eval函数执行上下文

### 全局执行上下文

全局执行上下文，是执行上下文中最基础的执行上下文，在程序运行时，它会一直存在于**执行上下文栈(Execution Context Stack, ECS)**的底部，直到程序运行结束它才会出栈。全局执行上下文的 **变量对象(VO)**（这一概念我们将在稍后介绍）是**全局对象**，在客户端环境，你可以在顶层代码中通过`this`来访问这个对象。但无论是客户端还是服务端，最好还是使用`globalThis`，以免出现意料之外的情况。

### 函数执行上下文

每次函数被调用，JavaScript引擎都会同时创建一个新的函数执行上下文，并将该函数执行上下文压入ECS栈顶；当函数执行完毕，该函数执行上下文便被弹出，控制权被交回栈中的下一层执行上下文.

### Eval函数执行上下文
在开发中，我们很少使用也避免使用Eval函数，因此本文不对此进行讨论.


## 执行上下文的内容

为了更好地理解执行上下文，我们可以将其视为一个对象(Object)。一般来说，该“对象”由以下内容组成：

1. 变量对象（Variable Object, VO）
2. 活动对象（Active Object, AO）
3. 作用域链 （Scope Chain）
4. 调用者信息 （this）

### 变量对象 （Variable Object）

> Every execution context has associated with it a variable object. Variables and functions declared in the source text are added as properties of the variable object. For function code, parameters are added as properties of the variable object.

“每个执行上下文都有一个变量对象与之相关联。在源代码中声明的函数以及变量，都将被添加到变量对象对应的属性中。对于函数代码，函数的参数也被作为变量对象的属性被添加。”

以上是ECMAScript 3 规范对于变量对象特性的定义，再结合[原文](https://interglacial.com/javascript_spec/a-10.html#:~:text=10.1.3%20Variable%20Instantiation-,Every%20execution%20context%20has%20associated%20with%20it%20a%20variable%20object.%20Variables%20and%20functions%20declared%20in%20the%20source%20text%20are%20added%20as%20properties%20of%20the%20variable%20object.%20For%20function%20code,%20parameters%20are%20added%20as%20properties%20of%20the%20variable%20object.,-Which%20object%20is)中其他相关的规范描述，我们发现变量对象包括以下内容：

 1. 函数形参（在函数上下文中）
 2. 函数声明
 3. 变量声明

还是有些抽象，让我们来看个具象的例子

观察以下代码：
~~~javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
~~~
在引擎分析代码时（亦即进入执行上下文时），变量对象大体是这样的：
~~~javascript
VO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
~~~
可以发现，正如规范中所描述的那样，在源代码中声明的变量、函数（`b`, `c`, `d`）以及函数的参数（`a`）都作为属性添加到变量对象中了，唯一有点难懂的是`arguments`，它是哪里来的？

事实上，在学习有关函数的内容时，我们接触过以下知识：

> 调用函数时，会为其创建一个Arguments对象，并自动初始化局部变量arguments，指代该Arguments对象。所有作为参数传入的值都会成为Arguments对象的数组元素

原来如此！arguments指代一个类数组对象！在这个例子中，arguments对象中的属性`0`指代的是传入该函数的第一个参数 `a`，`length`代表该函数接收到的参数个数（不一定与函数定义中的形参个数相同）

让我们回到正题。当我们以上的代码由分析阶段进入到执行阶段后，变量对象的具体内容也会发生变化。现在，变量对象大体是这样的：
~~~javascript
VO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
~~~
可以看到现在被初始化的变量/函数不仅仅包含Arguments对象中的变量，还包括在函数代码中声明并初始化的变量`b`, `c`, `d`.

综合两个阶段中变量对象的内容，以及ECMAScript 3规范我们可以得出以下结论：

1. 函数执行上下文中，在代码分析阶段，变量对象中会添加变量、函数以及函数形式参数的标识符作为属性
2.  函数执行上下文中，在代码分析阶段，变量对象中只有Arguments对象与形参会被初始化，其他属性值将为`undefined`。但是，如果函数调用方未提供完整的参数，缺失的参数将为`undefined`.
3. 函数执行上下文中，在代码执行阶段，会根据代码修改变量对象的属性值.

关于以上第一点，有一些事情需要注意的。观察以下代码：

~~~javascript
function foo() {
	console.log(b);
	
	var b = 3;
	function b() {}
}

foo();
~~~
输出如下：
~~~javascript
[Function: b]
~~~
输出为函数而非`undefined`，这是因为在分析代码（进入执行上下文）时，首先会处理函数声明，其次会处理变量声明，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。因此，在执行到语句`var b = 3;`前，变量对象中属性`b`对应的值是函数而非`undefined`.

### 顺带一提：全局对象
以上我们介绍的都是变量对象在函数执行上下文中的表现，在*“执行上下文的类型”*中，我们提到**全局执行上下文**中的变量对象为**全局对象**。全局对象较上述函数执行上下文中的变量对象不同，主要有以下特征：

1. 在顶层代码中可以通过`this`引用，或在任何地方通过`globalThis`引用.

2. 内部预定义了大量的函数与属性。正因如此，`Math.random()`与`globalThis.Math.random()`才能实现同样的功能.

3. 通过`var`关键字定义的全局变量以及顶层代码中的函数都会被挂载为全局对象的属性.

4. 全局对象是**作用域链**（稍后将会介绍）的头.


### 活动对象	（Active Object）

ECMAScript 3对活动对象（Active Object, AO）的描述如下：

> When control enters an execution context for function code, an object
> called the activation object is created and associated with the
> execution context. The activation object is initialised with a
> property with name arguments and attributes { DontDelete }. The
> initial value of this property is the arguments object described
> below. The activation object is then used as the variable object for
> the purposes of variable instantiation

简单来说，当函数进入执行阶段，原来不能被访问的变量对象（VO）就会被激活为一个活动对象（AO），如此这般，我们才能访问到变量对象中的各种属性。变量对象与活动对象实际上是同一个东西，只是处于执行上下文的不同生命周期中。

### 作用域链 （Scope Chain）

我们知道，作用域确定当前执行代码对变量的访问权限。在ECMAScript 3规范下，当需要查找变量时，会先从当前执行上下文的变量对象中寻找，若查找无果，则从父级执行上下文的变量对象中查找，若仍然无果，则继续向上查找，直到获取到该变量或已查找到全局执行上下文的变量对象（`globalThis`）。而作用域链就是以各级执行上下文的变量对象作为节点，并将其以一定顺序链接而组成的链表。

为了深入理解执行上下文，有必要对作用域链的形成过程进行介绍：
对于以下代码：
~~~javascript
function func() {
	var a = 1;
}
func();
~~~
1. 当一个函数被创建，会将所有父变量对象保存到一个名为`[[scope]]`的函数属性中
~~~javascript
func.[[scope]] = globalContext.VO;
~~~
2. 当该函数被调用，JavaScript引擎创建该函数的执行上下文，并将其压入执行上下文栈栈顶.
~~~javascript
ECStack = [
	funcContext,
    globalContext
];
~~~
3. JavaScript引擎复制该函数的`[[scope]]`属性，在函数执行上下文中创建作用域链.
~~~javascript
funcContext = {
	scopeChain: func.[[scope]],
}
~~~

4. 使用`arguments`创建变量对象（VO），随后按照前面提到的顺序，初始化活动对象，加入形参、函数声明、变量声明.
~~~javascript
funcContext = {
	VO: {
		arguments: {
			length: 0
		},
		a: undefined
	},
	scopeChain: func.[[scope]],
}
~~~

6. 变量对象（VO）被激活为活动对象（AO），并被压入作用域链的表头
~~~javascript
funcContext = {
	AO: {
		arguments: {
			length: 0
		},
		a: undefined
	},
	scopeChain: [AO, func.[[scope]]],
}
~~~

至此，函数`func`的完整作用域链创建完成.

### 调用者信息（this）

如果当前函数作为对象方法调用，或使用`bind` `call` `apply`等方法调用，则引擎会将对应的调用者信息（`this`）存入当前执行上下文中。否则，调用者信息将默认地被设置为全局对象（`globalThis`）.

以上只是对确认`this`的笼统概括。囿于篇幅，关于`this`的细节我们将在另一篇博文中介绍.

### 总结：执行上下文内容

综上所述，执行上下文的内容大致如下：
~~~javascript
executionContext：{
	[Variable Object | Activation Object]：{ 
		 arguments,
		 variables: [...],
		 funcions: [...] 
	},
	scopeChain: VO|AO.concat([[scope]]),
	thisValue: context object
}
~~~

## 执行上下文的生命周期
执行上下文的生命周期分为以下阶段：

1. 创建阶段
2. 执行阶段
3. 销毁阶段 

在创建阶段，变量对象（VO）、作用域链（Scope Chain）以及调用者信息（this）**依次**被创建；在执行阶段，JavaScript引擎利用**作用域链**及**执行上下文栈**，一条条地执行代码。 事实上，执行上下文各个部分在“创建阶段”以及“执行阶段”的细节，我们已在“执行上下文的内容”中熟悉；而对于“销毁阶段”，我们还比较陌生。

### 销毁阶段

当一个函数执行完毕，它的执行上下文将从执行上下文栈中弹出，并于特定时期被**垃圾回收**，控制权被交给此时位于执行上下文栈 **栈顶** 的执行上下文。

然而，这只是一般情况。在实际开发中，我们或多或少还会遇到另一种情况：闭包。

> [闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming)) 是指一个函数可以记住其外部变量并可以访问这些变量。

基于垃圾回收机制的知识，我们知道：当一个对象不再可达后（如果一个值可以通过引用链从根访问任何其他值，则认为该值是可达的），将会被JavaScript引擎中的垃圾回收器删除。而一个函数执行完毕后，即使它的执行上下文从栈中弹出，也不一定要被垃圾回收，因为它不一定是不可达的。也就是说，一个函数可以在仍然可达的状态下执行完毕，如以下代码：

~~~javascript
function wrapper() {
	var outer = 1;
	return function() {
		console.log(outer);
	}
}

var spy = wrapper();
spy();// 1
~~~

当函数`warpper`执行完成，它的执行上下文就要从栈中被弹出，执行上下文中的作用域链也将被销毁。然而，函数`spy`仍然在引用`warpper`函数的变量对象，亦即`warpper`函数的变量对象可达，因此，垃圾回收器不会将其销毁.

## 总结

基于以上的学习，我们现在知道：

1. 执行上下文分为三种类型：全局执行上下文、函数执行上下文、Eval函数执行上下文
2. 无论是哪种执行上下文，都包含了变量对象或活动对象、作用域链、调用者信息三部分内容
3. 无论是哪种执行上下文，都要经历构建、执行、销毁三个阶段












