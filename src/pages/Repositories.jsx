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
  background-color: #f0f0f0;
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0px 4px 8px 3px rgba(0, 0, 0, 0.15),
    0px 1px 3px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
  overflow: hidden;
`;

const RepositoryTitle = styled.h1`
  color: #000;
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

  /* 스크롤바 스타일링 (선택사항) */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

const RepositoryItem = styled.div`
  width: 90%;
  min-height: 85px;
  margin: 20px auto;
  padding: 15px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
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
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RepoDescription = styled.p`
  color: #666;
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
  color: #666;
  font-size: 12px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
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

const Repositories = () => {
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
      <RepositoryContainer>
        <RepositoryTitle>Unselected</RepositoryTitle>
        <SearchBarWrapper>
          <SearchBar
            value={searchTermUnselected}
            onChange={(e) => setSearchTermUnselected(e.target.value)}
          />
        </SearchBarWrapper>
        <RepositoryWrapper>
          {filteredUnselectedRepos.map((repo) => (
            <RepositoryItem key={repo.id}>
              <RepoImage src={repo.image} alt="Repository thumbnail" />
              <RepoContent>
                <RepoHeader>
                  <RepoName>{repo.name}</RepoName>
                  <PublicLabel>
                    <PublicIcon sx={{ fontSize: 16 }} />
                    Public
                  </PublicLabel>
                </RepoHeader>
                <RepoDescription>{repo.description}</RepoDescription>
                <RepoStats>
                  <Language language={repo.language}>{repo.language}</Language>
                  <StatItem>
                    <AccountTreeIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem>
                    <StarBorderIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem>
                    <BugReportIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem>7h</StatItem>
                </RepoStats>
              </RepoContent>
              <IconWrapper onClick={() => handleSelect(repo)}>
                <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
              </IconWrapper>
            </RepositoryItem>
          ))}
        </RepositoryWrapper>
      </RepositoryContainer>

      <RepositoryContainer>
        <RepositoryTitle>Selected</RepositoryTitle>
        <SearchBarWrapper>
          <SearchBar
            value={searchTermSelected}
            onChange={(e) => setSearchTermSelected(e.target.value)}
          />
        </SearchBarWrapper>
        <RepositoryWrapper>
          {filteredSelectedRepos.map((repo) => (
            <RepositoryItem key={repo.id}>
              <RepoImage src={repo.image} alt="Repository thumbnail" />
              <RepoContent>
                <RepoHeader>
                  <RepoName>{repo.name}</RepoName>
                  <PublicLabel>
                    <PublicIcon sx={{ fontSize: 16 }} />
                    Public
                  </PublicLabel>
                </RepoHeader>
                <RepoDescription>{repo.description}</RepoDescription>
                <RepoStats>
                  <Language language={repo.language}>{repo.language}</Language>
                  <StatItem>
                    <AccountTreeIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem>
                    <StarBorderIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem>
                    <BugReportIcon sx={{ fontSize: 16 }} />0
                  </StatItem>
                  <StatItem>7h</StatItem>
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
