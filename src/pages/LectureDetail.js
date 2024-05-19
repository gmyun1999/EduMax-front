import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Typography, { colorMapping } from "../components/Typography";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import {
    PostWrapper, CategoryWrapper,
    CategoryContainer, HomeIconImage, PostTitleWrapper,
    AuthorAndViewerWrapper, AuthorAndDateContainer, ButtonListWrapper, DeleteOrModifyWrapper
} from "../components/PostDetail/PostContainer";

import { getLecture } from "../apifetchers/fetcher";
import ListButton from "../components/buttons/ListButtons";
import PostDeleteButton from "../components/buttons/PostDeleteButton";
import PostModifyButton from "../components/buttons/PostDeleteButton";
import homeIcon from "../assets/homeIcon.png"
import SideBar from "../components/SideBar";
import YouTube from 'react-youtube'; // YouTube 컴포넌트를 임포트합니다
import LoadingSpinner from "../components/spinner";
import { DeleteLecture } from "../apifetchers/fetcher";


const MainContainer = styled.div`
display: flex;
justify-content: center;
align-items: flex-start;
gap: 50px;
align-self: stretch;
margin-top: 60px;
`

const MainContentwrapper = styled.div`
display: flex;
width: 923px;
padding-bottom: 34px;
flex-direction: column;
align-items: center;
gap: 10px;
border-top: 2px solid #393E46;
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;  
  width: 100%;   
  padding: 60px 0 60px 0;
`;
const VideoContainer = styled.div`
  overflow: hidden;        
  border-radius: 20px;     
  width: 640px;              
  height: 390px;           
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  
  margin: auto;             
`;

const Categorymapping = {
    "EN": "영어",
    "KO": "국어",
    "TM": "탐구",
    "MA": "수학"
};

const LectureDetial = () => {
    const auth = useContext(AuthContext);
    const user_nickname = auth.isAuthenticated ? auth.username : ""

    const navigate = useNavigate();

    const { lectureId } = useParams();
    const [lectureDetail, setLectureData] = useState(null);
    async function fetchData() {
        try {
            const lectureDetail = await getLecture(lectureId);
            console.log(lectureDetail)
            setLectureData(lectureDetail.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isNaN(lectureId) && parseInt(lectureId) >= 1) {
            fetchData();
        }
    }, [lectureId]);

    const SubjectCategorymapping = {
        EN: "선생님강의-영어",
        KO: "선생님강의-국어",
        MA: "선생님강의-수학",
        TM: "선생님강의-탐구",
    }
    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const response = await DeleteLecture(lectureId); // DeletePost 함수를 호출하여 API 요청
                console.log("lecture 삭제 성공:", response);
                navigate(`/lecture/`); // 상태 업데이트 후 페이지 리다이렉트
            } catch (error) {
                console.error("lecture 삭제 실패:", error);
                alert("삭제에 실패하였습니다."); // 사용자에게 실패를 알림
            }
        }
    };

    if (!lectureDetail) {
        return <LoadingSpinner />;  // 데이터가 없을 경우 로딩 스피너를 표시
    }
    const { title, youtube_id, category_d1, category_d2, category_d3, category_d4, modified_at, author } = lectureDetail
    return (

        <MainContainer>
            <SideBar />
            <MainContentwrapper>
                <PostWrapper>
                    <CategoryWrapper>
                        <CategoryContainer to={`/post/lecture/?category=${Categorymapping[category_d1]}`}>
                            <HomeIconImage src={homeIcon} />
                            <Typography size="body_sub_title" color="gray">{SubjectCategorymapping[category_d1]}</Typography>
                        </CategoryContainer>
                    </CategoryWrapper>

                    <PostTitleWrapper>
                        <Typography size="h1" color="black_gray">{title}</Typography>
                    </PostTitleWrapper>

                    <AuthorAndViewerWrapper>
                        <AuthorAndDateContainer>
                            <Typography size="body_sub_title" color="black_gray">{author}</Typography>
                            <Typography size="body_sub_title" color="gray">{modified_at}</Typography>
                        </AuthorAndDateContainer>
                    </AuthorAndViewerWrapper>

                    <ContentWrapper>
                        <VideoContainer>
                            {youtube_id && (
                                <YouTube
                                    videoId={youtube_id}
                                    opts={{
                                        width: 640,
                                        height: 390,
                                        playerVars: {
                                            autoplay: 1,
                                            modestbranding: 1,
                                            rel: 0,
                                            controls: 1,
                                            showinfo: 0
                                        }
                                    }}
                                />
                            )}
                        </VideoContainer>
                    </ContentWrapper>
                    <ButtonListWrapper>
                        <DeleteOrModifyWrapper>
                            {user_nickname && user_nickname === author && (
                                <>
                                    <PostDeleteButton onClick={handleDelete} />
                                </>
                            )}
                        </DeleteOrModifyWrapper>
                        <ListButton category={Categorymapping[category_d1]} mainContent="post/lecture" />
                    </ButtonListWrapper>
                </PostWrapper>
            </MainContentwrapper>
        </MainContainer>

    )
}

export default LectureDetial; 