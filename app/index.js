'use strict';

// 是否使用已保存密码登录
var useSavedPass = false;
var lastMD5Pass = '';
var loginedUsers = null;

// 绑定页面事件
$('#userName').keyup(function () {
	$('#userPassword').val('');
	useSavedPass = false;
});

$('#userPassword').keyup(function () {
	useSavedPass = false;
});

// 加载本地已经登录的用户
var loginedUsersKey = 'logined-users';
var loginedUsersStr = LocalStorageDao.get(loginedUsersKey);

if (loginedUsersStr) {
	loginedUsers = JSON.parse(loginedUsersStr);

	setLoginedUsers(loginedUsers);
}

function setLoginedUsers(loginedUsers) {
	setLastLoginedUser(loginedUsers.lastLoginedUser);
	useSavedPass = true;

	loginedUsers.loginedUsers.forEach(addLoginedUser);
}

function setLastLoginedUser(lastLoginedUser) {
	$('#userName').val(lastLoginedUser.name);
	$('#userPassword').val('xxxxxxxxxxxxxxxx');
	lastMD5Pass = lastLoginedUser.password;
	$('#avatar').css('background-image', 'url(./upload/' + lastLoginedUser.avatar + ')');
}

function addLoginedUser(loginedUser) {
	var tplHTML = '<div class="ui-form-item ui-border-b">' +
		'<div class="ui-avatar-s">' +
		'<span id="avatar" style="background-image:url(./upload/u1.png)"></span>' +
		'</div>' +
		'<input type="text" readonly value="<%=name%>">' +
		'<a href="#" class="ui-icon-close"></a>' +
		'</div>';
	$('#loginedUsers').append($.tpl(tplHTML,{name: loginedUser.name}));
}

// 登录事件
$('#login').click(function (evt) {
	evt.stopImmediatePropagation();
	$.post('/login', {
		userName: $('#userName').val(),
		userPassword: useSavedPass ? lastMD5Pass : md5($('#userPassword').val()),
	}, function (rtn) {
		if (rtn.result === 'SUCCESS') {
			addToLoginedUsers(rtn.data);
		} else {
			showError(rtn.msg);
		}
	}, 'json');
});

function addToLoginedUsers(user) {
	if (loginedUsers) {
		loginedUsers.loginedUsers.push(user);
		loginedUsers.lastLoginedUser = user;
	} else {
		loginedUsers = {loginedUsers: [user], lastLoginedUser: user}
	}

	LocalStorageDao.put(loginedUsersKey, JSON.stringify(loginedUsers));
}

function showError(msg) {
	$.tips({
		content:msg,
		stayTime:2000,
		type:"warn"
	});
}