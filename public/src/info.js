document.addEventListener('DOMContentLoaded', function () {
  var name = localStorage.getItem('name');
  var department = localStorage.getItem('department');
  document.getElementById('name').textContent = name;
  document.getElementById('department').textContent = department;

  // 환자 정보를 가져와서 테이블에 표시하는 함수
  // 환자 정보를 가져와서 테이블에 표시하는 함수
  function fetchPatients() {
    // 서버로부터 환자 정보를 가져오는 API 호출
    fetch('/patients')
      .then((response) => response.json())
      .then((patients) => {
        const patientTableBody = document.getElementById('patient-table-body');
        // 기존의 환자 정보 삭제
        patientTableBody.innerHTML = '';

        // 환자 정보를 테이블에 추가
        patients.forEach((patient) => {
          const row = patientTableBody.insertRow();
          row.innerHTML = `
            <td>${patient.name || ''}</td>
            <td>${patient.age || ''}</td>
            <td>${formatDate(patient.birth) || ''}</td>
            <td>${formatPhoneNumber(patient.phone) || ''}</td>
            <td>${patient.department || ''}</td>
            <td>${patient.disease || ''}</td>
            <td>${formatDate(patient.recent_visit_date) || ''}</td>
          `;
        });
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }

  // 전화번호 앞에 0을 붙이는 함수
  function formatPhoneNumber(phone) {
    // 전화번호가 없으면 빈 문자열 반환
    if (!phone) return '';

    // 전화번호가 010으로 시작하면 그대로 반환
    if (phone.startsWith('010')) return phone;

    // 그 외의 경우에는 0을 추가하여 반환
    return '0' + phone;
  }

  // 주어진 날짜를 원하는 형식으로 변환하는 함수
  function formatDate(date) {
    // 날짜 객체 생성
    const formattedDate = new Date(date);

    // 년, 월, 일 추출
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줌
    const day = String(formattedDate.getDate()).padStart(2, '0');

    // 원하는 형식으로 날짜 문자열 생성
    const formattedDateString = `${year}/${month}/${day}`;

    return formattedDateString;
  }

  // 페이지 로드 시 환자 정보 가져오기
  fetchPatients();

  document
    .getElementById('logout-button')
    .addEventListener('click', function () {
      // localStorage 비우기
      localStorage.removeItem('name');
      localStorage.removeItem('department');

      // 로그인 페이지로 이동
      window.location.href = '/';
    });
});
