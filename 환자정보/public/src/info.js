document.addEventListener('DOMContentLoaded', function () {
  var name = localStorage.getItem('name');
  var department = localStorage.getItem('department');
  document.getElementById('name').textContent = name;
  document.getElementById('department').textContent = department;

  const perPage = 15;
  let currentPage = 1;
  let currentSearch = '';

  // 환자 정보를 가져와서 테이블에 표시하는 함수
  function fetchPatients(page = 1, search = '') {
    currentSearch = search;
    // 서버로부터 환자 정보를 가져오는 API 호출
    fetch(`/patients?page=${page}&perPage=${perPage}&name=${search}`)
      .then((response) => response.json())
      .then((data) => {
        const patientTableBody = document.getElementById('patient-table-body');
        // 기존의 환자 정보 삭제
        patientTableBody.innerHTML = '';

        // 환자 정보를 테이블에 추가
        data.patients.forEach((patient) => {
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

        // 페이지네이션 업데이트
        updatePagination(data.totalPages, page);
      })
      .catch((error) => console.error('Error fetching patients:', error));
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
    return `${year}/${month}/${day}`;
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

  // 페이지네이션 업데이트 함수
  function updatePagination(totalPages, currentPage) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.toggle('active', i === currentPage);
      button.addEventListener('click', () => fetchPatients(i, currentSearch));
      pagination.appendChild(button);
    }
  }

  // 페이지 로드 시 환자 정보 가져오기
  fetchPatients(currentPage);

  document
    .getElementById('logout-button')
    .addEventListener('click', function () {
      // localStorage 비우기
      localStorage.removeItem('name');
      localStorage.removeItem('department');

      // 로그인 페이지로 이동
      window.location.href = '/';
    });

  // 검색 기능 추가
  const searchBox = document.querySelector('.search-box input');
  searchBox.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      fetchPatients(1, searchBox.value.trim());
    }
  });

  const searchIcon = document.querySelector('.search-box .bx-search-alt-2');
  searchIcon.addEventListener('click', function () {
    fetchPatients(1, searchBox.value.trim());
  });

  // 검색 초기화 기능 추가
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', function () {
    searchBox.value = ''; // 검색 상자 내용 지우기
    fetchPatients(1); // 전체 환자 정보 가져오기
  });
});
