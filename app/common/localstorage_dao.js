'use strict';

var storagePrefix = 'qq-login-mock_';

var LocalStorageDao = {
	// apis
	get: function (key) {
		return localStorage.getItem(storagePrefix + key);
	},
	add: function (key, obj) {
		// 如果属性存在，不报错，不覆盖已有值，直接返回
		if (localStorage.getItem(storagePrefix + key)) {
			return localStorage.getItem(storagePrefix + key);
		} else {
			localStorage.setItem(storagePrefix + key, obj);
			return obj;
		}
	},
	put: function (key, obj) {
		// 如果key存在，直接更新，如果不存在，新建
		try {
			localStorage.setItem(storagePrefix + key, obj);
			return obj;
		} catch (e) {
			return e;
		}
	},
	remove: function (key) {
		var obj = localStorage.getItem(storagePrefix + key);
		localStorage.removeItem(storagePrefix + key);
		return obj;
	}
};