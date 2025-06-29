import { useRef, useState } from "react";
import styles from "./post.module.css";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { LiaCommentDotsSolid } from "react-icons/lia";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GiBottomRight3dArrow } from "react-icons/gi";

const Post = ({ data: post }) => {
  // const doctorId = useParams().id;
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const commentInputRef = useRef(null);
  const lastCommentRef = useRef(null);

  const [highlightLastComment, setHighlightLastComment] = useState(false);
  const [toggleComments, setToggleComments] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState("");

  const commentCount = post.comments.length;

  const leftClick = () => setCurrentIndex((prev) => prev - 1);
  const rightClick = () => setCurrentIndex((prev) => prev + 1);

  const scrollToLastComment = () => {
    setTimeout(() => {
      setHighlightLastComment(true);
      lastCommentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
      setTimeout(() => setHighlightLastComment(false), 1000);
    }, 100);
  };

  // ✅ Simulated comment add function
  const addComment = (newComment) => {
    console.log("Comment submitted:", newComment);
    scrollToLastComment();
    // Replace this with actual dispatch or API call as needed
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) return;

    addComment({
      postId: post.id,
      timestamp: new Date().toISOString(),
      user: user.username,
      comment,
    });

    setToggleComments(true);
    setComment("");
  };

  const handleToggleComments = () => setToggleComments((prev) => !prev);
  const handleFocusCommentInput = () => commentInputRef.current?.focus();

  return (
    <div className={styles.post}>
      <p className={styles.date}>{new Date(post.timestamp).toLocaleDateString()}</p>
      <p className={styles.time}>{new Date(post.timestamp).toLocaleTimeString()}</p>

      {post.text && <p className={styles.text}>{post.text}</p>}

      {post.images.length > 0 && (
        <div className={styles.imgsCon}>
          <div className={styles.slidesWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {post.images.map((src, idx) => (
              <div key={idx} className={styles.imageSlide}>
                <img src={src} alt={`Post image ${idx + 1}`} loading="lazy" className={styles.image} />
              </div>
            ))}
          </div>
          {post.images.length > 1 && (
            <>
              <button
                className={`${styles.arrow} ${styles.left} ${currentIndex === 0 ? styles.disable : ""}`}
                onClick={leftClick}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>
              <button
                className={`${styles.arrow} ${styles.right} ${currentIndex === post.images.length - 1 ? styles.disable : ""}`}
                onClick={rightClick}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            </>
          )}
        </div>
      )}

      <div className={styles.reactAndCommentsCon}>
        <h4 className={styles.commentsTitle} onClick={handleToggleComments}>
          Comments: {commentCount}
        </h4>
        <div className={styles.reactions}>
          {post.reactions.like && (
            <span className={styles.like}>
              <AiFillLike />
              {post.reactions.like.count}
            </span>
          )}
          {post.reactions.love && (
            <span className={styles.save}>
              <IoMdHeart />
              {post.reactions.love.count}
            </span>
          )}
        </div>
      </div>

      <div className={styles.options}>
        <button className={styles.save}>
          <IoMdHeartEmpty /> <span>Save</span>
        </button>
        <button className={styles.comment} onClick={handleFocusCommentInput}>
          <LiaCommentDotsSolid /> <span>Comment</span>
        </button>
        <button className={styles.like}>
          <AiOutlineLike /> <span>Like</span>
        </button>
      </div>

      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <div className={`${comment.trim().length > 0 ? styles.hasText : ""}`}>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            ref={commentInputRef}
            className={styles.commentInput}
          />
        </div>
        <button type="submit" className={styles.commentSubmit}>
          <GiBottomRight3dArrow />
        </button>
      </form>

      {commentCount > 0 && (
        <div className={`${styles.comments} ${toggleComments ? styles.open : styles.close}`}>
          {post.comments.map((c, i) => (
            <div
              key={i}
              className={`${styles.comment} ${i === post.comments.length - 1 && highlightLastComment ? styles.commentFadeIn : ""}`}
              ref={i === post.comments.length - 1 ? lastCommentRef : null}
            >
              <div className={styles.commentHeader}>
                <span className={styles.username}>{c.user}</span>
                <span className={styles.date}>{new Date(c.timestamp).toLocaleDateString()}</span>
                <span className={styles.time}>{new Date(c.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className={styles.commentText}>{c.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
