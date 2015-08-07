function logout() {
	$.ajax({
		url: '/login-out',
		type: 'post',
		cache: false,
		success: function (rtn) {
			if (rtn.result === 'SUCCESS') {
				window.location.href = '/index.html';
			}
		},
		error: function (rtn) {
		}
	});
}