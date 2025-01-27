// src/pages/Repositories.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar/SearchBar";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import PublicIcon from "@mui/icons-material/Public";
import Button from "@mui/material/Button"; // Material-UI 버튼 임포트
import {
  getActiveReposById,
  getInactiveReposById,
  toggleRepoStatus,
} from "../services/repositoryService";
import TreegraphChart from "../components/TreegraphChart/TreegraphChart"; // TreegraphChart 임포트
import WordcloudChart from "../components/WordcloudChart/WordcloudChart"; // WordcloudChart 임포트
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator"; // 로딩 인디케이터 임포트

// 스타일 컴포넌트 정의 (변경 없음)

const RepositoryContainer = styled.div`
  width: 46%;
  height: 57rem;
  background-color: #ffffff; /* 다크 모드 제거 */
  border-radius: 20px;
  box-shadow:
    0px 4px 8px 3px rgba(0, 0, 0, 0.15),
    0px 1px 3px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
  overflow: hidden;
  border: none;
`;

const RepositoryTitle = styled.h1`
  color: #000000; /* 다크 모드 제거 */
  text-align: center;
  font-family: Poppins;
  font-size: 30px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 66.667% */
  letter-spacing: 0.01px;
  margin-top: 42px;
`;

const RepositoriesWrapper = styled.div`
  display: flex;
  gap: 85px;
  justify-content: center;
  max-width: 1450px;
  margin: 0 auto;
  padding: 0 40px;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 25px;
  margin-bottom: 25px;
`;

const RepositoryWrapper = styled.div`
  height: calc(100% - 120px);
  margin-top: 20px;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 12px; /* 스크롤바 너비 */
  }
  &::-webkit-scrollbar-track {
    background: #d9d9d9; /* 트랙 배경색 */
    border-radius: 10px; /* 둥근 모서리 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #777777; /* 스크롤바 색상 */
    border-radius: 10px; /* 둥근 모서리 */
    border: 3px solid #f0f0f0; /* 스크롤바와 트랙 사이의 간격 */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 호버 시 스크롤바 색상 */
  }
`;

const RepositoryItem = styled.div`
  width: 90%;
  min-height: 85px;
  margin: 20px auto;
  padding: 15px;
  background: #ffffff; /* 다크 모드 제거 */
  border: none; /* 다크 모드 제거 */
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  color: #000000; /* 다크 모드 제거 */
`;

const RepoImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #666;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 50%;
  }
`;

const RepoContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const RepoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RepoName = styled.span`
  font-weight: 500;
  font-size: 16px;
`;

const PublicLabel = styled.span`
  color: #666666; /* 다크 모드 제거 */
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoDescription = styled.p`
  color: #666666; /* 다크 모드 제거 */
  font-size: 14px;
  margin: 0;
  max-width: 19rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 20px;
`;

const RepoStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666666; /* 다크 모드 제거 */
  font-size: 12px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666666; /* 다크 모드 제거 */
`;

const getLanguageColor = (language) => {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    Vue: "#41b883",
    Swift: "#ffac45",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    "C++": "#f34b7d",
    C: "#555555",
  };
  return colors[language] || "#858585";
};

const Language = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "";
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => getLanguageColor(props.language)};
    display: inline-block;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* 오버레이 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 기존 요소들보다 높은 z-index */
`;

const Repositories = () => {
  const [unselectedRepos, setUnselectedRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);

  const [searchTermUnselected, setSearchTermUnselected] = useState("");
  const [searchTermSelected, setSearchTermSelected] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showChart, setShowChart] = useState(false); // 트리그래프 오버레이 상태
  const [showWordCloudChart, setShowWordCloudChart] = useState(false); // 워드 클라우드 오버레이 상태

  const [selectedPRIds, setSelectedPRIds] = useState([1, 2, 3, 4, 5, 6]); // 고정된 PR IDs

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      try {
        const [inactiveReposResponse, activeReposResponse] = await Promise.all([
          getInactiveReposById(),
          getActiveReposById(),
        ]);

        const inactiveRepos = inactiveReposResponse.repositories || [];
        const activeRepos = activeReposResponse.repositories || [];

        setUnselectedRepos(inactiveRepos);
        setSelectedRepos(activeRepos);
      } catch (error) {
        console.error("레포지토리 데이터 로딩 실패:", error);
        setUnselectedRepos([]);
        setSelectedRepos([]);
        setError("레포지토리 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, []);

  console.log("unselectedRepos:", unselectedRepos);
  console.log("selectedRepos:", selectedRepos);

  useEffect(() => {
    console.log("showChart 상태:", showChart);
  }, [showChart]);

  useEffect(() => {
    console.log("showWordCloudChart 상태:", showWordCloudChart);
  }, [showWordCloudChart]);

  const filteredUnselectedRepos = unselectedRepos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTermUnselected.toLowerCase())
  );

  const filteredSelectedRepos = selectedRepos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTermSelected.toLowerCase())
  );

  const handleSelect = async (repo) => {
    try {
      await toggleRepoStatus([repo.id], true);
      setUnselectedRepos(unselectedRepos.filter((r) => r.id !== repo.id));
      setSelectedRepos([...selectedRepos, repo]);
      // 선택된 PR IDs 업데이트 (예시: PR ID를 워드 클라우드에 추가)
      setSelectedPRIds((prevIds) => [...prevIds, repo.id]);
      console.log("레포지토리 선택됨");
    } catch (error) {
      console.error("레포지토리 선택 실패:", error);
    }
  };

  const handleUnselect = async (repo) => {
    try {
      await toggleRepoStatus([repo.id], false);
      setSelectedRepos(selectedRepos.filter((r) => r.id !== repo.id));
      setUnselectedRepos([...unselectedRepos, repo]);
      // 선택된 PR IDs 업데이트 (예시: PR ID를 워드 클라우드에서 제거)
      setSelectedPRIds((prevIds) => prevIds.filter((id) => id !== repo.id));
      console.log("레포지토리 선택 해제됨");
    } catch (error) {
      console.error("레포지토리 선택 해제 실패:", error);
    }
  };

  const DateFormatter = ({ isoDate }) => {
    const date = new Date(isoDate);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    return <div>Updated on {formattedDate}</div>;
  };

  const handleShowChart = () => {
    setShowChart(true);
  };

  const handleShowWordCloudChart = () => {
    setShowWordCloudChart(true);
  };

  return (
    <RepositoriesWrapper>
      {/* Unselected Repositories */}
      <RepositoryContainer>
        <RepositoryTitle>Unselected</RepositoryTitle>
        <SearchBarWrapper>
          <SearchBar
            value={searchTermUnselected}
            onChange={(e) => setSearchTermUnselected(e.target.value)}
            isDarkMode={false} /* 다크 모드 제거 */
          />
        </SearchBarWrapper>
        <RepositoryWrapper>
          {isLoading ? (
            <LoadingIndicator />
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : filteredUnselectedRepos.length === 0 ? (
            <p>No Repositories Found.</p>
          ) : (
            filteredUnselectedRepos.map((repo) => (
              <RepositoryItem key={repo.id}>
                <RepoImage src={repo.repo_image} alt="Repository thumbnail" />
                <RepoContent>
                  <RepoHeader>
                    <RepoName>{repo.name}</RepoName>
                    <PublicLabel>
                      <PublicIcon sx={{ fontSize: 16, color: "#666666" }} />
                      Public
                    </PublicLabel>
                  </RepoHeader>
                  <RepoDescription>{repo.description}</RepoDescription>
                  <RepoStats>
                    <Language language={repo.language}>{repo.language}</Language>
                    <StatItem>
                      <DateFormatter isoDate={repo.repo_updated_at} />
                    </StatItem>
                  </RepoStats>
                </RepoContent>
                <IconWrapper onClick={() => handleSelect(repo)}>
                  <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                </IconWrapper>
              </RepositoryItem>
            ))
          )}
        </RepositoryWrapper>
      </RepositoryContainer>

      {/* Selected Repositories */}
      <RepositoryContainer>
        <RepositoryTitle>Selected</RepositoryTitle>
        <SearchBarWrapper>
          <SearchBar
            value={searchTermSelected}
            onChange={(e) => setSearchTermSelected(e.target.value)}
            isDarkMode={false} /* 다크 모드 제거 */
          />
        </SearchBarWrapper>
        <RepositoryWrapper>
          {isLoading ? (
            <LoadingIndicator />
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : filteredSelectedRepos.length === 0 ? (
            <p>No Repositories Selected.</p>
          ) : (
            filteredSelectedRepos.map((repo) => (
              <RepositoryItem key={repo.id}>
                <RepoImage src={repo.repo_image} alt="Repository thumbnail" />
                <RepoContent>
                  <RepoHeader>
                    <RepoName>{repo.name}</RepoName>
                    <PublicLabel>
                      <PublicIcon sx={{ fontSize: 16, color: "#666666" }} />
                      Public
                    </PublicLabel>
                  </RepoHeader>
                  <RepoDescription>{repo.description}</RepoDescription>
                  <RepoStats>
                    <Language language={repo.language}>{repo.language}</Language>
                    <StatItem>
                      <DateFormatter isoDate={repo.repo_updated_at} />
                    </StatItem>
                  </RepoStats>
                </RepoContent>
                <IconWrapper onClick={() => handleUnselect(repo)}>
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconWrapper>
              </RepositoryItem>
            ))
          )}
        </RepositoryWrapper>
      </RepositoryContainer>

      {/* 트리그래프 보기 버튼 추가 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleShowChart}
        style={{ marginTop: "20px", alignSelf: "center" }}
      >
        트리그래프 보기
      </Button>

      {/* 워드 클라우드 보기 버튼 추가 */}
      <Button
        variant="contained"
        color="secondary" // 다른 색상으로 구분
        onClick={handleShowWordCloudChart}
        style={{ marginTop: "20px", alignSelf: "center", marginLeft: "10px" }}
      >
        워드 클라우드 보기
      </Button>

      {/* 트리그래프 오버레이 */}
      {showChart && (
        <Overlay>
          <TreegraphChart />
          {/* 오버레이를 닫을 수 있는 버튼 추가 */}
          <IconWrapper
            style={{ top: "20px", right: "20px", width: "30px", height: "30px" }}
            onClick={() => setShowChart(false)}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconWrapper>
        </Overlay>
      )}

      {/* 워드 클라우드 오버레이 */}
      {showWordCloudChart && (
        <Overlay>
          <WordcloudChart />
          {/* 오버레이를 닫을 수 있는 버튼 추가 */}
          <IconWrapper
            style={{ top: "20px", right: "20px", width: "30px", height: "30px" }}
            onClick={() => setShowWordCloudChart(false)}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconWrapper>
        </Overlay>
      )}
    </RepositoriesWrapper>
  );
};

export default Repositories;
