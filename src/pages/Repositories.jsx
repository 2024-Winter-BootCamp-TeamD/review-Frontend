import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar/SearchBar";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import {
  getActiveReposById,
  getInactiveReposById,
  toggleRepoStatus,
} from "../services/repositoryService";
import PublicIcon from "@mui/icons-material/Public";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BugReportIcon from "@mui/icons-material/BugReport";

const RepositoryContainer = styled.div`
  width: 46%;
  height: 57rem;
  background-color: ${({ isDarkMode }) =>
    isDarkMode ? "#00000050" : "#FFFFFFFF"};
  border-radius: 20px;
  box-shadow:
    0px 4px 8px 3px rgba(0, 0, 0, 0.15),
    0px 1px 3px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
  overflow: hidden;
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};
`;

const RepositoryTitle = styled.h1`
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#000000")};
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
    background: ${({ isDarkMode }) =>
      isDarkMode ? "#4A4A4A" : "#D9D9D9"}; /* 트랙 배경색 */
    border-radius: 10px; /* 둥근 모서리 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) =>
      isDarkMode ? "#FFFFFF" : "#777777"}; /* 스크롤바 색상 */
    border-radius: 10px; /* 둥근 모서리 */
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? "#333" : "#f0f0f0")}; /* 스크롤바와 트랙 사이의 간격 */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) =>
      isDarkMode ? "#c7c7c7" : "#555"}; /* 호버 시 스크롤바 색상 */
  }
`;

const RepositoryItem = styled.div`
  width: 90%;
  min-height: 85px;
  margin: 20px auto;
  padding: 15px;
  background: ${({ isDarkMode }) => (isDarkMode ? "#00000050" : "#ffffff")};
  border: ${({ isDarkMode }) => (isDarkMode ? "1px solid #FFFFFF" : "none")};
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  color: ${({ isDarkMode }) => (isDarkMode ? "#FFFFFF" : "#000000")};
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
  color: ${({ isDarkMode }) => (isDarkMode ? "#E6E6E6" : "#666666")};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoDescription = styled.p`
  color: ${({ isDarkMode }) => (isDarkMode ? "#E6E6E6" : "#666666")};
  font-size: 14px;
  margin: 0;
  max-width: 19rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RepoStats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#E6E6E6" : "#666666")};
  font-size: 12px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ isDarkMode }) => (isDarkMode ? "#E6E6E6" : "#666666")};
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

const Repositories = ({ isDarkMode }) => {
  const [unselectedRepos, setUnselectedRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);

  const [searchTermUnselected, setSearchTermUnselected] = useState("");
  const [searchTermSelected, setSearchTermSelected] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
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
      }
    };

    fetchRepos();
  }, []);

  console.log("unselectedRepos:", unselectedRepos);
  console.log("selectedRepos:", selectedRepos);

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
    } catch (error) {
      console.error("레포지토리 선택 실패:", error);
    }
  };

  const handleUnselect = async (repo) => {
    try {
      await toggleRepoStatus([repo.id], false);
      setSelectedRepos(selectedRepos.filter((r) => r.id !== repo.id));
      setUnselectedRepos([...unselectedRepos, repo]);
    } catch (error) {
      console.error("레포지토리 선택 해제 실패:", error);
    }
  };

  const DateFormatter = ({ isoDate, name }) => {
    console.log("name:", name);
    console.log("isoDate:", isoDate);
    const date = new Date(isoDate);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

    return <div>Updated on {formattedDate}</div>;
  };

  return (
    <RepositoriesWrapper>
      <RepositoryContainer isDarkMode={isDarkMode}>
        <RepositoryTitle isDarkMode={isDarkMode}>Unselected</RepositoryTitle>
        <SearchBarWrapper>
          <SearchBar
            value={searchTermUnselected}
            onChange={(e) => setSearchTermUnselected(e.target.value)}
            isDarkMode={isDarkMode}
          />
        </SearchBarWrapper>
        <RepositoryWrapper isDarkMode={isDarkMode}>
          {filteredUnselectedRepos.map((repo) => (
            <RepositoryItem key={repo.id} isDarkMode={isDarkMode}>
              <RepoImage src={repo.repo_image} alt="Repository thumbnail" />
              <RepoContent>
                <RepoHeader>
                  <RepoName>{repo.name}</RepoName>
                  <PublicLabel isDarkMode={isDarkMode}>
                    <PublicIcon
                      sx={{
                        fontSize: 16,
                        color: isDarkMode ? "#E6E6E6" : "#666666",
                      }}
                    />
                    Public
                  </PublicLabel>
                </RepoHeader>
                <RepoDescription isDarkMode={isDarkMode}>
                  {repo.description}
                </RepoDescription>
                <RepoStats isDarkMode={isDarkMode}>
                  <Language language={repo.language}>{repo.language}</Language>
                  <StatItem isDarkMode={isDarkMode}>
                    <DateFormatter isoDate={repo.repo_updated_at} />
                  </StatItem>
                </RepoStats>
              </RepoContent>
              <IconWrapper onClick={() => handleSelect(repo)}>
                <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
              </IconWrapper>
            </RepositoryItem>
          ))}
        </RepositoryWrapper>
      </RepositoryContainer>

      <RepositoryContainer isDarkMode={isDarkMode}>
        <RepositoryTitle isDarkMode={isDarkMode}>Selected</RepositoryTitle>
        <SearchBarWrapper>
          <SearchBar
            value={searchTermSelected}
            onChange={(e) => setSearchTermSelected(e.target.value)}
            isDarkMode={isDarkMode}
          />
        </SearchBarWrapper>
        <RepositoryWrapper isDarkMode={isDarkMode}>
          {filteredSelectedRepos.map((repo) => (
            <RepositoryItem key={repo.id} isDarkMode={isDarkMode}>
              <RepoImage src={repo.repo_image} alt="Repository thumbnail" />
              <RepoContent>
                <RepoHeader>
                  <RepoName>{repo.name}</RepoName>
                  <PublicLabel isDarkMode={isDarkMode}>
                    <PublicIcon
                      sx={{
                        fontSize: 16,
                        color: isDarkMode ? "#E6E6E6" : "#666666",
                      }}
                    />
                    Public
                  </PublicLabel>
                </RepoHeader>
                <RepoDescription isDarkMode={isDarkMode}>
                  {repo.description}
                </RepoDescription>
                <RepoStats isDarkMode={isDarkMode}>
                  <Language language={repo.language}>{repo.language}</Language>
                  <StatItem isDarkMode={isDarkMode}>
                    <DateFormatter
                      isoDate={repo.repo_updated_at}
                      name={repo.name}
                    />
                  </StatItem>
                </RepoStats>
              </RepoContent>
              <IconWrapper onClick={() => handleUnselect(repo)}>
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconWrapper>
            </RepositoryItem>
          ))}
        </RepositoryWrapper>
      </RepositoryContainer>
    </RepositoriesWrapper>
  );
};

export default Repositories;
