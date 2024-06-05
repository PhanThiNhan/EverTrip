import React, { useState, useEffect } from "react";
import "./newsDetai.css";
import { Spin, Breadcrumb, Card, notification, Input, Button, Comment, Avatar } from "antd";
import { UserOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import postsApi from "../../apis/postsApi";

const { TextArea } = Input;

const NewsDetail = () => {
  const [news, setNews] = useState({});
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const { id } = useParams();

  useEffect(() => {
    loadNews();
    loadComments();
    loadLikes();
  }, [id]);

  const loadNews = async () => {
    try {
      const response = await postsApi.getPostById(id);
      setNews(response[0]);
      setIsLoading(false);
    } catch (error) {
      console.log("Failed to fetch news detail:", error);
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await postsApi.getComments(id);
      setComments(response);
    } catch (error) {
      console.log("Failed to fetch comments:", error);
    }
  };

  const loadLikes = async () => {
    try {
      const response = await postsApi.getLikes(id);
      setLikesCount(response.like_count);
    } catch (error) {
      console.log("Failed to fetch likes:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      return;
    }
    try {

      const local = localStorage.getItem("user");
      const user = JSON.parse(local);
      const params = {
        id_user: user.id,
        id_post: id,
        content: commentText
      }

      await postsApi.addComment(params);
      // Reload comments after adding a new comment
      loadComments();
      setCommentText('');
      notification.success({ message: "Bình luận thành công" });
    } catch (error) {
      console.log("Failed to add comment:", error);
      notification.error({ message: "Failed to add comment" });
    }
  };

  const handleLikePost = async () => {
    setIsLiking(true);
    try {
      const local = localStorage.getItem("user");
      const user = JSON.parse(local);
      const params = {
        id_user: user.id,
        id_post: id,

      }
      await postsApi.likePost(params);
      // Reload likes after liking
      loadLikes();
      notification.success({ message: "Bạn đã yêu thích thành công!" });
    } catch (error) {
      console.log("Failed to like post:", error);
      notification.error({ message: "Failed to like post" });
    } finally {
      setIsLiking(false);
    }
  };

  function extractYouTubeVideoId(url) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match && match[1];
  }

  return (
    <div>
      <Spin spinning={isLoading}>
        <Card className="container_details">
          <div className="product_detail">
            {/* Breadcrumb */}
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                {/* Breadcrumb items */}
              </Breadcrumb>
            </div>
            <hr></hr>
            {/* News content */}
            <div className="pt-5-container mt-2 ">
              {/* News title */}
              <div className="newsdetaititle">{news?.title}</div>
              {/* News content */}
              <div dangerouslySetInnerHTML={{ __html: news?.content }}></div>
              {/* YouTube video */}
              {news?.video && (
                <div className="w-full mx-auto my-8">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      className="w-full h-full"
                      style={{ height: 350 }}
                      src={`https://www.youtube.com/embed/${extractYouTubeVideoId(news.video)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              {/* Comments section */}
              <div className="comments-section">
                <h3>Bình luận</h3>
                <div className="comments-list mb-3">
                  {comments.map(comment => (
                    <Comment
                      key={comment.id}
                      author={<span>{comment.username}</span>}
                      avatar={<Avatar src={comment.image} icon={<UserOutlined />} />}
                      content={<p>{comment.content}</p>}
                    />
                  ))}

                </div>
                {/* Add comment */}
                <div className="add-comment mt-3">
                  <TextArea
                    rows={4}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Hãy bình luận ở đây"
                  />
                  <Button type="primary mt-3" onClick={handleAddComment}>Thêm bình luận</Button>
                </div>
              </div>
              {/* Likes section */}
              <div className="likes-section mt-3">
                <Button
                  type="primary"
                  icon={isLiking ? <Spin indicator={<LikeOutlined spin />} /> : (news?.liked ? <LikeFilled /> : <LikeOutlined />)}
                  onClick={handleLikePost}
                >
                  {likesCount} Likes
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default NewsDetail;
