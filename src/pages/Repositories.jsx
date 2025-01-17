import React from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar/SearchBar";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BugReportIcon from "@mui/icons-material/BugReport";

const RepositoryContainer = styled.div`
  width: 46%;
  height: 57rem;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#00000050' : '#f0f0f0')};
  border-radius: 20px;
  box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
  overflow: hidden;
  border: ${({ isDarkMode }) => (isDarkMode ? '1px solid #FFFFFF' : 'none')};
`;

const RepositoryTitle = styled.h1`
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
  text-align: center;
  font-family: Poppins;
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
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
    background: ${({ isDarkMode }) => (isDarkMode ? '#4A4A4A' : '#D9D9D9')}; /* 트랙 배경색 */
    border-radius: 10px; /* 둥근 모서리 */
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#777777')}; /* 스크롤바 색상 */
    border-radius: 10px; /* 둥근 모서리 */
    border: 3px solid ${({ isDarkMode }) => (isDarkMode ? '#333' : '#f0f0f0')}; /* 스크롤바와 트랙 사이의 간격 */
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#c7c7c7' : '#555')}; /* 호버 시 스크롤바 색상 */
  }
`;

const RepositoryItem = styled.div`
  width: 90%;
  min-height: 85px;
  margin: 20px auto;
  padding: 15px;
  background: ${({ isDarkMode }) => (isDarkMode ? '#00000050' : '#ffffff')};
  border: ${({ isDarkMode }) => (isDarkMode ? '1px solid #FFFFFF' : 'none')};
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  color: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#000000')};
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
  font-weight: 600;
  font-size: 16px;
`;

const PublicLabel = styled.span`
  color: ${({ isDarkMode }) => (isDarkMode ? '#E6E6E6' : '#666666')};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoDescription = styled.p`
  color: ${({ isDarkMode }) => (isDarkMode ? '#E6E6E6' : '#666666')};
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
  color: ${({ isDarkMode }) => (isDarkMode ? '#E6E6E6' : '#666666')};
  font-size: 12px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ isDarkMode }) => (isDarkMode ? '#E6E6E6' : '#666666')};
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
  const [unselectedRepos, setUnselectedRepos] = useState([
    {
      id: 1,
      name: "YSKIM",
      description: "김윤성의 리액트 프로젝트 레포지토리입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "JavaScript",
    },
    {
      id: 2,
      name: "Algorithm-Study",
      description: "알고리즘 문제 풀이 및 스터디 자료를 정리하는 저장소입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "Python",
    },
    {
      id: 3,
      name: "Portfolio-2024",
      description: "2024년 개인 포트폴리오 웹사이트 프로젝트입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "TypeScript",
    },
    {
      id: 4,
      name: "React-Shopping-Mall",
      description: "리액트로 구현한 쇼핑몰 프로젝트입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "JavaScript",
    },
    {
      id: 5,
      name: "Spring-Board-Project",
      description: "스프링 부트로 만든 게시판 프로젝트입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "Java",
    },
    {
      id: 6,
      name: "Next.js-Blog",
      description: "Next.js로 제작한 개인 블로그 프로젝트입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "TypeScript",
    },
    {
      id: 7,
      name: "Machine-Learning-Study",
      description: "머신러닝 학습 내용을 정리한 저장소입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "Python",
    },
    {
      id: 8,
      name: "Docker-Practice",
      description: "도커 실습 및 예제 코드를 정리한 저장소입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "Shell",
    },
    {
      id: 9,
      name: "Vue-Weather-App",
      description: "Vue.js로 만든 날씨 정보 애플리케이션입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "Vue",
    },
    {
      id: 10,
      name: "iOS-Swift-Study",
      description: "iOS 앱 개발 학습 내용을 정리한 저장소입니다.",
      image: "https://avatars.githubusercontent.com/u/192951892?s=48&v=4",
      language: "Swift",
    },
  ]);

  const [selectedRepos, setSelectedRepos] = useState([]);

  const [searchTermUnselected, setSearchTermUnselected] = useState("");
  const [searchTermSelected, setSearchTermSelected] = useState("");

  const filteredUnselectedRepos = unselectedRepos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTermUnselected.toLowerCase())
  );

  const filteredSelectedRepos = selectedRepos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTermSelected.toLowerCase())
  );

  const handleSelect = (repo) => {
    setUnselectedRepos(unselectedRepos.filter((r) => r.id !== repo.id));
    setSelectedRepos([...selectedRepos, repo]);
  };

  const handleUnselect = (repo) => {
    setSelectedRepos(selectedRepos.filter((r) => r.id !== repo.id));
    setUnselectedRepos([...unselectedRepos, repo]);
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
              <RepoImage src={repo.image} alt="Repository thumbnail" />
              <RepoContent>
                <RepoHeader>
                  <RepoName>{repo.name}</RepoName>
                  <PublicLabel isDarkMode={isDarkMode}>
                    <PublicIcon sx={{ fontSize: 16, color: isDarkMode ? '#E6E6E6' : '#666666' }} />
                    Public
                  </PublicLabel>
                </RepoHeader>
                <RepoDescription isDarkMode={isDarkMode}>{repo.description}</RepoDescription>
                <RepoStats isDarkMode={isDarkMode}>
                  <Language language={repo.language}>{repo.language}</Language>
                  <StatItem isDarkMode={isDarkMode}>
                    <AccountTreeIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem isDarkMode={isDarkMode}>
                    <StarBorderIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem isDarkMode={isDarkMode}>
                    <BugReportIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem isDarkMode={isDarkMode}>7h</StatItem>
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
              <RepoImage src={repo.image} alt="Repository thumbnail" />
              <RepoContent>
                <RepoHeader>
                  <RepoName>{repo.name}</RepoName>
                  <PublicLabel isDarkMode={isDarkMode}>
                    <PublicIcon sx={{ fontSize: 16, color: isDarkMode ? '#E6E6E6' : '#666666' }} />
                    Public
                  </PublicLabel>
                </RepoHeader>
                <RepoDescription isDarkMode={isDarkMode}>{repo.description}</RepoDescription>
                <RepoStats isDarkMode={isDarkMode}>
                  <Language language={repo.language}>{repo.language}</Language>
                  <StatItem isDarkMode={isDarkMode}>
                    <AccountTreeIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem isDarkMode={isDarkMode}>
                    <StarBorderIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem isDarkMode={isDarkMode}>
                    <BugReportIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem isDarkMode={isDarkMode}>7h</StatItem>
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
