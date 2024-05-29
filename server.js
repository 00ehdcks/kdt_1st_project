const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'hospital_data',
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MariaDB database');
});

// POST 요청의 본문을 파싱하기 위한 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));

// 로그인 요청 처리
app.post('/index', (req, res) => {
  const { id, password } = req.body;

  // MariaDB 데이터베이스에서 사용자 정보 조회
  connection.query(
    'SELECT name, department FROM user WHERE id = ? AND password = ?',
    [id, password],
    (error, results, fields) => {
      if (error) {
        console.error('Error executing MariaDB query:', error);
        return res.status(500).send('Internal server error');
      }

      if (results.length > 0) {
        // 로그인 성공, 사용자 정보 전송
        res.json({ name: results[0].name, department: results[0].department });
      } else {
        // 로그인 실패
        res.status(401).send('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    }
  );
});

// 루트 경로에 대한 요청에 index.html 파일을 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// patient 테이블에서 환자 정보를 가져오는 API 엔드포인트
app.get('/patients', (req, res) => {
  // patient 테이블에서 환자 정보를 가져오는 쿼리
  const query = 'SELECT * FROM patient';

  // 쿼리 실행
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      return res.status(500).send('Internal server error');
    }

    // 결과를 JSON 형식으로 응답
    res.json(results);
  });
});

// 정적 파일 서비스를 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
