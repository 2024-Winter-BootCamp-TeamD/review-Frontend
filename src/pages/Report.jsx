import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PlayfulButton from "../components/PlayfulButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchBarSC from "../components/SearchBarSC";

const image = "https://avatars.githubusercontent.com/u/192951892?s=48&v=4";

const ALL_MODES = ["Basic", "Clean Code", "Optimize", "Newbie", "Study"];

const MODE_COLORS = {
  Basic: {
    bg: "#FFF1EC",
    text: "#FF794E",
  },
  "Clean Code": {
    bg: "#F9F0F7",
    text: "#AE5FA3",
  },
  Optimize: {
    bg: "#F0F9F0",
    text: "#70BF73",
  },
  Newbie: {
    bg: "#EDF6FD",
    text: "#4DABF5",
  },
  Study: {
    bg: "#FFF9E6",
    text: "#FFCD39",
  },
};

const Report = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const reportData = [
    {
      id: 1,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 25,
      modes: ALL_MODES,
    },
    {
      id: 2,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 15,
      modes: ["Optimize", "Basic"],
    },
    {
      id: 3,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 25,
      modes: ["Basic"],
    },
    {
      id: 4,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Optimize", "Newbie"],
    },
    {
      id: 7,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Clean Code", "Study"],
    },
    {
      id: 5,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Optimize", "Clean Code", "Study"],
    },
    {
      id: 6,
      image: image,
      title: "PR 보고서",
      createdAt: "2024-03-15",
      reviewCount: 20,
      modes: ["Optimize", "Clean Code", "Study"],
    },
  ];

  const [isChecked, setIsChecked] = useState(false);
  const handleCreateReport = () => {
    // 나중에 API 연동을 위한 임시 함수
    console.log("Report creation requested:", { isChecked });
    // 모달 닫기 등의 UI 처리가 필요하다면 여기에 추가
  };

  // 예시 데이터
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
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 3,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 4,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 5,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
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
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 8,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
      issueType: "Design Pattern",
    },
    {
      id: 9,
      mode: "Basic",
      title: "Feat/#68 로고 디자인 반영",
      date: "2024.01.03",
      grade: "A",
      issueType: "Design Pattern",
    },

    // ... 더 많은 아이템
  ];

  const [selectedItems, setSelectedItems] = useState(new Set());

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

  return (
    <ReportWrapper>
      <PageTitle>Report</PageTitle>
      <CategoryBar>
        <CategoryItem
          style={{ width: "50px", justifyContent: "center" }}
        ></CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }}>
          Report Name
        </CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }}>
          Date
        </CategoryItem>
        <CategoryItem style={{ flex: 1, justifyContent: "center" }}>
          Comments
        </CategoryItem>
        <CategoryItem style={{ flex: 1, justifyContent: "center" }}>
          Used Review Modes
        </CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }}>
          Download
        </CategoryItem>
        <CategoryItem style={{ width: "100px", justifyContent: "center" }}>
          Delete
        </CategoryItem>
      </CategoryBar>
      <ReportContainer>
        <ReportList>
          {reportData.map((report) => (
            <ReportItem key={report.id}>
              <ReportImage>
                <img src={report.image} alt="report thumbnail" />
              </ReportImage>
              <ReportTitle>{report.title}</ReportTitle>
              <CreatedDate>{report.createdAt}</CreatedDate>
              <ReviewCount>
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
              <DownloadButton>
                <DownloadIcon />
              </DownloadButton>
              <DeleteButton>
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
          <ModalContent onClick={(e) => e.stopPropagation()}>
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
                <SearchBarSC
                  width="800px"
                  placeholder="search pull request..."
                  backgroundColor="#f5f5f5"
                  value={searchQuery}
                  onChange={handleSearchChange}
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
                >
                  <CheckCircle checked={selectedItems.has(item.id)}>
                    {selectedItems.has(item.id) && "✓"}
                  </CheckCircle>
                  <ReviewMode mode={item.mode}>{item.mode}</ReviewMode>
                  <PRTitle>{item.title}</PRTitle>
                  <PRDate>{item.date}</PRDate>
                  <Grade>{item.grade}</Grade>
                  <IssueType>{item.issueType}</IssueType>
                </ModalItem>
              ))}
            </ModalItemList>
          </ModalContent>
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
  color: #666;
  font-size: 18px;
`;

const ReviewCount = styled.div`
  flex: 1;
  font-weight: 500;
`;

const ModeList = styled.div`
  flex: 1;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ModeTag = styled.span`
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${(props) =>
    props.isActive ? MODE_COLORS[props.mode].bg : "#f5f5f5"};
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

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 36px;
    height: 36px;
    color: #666;
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
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
`;

const CategoryBar = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  width: 87rem;
  height: 47px;
  padding: 0 20px;
  margin-top: 24px;
  margin-left: 60px;
  margin-bottom: 0px;
  gap: 45px;
  border-radius: 15px;
  background: #efefef;
  z-index: 1;
`;

const CategoryItem = styled.div`
  color: #666;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 100%;
`;

const ReportTitle = styled.h1`
  width: 100px;
  color: #666;
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
  padding-bottom: 40px; // 추가: 바닥과의 간격
`;

const ModalContent = styled.div`
  background: #e8e8e8;
  width: 96rem;
  height: 83vh;
  margin-left: 328px;
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
  background: white;
  border-radius: 15px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  gap: 30px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateX(5px);
    background-color: #f8f9fa;
  }

  ${(props) =>
    props.selected &&
    `
    background-color: #d5def6;
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
  color: #333;
`;

const PRDate = styled.div`
  width: 100px;
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
`;

const Grade = styled.div`
  width: 80px;
  text-align: center;
  font-weight: 500;
  color: #4a90e2;
  flex-shrink: 0;
`;

const IssueType = styled.div`
  width: 120px;
  color: #666;
  text-align: right;
  flex-shrink: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  align-items: center; // 수직(상하) 중앙 정렬
  margin-right: 15rem;
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
`;
export default Report;
