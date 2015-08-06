'use strict';

// 是否使用已保存密码登录
var useSavedPass = false;
var lastMD5Pass = '';
var loginedUsers = null;

// 输入框事件
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
	setCurrentLoginedUser(loginedUsers.lastLoginedUser);
	useSavedPass = true;

	setLoginedUsersList(loginedUsers.loginedUsers);
}

function setCurrentLoginedUser(lastLoginedUser) {
	if (!lastLoginedUser) {
		$('#userName').val('');
		$('#userPassword').val('');
		$('#avatar').css('background-image', '');
		return;
	}

	$('#userName').val(lastLoginedUser.name);
	$('#userPassword').val('xxxxxxxxxxxxxxxx');
	lastMD5Pass = lastLoginedUser.password;
	$('#avatar').css('background-image', 'url(./upload/' + lastLoginedUser.avatar + ')');
}

function addLoginedUser(loginedUser) {
	var div = $('<div class="ui-form-item ui-border-b"></div>');
	div.click(function () {
		setCurrentLoginedUser(loginedUser);
	});

	var tplHTML = '<div class="ui-avatar-s">' +
			'<span id="avatar" style="background-image:url(./upload/u1.png)"></span>' +
			'</div>' +
			'<input type="text" readonly value="<%=name%>">' +
		'<a href="javascript:removeLoginedUser(\'<%=name%>\')" class="ui-icon-close"></a>';
	div.append($.tpl(tplHTML,{name: loginedUser.name}));
	$('#loginedUsers').append(div);
}

function setLoginedUsersList(loginedUsers) {
	$('#loginedUsers').html('');

	loginedUsers.forEach(addLoginedUser);
}

// 页面事件
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
		// 如果登陆过，设置为最新登录用户
		var userIndex = -1;

		for (var i = 0; i < loginedUsers.loginedUsers.length; i++) {
			var loginedUser = loginedUsers.loginedUsers[i];

			if (loginedUser.name === user.name) {
				userIndex = i;
				break;
			}
		}

		if (userIndex !== -1) {
			loginedUsers.loginedUsers.splice(userIndex, 1);
		}

		loginedUsers.loginedUsers.push(user);
		loginedUsers.lastLoginedUser = user;
	} else {
		loginedUsers = {loginedUsers: [user], lastLoginedUser: user}
	}

	saveLoginedUsers(loginedUsers);

	setLoginedUsers(loginedUsers);
}

function showError(msg) {
	$.tips({
		content:msg,
		stayTime:2000,
		type:"warn"
	});
}

function removeLoginedUser(userName) {
	_.remove(loginedUsers.loginedUsers, function (loginedUser) {
		return loginedUser.name === userName;
	});

	if (loginedUsers.loginedUsers.length) {
		loginedUsers.lastLoginedUser = loginedUsers.loginedUsers.slice(-1)[0];
	} else {
		loginedUsers.lastLoginedUser = null;
	}

	saveLoginedUsers(loginedUsers);

	setLoginedUsers(loginedUsers);
}

function saveLoginedUsers(loginedUsersObj) {
	LocalStorageDao.put(loginedUsersKey, JSON.stringify(loginedUsersObj));
}