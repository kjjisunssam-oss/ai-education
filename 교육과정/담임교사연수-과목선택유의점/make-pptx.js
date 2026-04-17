/**
 * 2022 개정 교육과정 및 고교학점제 과목 선택 유의점 안내
 * PPTX 생성 스크립트 (pptxgenjs)
 */
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 16:9 (33.87 x 19.05 cm)

// ─── 색상 상수 (K-에듀 클린) ───────────────────────────────
const C = {
  primary:   '1A3A6B',  // 딥 블루
  accent:    '0B8A7A',  // 틸
  midBlue:   '2E5FA3',  // 미디엄 블루
  bg:        'F0F4FF',  // 슬라이드 배경
  cardBg:    'FFFFFF',
  divider:   'C5D5F0',
  text:      '1A1A2E',
  textSub:   '4A5A7A',
  white:     'FFFFFF',
  teal10:    'E6F4F1',  // 하이라이트 박스 배경
  warn10:    'FFF3E0',  // 경고 박스 배경
  warnLine:  'D84315',
  stat:      'EDF2FB',
};

// ─── 공통 헬퍼 ────────────────────────────────────────────
const IN = 1; // 인치 기준 레이아웃 사용
const W = 13.33, H = 7.5; // LAYOUT_WIDE 크기(인치)

function topBar(slide, sectionNum, title, pageStr) {
  // 딥 블루 헤더 바
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.44,
    fill: { color: C.primary }, line: { color: C.primary }
  });
  // 좌측 섹션 번호
  if (sectionNum) {
    slide.addText(sectionNum, {
      x: 0.18, y: 0, w: 0.6, h: 0.44,
      fontSize: 9, bold: false, color: 'AABBDD',
      valign: 'middle', fontFace: 'Arial'
    });
  }
  // 중앙 제목
  slide.addText(title, {
    x: 1, y: 0, w: W - 2, h: 0.44,
    fontSize: 10, bold: true, color: C.white,
    align: 'center', valign: 'middle', fontFace: 'Arial'
  });
  // 우측 페이지
  if (pageStr) {
    slide.addText(pageStr, {
      x: W - 1.1, y: 0, w: 1.0, h: 0.44,
      fontSize: 9, color: 'AABBDD',
      align: 'right', valign: 'middle', fontFace: 'Arial'
    });
  }
}

function sectionBar(slide, text, subtext, y) {
  // 좌측 강조 세로선
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.35, y: y, w: 0.06, h: subtext ? 0.55 : 0.4,
    fill: { color: C.primary }, line: { color: C.primary }
  });
  slide.addText(text, {
    x: 0.5, y: y, w: W - 0.7, h: 0.35,
    fontSize: 15, bold: true, color: C.primary,
    valign: 'middle', fontFace: 'Noto Sans KR'
  });
  if (subtext) {
    slide.addText(subtext, {
      x: 0.5, y: y + 0.34, w: W - 0.7, h: 0.22,
      fontSize: 9, color: C.textSub,
      valign: 'top', fontFace: 'Noto Sans KR'
    });
  }
}

function highlightBox(slide, text, x, y, w, h, isWarn) {
  const bg   = isWarn ? C.warn10 : C.teal10;
  const line = isWarn ? C.warnLine : C.accent;
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: bg }, line: { color: bg }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.05, h,
    fill: { color: line }, line: { color: line }
  });
  slide.addText(text, {
    x: x + 0.12, y, w: w - 0.16, h,
    fontSize: 9.5, color: C.text, valign: 'middle',
    wrap: true, fontFace: 'Noto Sans KR',
    paraSpaceAfter: 2
  });
}

function tableHeader(slide, cols, x, y, w, rowH) {
  const colW = w / cols.length;
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: rowH,
    fill: { color: C.primary }, line: { color: C.primary }
  });
  cols.forEach((col, i) => {
    slide.addText(col, {
      x: x + i * colW, y, w: colW, h: rowH,
      fontSize: 8.5, bold: true, color: C.white,
      align: 'center', valign: 'middle',
      fontFace: 'Noto Sans KR'
    });
  });
  return y + rowH;
}

function tableRow(slide, cells, colWidths, x, y, rowH, isEven, isSubtotal) {
  const bg = isSubtotal ? 'D4E4F4' : (isEven ? 'EDF2FB' : C.cardBg);
  let cx = x;
  cells.forEach((cell, i) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: cx, y, w: colWidths[i], h: rowH,
      fill: { color: bg },
      line: { color: C.divider, pt: 0.5 }
    });
    slide.addText(cell.text || cell, {
      x: cx + 0.03, y, w: colWidths[i] - 0.06, h: rowH,
      fontSize: cell.fontSize || 8.5, bold: isSubtotal || cell.bold || false,
      color: cell.color || C.text,
      align: cell.align || (i === 0 ? 'left' : 'center'),
      valign: 'middle', wrap: true,
      fontFace: 'Noto Sans KR'
    });
    cx += colWidths[i];
  });
  return y + rowH;
}

function activityItem(slide, num, title, desc, note, x, y, w, h) {
  // 틸 좌측 바
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.05, h,
    fill: { color: C.accent }, line: { color: C.accent }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: x + 0.05, y, w: w - 0.05, h,
    fill: { color: 'F0F4FF' }, line: { color: 'F0F4FF' }
  });
  // 번호 원
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.12, y: y + 0.12, w: 0.26, h: 0.26,
    fill: { color: C.midBlue }, line: { color: C.midBlue }
  });
  slide.addText(num, {
    x: x + 0.12, y: y + 0.12, w: 0.26, h: 0.26,
    fontSize: 9, bold: true, color: C.white,
    align: 'center', valign: 'middle', fontFace: 'Arial'
  });
  // 제목
  slide.addText(title, {
    x: x + 0.46, y: y + 0.1, w: w - 0.55, h: 0.28,
    fontSize: 11, bold: true, color: C.primary,
    valign: 'middle', fontFace: 'Noto Sans KR'
  });
  // 설명
  if (desc) {
    slide.addText(desc, {
      x: x + 0.15, y: y + 0.42, w: w - 0.22, h: note ? h - 0.62 : h - 0.5,
      fontSize: 9.5, color: C.textSub, wrap: true,
      valign: 'top', fontFace: 'Noto Sans KR', paraSpaceAfter: 2
    });
  }
  // 노트
  if (note) {
    slide.addText(note, {
      x: x + 0.15, y: y + h - 0.28, w: w - 0.22, h: 0.25,
      fontSize: 8.5, color: C.accent, wrap: true,
      valign: 'middle', fontFace: 'Noto Sans KR'
    });
  }
}

// ─── Slide 1: 표지 ────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  // 헤더 바
  topBar(s, '2026학년도', '담임교사 연수자료', '2026.4.21');

  // 중앙 콘텐츠 영역 (화이트 카드)
  s.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 0.7, w: W - 1.6, h: H - 1.5,
    fill: { color: C.cardBg },
    line: { color: C.divider, pt: 1 },
    shadow: { type: 'outer', color: '1A3A6B', opacity: 0.12, blur: 8, offset: 3, angle: 90 }
  });

  // 연도 배지
  s.addShape(pptx.ShapeType.roundRect, {
    x: W/2 - 0.8, y: 1.1, w: 1.6, h: 0.3,
    fill: { color: C.primary }, line: { color: C.primary },
    rectRadius: 0.15
  });
  s.addText('2026학년도', {
    x: W/2 - 0.8, y: 1.1, w: 1.6, h: 0.3,
    fontSize: 10, bold: true, color: C.white,
    align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
  });

  // 대제목
  s.addText('2022 개정 교육과정 및\n고교학점제 도입에 따른\n과목 선택 유의점 안내', {
    x: 1.2, y: 1.55, w: W - 2.4, h: 2.8,
    fontSize: 30, bold: true, color: C.primary,
    align: 'center', valign: 'middle',
    fontFace: 'Noto Sans KR', lineSpacingMultiple: 1.3
  });

  // 구분선
  s.addShape(pptx.ShapeType.rect, {
    x: W/2 - 0.5, y: 4.55, w: 1.0, h: 0.04,
    fill: { color: C.accent }, line: { color: C.accent }
  });

  // 부제목 / 날짜
  s.addText('담임교사 대상 연수  ·  2026년 4월 21일', {
    x: 1.2, y: 4.7, w: W - 2.4, h: 0.35,
    fontSize: 11, color: C.textSub,
    align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
  });
}

// ─── Slide 2: 목차 ────────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '', '목차', '2 / 10');

  // 카드 배경
  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider },
    shadow: { type: 'outer', color: '1A3A6B', opacity: 0.10, blur: 6, offset: 2, angle: 90 }
  });

  sectionBar(s, '오늘의 안내 내용', null, 0.68);

  const items = [
    { num: '01', text: '2015 vs 2022 개정 교육과정 — 교과 구조 및 성적 산출 방식 변화' },
    { num: '02', text: '고교학점제 이수 조건 — 졸업 192학점 · 교과별 필수 이수학점' },
    { num: '03', text: '담임 선생님 상담 유의점 — 국·영·수 집중 방지 · 중복 이수 금지' },
    { num: '04', text: '과목 선택 일정 · 상담 참고 자료 — 5월 집중 상담 ~ 7월 수강 신청' },
  ];
  const startY = 1.2;
  const rowH = 0.9;
  items.forEach((item, i) => {
    const y = startY + i * (rowH + 0.12);
    s.addShape(pptx.ShapeType.rect, {
      x: 0.4, y, w: W - 0.8, h: rowH,
      fill: { color: C.bg }, line: { color: C.divider, pt: 0.5 }
    });
    s.addShape(pptx.ShapeType.rect, {
      x: 0.4, y, w: 0.05, h: rowH,
      fill: { color: C.divider }, line: { color: C.divider }
    });
    s.addText(item.num, {
      x: 0.55, y, w: 0.6, h: rowH,
      fontSize: 16, bold: true, color: C.primary,
      valign: 'middle', fontFace: 'Arial'
    });
    s.addText(item.text, {
      x: 1.2, y, w: W - 1.7, h: rowH,
      fontSize: 11, color: C.text, valign: 'middle',
      fontFace: 'Noto Sans KR', wrap: true
    });
    s.addText('→', {
      x: W - 0.9, y, w: 0.45, h: rowH,
      fontSize: 11, color: C.textSub,
      align: 'right', valign: 'middle', fontFace: 'Arial'
    });
  });
}

// ─── Slide 3: 교과 구조 변화 ─────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '01', '교과 구조 변화 비교', '3 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });

  sectionBar(s, '고등학교 교과 구조 비교', '2015 개정 → 2022 개정 교육과정', 0.68);

  // 테이블
  const tx = 0.4, tw = W - 0.8;
  const colW = [tw*0.15, tw*0.42, tw*0.43];
  let ty = 1.22;
  const rowH = 0.38;

  // 헤더
  ty = tableHeader(s, ['구분', '2015 개정 교육과정', '2022 개정 교육과정'], tx, ty, tw, rowH);

  const rows = [
    [{ text: '보통\n교과', rowspan: 2 }, '공통', '공통'],
    [null, '선택 — 일반 / 진로', { text: '선택 — 일반 / 진로 / 융합 (신설)', color: C.accent, bold: true }],
    [{ text: '전문\n교과', rowspan: 3 }, '전문 교과 Ⅰ', { text: '전문 공통', color: C.accent, bold: true }],
    [null, '전문 교과 Ⅱ', { text: '선택 — 전공 일반', color: C.accent, bold: true }],
    [null, '', { text: '선택 — 전공 실무', color: C.accent, bold: true }],
  ];

  // 행 배경
  let rowIdx = 0;
  rows.forEach((row, i) => {
    s.addShape(pptx.ShapeType.rect, {
      x: tx, y: ty + i * rowH, w: tw, h: rowH,
      fill: { color: i % 2 === 1 ? 'EDF2FB' : C.cardBg }, line: { color: C.divider, pt: 0.5 }
    });
  });

  // 셀 내용
  rows.forEach((row, i) => {
    let cx = tx;
    row.forEach((cell, ci) => {
      if (cell === null) { cx += colW[ci]; return; }
      const cellY = ty + i * rowH;
      const c = typeof cell === 'string' ? { text: cell } : cell;
      s.addText(c.text, {
        x: cx + 0.04, y: cellY, w: colW[ci] - 0.08, h: rowH,
        fontSize: 9.5, bold: c.bold || false, color: c.color || C.text,
        align: ci === 0 ? 'center' : 'left', valign: 'middle',
        wrap: true, fontFace: 'Noto Sans KR'
      });
      cx += colW[ci];
    });
  });

  highlightBox(s,
    '핵심 변화:  보통교과에 융합 선택과목이 신설되어 교과 내·교과 간 주제 융합 학습이 가능해졌으며, 전문교과 구조가 전문 공통 / 전공 일반 / 전공 실무로 세분화되었습니다.',
    0.4, ty + rows.length * rowH + 0.12, tw, 0.5
  );
}

// ─── Slide 4: 성적 산출 방식 ─────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '01', '성적 산출 방식 변화', '4 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });

  sectionBar(s, '과목 유형별 성적 처리 방식',
    '고등학교 교과목은 과목의 유형에 따라 성적을 처리하는 방식이 다릅니다.', 0.68);

  const tx = 0.4, tw = W - 0.8;
  const colW = [tw*0.2, tw*0.1, tw*0.13, tw*0.13, tw*0.15, tw*0.12, tw*0.17];
  let ty = 1.28;
  const rH = 0.34;

  // 2행 헤더
  s.addShape(pptx.ShapeType.rect, { x: tx, y: ty, w: tw, h: rH * 2, fill: { color: C.primary }, line: { color: C.primary } });
  // 행 1 헤더
  const hdr1 = [
    { text: '구분', x: tx, w: colW[0], rowspan: 2 },
    { text: '절대평가', x: tx + colW[0], w: colW[1] + colW[2], colspan: 2 },
    { text: '상대평가', x: tx + colW[0] + colW[1] + colW[2], w: colW[3] },
    { text: '통계정보', x: tx + colW[0] + colW[1] + colW[2] + colW[3], w: colW[4] + colW[5] + colW[6], colspan: 3 },
  ];
  hdr1.forEach(h => {
    s.addText(h.text, {
      x: h.x, y: ty, w: h.w, h: rH,
      fontSize: 8.5, bold: true, color: C.white,
      align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
    });
  });
  // 행 2 헤더
  const hdr2 = ['원점수','성취도','석차등급','성취도별 분포비율','과목평균','수강자수'];
  let hx = tx + colW[0];
  hdr2.forEach((h, i) => {
    s.addText(h, {
      x: hx, y: ty + rH, w: colW[i + 1], h: rH,
      fontSize: 7.5, bold: true, color: C.white,
      align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
    });
    hx += colW[i + 1];
  });

  ty += rH * 2;

  const rows = [
    ['보통교과', '○', 'A·B·C·D·E', { text: '5등급', color: C.accent, bold: true }, '○', '○', '○'],
    ['사회·과학 융합 선택', '○', 'A·B·C·D·E', { text: '—', color: C.midBlue }, '○', '○', '○'],
    ['체육·예술 / 과학탐구실험', '—', 'A·B·C', { text: '—', color: C.midBlue }, '—', '—', '—'],
    ['교양', '—', 'P', { text: '—', color: C.midBlue }, '—', '—', '—'],
    ['전문교과', '○', 'A·B·C·D·E', { text: '5등급', color: C.accent, bold: true }, '○', '○', '○'],
  ];

  rows.forEach((row, ri) => {
    s.addShape(pptx.ShapeType.rect, {
      x: tx, y: ty + ri * rH, w: tw, h: rH,
      fill: { color: ri % 2 === 1 ? 'EDF2FB' : C.cardBg }, line: { color: C.divider, pt: 0.4 }
    });
    let cx = tx;
    row.forEach((cell, ci) => {
      const c = typeof cell === 'string' ? { text: cell } : cell;
      s.addText(c.text, {
        x: cx + 0.03, y: ty + ri * rH, w: colW[ci] - 0.06, h: rH,
        fontSize: 8.5, bold: c.bold || false, color: c.color || C.text,
        align: ci === 0 ? 'left' : 'center', valign: 'middle',
        fontFace: 'Noto Sans KR', wrap: true
      });
      cx += colW[ci];
    });
  });

  highlightBox(s,
    '※ 사회·과학 교과군 상대평가 제외 과목 (9개):  여행지리 / 역사로 탐구하는 현대 세계 / 사회문제 탐구 / 금융과 경제생활 / 윤리문제 탐구 / 기후변화와 지속가능한 세계 / 과학의 역사와 문화 / 기후변화와 환경생태 / 융합과학 탐구',
    0.4, ty + rows.length * rH + 0.1, tw, 0.52
  );
}

// ─── Slide 5: 고교학점제 이수 조건 ──────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '02', '고교학점제 이수 조건', '5 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });
  sectionBar(s, '졸업 이수 조건 및 필수 이수 학점', null, 0.68);

  // stat 카드 3개
  const statItems = [
    { num: '192', unit: '학점', label: '총 이수 학점 (졸업 조건)' },
    { num: '84',  unit: '학점', label: '필수 이수 (일반고)' },
    { num: '18',  unit: '학점', label: '창의적 체험활동 (288시간)' },
  ];
  const sw = (W - 1.0) / 3, sx = 0.4;
  statItems.forEach((st, i) => {
    s.addShape(pptx.ShapeType.rect, {
      x: sx + i * (sw + 0.05), y: 1.2, w: sw, h: 0.85,
      fill: { color: C.bg }, line: { color: C.divider }
    });
    s.addText(st.num + st.unit, {
      x: sx + i * (sw + 0.05), y: 1.25, w: sw, h: 0.48,
      fontSize: 26, bold: true, color: C.primary,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });
    s.addText(st.label, {
      x: sx + i * (sw + 0.05), y: 1.73, w: sw, h: 0.28,
      fontSize: 8.5, color: C.textSub,
      align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
    });
  });

  // 테이블
  const tx = 0.4, tw = W - 0.8;
  const colW = [tw*0.25, tw*0.32, tw*0.143, tw*0.143, tw*0.144];
  let ty = 2.18;
  const rH = 0.31;

  ty = tableHeader(s, ['교과(군)', '공통 과목', '일반고', '자율고', '특수목적고'], tx, ty, tw, rH);

  const rows = [
    ['국어', '공통국어1, 공통국어2', '8', '8', '8'],
    ['수학', '공통수학1, 공통수학2', '8', '8', '8'],
    ['영어', '공통영어1, 공통영어2', '8', '8', '8'],
    ['사회 (역사/도덕 포함)', '한국사1,2 / 통합사회1,2', '14', '14', '14'],
    ['과학', '통합과학1,2 / 과학탐구실험1,2', '10', '10', '10'],
    ['체육', '—', '10', '10', '10'],
    ['예술', '—', '10', '5', '5'],
    ['기술·가정/정보/제2외국어/한문/교양', '—', '16', '12', '12'],
    [
      { text: '소계', bold: true }, { text: '—', bold: true },
      { text: '84', color: C.accent, bold: true },
      { text: '75', color: C.accent, bold: true },
      { text: '75', color: C.accent, bold: true }
    ],
  ];

  rows.forEach((row, ri) => {
    const isSubtotal = ri === rows.length - 1;
    ty = tableRow(s, row, colW, tx, ty, rH, ri % 2 === 1, isSubtotal);
  });
}

// ─── Slide 6: 공통→선택 이수 순서 ───────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '02', '공통 과목과 선택 과목 이수 순서', '6 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });
  sectionBar(s, '공통 과목 이수 후 선택 과목 편성',
    '공통 과목은 각 교과의 기초 소양 함양과 기본 학력 보장을 위한 과목이므로 선택 과목 이수 이전에 편성합니다.', 0.68);

  const topY = 1.3, boxH = 4.05;
  const lx = 0.4, lw = 5.5, rx = 7.3, rw = 5.5;

  // 왼쪽 박스
  s.addShape(pptx.ShapeType.rect, { x: lx, y: topY, w: lw, h: boxH, fill: { color: C.bg }, line: { color: C.divider } });
  s.addText('공통 과목 (먼저 이수)', { x: lx + 0.1, y: topY + 0.06, w: lw - 0.2, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: 'Noto Sans KR' });
  s.addShape(pptx.ShapeType.rect, { x: lx, y: topY + 0.4, w: lw, h: 0.02, fill: { color: C.divider }, line: { color: C.divider } });

  const left = [
    '국어:  공통국어1, 공통국어2',
    '수학:  공통수학1, 공통수학2 (기본수학1,2)',
    '영어:  공통영어1, 공통영어2 (기본영어1,2)',
    '사회:  한국사1, 한국사2',
    '사회:  통합사회1, 통합사회2',
    '과학:  통합과학1,2 / 과학탐구실험1,2',
  ];
  left.forEach((t, i) => {
    s.addText(t, { x: lx + 0.12, y: topY + 0.48 + i * 0.55, w: lw - 0.22, h: 0.52, fontSize: 9.5, color: C.textSub, wrap: true, valign: 'middle', fontFace: 'Noto Sans KR' });
    if (i < left.length - 1) s.addShape(pptx.ShapeType.rect, { x: lx, y: topY + 0.48 + (i+1)*0.55 - 0.02, w: lw, h: 0.01, fill: { color: C.divider }, line: { color: C.divider } });
  });

  // 화살표
  s.addText('→', { x: 5.95, y: topY + boxH/2 - 0.22, w: 1.3, h: 0.45, fontSize: 22, bold: true, color: C.accent, align: 'center', valign: 'middle', fontFace: 'Arial' });

  // 오른쪽 박스
  s.addShape(pptx.ShapeType.rect, { x: rx, y: topY, w: rw, h: boxH, fill: { color: C.bg }, line: { color: C.divider } });
  s.addText('선택 과목 (이후 이수)', { x: rx + 0.1, y: topY + 0.06, w: rw - 0.2, h: 0.3, fontSize: 11, bold: true, color: C.primary, fontFace: 'Noto Sans KR' });
  s.addShape(pptx.ShapeType.rect, { x: rx, y: topY + 0.4, w: rw, h: 0.02, fill: { color: C.divider }, line: { color: C.divider } });

  const right = [
    '화법과 언어, 독서와 작문, 문학, 주제 탐구 독서 등',
    '대수, 미적분Ⅰ, 확률과 통계, 기하, 경제수학 등',
    '영어Ⅱ, 영어 독해와 작문, 영미 문학 읽기 등',
    '동아시아 역사 기행, 세계사 등',
    '세계시민과 지리, 사회와 문화, 현대사회와 윤리 등',
    '물리학, 화학, 생명과학, 지구과학, 역학과 에너지 등',
  ];
  right.forEach((t, i) => {
    s.addText(t, { x: rx + 0.12, y: topY + 0.48 + i * 0.55, w: rw - 0.22, h: 0.52, fontSize: 9.5, color: i === 4 ? C.accent : C.textSub, wrap: true, valign: 'middle', fontFace: 'Noto Sans KR' });
    if (i < right.length - 1) s.addShape(pptx.ShapeType.rect, { x: rx, y: topY + 0.48 + (i+1)*0.55 - 0.02, w: rw, h: 0.01, fill: { color: C.divider }, line: { color: C.divider } });
  });

  highlightBox(s,
    '원칙:  공통 과목 학습 내용을 이해하고 탐구한 후 학생의 적성과 진로에 맞는 선택 과목을 편성합니다. 공통 과목 이전에 선택 과목을 편성하지 않도록 확인하세요.',
    0.4, topY + boxH + 0.12, W - 0.8, 0.44
  );
}

// ─── Slide 7: 담임 상담 유의점 ───────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '03', '담임 선생님 상담 유의점', '7 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });
  sectionBar(s, '과목 선택 상담 시 반드시 확인하세요', null, 0.68);

  activityItem(s, '①', '과목 선택 집중 방지',
    '국어·수학·영어 교과의 이수 학점 총합이 81학점을 초과하지 않도록 안내합니다.\n교과 이수 학점이 174학점을 초과하는 경우, 초과 이수 학점의 50%를 넘지 않도록 조정합니다.',
    '→ 국·영·수 과목에만 집중되지 않도록 진로 연계 다양한 과목 선택을 독려하세요.',
    0.4, 1.22, W - 0.8, 1.55
  );

  activityItem(s, '②', '같은 과목 중복 이수 금지',
    '동일한 과목을 1학기와 2학기에 중복하여 이수하는 것은 금지됩니다.\n학생의 시간표를 확인하여 같은 과목명이 두 학기에 모두 편성되지 않도록 반드시 점검하세요.',
    '✦ 금지 예시 — 1학기: 생명과학  /  2학기: 생명과학  (동일 과목 반복 편성 불가)',
    0.4, 2.92, W - 0.8, 1.55
  );

  highlightBox(s,
    '※ 핵심 요약:  국·영·수 합계 81학점 이하 유지  +  같은 과목 중복 이수 금지 (동일 과목 두 학기 편성 불가)',
    0.4, 4.6, W - 0.8, 0.44, true
  );
}

// ─── Slide 8: 과목 선택 일정 ─────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '04', '과목 선택 일정', '8 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });
  sectionBar(s, '2026학년도 과목 선택 전체 일정',
    '수강 신청 기간 전까지 충분한 고민과 상담을 통해 선택과목의 폭을 좁혀갈 수 있도록 안내해 주세요.', 0.68);

  const tlItems = [
    { date: '5.18~22', title: '집중 상담 주간', desc: '과목 선택 집중 상담', hl: true },
    { date: '5.22',    title: '선호 조사',      desc: '선택과목 선호 조사',  hl: false },
    { date: '7.13',    title: '과목 설명회',    desc: '선택과목 설명회',     hl: false },
    { date: '7.13~15', title: '1차 수요조사',   desc: '선택과목 1차 수요조사', hl: false },
    { date: '7.18~20', title: '2차 수요조사',   desc: '선택과목 2차 수요조사', hl: false },
    { date: '7.21~22', title: '최종 수강 신청', desc: '선택과목 최종 확정',  hl: true },
  ];

  const tlY = 1.3, tlH = 0.02;
  const itemW = (W - 0.8) / tlItems.length, startX = 0.4;

  // 타임라인 가로 선
  s.addShape(pptx.ShapeType.rect, {
    x: startX, y: tlY + 0.1, w: W - 0.8, h: tlH,
    fill: { color: C.divider }, line: { color: C.divider }
  });

  tlItems.forEach((item, i) => {
    const cx = startX + i * itemW + itemW / 2;
    const dotR = item.hl ? 0.12 : 0.09;
    // 마커
    s.addShape(pptx.ShapeType.ellipse, {
      x: cx - dotR, y: tlY + 0.1 - dotR + tlH/2, w: dotR*2, h: dotR*2,
      fill: { color: item.hl ? C.accent : C.cardBg },
      line: { color: item.hl ? C.accent : C.primary, pt: 2 }
    });
    // 날짜
    s.addText(item.date, {
      x: startX + i * itemW, y: tlY + 0.3, w: itemW, h: 0.28,
      fontSize: 9, bold: true, color: item.hl ? C.accent : C.primary,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });
    // 제목
    s.addText(item.title, {
      x: startX + i * itemW, y: tlY + 0.58, w: itemW, h: 0.3,
      fontSize: 9.5, bold: item.hl, color: item.hl ? C.accent : C.text,
      align: 'center', valign: 'middle', wrap: true, fontFace: 'Noto Sans KR'
    });
    // 설명
    s.addText(item.desc, {
      x: startX + i * itemW, y: tlY + 0.88, w: itemW, h: 0.26,
      fontSize: 8.5, color: C.textSub,
      align: 'center', valign: 'middle', wrap: true, fontFace: 'Noto Sans KR'
    });
  });

  highlightBox(s,
    '담임 선생님께:  5월 집중 상담 주간부터 학생별 진로·계열과 연계한 상담을 시작하여, 7월 최종 수강 신청 전까지 선택과목이 확정될 수 있도록 도와주세요.',
    0.4, 2.5, W - 0.8, 0.46
  );
}

// ─── Slide 9: 상담 참고 자료 ─────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '04', '상담 시 참고 자료', '9 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 0.55, w: W - 0.6, h: H - 0.75,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });
  sectionBar(s, '대학 핵심 권장 과목 자료 활용',
    '학생의 희망 진로 및 대학 전공 계열에 맞는 과목 선택 상담 시 아래 자료를 참고하세요.', 0.68);

  const cards = [
    { title: '서울대학교', desc: '계열별 핵심 권장 과목 목록을 참고하여 학생의 전공 적합성을 고려한 선택과목을 안내합니다.', badge: '핵심권장 과목', badgeColor: C.primary },
    { title: '경희대학교', desc: '전공 계열별 핵심 권장 과목을 확인하여 학생의 진로 방향에 맞는 선택 상담에 활용합니다.', badge: '핵심권장 과목', badgeColor: C.accent },
  ];
  const cw = (W - 1.0) / 2;
  cards.forEach((c, i) => {
    const cx = 0.4 + i * (cw + 0.2);
    s.addShape(pptx.ShapeType.rect, { x: cx, y: 1.3, w: cw, h: 2.0, fill: { color: C.bg }, line: { color: C.divider } });
    s.addText(c.title, { x: cx + 0.1, y: 1.38, w: cw - 0.2, h: 0.34, fontSize: 13, bold: true, color: C.primary, fontFace: 'Noto Sans KR' });
    s.addText(c.desc,  { x: cx + 0.1, y: 1.78, w: cw - 0.2, h: 0.9,  fontSize: 9.5, color: C.textSub, wrap: true, fontFace: 'Noto Sans KR' });
    const badgeBg = c.badgeColor === C.primary ? 'DDE8F8' : 'D6F0EC';
    s.addShape(pptx.ShapeType.roundRect, { x: cx + 0.1, y: 2.74, w: 1.3, h: 0.26, fill: { color: badgeBg }, line: { color: c.badgeColor }, rectRadius: 0.13 });
    s.addText(c.badge, { x: cx + 0.1, y: 2.74, w: 1.3, h: 0.26, fontSize: 8.5, bold: true, color: c.badgeColor, align: 'center', valign: 'middle', fontFace: 'Noto Sans KR' });
  });

  highlightBox(s,
    '활용 방법:  ① 학생의 희망 전공 계열 확인  →  ② 해당 대학 핵심 권장 과목과 학생 선택 계획 비교  →  ③ 누락된 권장 과목이 있다면 추가 선택 안내',
    0.4, 3.42, W - 0.8, 0.44
  );
  highlightBox(s,
    '추가 참고:  각 대학 입학처 "고교 교육 기여 대학 지원 사업" 자료 및 대입정보포털(어디가)의 전공 계열별 선택과목 안내도 적극 활용하세요.',
    0.4, 3.98, W - 0.8, 0.44
  );
}

// ─── Slide 10: 마무리 ─────────────────────────────────────
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  topBar(s, '', '마무리', '10 / 10');

  s.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 0.55, w: W - 1.6, h: H - 0.8,
    fill: { color: C.cardBg }, line: { color: C.divider }
  });

  s.addText('감사합니다', {
    x: 1.2, y: 0.85, w: W - 2.4, h: 0.9,
    fontSize: 34, bold: true, color: C.primary,
    align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
  });
  s.addText('궁금하신 사항은 교육과정 담당 선생님께 문의해 주세요.', {
    x: 1.2, y: 1.75, w: W - 2.4, h: 0.35,
    fontSize: 11, color: C.textSub,
    align: 'center', valign: 'middle', fontFace: 'Noto Sans KR'
  });
  s.addShape(pptx.ShapeType.rect, {
    x: W/2 - 0.6, y: 2.18, w: 1.2, h: 0.04,
    fill: { color: C.accent }, line: { color: C.accent }
  });

  // 요약 박스
  s.addShape(pptx.ShapeType.rect, { x: 1.5, y: 2.38, w: W - 3.0, h: 3.5, fill: { color: C.teal10 }, line: { color: C.teal10 } });
  s.addShape(pptx.ShapeType.rect, { x: 1.5, y: 2.38, w: 0.06, h: 3.5, fill: { color: C.accent }, line: { color: C.accent } });
  s.addText('오늘의 핵심 정리', { x: 1.66, y: 2.45, w: W - 3.3, h: 0.28, fontSize: 11, bold: true, color: C.accent, fontFace: 'Noto Sans KR' });

  const summaries = [
    '✦  2022 개정:  보통교과에 융합 선택과목 신설, 전문교과 구조 세분화',
    '✦  성적 산출:  과목 유형별 차이 — 융합 선택은 석차등급 없음',
    '✦  고교학점제:  졸업 192학점 이수, 일반고 필수 이수 84학점',
    '✦  상담 유의:  국·영·수 합계 81학점 이하  +  같은 과목 중복 이수 금지',
    '✦  일정:  5.18~22 집중 상담 주간  →  7.21~22 최종 수강 신청',
  ];
  summaries.forEach((t, i) => {
    s.addText(t, {
      x: 1.66, y: 2.82 + i * 0.56, w: W - 3.3, h: 0.52,
      fontSize: 10, color: C.text, wrap: true, valign: 'middle',
      fontFace: 'Noto Sans KR'
    });
  });
}

// ─── 파일 저장 ────────────────────────────────────────────
const outPath = '교육과정/담임교사연수-과목선택유의점/2022개정교육과정_고교학점제_과목선택유의점_담임연수.pptx';
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log('✅ PPTX 생성 완료:', outPath);
}).catch(e => {
  console.error('❌ 오류:', e.message);
});
