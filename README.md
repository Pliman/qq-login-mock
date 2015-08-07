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