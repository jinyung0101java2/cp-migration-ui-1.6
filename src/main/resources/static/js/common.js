
const func = {

	url : URI_REQUEST_CP_API,
	catalogUrl : URI_REQUEST_CATALOG_API,
	chaosUrl : URI_REQUEST_CHAOS_API,
	ui : 'http://localhost:8091/',
	nameLoad : new function(){},
	clusterData:  new Object(),
	nameData : new Object(),
	createIm : '',
	depth1 : '',
	depth2 : '',

	init(depth1, depth2){

		// Locale Language 조회
		func.getLocaleLang();
		func.event();
	},

	event(){
		// navigation
		var nav = document.querySelector('nav').querySelectorAll('.dep01');

		for(var i=0; i<=nav.length-1; i++){
			nav[i].addEventListener('click', (e) => {
				e.stopPropagation();

			for(var j=0; j<=nav.length-1; j++){
				nav[j].parentNode.classList.toggle('on', false);
			};

			e.target.parentNode.classList.toggle('on', true);
		}, false);
		};

		// search
		if(document.getElementById('search') != null){
			document.getElementById('search').addEventListener('click', (e) => {
				if(e.target.parentNode.classList != 'on'){
				e.target.parentNode.classList.toggle('on');
			} else {
				if(document.getElementById('searchText').value != ''){
					IS_SEARCH = true;
					func.nameLoad();
				};
			}
		}, false);

			document.getElementById('searchText').onkeydown = function(event) {
				if(event.keyCode === 13){
					IS_SEARCH = true;
					func.nameLoad();
				};
			};

			document.getElementById('searchText').onkeyup = function(event) {
				document.getElementById('searchText').value = document.getElementById('searchText').value.replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,'');
			};
		};

		// logout event
		document.getElementById('logout').addEventListener('click', (e) => {
			func.alertPopup('Sign Out', MSG_WANT_TO_SIGN_OUT + '<br><p id="logout-sub">' + MSG_INTEGRATED_SIGN_OUT_TAKES_PLACE + '</p>', true, MSG_CONFIRM, func.logout);
	}, false);

	},

	logout(){
		sessionStorage.clear();
		movePage(URI_CP_LOGOUT);
	},

	clusters(data){
		var html ='';
		for(
			var i=0; i<=data.items.length-1; i++){
			html += `<li><a href="javascript:;" data-name="${data.items[i].clusterId}" data-type="${data.items[i].clusterType}">${data.items[i].clusterName}</a></li>`;
		};

		document.getElementById("clusterListUl").innerHTML = html;

		/////////////////////
		if(sessionStorage.getItem('cluster') != null){
			document.querySelector('.clusterTop').innerText = sessionStorage.getItem('clusterName');
		} else {
			document.querySelector('.clusterTop').innerText = data.items[0].clusterName;
			sessionStorage.setItem('cluster', data.items[0].clusterId);
			sessionStorage.setItem('clusterName', data.items[0].clusterName);
			sessionStorage.setItem('clusterType', data.items[0].clusterType);
		};

		var name = document.querySelector('.clusterUl').querySelectorAll('a');
		func.setUserAuthority(sessionStorage.getItem('cluster'), data.items);

		//cluster click event
		for(var i=0 ; i<name.length; i++){
			name[i].addEventListener('click', (e) => {
				sessionStorage.setItem('cluster' , e.target.getAttribute('data-name'));
				sessionStorage.setItem('clusterType' , e.target.getAttribute('data-type'));
				sessionStorage.setItem('clusterName', e.target.innerText);
				document.querySelector('.clusterTop').innerText = e.target.innerText;
				sessionStorage.removeItem('nameSpace');
				func.setUserAuthority(sessionStorage.getItem('cluster'), data.items);
				IS_RELOAD = true;
				func.loadData('GET', `${func.url}clusters/${sessionStorage.getItem('cluster')}/users/namespacesList`, 'application/json', func.namespaces);
			}, false);
		};

		func.loadData('GET', `${func.url}clusters/${sessionStorage.getItem('cluster')}/users/namespacesList`, 'application/json', func.namespaces);

	},

	namespaces(data){
		func.nameData = data;

		var html = '';
		if(document.querySelector('.nameSpace')){
			for(var i=0; i<=data.items.length-1; i++){
				var namespace = data.items[i].cpNamespace;
				html += `<li><a href="javascript:;" data-name="${namespace}">${namespace}</a></li>`;
			};

			document.getElementById("namespaceListUl").innerHTML = html;

			if(sessionStorage.getItem('nameSpace') != null){
				document.querySelector('.nameTop').innerText = sessionStorage.getItem('nameSpace');
			} else {
				document.querySelector('.nameTop').innerText =  data.items[0].cpNamespace;
				sessionStorage.setItem('nameSpace', data.items[0].cpNamespace);
			};

			var name = document.querySelector('.nameSpace').querySelectorAll('a');

			for(var i=0 ; i<name.length; i++){
				name[i].addEventListener('click', (e) => {
					sessionStorage.setItem('nameSpace' , e.target.getAttribute('data-name'));
				document.querySelector('.nameTop').innerText = e.target.innerText;
				if(IS_NAMELOAD) {
					func.loadData('GET', null, 'application/json', func.nameLoad);
				}
				else {
					movePage(URI_CP_INDEX_URL);
				}
			}, false);

			};

			if(IS_RELOAD) {
				if(IS_NAMELOAD) {
					func.loadData('GET', null, 'application/json', func.nameLoad);
				}
				else {
					movePage(URI_CP_INDEX_URL);
				}
			}
			if(IS_INDEX) {
				func.loadData('GET', null, 'application/json', func.nameLoad);
			}
		};
	},

	apply(title, url, btnName, name){
		sessionStorage.setItem('vaultDbName' , name);
		var html = `<div class="modal-wrap" id="modal">
			<div class="modal midium">
				<h5>${title}</h5>
				<dl>
					<dt>Application</dt>
					<dd>
						<fieldset>
							<select id="createApp" class="createApp">
							</select>
						</fieldset>
					</dd>
				</dl>
				<a class="confirm" href="javascript:;">${btnName}</a>
				<a class="close" href="javascript:;">`+ MSG_CLOSE + `</a>
			</div>
		</div>`;

		func.appendHtml(document.getElementById('wrap'), html, 'div');

		func.loadData('GET', `${func.url}clusters/${sessionStorage.getItem('cluster')}/namespaces/${sessionStorage.getItem('nameSpace')}/deployments/vaultSecret`, 'application/json', applicationDraw);

		function applicationDraw(data) {
			for(var i=0; i<=data.items.length-1; i++){
				var application = data.items[i].name;
				var html = `<option value="${application}">${application}</option>`;
				func.appendHtml(document.getElementById('createApp'), html, 'select');
			};
		}

		if(sessionStorage.getItem('nameSpace') == NAMESPACE_ALL_VALUE) {
			document.getElementById('createApp').selectedIndex = 0;}
		else {
			document.getElementById('createApp').value = sessionStorage.getItem('nameSpace');
		}

		document.getElementById('modal').querySelector('.close').addEventListener('click', (e) => {
			document.getElementById('wrap').removeChild(document.getElementById('modal'));
		}, false);


		document.getElementById('modal').querySelector('.confirm').addEventListener('click', (e) => {

			document.querySelector('.nameTop').innerHTML = sessionStorage.getItem('nameSpace');
			sessionStorage.setItem('appName' , document.querySelector('#createApp > option:checked').value);
			document.getElementById('wrap').removeChild(document.getElementById('modal'));

			var sendData = JSON.stringify ({
				cluster : sessionStorage.getItem('cluster'),
				namespace : sessionStorage.getItem('nameSpace'),
				resourceName : sessionStorage.getItem('appName'),
				dbService : sessionStorage.getItem('vaultDbName')
			});

			func.saveData('POST', `${func.url}clusters/${sessionStorage.getItem('cluster')}/namespaces/${sessionStorage.getItem('nameSpace')}/${url}/vault/application`, sendData, true, 'application/json', func.historyBack);
		}, false);
	},

	create(title, url, name){
		var html = `<div class="modal-wrap" id="modal">
			<div class="modal midium">
				<h5>${title}</h5>
				<dl>
					<dt>Namespace</dt>
					<dd>
						<fieldset>
							<select id="createName">
							</select>
						</fieldset>
					</dd>
				</dl>
				<dl>
					<dt>YAML</dt>
					<dd>
						<textarea></textarea>
					</dd>
				</dl>
				<a class="confirm" href="javascript:;">${name}</a>
				<a class="close" href="javascript:;">`+ MSG_CLOSE + `</a>
			</div>
		</div>`;

		func.appendHtml(document.getElementById('wrap'), html, 'div');

		for(var i=0; i<=func.nameData.items.length-1; i++){
			var namespace = func.nameData.items[i].cpNamespace;
			if(namespace != NAMESPACE_ALL_VALUE){
				var html = `<option value="${namespace}">${namespace}</option>`;
				func.appendHtml(document.getElementById('createName'), html, 'select');
			};
		};

		if(sessionStorage.getItem('nameSpace') == NAMESPACE_ALL_VALUE) {
			document.getElementById('createName').selectedIndex = 0;}
		else {
			document.getElementById('createName').value = sessionStorage.getItem('nameSpace');
		}

		document.getElementById('modal').querySelector('.close').addEventListener('click', (e) => {
			document.getElementById('wrap').removeChild(document.getElementById('modal'));
	}, false);


		document.getElementById('modal').querySelector('.confirm').addEventListener('click', (e) => {
			var input = document.getElementById('modal').querySelector('textarea');

		sessionStorage.setItem('nameSpace' , document.getElementById('createName').value);
		document.querySelector('.nameTop').innerHTML = sessionStorage.getItem('nameSpace');

		document.getElementById('wrap').removeChild(document.getElementById('modal'));


		var sendData = JSON.stringify ({
			cluster : sessionStorage.getItem('cluster'),
			namespace : sessionStorage.getItem('nameSpace'),
			resourceName : url,
			yaml : input.value
		});


		func.saveData('POST', `${func.url}clusters/${sessionStorage.getItem('cluster')}/namespaces/${sessionStorage.getItem('nameSpace')}/${url}`, sendData, true, 'application/json', func.refresh);
	}, false);
	},

	modify(data){
		var html = `<div class="modal-wrap" id="modal">
			<div class="modal midium">
				<h5>Modify</h5>
				<dl>
					<dt>Namespace</dt>
					<dd>
						<fieldset>
							<select id="createName" disabled>
							</select>
						</fieldset>
					</dd>
				</dl>
				<dl>
					<dt>YAML</dt>
					<dd>
						<textarea>${data.sourceTypeYaml}</textarea>
					</dd>
				</dl>
				<a class="confirm" href="javascript:;">`+ MSG_SAVE +`</a>
				<a class="close" href="javascript:;">`+ MSG_CLOSE + `</a>
			</div>
		</div>`;

		func.appendHtml(document.getElementById('wrap'), html, 'div');

		for(var i=0; i<=func.nameData.items.length-1; i++){
			var namespace = func.nameData.items[i].cpNamespace;
			var html = `<option value="${namespace}">${namespace}</option>`;
			func.appendHtml(document.getElementById('createName'), html, 'select');
		};

		document.getElementById('createName').value = sessionStorage.getItem('nameSpace');

		document.querySelector('.nameTop').innerHTML = sessionStorage.getItem('nameSpace');

		document.getElementById('modal').querySelector('.close').addEventListener('click', (e) => {
			document.getElementById('wrap').removeChild(document.getElementById('modal'));
	}, false);


		document.getElementById('modal').querySelector('.confirm').addEventListener('click', (e) => {
			var input = document.getElementById('modal').querySelector('textarea');

		document.getElementById('wrap').removeChild(document.getElementById('modal'));

		var sendData = JSON.stringify ({
			cluster : sessionStorage.getItem('cluster'),
			namespace : sessionStorage.getItem('nameSpace'),
			resourceName : sessionStorage.getItem('commonName'),
			yaml : input.value
		});


		func.saveData('PUT', `${func.url}clusters/${sessionStorage.getItem('cluster')}/namespaces/${sessionStorage.getItem('nameSpace')}/${document.getElementById('modify').getAttribute('data-role')}/${sessionStorage.getItem('commonName')}`, sendData, true, 'application/json', func.history);
	}, false);
	},

	// 로그인 체크 ////////////////////////////////////////////////////////////////
	loginCheck(){
		var request = new XMLHttpRequest();

		request.open('GET', URI_CP_GET_USER_LOGIN_DATA, false);
		request.setRequestHeader('Content-type', 'application/json');

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE){
				if(request.status === 200){
					if(JSON.parse(request.responseText).httpStatusCode != 401){

						if(JSON.parse(request.responseText).accessToken == '-') {
							func.logout();
							return false;
						}

						sessionStorage.setItem('user' , JSON.parse(request.responseText).userId);
						sessionStorage.setItem('userType' , JSON.parse(request.responseText).userType);
						sessionStorage.setItem('token' , 'Bearer ' + JSON.parse(request.responseText).accessToken);


					} else {
						func.alertPopup('ERROR', JSON.parse(request.responseText).detailMessage, true, MSG_CLOSE, func.refresh);
					}
				} else {
					func.alertPopup('ERROR', JSON.parse(request.responseText).detailMessage, true, MSG_CLOSE);
				};
			};
		};

		request.send();
	},

	// Refresh 토큰 조회 ////////////////////////////////////////////////////////////////
	refreshToken(){
		var request = new XMLHttpRequest();

		request.open('GET', URI_CP_REFRESH_TOKEN, false);
		request.setRequestHeader('Content-type', 'application/json');

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE){
				if(request.status === 200){
					// 토큰 업데이트
					sessionStorage.setItem('token' , 'Bearer ' + JSON.parse(request.responseText).accessToken);
				} else {
					func.alertPopup('ERROR', JSON.parse(request.responseText).detailMessage, true, MSG_CLOSE);
				};
			};
		};

		request.send();
	},

	// Locale Language 조회 ////////////////////////////////////////////////////////////////
	getLocaleLang(){
		var request = new XMLHttpRequest();
		request.open('GET', URL_API_LOCALE_LANGUAGE, false);
		request.setRequestHeader('Content-type', 'application/json');

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE){
				if(request.status === 200){
					CURRENT_LOCALE_LANGUAGE = request.responseText;
					setSelectValue('u_locale_lang',request.responseText);
				} else {
					CURRENT_LOCALE_LANGUAGE = LANG_EN;
					setSelectValue('u_locale_lang',LANG_EN);
				};
			};
		};
		request.send();
	},

	// Locale Language 설정 ////////////////////////////////////////////////////////////////
	setLocaleLang(reqUrl){
		var request = new XMLHttpRequest();
		request.open('PUT', reqUrl, false);
		request.setRequestHeader('Content-type', 'application/json');

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE){
				if(request.status === 200){
					reloadPage();
				}
			};
		};
		request.send();
	},

	setUserAuthority(cluster, usersList){
		var authority ='';
		for(var i= 0; i < usersList.length; i++) {
			var users = usersList[i];
			if(users.clusterId === cluster) {
				authority = users.userType;
				break;
			}
		}
		var request = new XMLHttpRequest();
		request.open('PUT', URI_API_SET_CLUSTER_AUTHORITY, false);
		request.setRequestHeader('Content-type', 'application/json');

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE){
				if(request.status === 200){
				}
			};
		};
		request.send(authority);
	},
	/////////////////////////////////////////////////////////////////////////////////////
	// 데이터 로드 - loadData(method, url, callbackFunction)
	// (전송타입, url, 콜백함수)
	/////////////////////////////////////////////////////////////////////////////////////
	loadData(method, url, header, callbackFunction, list){
		if(sessionStorage.getItem('token') == null){
			func.loginCheck();
		};

		if(url == null) {
			callbackFunction();
			return false;
		}

		var request = new XMLHttpRequest();

		setTimeout(function() {
			request.open(method, url, false);
			request.setRequestHeader('Content-type', header);
			request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
			request.setRequestHeader('uLang', CURRENT_LOCALE_LANGUAGE);
			request.setRequestHeader('Accept-Language', CURRENT_LOCALE_LANGUAGE);

			request.onreadystatechange = () => {
				if (request.readyState === XMLHttpRequest.DONE){
					if(request.status === 200 && request.responseText != ''){
						var resultMessage = JSON.parse(request.responseText).resultMessage;
						var resultCode =  JSON.parse(request.responseText).resultCode;
						var detailMessage = JSON.parse(request.responseText).detailMessage;
						//토큰 만료 검사
						if( resultMessage == 'TOKEN_EXPIRED') {
							func.refreshToken();
							return func.loadData(method, url, header, callbackFunction, list);
						}
						else if(resultMessage == 'TOKEN_FAILED') {
							func.loginCheck();
							return func.loadData(method, url, header, callbackFunction, list);
						}
						else if(resultCode != RESULT_STATUS_SUCCESS) {
							if(document.getElementById('loading')){
								document.getElementById('wrap').removeChild(document.getElementById('loading'));
							};
							func.alertPopup('ERROR', detailMessage, true, MSG_CONFIRM, 'closed');
						}
						else {
							callbackFunction(JSON.parse(request.responseText), list);
						}
					} else if(JSON.parse(request.responseText).httpStatusCode === 500){
						sessionStorage.clear();
						func.loginCheck();
					};
				};
			};

			request.send(); },0);
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// 상태 데이터 로드 - statusLoadData(method, url, callbackFunction)
	// (전송타입, url, 콜백함수)
	/////////////////////////////////////////////////////////////////////////////////////
	statusLoadData(method, url, header, callbackFunction, list){
		if(sessionStorage.getItem('token') == null){
			func.loginCheck();
		};

		if(url == null) {
			callbackFunction();
			return false;
		}

		var request = new XMLHttpRequest();

		setTimeout(function() {
			request.open(method, url, false);
			request.setRequestHeader('Content-type', header);
			request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
			request.setRequestHeader('uLang', CURRENT_LOCALE_LANGUAGE);
			request.setRequestHeader('Accept-Language', CURRENT_LOCALE_LANGUAGE);

			request.onreadystatechange = () => {
				if (request.readyState === XMLHttpRequest.DONE){
					if(request.status === 200 && request.responseText != ''){
						var resultMessage = JSON.parse(request.responseText).resultMessage;
						var resultCode =  JSON.parse(request.responseText).resultCode;
						var detailMessage = JSON.parse(request.responseText).detailMessage;
						//토큰 만료 검사
						if( resultMessage == 'TOKEN_EXPIRED') {
							func.refreshToken();
							return func.loadData(method, url, header, callbackFunction, list);
						}
						else if(resultMessage == 'TOKEN_FAILED') {
							func.loginCheck();
							return func.loadData(method, url, header, callbackFunction, list);
						}
						else if(resultCode != RESULT_STATUS_SUCCESS) {
							if(document.getElementById('loading')){
								document.getElementById('wrap').removeChild(document.getElementById('loading'));
							};
							func.alertPopup('ERROR', detailMessage, true, MSG_CONFIRM, func.moveToMain);
						}
						else {
							callbackFunction(JSON.parse(request.responseText), list);
						}
					} else if(JSON.parse(request.responseText).httpStatusCode === 500){
						sessionStorage.clear();
						func.loginCheck();
					};
				};
			};

			request.send(); },0);

	},

	/////////////////////////////////////////////////////////////////////////////////////
	// 데이터 SAVE - saveData(method, url, data, bull, callFunc)
	// (전송타입, url, 데이터, 분기, 콜백함수)
	/////////////////////////////////////////////////////////////////////////////////////
	saveData(method, url, data, bull, header, callFunc){
		func.loading();

		if(sessionStorage.getItem('token') == null){
			func.loginCheck();
		};


		var request = new XMLHttpRequest();

		setTimeout(function() {
			request.open(method, url, false);
			request.setRequestHeader('Content-type', header);
			request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
			request.setRequestHeader('uLang', CURRENT_LOCALE_LANGUAGE);
			request.setRequestHeader('Accept-Language', CURRENT_LOCALE_LANGUAGE);

			request.onreadystatechange = () => {
				if (request.readyState === XMLHttpRequest.DONE){
					if(request.status === 200 && request.responseText != ''){

						//토큰 만료 검사
						if(JSON.parse(request.responseText).resultMessage == 'TOKEN_EXPIRED') {
							func.refreshToken();
							return func.saveData(method, url, data, bull, header, callFunc);
						}
						else if(JSON.parse(request.responseText).resultMessage == 'TOKEN_FAILED') {
							func.loginCheck();
							return func.loadData(method, url, header, callbackFunction, list);
						}
						else {
							document.getElementById('wrap').removeChild(document.getElementById('loading'));
							var response = JSON.parse(request.responseText);
							if (response.httpStatusCode == 200) {
								if(response.resultCode == RESULT_STATUS_SUCCESS) {
									func.alertPopup('SUCCESS', response.detailMessage, true, MSG_CONFIRM, callFunc);
								}
								else {
									func.alertPopup('ERROR', response.detailMessage, true, MSG_CONFIRM, 'closed');
								}
							}
							else {
								func.alertPopup('ERROR', response.detailMessage, true, MSG_CONFIRM, 'closed');
							}

						}
					} else {
						/*
                        if(method == 'DELETE'){
                            /func.alertPopup('DELETE', 'DELETE FAILED', func.winReload);
                        } else {
                            /func.alertPopup('SAVE', 'SAVE FAILED', func.winReload);
                        };
                        */
					};
				};
			};

			request.send(data); }, 0);
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// 데이터 SAVE - dryRun(method, url, data, bull, callFunc)
	// (전송타입, url, 데이터, 분기, 콜백함수)
	/////////////////////////////////////////////////////////////////////////////////////
	dryRun(method, url, data, bull, header, callFunc){
		func.loading();

		if(sessionStorage.getItem('token') == null){
			func.loginCheck();
		};

		var request = new XMLHttpRequest();

		setTimeout(function() {
			request.open(method, url, false);
			request.setRequestHeader('Content-type', header);
			request.setRequestHeader('Authorization', sessionStorage.getItem('token'));
			request.setRequestHeader('uLang', CURRENT_LOCALE_LANGUAGE);
			request.setRequestHeader('Accept-Language', CURRENT_LOCALE_LANGUAGE);

			request.onreadystatechange = () => {
				if (request.readyState === XMLHttpRequest.DONE){
					if(request.responseText != ''){
						//토큰 만료 검사
						if(JSON.parse(request.responseText).resultMessage == 'TOKEN_EXPIRED') {
							func.refreshToken();
							return func.saveData(method, url, data, bull, header, callFunc);
						}
						else if(JSON.parse(request.responseText).resultMessage == 'TOKEN_FAILED') {
							func.loginCheck();
							return func.loadData(method, url, header, callbackFunction, list);
						}
						else {
							document.getElementById('wrap').removeChild(document.getElementById('loading'));
							var response = JSON.parse(request.responseText);
							if (response.httpStatusCode == 200) {
								if(response.resultCode == RESULT_STATUS_SUCCESS) {
									callFunc(response);
								}
								else {
									if(document.getElementById('loading')){
										document.getElementById('wrap').removeChild(document.getElementById('loading'));
									};
									func.alertPopup('ERROR', response.detailMessage, true, MSG_CONFIRM, 'closed');
								}
							}
							else {
								if(document.getElementById('loading')){
									document.getElementById('wrap').removeChild(document.getElementById('loading'));
								};
								func.alertPopup('ERROR', response.detailMessage, true, MSG_CONFIRM, 'closed');
							}

						}
					}
				};
			};

			request.send(data); }, 0);
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// 공통 경고 팝업 - alertPopup(title, text, bull, name, fn)
	// (제목, 문구, 버튼유무, 버튼이름, 콜백함수)
	/////////////////////////////////////////////////////////////////////////////////////
	alertPopup(title, text, bull, name, callback){
		var html = `<div class='modal-wrap' id='alertModal'><div class='modal'><h5>${title}</h5><p>${text}</p>`;
		if(bull){
			html += `<a class='confirm' href='javascript:;'>${name}</a>`;
		};
		html += `<a class='close' href='javascript:;'>` + MSG_CLOSE + `</a></div></div>`;

		if(document.getElementById('alertModal') !== null) {
			document.getElementById('wrap').removeChild(document.getElementById('alertModal'));
		}

		func.appendHtml(document.getElementById('wrap'), html, 'div');

		document.getElementById('alertModal').querySelector('.close').addEventListener('click', (e) => {
			document.getElementById('wrap').removeChild(document.getElementById('alertModal'));
		}, false);

		if(callback){
			document.getElementById('alertModal').querySelector('.confirm').addEventListener('click', (e) => {
				if(callback != 'closed'){
				callback();
				};

				if(!IS_VCHK) {
				document.getElementById('wrap').removeChild(document.getElementById('alertModal'));
				}
			}, false);
		};
	},

    moveToMain() {
	location.href = URI_CP_BASE_URL;
    },

	historyBack(){
		window.history.back();
	},

	refresh(){
		location.href = location.href;
	},

	none() {
		return false;
	},
	loading(){
		var html = `<div id="loading">
						<div class="cubeSet">
							<div class="cube1 cube"></div>
							<div class="cube2 cube"></div>
							<div class="cube4 cube"></div>
							<div class="cube3 cube"></div>
						</div>
					</div>`

		func.appendHtml(document.getElementById('wrap'), html, 'div');
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// html 생성 - appendHtml(target, html, type)
	// (삽입 타겟, html 내용, 타입)
	/////////////////////////////////////////////////////////////////////////////////////
	appendHtml(target, html, type){
		var div = document.createElement(type);
		div.innerHTML = html;
		while (div.children.length > 0){
			target.appendChild(div.children[0]);
		};
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// html 삭제 - removeHtml(target)
	// (타겟 : 타겟의 자식요소 전부 삭제)
	/////////////////////////////////////////////////////////////////////////////////////
	removeHtml(target){
		while(target.hasChildNodes()){
			target.removeChild(target.firstChild);
		};
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// Count UP - 숫카 카운트업
	// (적용 타겟, 적용 숫자)
	/////////////////////////////////////////////////////////////////////////////////////
	countUp(target, num) {
		var cnt = -1;
		var dif = 0;

		var thisID = setInterval(function(){
			if(cnt < num){
				dif = num - cnt;

				if(dif > 0) {
					cnt += Math.ceil(dif / 5);
				};

				target.innerHTML = cnt;
			} else {
				clearInterval(thisID);
			};
		}, 20);
	},

	/////////////////////////////////////////////////////////////////////////////////////
	// 도넛 차트
	// (적용 타겟, 적용 데이터)
	/////////////////////////////////////////////////////////////////////////////////////
	donutChart(target, data){
		var chart = c3.generate({
			bindto: target,
			data: {
				columns: data,
				type : 'donut'
			},
			donut: {
				width: 47
			},
			legend: {
				show: false
			},
			color: {
				pattern: ['#0ca583', '#ffc53e', '#f34111', '#844adb', '#d9d9d9']
			},
		});
	},

	moveToUserGuideLink(){
	   window.open('about:blank').location.href = generatedGuideLink('ko', func.depth1);
	},
	moveToEngUserGuideLink(){
		window.open('about:blank').location.href = generatedGuideLink('en', func.depth1);
	},
	moveToPlayprkUsageGuideLink() {
		window.open('about:blank').location.href = GUIDE_URL_PLAYPARK;
	},
	isCollapse(id, collapse) {
		let el =  document.getElementById(id);
		el.classList.toggle('collapse');
		if(collapse) {
			el.title="Collapse Content";
		}else {
			el.title="Expand Content"
		}
	}
}