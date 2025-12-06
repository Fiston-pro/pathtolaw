import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import CommentSection from './CommentSection';
import './LawCard.css';

const LawCard = ({ law, isActive }) => {
    const { isLiked, isSaved, toggleLike, toggleSave } = useUser();
    const [localLikes, setLocalLikes] = useState(law.likes);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const videoRef = useRef(null);

    const liked = isLiked(law.id);
    const bookmarked = isSaved(law.id);

    // Update local likes when global like state changes
    useEffect(() => {
        if (liked) {
            setLocalLikes(law.likes + 1);
        } else {
            setLocalLikes(law.likes);
        }
    }, [liked, law.likes]);

    // Autoplay/pause video based on isActive
    useEffect(() => {
        if (videoRef.current) {
            if (isActive && !commentsOpen) {
                videoRef.current.play().catch(err => {
                    console.log('Autoplay prevented:', err);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isActive, commentsOpen]);

    const handleLike = () => {
        toggleLike(law.id);
    };

    const handleBookmark = () => {
        toggleSave(law.id);
    };

    const handleCommentClick = () => {
        setCommentsOpen(true);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    };

    return (
        <motion.div
            className="law-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
            transition={{ duration: 0.4 }}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                className="card-video"
                src={law.videoUrl}
                loop
                muted
                playsInline
            />

            {/* Dark overlay for better text readability */}
            <div className="video-overlay"></div>

            {/* Content overlay */}
            <div className="card-overlay-content">
                {/* Top section with category */}
                <div className="card-header-minimal">
                    <span className="category-badge">{law.category}</span>
                </div>

                {/* Bottom section with title and metadata */}
                <div className="card-footer-info">
                    <h2 className="law-title-minimal">{law.title}</h2>

                    <div className="metadata-minimal">
                        <span className="date">📅 {law.date}</span>
                        <span className="views">👁️ {law.views}</span>
                    </div>
                </div>
            </div>

            {/* Interaction buttons on the right */}
            <div className="interaction-buttons">
                <motion.button
                    className={`action-btn like-btn ${liked ? 'active' : ''}`}
                    onClick={handleLike}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <motion.span
                        className="btn-icon"
                        animate={liked ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        {liked ? '❤️' : '🤍'}
                    </motion.span>
                    <span className="btn-label">{formatNumber(localLikes)}</span>
                </motion.button>

                <motion.button
                    className="action-btn comment-btn"
                    onClick={handleCommentClick}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <span className="btn-icon">💬</span>
                    <span className="btn-label">{formatNumber(law.comments)}</span>
                </motion.button>

                <motion.button
                    className={`action-btn bookmark-btn ${bookmarked ? 'active' : ''}`}
                    onClick={handleBookmark}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <span className="btn-icon">{bookmarked ? '🔖' : '📑'}</span>
                    <span className="btn-label">Zapisz</span>
                </motion.button>

                <motion.button
                    className="action-btn share-btn"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <span className="btn-icon">🔗</span>
                    <span className="btn-label">Udostępnij</span>
                </motion.button>
            </div>

            {/* Comment Section Modal */}
            <CommentSection
                isOpen={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                lawId={law.id}
                commentCount={law.comments}
            />
        </motion.div>
    );
};

export default LawCard;
