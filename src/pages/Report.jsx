import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PlayfulButton from "../components/PlayfulButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "../components/SearchBar/SearchBar";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";

const image = "https://avatars.githubusercontent.com/u/192951892?s=48&v=4";

const ALL_MODES = ["Basic", "Study", "Newbie", "Clean Code", "Optimize"];

const MODE_COLORS = {
  Basic: {
    bg: "#FFF1EC",
    text: "#FF794E",
  },
  Study: {
    bg: "#FFF9E6",
    text: "#FFCD39",
  },
  "Clean Code": {
    bg: "#4DABF5",
    text: "#4DABF5",
  },
  Optimize: {
    bg: "#BC6FCD",
    text: "#BC6FCD",
  },
  Newbie: {
    bg: "#70BF73",
    text: "#70BF73",
  },
};

const GRADE_COLORS = {
  S: "#FF6B6B", // 빨간색 계열
  A: "#4A90E2", // 파란색 계열
  B: "#50C878", // 초록색 계열
  C: "#FFB84D", // 주황색 계열
  D: "#808080", // 회색 계열
};

const ISSUE_TYPE_COLORS = {
  "코드 구조": "#FF9F1C",
  성능: "#2EC4B6",
  보안: "#E71D36",
  가독성: "#4361EE",
  "버그 가능성": "#B5179E",
  기타: "#748CAB",
};
// 레이더 차트 데이터 추가
const radarData = [
  {
    metric: "PR1",
    Basic: 80,
    "Clean Code": 90,
    Optimize: 70,
    Newbie: 60,
    Study: 85,
  },
  {
    metric: "PR2",
    Basic: 75,
    "Clean Code": 65,
    Optimize: 95,
    Newbie: 55,
    Study: 70,
  },
  {
    metric: "PR3",
    Basic: 85,
    "Clean Code": 80,
    Optimize: 75,
    Newbie: 65,
    Study: 90,
  },
  {
    metric: "PR4",
    Basic: 70,
    "Clean Code": 95,
    Optimize: 65,
    Newbie: 80,
    Study: 75,
  },
  {
    metric: "PR5",
    Basic: 65,
    "Clean Code": 85,
    Optimize: 80,
    Newbie: 70,
    Study: 60,
  },
];
const GRAPHS = [
  {
    title: "PR별 점수 지표",
    component: (data) => (
      <ResponsiveRadar
        data={data}
        keys={["Basic", "Study", "Newbie", "Clean Code", "Optimize"]}
        indexBy="metric"
        maxValue={100}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ from: "color" }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: "background" }}
        dotBorderWidth={2}
        colors={Object.values(MODE_COLORS).map((color) => color.text)}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            translateX: -50,
            translateY: -40,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: "#999",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    ),
  },
  {
    title: "등급별 분포",
    component: () => (
      <ResponsivePie
        data={[
          { id: "S", value: 20, color: GRADE_COLORS.S },
          { id: "A", value: 30, color: GRADE_COLORS.A },
          { id: "B", value: 25, color: GRADE_COLORS.B },
          { id: "C", value: 15, color: GRADE_COLORS.C },
          { id: "D", value: 10, color: GRADE_COLORS.D },
        ]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ datum: "data.color" }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
      />
    ),
  },
  {
    title: "이슈 유형별 분포",
    component: () => (
      <ResponsivePie
        data={[
          { id: "코드 구조", value: 30, color: ISSUE_TYPE_COLORS["코드 구조"] },
          { id: "성능", value: 25, color: ISSUE_TYPE_COLORS["성능"] },
          { id: "보안", value: 15, color: ISSUE_TYPE_COLORS["보안"] },
          { id: "가독성", value: 20, color: ISSUE_TYPE_COLORS["가독성"] },
          {
            id: "버그 가능성",
            value: 10,
            color: ISSUE_TYPE_COLORS["버그 가능성"],
          },
        ]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ datum: "data.color" }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
      />
    ),
  },
  {
    title: "시간별 성능 추이",
    component: () => (
      <ResponsiveLine
        data={[
          {
            id: "성능 점수",
            data: [
              { x: "1월", y: 85 },
              { x: "2월", y: 78 },
              { x: "3월", y: 92 },
              { x: "4월", y: 88 },
            ],
          },
        ]}
        margin={{ top: 50, right: 60, bottom: 50, left: 80 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 0, max: 100 }}
        axisTop={null}
        axisRight={null}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableArea={true}
        areaOpacity={0.15}
        useMesh={true}
        enableGridX={false}
      />
    ),
  },
];

const Report = ({ isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const graphTypes = Object.keys(GRAPHS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const modalItems = [
    {
      id: 1,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 2,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "C",
      issueType: "Design Pattern",
    },
    {
      id: 3,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "D",
      issueType: "Design Pattern",
    },
    {
      id: 4,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "S",
      issueType: "Design Pattern",
    },
    {
      id: 5,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "D",
      issueType: "Design Pattern",
    },
    {
      id: 6,
      mode: "Basic",
      title: "Feat/#67 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 7,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "S",
      issueType: "Design Pattern",
    },
    {
      id: 8,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "B",
      issueType: "Design Pattern",
    },
    {
      id: 9,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "C",
      issueType: "Design Pattern",
    },
  ];

  const reportData = [
    {
      id: 1,
      image: image,
      title: "PR 보고서1",
      createdAt: "2024-03-15",
      reviewCount: 25,
      modes: ALL_MODES,
    },
    {
      id: 2,
      image: image,
      title: "PR 보고서2",
      createdAt: "2024-03-15",
      reviewCount: 15,
      modes: ["Optimize", "Basic"],
    },
    {
      id: 3,
      image: image,
      title: "PR 보고서3",
      createdAt: "2024-03-15",
      reviewCount: 25,
      modes: ["Basic"],
    },
    {
      id: 4,
      image: image,
      title: "PR 보고서4",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Optimize", "Newbie"],
    },
    {
      id: 7,
      image: image,
      title: "PR 보고서5",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Clean Code", "Study"],
    },
    {
      id: 5,
      image: image,
      title: "PR 보고서6",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Optimize", "Clean Code", "Study"],
    },
    {
      id: 6,
      image: image,
      title: "PR 보고서7",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Optimize", "Clean Code", "Study"],
    },
  ];

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === modalItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(modalItems.map((item) => item.id)));
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색어로 필터링된 아이템들
  const filteredModalItems = modalItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issueType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItems(new Set()); // 선택된 항목 초기화
    setSearchQuery(""); // 검색어도 초기화
  };

  // 보고서 상세 보기 핸들러
  const handleReportClick = (report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // 상세 모달 닫기 핸들러
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
  };

  // 그래프 네비게이션 함수
  const navigateGraph = (direction) => {
    if (direction === "next") {
      setCurrentGraphIndex((prev) =>
        prev === graphTypes.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentGraphIndex((prev) =>
        prev === 0 ? graphTypes.length - 1 : prev - 1
      );
    }
  };

  const handleCreateReport = () => {
    setIsLoading(true);
    // 로딩이 100%가 되면 모달을 닫고 상세 보고서를 보여주기 위해 5초 후에 실행
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedItems(new Set());
      // 새로운 보고서 데이터 생성 (예시)
      const newReport = {
        id: reportData.length + 1,
        image: image,
        title: "새로운 PR 보고서",
        createdAt: new Date().toISOString().split('T')[0],
        reviewCount: selectedItems.size,
        modes: ALL_MODES,
      };
      // 새로 생성된 보고서로 상세 모달 열기
      setSelectedReport(newReport);
      setIsDetailModalOpen(true);
    }, 5000);
  };

  return (
    <ReportWrapper>
      {/* <SearchBarSC
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        isDarkMode={isDarkMode}
      /> */}
      <PageTitle isDarkMode={isDarkMode}>Report</PageTitle>
      <CategoryBar isDarkMode={isDarkMode}>
        <CategoryItem style={{ width: "50px", justifyContent: "center" }} isDarkMode={isDarkMode}></CategoryItem>
        <CategoryItem style={{ width: "115px", justifyContent: "center" }} isDarkMode={isDarkMode}>
          Report Name
        </CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }} isDarkMode={isDarkMode}>
          Date
        </CategoryItem>
        <CategoryItem style={{ flex: 1, justifyContent: "flex-start", paddingLeft: "3vw" }} isDarkMode={isDarkMode}>
          Comments
        </CategoryItem>
        <CategoryItem style={{ flex: 1, justifyContent: "flex-start", paddingRight: "2vw" }} isDarkMode={isDarkMode}>
          Used Review Modes
        </CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }} isDarkMode={isDarkMode}>
          Download
        </CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }} isDarkMode={isDarkMode}>
          Delete
        </CategoryItem>
      </CategoryBar>
      <ReportContainer>
        <ReportList>
          {reportData.map((report) => (
            <ReportItem
              key={report.id}
              onClick={() => handleReportClick(report)}
              isDarkMode={isDarkMode}
            >
              <ReportImage>
                <img src={report.image} alt="report thumbnail" />
              </ReportImage>
              <ReportTitle isDarkMode={isDarkMode}>{report.title}</ReportTitle>
              <CreatedDate isDarkMode={isDarkMode}>{report.createdAt}</CreatedDate>
              <ReviewCount isDarkMode={isDarkMode}>
                Total of {report.reviewCount} AI review comments
              </ReviewCount>
              <ModeList>
                {ALL_MODES.map((mode, index) => (
                  <ModeTag
                    key={index}
                    isActive={report.modes.includes(mode)}
                    mode={mode}
                  >
                    {mode}
                  </ModeTag>
                ))}
              </ModeList>
              <DownloadButton isDarkMode={isDarkMode}>
                <DownloadIcon />
              </DownloadButton>
              <DeleteButton isDarkMode={isDarkMode}>
                <DeleteIcon />
              </DeleteButton>
            </ReportItem>
          ))}
        </ReportList>
      </ReportContainer>
      <ButtonWrapper>
        <PlayfulButton onClick={() => setIsModalOpen(true)}>
          + ADD
        </PlayfulButton>
      </ButtonWrapper>

      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} isDarkMode={isDarkMode}>
            {!isLoading ? (
              <>
                <ModalHeader>
                  <ButtonCheckboxContainer>
                    <CheckboxRound
                      checked={selectedItems.size === modalItems.length}
                      onClick={toggleSelectAll}
                    />
                    <PlayfulButton onClick={handleCreateReport}>
                      {`Create New Report${selectedItems.size > 0 ? ` (${selectedItems.size})` : ""}`}
                    </PlayfulButton>
                  </ButtonCheckboxContainer>
                  <SearchBarWrapper>
                    <SearchBar
                      width="800px"
                      placeholder="search pull request..."
                      backgroundColor={isDarkMode ? "#00000050" : "#f5f5f5"}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      isDarkMode={isDarkMode}
                    />
                  </SearchBarWrapper>
                  <CloseButton onClick={handleCloseModal}>
                    <CloseIcon />
                  </CloseButton>
                </ModalHeader>

                <ModalItemList>
                  {filteredModalItems.map((item) => (
                    <ModalItem
                      key={item.id}
                      selected={selectedItems.has(item.id)}
                      onClick={() => toggleItemSelection(item.id)}
                      isDarkMode={isDarkMode}
                    >
                      <CheckCircle checked={selectedItems.has(item.id)}>
                        {selectedItems.has(item.id) && "✓"}
                      </CheckCircle>
                      <ReviewMode mode={item.mode}>{item.mode}</ReviewMode>
                      <PRTitle isDarkMode={isDarkMode}>{item.title}</PRTitle>
                      <PRDate isDarkMode={isDarkMode}>{item.date}</PRDate>
                      <Grade grade={item.grade} isDarkMode={isDarkMode}>{item.grade}</Grade>
                      <IssueType isDarkMode={isDarkMode}>{item.issueType}</IssueType>
                    </ModalItem>
                  ))}
                </ModalItemList>
              </>
            ) : (
              <LoadingWrapper>
                <LoadingIndicator />
              </LoadingWrapper>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {isDetailModalOpen && selectedReport && (
        <ModalOverlay onClick={handleCloseDetailModal}>
          <DetailModalContent onClick={(e) => e.stopPropagation()}>
            <DetailHeader>
              <HeaderContent>
                <h2>{selectedReport.title}</h2>
                <HeaderInfo>
                  <InfoItem>
                    <InfoLabel>생성일</InfoLabel>
                    <InfoValue>{selectedReport.createdAt}</InfoValue>
                  </InfoItem>
                  <InfoDivider />
                  <InfoItem>
                    <InfoLabel>리뷰 수</InfoLabel>
                    <InfoValue>{selectedReport.reviewCount} comments</InfoValue>
                  </InfoItem>
                  <InfoDivider />
                  <InfoItem>
                    <InfoLabel>리뷰 모드</InfoLabel>
                    <ModeList>
                      {selectedReport.modes.map((mode, index) => (
                        <ModeTag key={index} isActive={true} mode={mode}>
                          {mode}
                        </ModeTag>
                      ))}
                    </ModeList>
                  </InfoItem>
                </HeaderInfo>
                <CloseButton onClick={handleCloseDetailModal}>
                  <CloseIcon />
                </CloseButton>
              </HeaderContent>
            </DetailHeader>
            <ReportContentWrapper>
              <ReportContent>
                <ReportContent>
                  <ContentTitle>AI 코드리뷰 익스텐션 보고서</ContentTitle>
                  <ContentText>
                    1. 개요 분석 대상 PR 수: 7개 (사용자 선택) 분석 기간: 2023년
                    7월 ~ 2023년 10월 평균 등급: B (문제 PR로 분류된 비율: 57%)
                    리뷰 모드: 엄격 모드 (코드 품질, 성능, 보안 강조) 2.
                    전체적인 문제점 및 개선 방안 2.1 성능 문제 전체적인 문제점
                    불필요한 데이터베이스 쿼리 반복 여러 PR에서 동일한 데이터를
                    여러 번 조회하는 문제가 반복되었습니다. 이로 인해
                    데이터베이스 부하가 증가하고, 응답 시간이 느려졌습니다.
                    복잡한 로직으로 인한 처리 속도 저하 중첩된 루프나 불필요한
                    조건문으로 인해 코드 실행 속도가 느린 경우가 많았습니다.
                    개선 방안 캐싱 도입 자주 조회되는 데이터는 캐싱하여
                    데이터베이스 조회 횟수를 줄이세요. 예: Redis를 사용해 사용자
                    데이터를 캐싱합니다. 쿼리 최적화 중복 쿼리를 제거하고,
                    필요한 데이터를 한 번에 조회하세요. 예: JOIN을 사용해 관련
                    데이터를 한 번에 가져옵니다. 로직 단순화 복잡한 루프와
                    조건문을 최소화하고, 알고리즘을 최적화하세요. 예: 리스트
                    컴프리헨션을 사용해 코드를 간결하게 만듭니다. 2.2 코드
                    스타일 문제 전체적인 문제점 주석 부족 주요 로직에 대한
                    설명이 없어 코드를 이해하기 어려운 경우가 많았습니다. 네이밍
                    컨벤션 불일치 변수와 함수 이름이 직관적이지 않아 코드
                    가독성이 떨어졌습니다. 개선 방안 주석 추가 주요 로직과
                    복잡한 알고리즘에는 설명을 추가하세요. 예: 함수의 목적,
                    입력값, 출력값을 명시합니다. 네이밍 컨벤션 통일 변수와 함수
                    이름은 직관적이고 일관되게 작성하세요. 예:
                    get_user_by_id()와 같이 명확한 이름을 사용합니다. 2.3 보안
                    문제 전체적인 문제점 API 키 하드코딩 민감한 정보가 코드에
                    직접 작성되어 보안 위험이 있었습니다. 입력값 검증 부족
                    사용자 입력값을 충분히 검증하지 않아 SQL Injection 등의
                    위험이 있었습니다. 개선 방안 환경 변수 사용 API 키와 같은
                    민감한 정보는 환경 변수로 관리하세요. 예: os.environ을
                    사용해 환경 변수를 로드합니다. 입력값 검증 강화 모든 사용자
                    입력값은 철저히 검증하세요. 예: pydantic 라이브러리를 사용해
                    입력값을 검증합니다. 3. 종합 평가 3.1 강점 데이터베이스 모델
                    설계 데이터베이스 모델 설계가 매우 우수합니다. 유틸리티 코드
                    재사용성 재사용성이 높은 유틸리티 코드가 많아 팀 전체에
                    도움이 됩니다. 3.2 개선점 성능 최적화 불필요한 쿼리와 복잡한
                    로직으로 인해 성능이 저하되는 경우가 많습니다. 코드 스타일
                    주석 부족과 네이밍 컨벤션 불일치로 인해 코드 가독성이
                    떨어집니다. 보안 강화 API 키 관리와 입력값 검증이 미흡해
                    보안 위험이 있습니다. 4. 시각화 자료 4.1 PR 등급 분포 ![PR
                    등급 분포 파이 차트] 4.2 문제 PR 유형 분포 ![문제 PR 유형
                    분포 바 차트] 4.3 파일 유형별 등급 추이 ![파일 유형별 등급
                    추이 라인 그래프] 5. 결론 및 추천 5.1 강점 데이터베이스 모델
                    설계와 유틸리티 코드 재사용성이 매우 우수합니다. 이러한
                    강점을 유지하면서, 아래 개선점을 해결해 보세요. 5.2 개선점
                    성능 최적화: 불필요한 쿼리와 복잡한 로직을 단순화하세요.
                    코드 스타일: 주석을 추가하고, 네이밍 컨벤션을 통일하세요.
                    보안 강화: API 키를 환경 변수로 관리하고, 입력값을 철저히
                    검증하세요. 5.3 추천 학습 자료 성능 최적화: "High
                    Performance MySQL" by Baron Schwartz 코드 스타일: "Clean
                    Code" by Robert C. Martin 보안: "Web Application Security"
                    by Andrew Hoffman 6. 향후 목표 성능 최적화: 모든 PR의 성능
                    등급을 A 이상으로 개선 코드 스타일: 모든 PR에서 코드 스타일
                    등급 S 달성 보안 강화: 모든 PR에서 보안 등급 S 달성 이
                    보고서는 사용자가 선택한 PR 리뷰를 종합적으로 분석하여
                    전체적인 문제점과 개선 방안을 제공합니다. **"AI 코드리뷰
                    익스텐션"**과 함께 더 나은 개발자로 성장해 보세요! 1. 개요
                    분석 대상 PR 수: 7개 (사용자 선택) 분석 기간: 2023년 7월 ~
                    2023년 10월 평균 등급: B (문제 PR로 분류된 비율: 57%) 리뷰
                    모드: 엄격 모드 (코드 품질, 성능, 보안 강조) 2. 전체적인
                    문제점 및 개선 방안 2.1 성능 문제 전체적인 문제점 불필요한
                    데이터베이스 쿼리 반복 여러 PR에서 동일한 데이터를 여러 번
                    조회하는 문제가 반복되었습니다. 이로 인해 데이터베이스
                    부하가 증가하고, 응답 시간이 느려졌습니다. 복잡한 로직으로
                    인한 처리 속도 저하 중첩된 루프나 불필요한 조건문으로 인해
                    코드 실행 속도가 느린 경우가 많았습니다. 개선 방안 캐싱 도입
                    자주 조회되는 데이터는 캐싱하여 데이터베이스 조회 횟수를
                    줄이세요. 예: Redis를 사용해 사용자 데이터를 캐싱합니다.
                    쿼리 최적화 중복 쿼리를 제거하고, 필요한 데이터를 한 번에
                    조회하세요. 예: JOIN을 사용해 관련 데이터를 한 번에
                    가져옵니다. 로직 단순화 복잡한 루프와 조건문을 최소화하고,
                    알고리즘을 최적화하세요. 예: 리스트 컴프리헨션을 사용해
                    코드를 간결하게 만듭니다. 2.2 코드 스타일 문제 전체적인
                    문제점 주석 부족 주요 로직에 대한 설명이 없어 코드를
                    이해하기 어려운 경우가 많았습니다. 네이밍 컨벤션 불일치
                    변수와 함수 이름이 직관적이지 않아 코드 가독성이
                    떨어졌습니다. 개선 방안 주석 추가 주요 로직과 복잡한
                    알고리즘에는 설명을 추가하세요. 예: 함수의 목적, 입력값,
                    출력값을 명시합니다. 네이밍 컨벤션 통일 변수와 함수 이름은
                    직관적이고 일관되게 작성하세요. 예: get_user_by_id()와 같이
                    명확한 이름을 사용합니다. 2.3 보안 문제 전체적인 문제점 API
                    키 하드코딩 민감한 정보가 코드에 직접 작성되어 보안 위험이
                    있었습니다. 입력값 검증 부족 사용자 입력값을 충분히 검증하지
                    않아 SQL Injection 등의 위험이 있었습니다. 개선 방안 환경
                    변수 사용 API 키와 같은 민감한 정보는 환경 변수로
                    관리하세요. 예: os.environ을 사용해 환경 변수를 로드합니다.
                    입력값 검증 강화 모든 사용자 입력값은 철저히 검증하세요. 예:
                    pydantic 라이브러리를 사용해 입력값을 검증합니다. 3. 종합
                    평가 3.1 강점 데이터베이스 모델 설계 데이터베이스 모델
                    설계가 매우 우수합니다. 유틸리티 코드 재사용성 재사용성이
                    높은 유틸리티 코드가 많아 팀 전체에 도움이 됩니다. 3.2
                    개선점 성능 최적화 불필요한 쿼리와 복잡한 로직으로 인해
                    성능이 저하되는 경우가 많습니다. 코드 스타일 주석 부족과
                    네이밍 컨벤션 불일치로 인해 코드 가독성이 떨어집니다. 보안
                    강화 API 키 관리와 입력값 검증이 미흡해 보안 위험이
                    있습니다. 4. 시각화 자료 4.1 PR 등급 분포 ![PR 등급 분포
                    파이 차트] 4.2 문제 PR 유형 분포 ![문제 PR 유형 분포 바
                    차트] 4.3 파일 유형별 등급 추이 ![파일 유형별 등급 추이 라인
                    그래프] 5. 결론 및 추천 5.1 강점 데이터베이스 모델 설계와
                    유틸리티 코드 재사용성이 매우 우수합니다. 이러한 강점을
                    유지하면서, 아래 개선점을 해결해 보세요. 5.2 개선점 성능
                    최적화: 불필요한 쿼리와 복잡한 로직을 단순화하세요. 코드
                    스타일: 주석을 추가하고, 네이밍 컨벤션을 통일하세요. 보안
                    강화: API 키를 환경 변수로 관리하고, 입력값을 철저히
                    검증하세요. 5.3 추천 학습 자료 성능 최적화: "High
                    Performance MySQL" by Baron Schwartz 코드 스타일: "Clean
                    Code" by Robert C. Martin 보안: "Web Application Security"
                    by Andrew Hoffman 6. 향후 목표 성능 최적화: 모든 PR의 성능
                    등급을 A 이상으로 개선 코드 스타일: 모든 PR에서 코드 스타일
                    등급 S 달성 보안 강화: 모든 PR에서 보안 등급 S 달성 이
                    보고서는 사용자가 선택한 PR 리뷰를 종합적으로 분석하여
                    전체적인 문제점과 개선 방안을 제공합니다. **"AI 코드리뷰
                    익스텐션"**과 함께 더 나은 개발자로 성장해 보세요!
                  </ContentText>
                </ReportContent>
              </ReportContent>
              <ReportGraph>
                <GraphTitle>
                  {GRAPHS[graphTypes[currentGraphIndex]].title}
                </GraphTitle>
                <GraphNavButton
                  style={{ left: "10px" }}
                  onClick={() => navigateGraph("prev")}
                >
                  ←
                </GraphNavButton>
                <div style={{ height: "600px" }}>
                  {GRAPHS[graphTypes[currentGraphIndex]].component(radarData)}
                </div>
                <GraphNavButton
                  style={{ right: "10px" }}
                  onClick={() => navigateGraph("next")}
                >
                  →
                </GraphNavButton>
              </ReportGraph>
            </ReportContentWrapper>
          </DetailModalContent>
        </ModalOverlay>
      )}
    </ReportWrapper>
  );
};

const ReportWrapper = styled.div`
  height: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 10px;
`;

const PageTitle = styled.h1`
  font-size: 50px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
  margin-left: 60px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#000000")};
`;

const ReportContainer = styled.div`
  height: calc(100vh - 280px);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ReportImage = styled.div`
  width: 50px;
  height: 50px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const CreatedDate = styled.span`
  width: 100px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
  font-size: 18px;
`;

const ReviewCount = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
`;

const ModeList = styled.div`
  flex: 2;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  background: #00000000;
`;

const ModeTag = styled.span`
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 14px;
  background-color: "00000000";
  color: ${(props) => (props.isActive ? MODE_COLORS[props.mode].text : "#666")};
  transition: all 0.2s ease-in-out;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 36px;
    height: 36px;
  }
`;

const DownloadButton = styled(IconButton)`
  width: 100px;
`;

const DeleteButton = styled(IconButton)`
  width: 100px;
`;

const ReportItem = styled.div`
  display: flex;
  align-items: center;
  width: 87rem;
  gap: 45px;
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
  padding: 20px;
  background: ${({ isDarkMode }) => (isDarkMode ? "#00000050" : "#ffffff")};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const CategoryBar = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  width: 87rem;
  height: auto;
  padding: 0 20px;
  margin-top: 24px;
  margin-left: 60px;
  margin-bottom: 0px;
  gap: 40px;
  border-radius: 15px;
  background: ${({ isDarkMode }) => (isDarkMode ? "#00000050" : "#ECECEC")};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "1px solid #00000030")};
  z-index: 1;
`;

const CategoryItem = styled.div`
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0px;
  margin: 0px;
`;

const ReportTitle = styled.h1`
  width: 100px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
  font-size: 20px;
`;

const ReportList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  overflow-y: auto;
  width: 90rem;

  &::-webkit-scrollbar {
    width: 8px;
    margin-left: 4px; // 스크롤바를 리스트에서 살짝 띄움
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 80px;

  .button {
    min-width: 120px;
    width: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled.div`
  background: ${({ isDarkMode }) => (isDarkMode ? "#00000050" : "#e8e8e8")};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};
  width: 90rem;
  height: 90vh;
  margin: auto;
  border-radius: 20px;
  padding: 30px;
  animation: slideUp 0.5s ease-out forwards;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const ModalItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
  overflow-y: auto;
  max-height: calc(100% - 100px);
  padding: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const ModalItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 30px;
  background: ${({ isDarkMode }) => (isDarkMode ? '#00000050' : 'white')};
  border-radius: 15px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  gap: 30px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: ${({ isDarkMode }) => (isDarkMode ? '1px solid #FFFFFF' : 'none')};

  &:hover {
    transform: translateX(5px);
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#000000' : '#f8f9fa')};
  }

  ${(props) =>
    props.selected &&
    `
    background-color: ${props.isDarkMode ? '#10204C' : '#C0CDF2'};
  `}
`;

const CheckCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #4a90e2;
  background-color: ${(props) => (props.checked ? "#4A90E2" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
`;

const ReviewMode = styled.div`
  width: 120px;
  color: ${(props) => MODE_COLORS[props.mode]?.text || "#666"};
  background-color: ${(props) => MODE_COLORS[props.mode]?.bg || "#f5f5f5"};
  padding: 5px 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 15px;
  flex-shrink: 0;
`;

const PRTitle = styled.div`
  flex: 1;
  font-size: 16px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#D6D6D6' : '#333333')};
`;

const PRDate = styled.div`
  width: 100px;
  color: #666;
  font-size: 14px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#D6D6D6' : '#333333')};
`;

const Grade = styled.div`
  width: 80px;
  text-align: center;
  font-weight: 500;
  color: ${(props) => GRADE_COLORS[props.grade] || "#666"};
  flex-shrink: 0;
`;

const IssueType = styled.div`
  width: 120px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#D6D6D6' : '#333333')};
  text-align: right;
  flex-shrink: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0vw;
`;

// 새로운 styled components 추가
const CheckboxRound = styled.div`
  width: 1.6em;
  height: 1.6em;
  background-color: ${(props) => (props.checked ? "#4A90E2" : "white")};
  border-radius: 50%;
  border: 2px solid #4a90e2;
  margin-right: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 38px;
  cursor: pointer;

  &::after {
    content: "✓";
    color: white;
    font-size: 0.8em;
    opacity: ${(props) => (props.checked ? 1 : 0)};
  }
`;

const ButtonCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 3vw;
`;

// 새로운 스타일 컴포넌트 추가
const DetailModalContent = styled(ModalContent)`
  width: 90rem;
  height: 90vh;
  margin: auto;
`;

const DetailHeader = styled.div`
  padding: 10px;
  background: white;
  border-radius: 15px 15px 0 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  h2 {
    font-size: 20px;
    color: #333;
    margin-left: 30px;
    flex-shrink: 0;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 24px;
  flex: 1;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const InfoDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #eee;
`;

const ReportContent = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 0px 0px 0px 15px;
  background-color: white;
  padding: 20px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
  width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ isDarkMode }) => (isDarkMode ? '#4A4A4A' : '#D9D9D9')};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#777777')};
    border-radius: 10px;
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? '#333' : '#f0f0f0')};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#c7c7c7' : '#555')};
  }
`;

const ReportGraph = styled.div`
  width: 80%;
  height: 100%;
  background-color: white;
  border-radius: 0px 0px 15px 0px;
  overflow-y: auto;
  padding: 20px;
  position: relative;
`;

const GraphNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 1;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &:left {
    left: 10px;
  }

  &:right {
    right: 10px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }
`;

const GraphTitle = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
`;

const ContentText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
`;

const ReportContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
`;

const ContentTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Report;