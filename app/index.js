'use strict';

// 是否使用已保存密码登录
var useSavedPass = false;
var lastMD5Pass = '';
var loginedUsers = null;

// 输入框事件
$('#userName').keyup(function () {
	if (useSavedPass) {
		$('#userPassword').val('');
	}

	useSavedPass = false;
	focusUserName();
});

$('#userPassword').keyup(function () {
	useSavedPass = false;
	focusUserPassword();
});

$('#userName').focus(focusUserName);

function focusUserName() {
	$('#userPasswordCleaner').css('visibility', 'hidden');

	if (!$('#userName').val()) {
		$('#userNameCleaner').css('visibility', 'hidden');
		return;
	}

	$('#userNameCleaner').css('visibility', 'visible');
}

$('#userPassword').focus(focusUserPassword);

function focusUserPassword() {
	$('#userNameCleaner').css('visibility', 'hidden');

	if (!$('#userPassword').val()) {
		$('#userPasswordCleaner').css('visibility', 'hidden');
		return;
	}

	$('#userPasswordCleaner').css('visibility', 'visible');
}

$('#userChanger').click(function(e){
	e.stopImmediatePropagation();
	$(this).parent().addClass("hover");
	$('ul.dropdown').find('ul').animate({
		opacity: 1
	}, 100, 'ease-out');

	$(document).click(function () {
		$('#userChanger').parent().removeClass("hover");
		$(document).unbind("click");;
	});
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
	var div = $('<div class="ui-form-item-lg logined-user"></div>');
	div.click(function () {
		setCurrentLoginedUser(loginedUser);
	});

	var tplHTML = '&nbsp;&nbsp;&nbsp;<div class="ui-avatar-s" style="display:inline-block;vertical-align: middle">' +
			'<span style="background-image:url(./upload/<%=avatar%>)"></span>' +
			'</div>' +
		'<span>&nbsp;&nbsp;&nbsp;<%=name%></span>' +
		'<a onclick="removeLoginedUser(event, \'<%=name%>\')" class="ui-icon-close ui-form-item-lg" style="font-size: 36px;"></a>';
	div.append($.tpl(tplHTML,{avatar: loginedUser.avatar, name: loginedUser.name}));

	$('#loginedUsers').append(div);
}

function setLoginedUsersList(loginedUsers) {
	$('#loginedUsers').html('');

	loginedUsers.forEach(addLoginedUser);
}

// 页面事件
$('#login').click(function (evt) {
	if (!$('#userName').val()) {
		return showError('请输入用户名');
	}

	if (!useSavedPass && !$('#userPassword').val()) {
		return showError('请输入密码');
	}

	$.ajax({
		url: '/login',
		type: 'post',
		cache: false,
		dataType: 'json',
		data: {
			userName: $('#userName').val(),
			userPassword: useSavedPass ? lastMD5Pass : md5($('#userPassword').val())
		},
		success: function (rtn) {
			if (rtn.result === 'SUCCESS') {
				addToLoginedUsers(rtn.data);
				window.location.href = '/success.html';
			} else {
				showError('账号或密码错误，请重新输入');
			}
		},
		error: function (rtn) {
			showError('账号或密码错误，请重新输入');
		}

	});
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

	//setLoginedUsers(loginedUsers);
}

function showError(msg) {
	$.tips({
		content:msg,
		stayTime:2000,
		type:"warn"
	});
}

function removeLoginedUser(event, userName) {
	event.stopImmediatePropagation();

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