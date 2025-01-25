import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PlayfulButton from "../components/PlayfulButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "../components/SearchBar/SearchBar";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";
import {
  getReports,
  deleteReport,
  downloadReport,
  getReportModes,
  createReport,
  getPrReviews,
  getReportById,
} from "../services/ReportService";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/highcharts-more';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/accessibility';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from 'remark-gfm';

const image = "https://avatars.githubusercontent.com/u/192951892?s=48&v=4";

const ALL_MODES = ["basic", "study", "newbie", "clean", "optimize"];

const MODE_COLORS = {
  basic: {
    bg: "#FFF1EC",
    text: "#FF794E",
  },
  study: {
    bg: "#FFF9E6",
    text: "#FFCD39",
  },
  clean: {
    bg: "#EDF6FD",
    text: "#4DABF5",
  },
  optimize: {
    bg: "#F9F0F7",
    text: "#BC6FCD",
  },
  newbie: {
    bg: "#F0F9F0",
    text: "#70BF73",
  },
};

const GRADE_COLORS = {
  S: "#FF6B6B",
  A: "#4A90E2",
  B: "#50C878",
  C: "#FFB84D",
  D: "#808080",
};

const ISSUE_TYPE_COLORS = {
  "코드 구조": "#FF9F1C",
  성능: "#2EC4B6",
  보안: "#E71D36",
  가독성: "#4361EE",
  "버그 가능성": "#B5179E",
  기타: "#748CAB",
};

// 예시 데이터에서 가져온거라 medalData 라고 함
const medalData = {
    categories: [
        'PR 1',
        'PR 2',
        'PR 3',
        'PR 4',
        'PR 5',
        'PR 6',
        'PR 7',
        'PR 8',
        'PR 9',
        'PR 10',
    ],
    // Basic, Study, Clean Code, Optimize, Newbie 순서로 데이터 입력
    series: [
        { name: 'Basic', data: [10, 0, 30, 0, 50, 0, 0, 0, 0, 0] },
        { name: 'Study', data: [0, 0, 0, 0, 0, 0, 50, 0, 0, 0] },
        { name: 'Clean Code', data: [0, 0, 0, 0, 0, 43, 0, 80, 0, 0] },
        { name: 'Optimize', data: [0, 0, 0, 80, 0, 0, 0, 0, 30, 0] },
        { name: 'Newbie', data: [0, 83, 0, 0, 0, 0, 0, 0, 0, 100] }
    ]
};

const HighChartBar = () => {
    const categories = ["S", "A", "B", "C", "D"];
    const perCategoryHeight = 135; // 각 카테고리에 할당할 높이 (픽셀 단위)
    const chartHeight = categories.length * perCategoryHeight;

    const chartOptions = {
        chart: {
            type: "bar",
            height: chartHeight, // 동적으로 계산된 차트 높이 설정
        },
        title: {
            text: "",
        },
        xAxis: {
            categories: categories,
            title: {
                text: null,
            },
            gridLineWidth: 5,
            lineWidth: 1,
        },
        yAxis: {
            min: 0,
            title: {
                text: "개수",
                align: "high",
            },
            labels: {
                overflow: "justify",
            },
            gridLineWidth: 0,
            lineWidth: 1,
        },
        tooltip: {
            valueSuffix: " 개",
        },
        plotOptions: {
            bar: {
                borderRadius: "50%",
                dataLabels: {
                    enabled: true,
                },
                groupPadding: 0.2,
            },
        },
        legend: {
            layout: "vertical",
            align: "right",
            verticalAlign: "top",
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: "#FFFFFF",
            shadow: true,
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: "코드 구조",
                data: [3, 0, 0, 2, 1],
            },
            {
                name: "성능",
                data: [1, 1, 0, 0, 0],
            },
            {
                name: "보안",
                data: [3, 0, 0, 0, 0],
            },
            {
                name: "가독성",
                data: [2, 0, 0, 0, 1],
            },
            {
                name: "버그 가능성",
                data: [1, 1, 0, 1, 0],
            },
        ],
    };

    const containerStyle = {
        minWidth: "310px",
        maxWidth: "800px",
        margin: "1em auto",
    };

    return (
        <div style={containerStyle}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
    );
};

const GRAPHS = [
  {
    title: "PR별 점수 지표",
    component: () => {
      const styles = {
        container: { height: '600px' },
        figure: { minWidth: '320px', maxWidth: '800px', margin: '1em auto', textAlign: 'center', marginTop: '100px' },
      };

      const options = {
        colors: ['#FF794E', '#BC6FCD', '#70BF73', '#4DABF5', '#FFCD39'],
        chart: {
          type: 'column',
          inverted: true,
          polar: true,
          backgroundColor: '#ffffff',
        },
        title: {
          text: '',
          align: 'center',
          style: {
            fontSize: '24px',
            color: '#000000',
          },
        },
        tooltip: { outside: false, zIndex: 1000 },
        pane: { size: '100%', innerSize: '10%', endAngle: 270 },
        xAxis: {
          categories: medalData.categories,
          tickInterval: 1,
          labels: {
            align: 'right',
            useHTML: true,
            allowOverlap: true,
            step: 1,
            y: 3,
            style: { fontSize: '13px' },
            formatter: function() {
              if (typeof this.value === 'string') {
                return this.value.replace(' ', '&nbsp;');
              }
              return String(this.value);
            }
          },
          lineWidth: 0,
          gridLineWidth: 0,
        },
        yAxis: {
          lineWidth: 0,
          tickInterval: 25,
          reversedStacks: false,
          endOnTick: true,
          showLastLabel: true,
          gridLineWidth: 5,
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15,
            borderRadius: '50%',
          }
        },
        series: medalData.series
      };

      return (
        <div style={styles.figure}>
          <div style={styles.container}>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      );
    },
  },
  {
    title: "등급 및 이슈 유형별 분포",
    component: () => <HighChartBar />,
  },
];

const ModeListContainer = styled.div`
  flex: 2;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  background: #00000000;
`;

const ModeTag = styled.span.attrs((props) => ({
  className: props.className,
}))`
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 16px;
  background-color: ${({ $isActive, $mode }) =>
    $isActive ? MODE_COLORS[$mode].bg : "#f5f5f5"};
  color: ${({ $isActive, $mode }) =>
    $isActive ? MODE_COLORS[$mode].text : "#666666"};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ModeList = ({ reportId }) => {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    const fetchModes = async () => {
      try {
        const response = await getReportModes(reportId);
        console.log("API 응답:", response);
        console.log("설정된 모드:", response.modes);
        setModes(response.modes);
      } catch (error) {
        console.error("모드 정보 로드 실패:", error);
      }
    };
    fetchModes();
  }, [reportId]);

  console.log("현재 modes 상태:", modes);
  console.log("ALL_MODES:", ALL_MODES);

  return (
    <ModeListContainer>
      {ALL_MODES.map((mode, index) => {
        const isActive = modes.includes(mode);
        console.log(`${mode} 활성화 여부:`, isActive);

        return (
          <ModeTag
            key={index}
            $isActive={isActive}
            $mode={mode}
            style={{ marginRight: "8px" }}
          >
            {mode}
          </ModeTag>
        );
      })}
    </ModeListContainer>
  );
};

const Report = ({ isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);
  const graphTypes = Object.keys(GRAPHS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [reportData, setReportData] = useState([]);
  const [modalItems, setModalItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPRs, setIsLoadingPRs] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const MAX_SELECTIONS = 10; // 최대 선택 개수 상수 추가
  const MIN_SELECTIONS = 5; // 최소 선택 개수 상수 추가
  const [reportDetail, setReportDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await getReports();
      const formattedReports = response.reports.map((report) => ({
        id: report.report_id,
        image: image,
        title: report.title,
        createdAt: report.created_at.split(" ")[0],
        reviewCount: report.review_num,
      }));

      setReportData(formattedReports);
    } catch (error) {
      console.error("보고서 로드 실패:", error);
    }
  };

  const handleDeleteReport = async (reportId, e) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    // 삭제 확인
    const isConfirmed = window.confirm(
      "이 보고서를 삭제하시겠습니까? \n삭제하면 복구할 수 없습니다."
    );
    if (!isConfirmed) return;

    try {
      await deleteReport(reportId);
      // 삭제 후 목록 새로고침
      loadReports();
    } catch (error) {
      console.error("보고서 삭제 실패:", error);
      alert("보고서 삭제에 실패했습니다.");
    }
  };

  const handleDownloadReport = async (reportId, e) => {
    e.stopPropagation();
    try {
      const response = await downloadReport(reportId);
      window.open(response.pdf_url, "_blank");
    } catch (error) {
      console.error("보고서 다운로드 실패:", error);
    }
  };

  const handleCreateReport = () => {
    if (selectedItems.size < MIN_SELECTIONS) {
      alert("최소 5개의 PR을 선택해주세요.");
      return;
    }
    setIsTitleModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportTitle.trim()) {
      alert("보고서 제목을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setIsTitleModalOpen(false);

    try {
      const selectedPrIds = Array.from(selectedItems);
      const response = await createReport(reportTitle, selectedPrIds);

      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedItems(new Set());
      setReportTitle("");

      // 새로 생성된 보고서 상세 보기로 이동
      const newReport = {
        id: response.report_id,
        title: response.title,
        createdAt: response.created_at,
        reviewCount: response.review_num,
      };

      setSelectedReport(newReport);
      setIsDetailModalOpen(true);
      handleReportClick(newReport);
      loadReports();
    } catch (error) {
      setIsLoading(false);
      console.error("보고서 생성 실패:", error);
      alert("보고서 생성에 실패했습니다.");
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (newSet.size >= MAX_SELECTIONS) {
          alert("최대 10개까지만 선택할 수 있습니다.");
          return prev;
        }
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // 전체 선택 토글 함수 수정
  const toggleSelectAll = () => {
    if (
      filteredModalItems.length > 0 &&
      filteredModalItems.every((item) => selectedItems.has(item.id))
    ) {
      // 필터링된 아이템들의 ID만 선택 해제
      const newSelectedItems = new Set(selectedItems);
      filteredModalItems.forEach((item) => {
        newSelectedItems.delete(item.id);
      });
      setSelectedItems(newSelectedItems);
    } else {
      // 필터링된 아이템들의 ID를 기존 선택에 추가 (최대 10개까지)
      const newSelectedItems = new Set(selectedItems);
      let remainingSlots = MAX_SELECTIONS - newSelectedItems.size;

      if (remainingSlots <= 0) {
        alert("최대 10개까지만 선택할 수 있습니다.");
        return;
      }

      filteredModalItems.some((item) => {
        if (!newSelectedItems.has(item.id)) {
          if (remainingSlots > 0) {
            newSelectedItems.add(item.id);
            remainingSlots--;
            return false; // continue
          }
          return true; // break
        }
        return false;
      });

      setSelectedItems(newSelectedItems);
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
      item.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItems(new Set());
    setSearchQuery("");
  };

  const MarkdownContainer = styled.div`
  width: 100%;
  font-size: 16px;
  line-height: 1.6;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#333333")};

  h1, h2, h3 {
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    margin-top: 10px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#333333" : "#f2f2f2")};
  }

  tr:nth-child(even) {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#222222" : "#f9f9f9")};
  }

  code {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#444" : "#f5f5f5")};
    padding: 2px 5px;
    border-radius: 4px;
  }

  pre {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#222222" : "#f5f5f5")};
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }

  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
  text-align: left;

  /* 필요에 따라 추가 스타일링 가능 */
  
  /* 예: 링크 스타일 변경 */
  a {
    color: #1e90ff;
    text-decoration: underline;
  }

  /* 이미지 스타일 변경 */
  img {
    max-width: 100%;
    height: auto;
  }
`;

const MarkdownRenderer = ({ markdown, isDarkMode }) => {
  return (
      <MarkdownContainer isDarkMode={isDarkMode}>
          <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                  code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                          <SyntaxHighlighter
                              style={dark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                          >
                              {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                      ) : (
                          <code className={className} {...props}>
                              {children}
                          </code>
                      );
                  },
              }}
          >
              {markdown}
          </ReactMarkdown>
      </MarkdownContainer>
  );
};
  // 보고서 상세 보기 핸들러
  const handleReportClick = async (report) => {
    setIsDetailModalOpen(true);
    setSelectedReport(report);
    setIsLoadingDetail(true);

    try {
      const detail = await getReportById(report.id);
      console.log("📄 API 응답 데이터:", detail);
      const detailreport = generateMarkdownReport(detail.content); 
      setReportDetail(detailreport);
    } catch (error) {
      console.error("보고서 상세 정보 로드 실패:", error);
      alert("보고서 상세 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  const generateMarkdownReport = (contentString) => {
    if (!contentString) return "🚨 데이터 로드 실패: content 필드가 없습니다.";

    console.log("📄 변환 전 content (문자열 형태):", contentString);

    // 🛠 1️⃣ JSON 내 큰따옴표(`"`)를 ✅ 같은 잘 쓰이지 않는 문자로 변환
    contentString = contentString.replace(/"/g, "✅");

    console.log("🔵 큰따옴표 변환 완료 (✅로 대체):", contentString);

    // 🛠 2️⃣ 작은따옴표(`'`)를 큰따옴표(`"`)로 변환하여 정규식 매칭 가능하도록 수정
    contentString = contentString.replace(/'/g, '"');

    console.log("🔵 작은따옴표 → 큰따옴표 변환 완료:", contentString);

    // 🛠 3️⃣ 제목 추출
    const titleMatch = contentString.match(/"title"\s*:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : "프로젝트 리뷰 보고서";

    // 🛠 4️⃣ 작성자 추출
    const authorMatch = contentString.match(/"author"\s*:\s*"([^"]+)"/);
    const author = authorMatch ? authorMatch[1] : "Unknown";

    // 🛠 5️⃣ 작성일자 추출
    const dateMatch = contentString.match(/"created_date"\s*:\s*"([^"]+)"/);
    const createdDate = dateMatch ? dateMatch[1] : "N/A";

    let markdown = `# ${title}\n\n`;
    markdown += `**작성자:** ${author}\n\n`;
    markdown += `**작성일자:** ${createdDate}\n\n---\n\n`;

    // 🛠 6️⃣ PR 리뷰 테이블 추출 (마크다운 표 유지)
    let reviewTableMatch = contentString.match(/"review_table"\s*:\s*\[(.*?)\]/s);
    if (reviewTableMatch) {
        let reviewTableContent = reviewTableMatch[1];

        // 테이블 헤더 추가
        markdown += `## 1. PR 리뷰 테이블\n\n`;
        markdown += `| ID | 제목 | 평균 등급 | 리뷰 모드 | 문제 유형 | 작성일자 |\n`;
        markdown += `|----|------|-----------|-----------|-----------|----------|\n`;

        // 개별 PR 리뷰 항목 추출 (마크다운 표 유지)
        let reviews = [...reviewTableContent.matchAll(/\{([^}]+)\}/g)];
        reviews.forEach((review) => {
            let id = review[1].match(/"id"\s*:\s*(\d+)/)?.[1] || "N/A";
            let title = review[1].match(/"title"\s*:\s*"([^"]+)"/)?.[1] || "N/A";
            let grade = review[1].match(/"aver_grade"\s*:\s*"([^"]+)"/)?.[1] || "N/A";
            let mode = review[1].match(/"review_mode"\s*:\s*"([^"]+)"/)?.[1] || "N/A";
            let problem = review[1].match(/"problem_type"\s*:\s*"([^"]+)"/)?.[1] || "N/A";
            let date = review[1].match(/"created_at"\s*:\s*"([^"]+)"/)?.[1] || "N/A";

            markdown += `| ${id} | ${title} | ${grade} | ${mode} | ${problem} | ${date} |\n`;
        });

        markdown += `\n---\n\n`;
    } else {
        markdown += `\n**PR 리뷰 데이터가 없습니다.**\n\n`;
    }

    // 🛠 7️⃣ 분석 결과 추출
    const analysisMatch = contentString.match(/"analysis"\s*:\s*"([\s\S]+?)"/);
    if (analysisMatch) {
        markdown += `## 2. 분석 결과\n\n`;
        markdown += `${analysisMatch[1].replace(/\\n/g, "\n")}\n\n---\n\n`;
    } else {
        markdown += `\n**분석 결과가 없습니다.**\n\n`;
    }

    // 🛠 8️⃣ ✅를 다시 큰따옴표(`"`)로 복원
    markdown = markdown.replace(/✅/g, '"');

    console.log("✅ 변환된 마크다운 (최종):", markdown);
    return markdown;
};


  // 상세 모달 닫기 핸들러
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReport(null);
    setReportDetail(null);
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

  // PR 리뷰 목록 로드 함수 수정
  const loadPrReviews = async (pageToLoad = currentPage) => {
    if (pageToLoad === 1) {
      setIsLoadingPRs(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await getPrReviews(pageToLoad);
      const formattedItems = response.data.map((item) => ({
        id: item.id,
        mode: item.review_mode,
        title: item.title,
        date: new Date(item.created_at).toLocaleDateString(),
        grade: item.aver_grade,
        issueType: item.problem_type,
      }));

      if (pageToLoad === 1) {
        setModalItems(formattedItems);
      } else {
        setModalItems((prev) => [...prev, ...formattedItems]);
      }

      setHasNextPage(response.hasNextPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("PR 리뷰 목록 로드 실패:", error);
    } finally {
      if (pageToLoad === 1) {
        setIsLoadingPRs(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // 무한 스크롤 observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isLoadingMore &&
          isModalOpen
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isLoadingMore, isModalOpen]);

  // 모달이 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (isModalOpen) {
      setCurrentPage(1);
      loadPrReviews(1);
    }
  }, [isModalOpen]);

  // 페이지 변경시 추가 데이터 로드
  useEffect(() => {
    if (currentPage > 1 && isModalOpen) {
      loadPrReviews(currentPage);
    }
  }, [currentPage]);

// 원본 데이터(json)입니다.
//const content = {'title': 'qqq', 'author': 'DeepSeek API', 'created_date': '2025-01-23', 'summary': {'total_prs': 5, 'clean_mode_count': 0, 'optimize_mode_count': 0, 'study_mode_count': 0, 'newbie_mode_count': 0, 'basic_mode_count': 0}, 'review_table': [{'id': 1, 'title': 'ddd', 'aver_grade': 'a', 'problem_type': '재사용성', 'review_mode': 'Basic', 'created_at': '2025-01-22 17:24:35'}, {'id': 2, 'title': 'dddw', 'aver_grade': 'a', 'problem_type': '재사용성', 'review_mode': 'Basic', 'created_at': '2025-01-22 17:24:35'}, {'id': 3, 'title': 'dddsf', 'aver_grade': 'a', 'problem_type': '재사용성', 'review_mode': 'Basic', 'created_at': '2025-01-22 17:24:35'}, {'id': 4, 'title': 'ddddfs', 'aver_grade': 'a', 'problem_type': '재사용성', 'review_mode': 'Basic', 'created_at': '2025-01-22 17:24:35'}, {'id': 5, 'title': 'dddaeghsgs', 'aver_grade': 'a', 'problem_type': '재사용성', 'review_mode': 'Basic', 'created_at': '2025-01-22 17:24:35'}], 'analysis': '### 2-1. 리뷰 결과 통계\n\n- **분석된 PR 수**: 5\n- **Clean 모드**: 0개의 리뷰\n- **Optimize 모드**: 0개의 리뷰\n- **Study 모드**: 0개의 리뷰\n- **newbie 모드**: 0개의 리뷰\n- **basic 모드**: 0개의 리뷰\n\n---\n\n### 2-2. 주요 취약점 및 개선 우선순위\n\n**취약한 유형 통계 및 개선 방향**:\n\n1. **취약점 유형 문제점**: 코드 가독성 부족\n   - **개선 방향**: 변수명과 함수명을 명확하게 정의하고, 주석을 적절히 추가하여 코드의 의도를 명확히 전달해야 합니다.\n   - **안좋은 예시**: `int a = 10;`\n   - **좋은 예시**: `int userAge = 10;`\n\n2. **취약점 유형 문제점**: 중복 코드\n   - **개선 방향**: 중복된 코드를 함수로 추출하여 재사용성을 높이고, 유지보수를 용이하게 해야 합니다.\n   - **안좋은 예시**: \n     ```python\n     print("Hello, World!")\n     print("Hello, World!")\n     ```\n   - **좋은 예시**: \n     ```python\n     def greet():\n         print("Hello, World!")\n     \n     greet()\n     greet()\n     ```\n\n3. **취약점 유형 문제점**: 예외 처리 부재\n   - **개선 방향**: 예외 상황을 고려하여 적절한 예외 처리를 추가해야 합니다.\n   - **안좋은 예시**: \n     ```python\n     result = 10 / 0\n     ```\n   - **좋은 예시**: \n     ```python\n     try:\n         result = 10 / 0\n     except ZeroDivisionError:\n         print("Cannot divide by zero")\n     ```\n\n---\n\n### 2-3. 개인화된 피드백 및 권장사항\n\n**사용자 맞춤 개선 방향**:\n\n- **가장 낮은 점수를 받은 평가 기준**: 코드 가독성\n  - **개선 방안**: 변수명과 함수명을 명확하게 정의하고, 주석을 적절히 추가하여 코드의 의도를 명확히 전달하세요. 또한, 코드를 모듈화하여 각 함수가 하나의 역할만 수행하도록 설계하세요.\n\n- **추천 학습 자료**:\n  - [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)\n  - [Refactoring: Improving the Design of Existing Code by Martin Fowler](https://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672)\n\n- **관련 예시 코드**:\n  ```python\n  # 안좋은 예시\n  def process_data(data):\n      a = data[0]\n      b = data[1]\n      c = a + b\n      return c\n\n  # 좋은 예시\n  def calculate_sum(data):\n      first_number = data[0]\n      second_number = data[1]\n      total_sum = first_number + second_number\n      return total_sum\n  ```\n\n---\n\n### 2-4. 종합 결론\n\n**총평**:\n\n- **강점**:\n  1. 코드의 기본 구조가 잘 잡혀 있어 확장성이 좋습니다.\n  2. 프로젝트의 목표가 명확하게 정의되어 있습니다.\n  3. 팀원 간의 협업이 원활하게 이루어지고 있습니다.\n\n- **약점**:\n  1. 코드 가독성이 떨어져 유지보수가 어렵습니다.\n  2. 중복 코드가 많아 코드의 재사용성이 낮습니다.\n  3. 예외 처리가 부족하여 안정성이 떨어집니다.\n\n- **향후 권장 사항**:\n  - **Study 모드**를 사용하여 코드 리팩토링과 예외 처리에 대한 학습을 강화하세요.\n  - 코드 리뷰를 통해 팀원 간의 코드 품질을 지속적으로 개선해 나가세요.\n  - 코드 가독성과 재사용성을 높이기 위해 Clean Code 원칙을 적용하세요.\n\n---\n\n### 첨부 자료\n\n- **추천 학습 자료**:\n  - [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)\n  - [Refactoring: Improving the Design of Existing Code by Martin Fowler](https://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672)\n\n- **관련 예시 코드**:\n  ```python\n  # 안좋은 예시\n  def process_data(data):\n      a = data[0]\n      b = data[1]\n      c = a + b\n      return c\n\n  # 좋은 예시\n  def calculate_sum(data):\n      first_number = data[0]\n      second_number = data[1]\n      total_sum = first_number + second_number\n      return total_sum\n  ```\n\n이 보고서를 통해 프로젝트의 강점과 약점을 명확히 이해하고, 개선 방향을 설정하여 더 나은 코드 품질을 달성할 수 있기를 바랍니다.'}

  return (
    <ReportWrapper isDarkMode={isDarkMode}>
      <PageTitle isDarkMode={isDarkMode}>Report</PageTitle>
      <CategoryBar isDarkMode={isDarkMode}>
        <CategoryItem
          style={{ width: "50px", justifyContent: "center" }}
          isDarkMode={isDarkMode}
        ></CategoryItem>
        <CategoryItem
          style={{ width: "125px", justifyContent: "center"}}
          isDarkMode={isDarkMode}
        >
          Report Name
        </CategoryItem>
        <CategoryItem
          style={{ width: "105px", justifyContent: "center", paddingLeft: "1vw" }}
          isDarkMode={isDarkMode}
        >
          Date
        </CategoryItem>
        <CategoryItem
          style={{
            flex: 1,
            justifyContent: "flex-start",
            paddingLeft: "4.5vw",
          }}
          isDarkMode={isDarkMode}
        >
          Comments
        </CategoryItem>
        <CategoryItem
          style={{
            flex: 1,
            justifyContent: "flex-start",
            paddingLeft: "2.5vw",
          }}
          isDarkMode={isDarkMode}
        >
          Used Review Modes
        </CategoryItem>
        <CategoryItem
          style={{ width: "110px", justifyContent: "center", paddingLeft: "6vw" }}
          isDarkMode={isDarkMode}
        >
          Download
        </CategoryItem>
        <CategoryItem
          style={{ width: "100px", justifyContent: "center", paddingLeft: "1.4vw" }}
          isDarkMode={isDarkMode}
        >
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
              <CreatedDate isDarkMode={isDarkMode}>
                {report.createdAt}
              </CreatedDate>
              <ReviewCount isDarkMode={isDarkMode}>
                Total of {report.reviewCount} AI review comments
              </ReviewCount>
              <ModeList reportId={report.id} />
              <DownloadButton
                isDarkMode={isDarkMode}
                onClick={(e) => handleDownloadReport(report.id, e)}
              >
                <DownloadIcon />
              </DownloadButton>
              <DeleteButton
                isDarkMode={isDarkMode}
                onClick={(e) => handleDeleteReport(report.id, e)}
              >
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
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            isDarkMode={isDarkMode}
          >
            {!isLoading ? (
              <>
                <ModalHeader>
                  <ButtonCheckboxContainer>
                    <CheckboxRound
                      checked={
                        filteredModalItems.length > 0 &&
                        filteredModalItems.every((item) =>
                          selectedItems.has(item.id)
                        )
                      }
                      onClick={toggleSelectAll}
                    />
                    <PlayfulButton
                      onClick={handleCreateReport}
                      disabled={selectedItems.size < MIN_SELECTIONS}
                    >
                      {`Create New Report${selectedItems.size > 0 ? ` (${selectedItems.size}/${MAX_SELECTIONS})` : ""}`}
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
                  {modalItems.length > 0 ? (
                    <>
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
                          <PRTitle isDarkMode={isDarkMode}>
                            {item.title}
                          </PRTitle>
                          <PRDate isDarkMode={isDarkMode}>{item.date}</PRDate>
                          <Grade grade={item.grade} isDarkMode={isDarkMode}>
                            {item.grade}
                          </Grade>
                          <IssueType isDarkMode={isDarkMode}>
                            {item.issueType}
                          </IssueType>
                        </ModalItem>
                      ))}
                      {hasNextPage && (
                        <LoaderWrapper ref={observerTarget}>
                          {isLoadingMore && <LoadingIndicator size="small" />}
                        </LoaderWrapper>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      {isLoadingPRs ? (
                        <LoadingIndicator />
                      ) : (
                        "PR 리뷰가 없습니다."
                      )}
                    </div>
                  )}
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
          <DetailModalContent
            onClick={(e) => e.stopPropagation()}
            isDarkMode={isDarkMode}
          >
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
                    <ModeList reportId={selectedReport.id} />
                  </InfoItem>
                </HeaderInfo>
                <CloseButton onClick={handleCloseDetailModal}>
                  <CloseIcon />
                </CloseButton>
              </HeaderContent>
            </DetailHeader>

            <ReportContentWrapper>
              {isLoadingDetail ? (
                <LoadingWrapper>
                  <LoadingIndicator />
                </LoadingWrapper>
              ) : reportDetail ? (
                <>
                  <ReportContent>
                    <ContentTitle>AI 코드리뷰 보고서</ContentTitle>
                    <MarkdownRenderer markdown={reportDetail} />
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
                      {GRAPHS[graphTypes[currentGraphIndex]].component(
                        reportDetail.graphData
                      )}
                    </div>
                    <GraphNavButton
                      style={{ right: "10px" }}
                      onClick={() => navigateGraph("next")}
                    >
                      →
                    </GraphNavButton>
                  </ReportGraph>
                </>
              ) : (
                <div>데이터를 불러올 수 없습니다.</div>
              )}
            </ReportContentWrapper>
          </DetailModalContent>
        </ModalOverlay>
      )}

      {/* 보고서 제목 입력 모달 */}
      {isTitleModalOpen && (
        <ModalOverlay
          onClick={(e) => {
            e.stopPropagation();
            setIsTitleModalOpen(false);
            setReportTitle("");
          }}
        >
          <TitleModalContent
            onClick={(e) => e.stopPropagation()}
            isDarkMode={isDarkMode}
          >
            <TitleModalHeader>
              <h3>Report Title</h3>
              <CloseButton
                onClick={() => {
                  setIsTitleModalOpen(false);
                  setReportTitle("");
                }}
              >
                <CloseIcon />
              </CloseButton>
            </TitleModalHeader>
            <TitleInput
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="input Report Title..."
              isDarkMode={isDarkMode}
            />
            <ButtonContainer>
              <PlayfulButton
                onClick={handleSubmitReport}
                disabled={!reportTitle.trim()}
              >
                {isLoading ? "Creating..." : "Create"}
              </PlayfulButton>
            </ButtonContainer>
          </TitleModalContent>
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
  // background-color: ${({ isDarkMode }) => (isDarkMode ? '#121212' : '#f0f0f0')};
  background-color: '#f0f0f0';
  padding: 20px;
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
  width: 110px;
  margin-right: 20px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
  font-size: 18px;
  font-weight: 300;
`;

const ReviewCount = styled.div`
  flex: 1;
  font-weight: 500;
  font-size: 13px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
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
  margin-right: -45px;
  width: 100px;
`;

const DeleteButton = styled(IconButton)`
  width: 100px;
  margin-right: -15px;
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
  height: 45px;
  padding: 0 20px;
  margin-top: 4px;
  margin-left: 60px;
  margin-bottom: 0px;
  gap: 40px;
  border-radius: 10px;
  background: ${({ isDarkMode }) => (isDarkMode ? "#00000050" : "#ECECEC")};
  border: ${({ isDarkMode }) =>
    isDarkMode ? "1px solid #FFFFFF" : "1px solid #00000030"};
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
  width: 130px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#666666")};
  font-size: 16px;
  font-weight: 800;
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
    margin-left: 4px;
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
  background: ${({ isDarkMode }) => (isDarkMode ? "#00000050" : "white")};
  border-radius: 15px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  gap: 30px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};

  &:hover {
    transform: translateX(5px);
    background-color: ${({ isDarkMode }) =>
      isDarkMode ? "#000000" : "#f8f9fa"};
  }

  ${(props) =>
    props.selected &&
    `
    background-color: ${props.isDarkMode ? "#10204C" : "#C0CDF2"};
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
  color: ${({ isDarkMode }) => (isDarkMode ? "#D6D6D6" : "#333333")};
`;

const PRDate = styled.div`
  width: 100px;
  color: #666;
  font-size: 14px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#D6D6D6" : "#333333")};
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
  color: ${({ isDarkMode }) => (isDarkMode ? "#D6D6D6" : "#333333")};
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
    background: ${({ isDarkMode }) => (isDarkMode ? "#4A4A4A" : "#D9D9D9")};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) =>
      isDarkMode ? "#FFFFFF" : "#777777"};
    border-radius: 10px;
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f0f0f0")};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? "#c7c7c7" : "#555")};
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

const GraphTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
`;

const ContentText = styled(ReactMarkdown).attrs({
  components: {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  },
})`
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 12px;
  text-align: left;

  /* 필요에 따라 추가 스타일링 가능 */
  
  /* 예: 링크 스타일 변경 */
  a {
    color: #1e90ff;
    text-decoration: underline;
  }

  /* 이미지 스타일 변경 */
  img {
    max-width: 100%;
    height: auto;
  }
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

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
`;

const TitleModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#ffffff")};
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  z-index: 1001;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TitleModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    margin: 0;
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#ddd")};
  border-radius: 4px;
  margin-bottom: 20px;
  background: ${(props) => (props.isDarkMode ? "#333" : "#fff")};
  color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};

  &:focus {
    outline: none;
    border-color: #aef060;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default Report;