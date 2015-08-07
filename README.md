# qq-login-mock

测试服务器地址：
http://121.42.52.101:3002/index.html
测试用户
Tom / 1111
Jerry / 2222

一共三个服务器，分别是：
app.js 应用服务器
oauth2-server.js oauth2服务器 oauth2流程选的是"Username and Password Flow"，可以根据实际情况进行修改
oauth2服务端使用了oauth2-provider oauth2客户端使用了node-odata来获取access_token
data-server.js 数据服务器(odata)，理论上data-server.js只能由oauth2-server.js
三个服务器可以分开部署，也可以部署在一起

浏览器只支持较新的chrome和safari，其他浏览器兼容性，暂时不考虑

程序github主页
https://github.com/Pliman/qq-login-mock
提交记录可以看出进展情况
https://github.com/Pliman/qq-login-mock/commits/master

实现情况说明：

实现了主体业务，登陆界面行为完整的实现了，其他细节暂不实现，比如头像上传服务器一份，可能涉及到详细的软件架构和服务器部署结构

本来可以实现点下拉选账号，图标变化的，结果没找到向上的图标，就没花时间了

测试时间仓促，可能会有些小bug

------------------
分析后的部分功能点：

//进去登陆界面，自动填充最后一个登陆用户，密码框填充假字符，用户站位，默认登陆使用已经保存的用户名密码，如果用户输入用户名，清空密码栏，并且不能使用已经保存的用户名密码登陆，如果用户重新输入密码，使用新密码登陆，不适用已经保存的密码
//加载最近登陆用户列表
//登陆成功，添加到列表 -- 如果已经添加，设为最近登陆用户，更新界面
//删除已登录用户，将上一个登陆用户，设为最近登陆，更新界面
//点击某个用户，切换用户
//退出登录功能
//如果没有退出当前登录，直接输入新用户名和密码登陆，视为用新用户登陆
//列表界面
//背景
//头像居中
//箭头改为下拉
//登陆按钮美化
//dropdown控件
//可以清空输入的动态"X"

//oauth2.0 username password
==>认证，获取登陆用户 -- 'users', {name: 'Tom', avatar: 'u1.png'}
curl -i -X POST -d '{"name": "Tom", "password": "b59c67bf196a4758191e42f76670ceba", "avatar":"u1.png"}' -H "Content-Type: application/json" http://127.0.0.1:3000/users
密码1111
curl -i -X POST -d '{"name": "Jerry", "password": "934b535800b1cba8f96a5d72f72f1611", "avatar":"u2.png"}' -H "Content-Type: application/json" http://127.0.0.1:3000/users
密码2222

//服务器部署
