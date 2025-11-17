import React from 'react';

// 1. PDF에서 추출한 데이터 (학력 + 경력)
const careerData = [
  { id: 1, type: 'school', name: '순천제일대학교 (작업치료과)', start: '2013.03', end: '2021.02' },
  { id: 2, type: 'work', name: '순천평화병원', start: '2020.12', end: '2022.11' },
  { id: 3, type: 'school', name: '순천제일대학교 (의료재활과)', start: '2022.03', end: '2023.02' },
  { id: 4, type: 'work', name: '백세요양원', start: '2022.11', end: '2023.05' },
  { id: 5, type: 'school', name: '순천대학교 대학원', start: '2023.03', end: '2025.02' },
  { id: 6, type: 'work', name: '전남지역장애인보건의료센터', start: '2023.06', end: '2024.05' },
  { id: 7, type: 'work', name: '순천의료원 (물리치료실)', start: '2024.06', end: '2025.06' },
];

const CareerGraph = () => {
  // 2. 전체 기간 계산 (최소 2013년 ~ 최대 2025년)
  const minYear = 2013;
  const maxYear = 2025;
  const totalYears = maxYear - minYear + 1;

  // 날짜를 퍼센트(%)로 변환하는 함수
  const calculatePosition = (dateStr) => {
    const [year, month] = dateStr.split('.').map(Number);
    const value = year + (month / 12); // 연도 + 월을 소수점으로 변환
    return ((value - minYear) / totalYears) * 100;
  };

  return (
    <div className="career-graph-container">
      <h3 className="graph-title">📊 경력 & 학력 타임라인</h3>
      
      {/* 연도 표시 눈금 (X축) */}
      <div className="year-markers">
        {Array.from({ length: totalYears }).map((_, i) => (
          <div key={i} className="year-label" style={{ left: `${(i / totalYears) * 100}%` }}>
            {minYear + i}
          </div>
        ))}
      </div>

      {/* 그래프 막대 영역 */}
      <div className="bars-wrapper">
        {/* 배경 그리드 선 */}
        {Array.from({ length: totalYears }).map((_, i) => (
          <div key={i} className="grid-line" style={{ left: `${(i / totalYears) * 100}%` }}></div>
        ))}

        {careerData.map((item) => {
          const startPos = calculatePosition(item.start);
          const endPos = calculatePosition(item.end);
          const width = endPos - startPos;

          return (
            <div key={item.id} className="career-row">
              <div 
                className={`career-bar ${item.type}`} 
                style={{ left: `${startPos}%`, width: `${width}%` }}
              >
                <div className="tooltip">
                  <strong>{item.name}</strong>
                  <span>{item.start} ~ {item.end}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerGraph;