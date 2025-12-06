import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import CommentSection from './CommentSection';
import './LawCard.css';

const LawCard = ({ law, index }) => {
    const { user, toggleLike, toggleBookmark } = useUser();
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [localLikes, setLocalLikes] = useState(law.likes);
    const [expanded, setExpanded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (user) {
            setLiked(user.likedLaws.includes(law.id));
            setBookmarked(user.bookmarkedLaws.includes(law.id));
        }
    }, [user, law.id]);

    useEffect(() => {
        // Auto-play video when it comes into view
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log("Autoplay prevented:", err);
            });
        }
    }, []);

    const handleLike = () => {
        toggleLike(law.id);
        setLiked(!liked);
        setLocalLikes(prev => liked ? prev - 1 : prev + 1);
    };

    const handleBookmark = () => {
        toggleBookmark(law.id);
        setBookmarked(!bookmarked);
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
        return num.toString();
    };

    return (
        <motion.div
            className="law-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                className="card-video"
                src={law.videoUrl}
                loop
                muted
                playsInline
                autoPlay
            />

            {/* Dark overlay for better text contrast */}
            <div className="video-overlay" />

            {/* Content Overlay */}
            <div className="card-overlay-content">
                <div className="card-header-minimal">
                    <div className="category-badge">{law.category}</div>
                </div>

                <div className="card-footer-info">
                    <h2 className="law-title-minimal">{law.title}</h2>

                    <div className="law-description-container">
                        <div
                            className={`law-description ${expanded ? '' : 'collapsed'}`}
                            onClick={() => setExpanded(!expanded)}
                        >
                            <p className="description-text">{law.description}</p>
                        </div>
                        {!expanded && law.description.length > 100 && (
                            <button
                                className="expand-btn"
                                onClick={() => setExpanded(true)}
                            >
                                Czytaj więcej ▼
                            </button>
                        )}
                    </div>

                    <div className="metadata-minimal">
                        <span className="date">📅 {law.date}</span>
                        <span className="views">👁️ {law.views}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
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
