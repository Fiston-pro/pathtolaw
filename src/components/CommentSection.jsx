import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import './CommentSection.css';

const CommentSection = ({ isOpen, onClose, lawId, commentCount }) => {
    const { addComment } = useUser();
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Anna Kowalska",
            avatar: "👩",
            text: "Super wyjaśnione! Wreszcie rozumiem to prawo 🙌",
            likes: 234,
            time: "2 godz. temu"
        },
        {
            id: 2,
            author: "Marek Nowak",
            avatar: "👨",
            text: "A jak to działa w praktyce? Ktoś może wytłumaczyć?",
            likes: 89,
            time: "5 godz. temu"
        },
        {
            id: 3,
            author: "Kasia Wiśniewska",
            avatar: "👩‍💼",
            text: "Dokładnie to, czego szukałam. Dzięki za info! 💯",
            likes: 156,
            time: "1 dzień temu"
        }
    ]);

    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment = {
                id: comments.length + 1,
                author: "Ty",
                avatar: "😊",
                text: newComment,
                likes: 0,
                time: "Teraz"
            };
            setComments([comment, ...comments]);

            // Add to user's global comments
            addComment(lawId, comment);

            setNewComment('');
        }
    };

    const handleLikeComment = (commentId) => {
        setComments(comments.map(comment =>
            comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
        ));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="comment-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Comment Panel */}
                    <motion.div
                        className="comment-panel"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="comment-header">
                            <h3>{commentCount} komentarzy</h3>
                            <button className="close-btn" onClick={onClose}>✕</button>
                        </div>

                        {/* Comments List */}
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    className="comment-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="comment-avatar">{comment.avatar}</div>
                                    <div className="comment-content">
                                        <div className="comment-author">{comment.author}</div>
                                        <div className="comment-text">{comment.text}</div>
                                        <div className="comment-footer">
                                            <span className="comment-time">{comment.time}</span>
                                            <button
                                                className="comment-like-btn"
                                                onClick={() => handleLikeComment(comment.id)}
                                            >
                                                ❤️ {comment.likes > 0 && comment.likes}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="comment-input-area">
                            <div className="comment-avatar">😊</div>
                            <input
                                type="text"
                                placeholder="Dodaj komentarz..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                className="comment-input"
                            />
                            <button
                                className="send-btn"
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                            >
                                ➤
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommentSection;
