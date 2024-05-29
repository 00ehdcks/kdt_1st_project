document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.getElementById('login-button');
  const idField = document.getElementById('id');
  const passwordField = document.getElementById('pwd');

  // 로그인 버튼 클릭 이벤트
  loginButton.addEventListener('click', function () {
    login();
  });

  // 엔터 키 입력 이벤트 처리
  passwordField.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      login();
    }
  });

  // 로그인 함수
  function login() {
    var id = idField.value;
    var password = passwordField.value;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          localStorage.setItem('name', response.name);
          localStorage.setItem('department', response.department);
          window.location.href = 'info.html'; // 로그인 성공 시 info.html 페이지로 이동
        } else {
          alert('로그인 실패: ' + xhr.responseText); // 로그인 실패 시 메시지 표시
        }
      }
    };
    xhr.open('POST', '/index', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(
      'id=' +
        encodeURIComponent(id) +
        '&password=' +
        encodeURIComponent(password)
    );
  }
});
