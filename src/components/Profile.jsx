import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { lawsData } from '../data/lawsData';
import './Profile.css';

const Profile = ({ onBack }) => {
    const { likedVideos, savedVideos, userComments } = useUser();
    const [activeTab, setActiveTab] = useState('liked');

    const getLikedLaws = () => {
        return lawsData.filter(law => likedVideos.includes(law.id));
    };

    const getSavedLaws = () => {
        return lawsData.filter(law => savedVideos.includes(law.id));
    };

    const getMyComments = () => {
        return userComments.map(comment => {
            const law = lawsData.find(l => l.id === comment.lawId);
            return { ...comment, lawTitle: law?.title || 'Usunięte video' };
        });
    };

    const renderVideoGrid = (laws) => {
        if (laws.length === 0) {
            return (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p className="empty-text">
                        {activeTab === 'liked' ? 'Brak polubionych filmów' : 'Brak zapisanych filmów'}
                    </p>
                    <p className="empty-subtext">
                        {activeTab === 'liked'
                            ? 'Polub filmy, aby zobaczyć je tutaj'
                            : 'Zapisz filmy, aby odnaleźć je później'}
                    </p>
                </div>
            );
        }

        return (
            <div className="video-grid">
                {laws.map((law, index) => (
                    <motion.div
                        key={law.id}
                        className="video-thumbnail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="thumbnail-video">
                            <video src={law.videoUrl} className="thumbnail-preview" />
                            <div className="thumbnail-overlay">
                                <span className="play-icon">▶</span>
                            </div>
                        </div>
                        <div className="thumbnail-info">
                            <h4 className="thumbnail-title">{law.title}</h4>
                            <div className="thumbnail-stats">
                                <span>❤️ {law.likes > 1000 ? `${(law.likes / 1000).toFixed(1)}K` : law.likes}</span>
                                <span>👁️ {law.views}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    const renderComments = () => {
        const comments = getMyComments();

        if (comments.length === 0) {
            return (
                <div className="empty-state">
                    <span className="empty-icon">💬</span>
                    <p className="empty-text">Brak komentarzy</p>
                    <p className="empty-subtext">Dodaj komentarze do filmów</p>
                </div>
            );
        }

        return (
            <div className="comments-list-profile">
                {comments.map((comment, index) => (
                    <motion.div
                        key={comment.id}
                        className="profile-comment-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="comment-video-title">{comment.lawTitle}</div>
                        <div className="comment-text-profile">{comment.text}</div>
                        <div className="comment-meta">
                            <span>{comment.time}</span>
                            <span>❤️ {comment.likes}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header">
                <button className="back-btn" onClick={onBack}>
                    ← Powrót
                </button>
                <h1 className="profile-title">Mój Profil</h1>
                <div className="header-spacer"></div>
            </div>

            {/* User Info */}
            <div className="user-info">
                <div className="user-avatar-wrapper">
                    <div className="user-avatar">👤</div>
                    <div className="avatar-badge">✨</div>
                </div>
                <h2 className="user-name">Użytkownik PathToLaw</h2>
                <p className="user-bio">
                    📚 Uczę się polskiego prawa | 🎓 Student | ⚖️ Prawo dla wszystkich
                </p>
                <div className="user-badges">
                    <span className="badge">🏆 Początkujący</span>
                    <span className="badge">🔥 Seria: 3 dni</span>
                </div>
                <div className="user-stats">
                    <div className="stat">
                        <span className="stat-number">{likedVideos.length}</span>
                        <span className="stat-label">Polubione</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{savedVideos.length}</span>
                        <span className="stat-label">Zapisane</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{userComments.length}</span>
                        <span className="stat-label">Komentarze</span>
                    </div>
                </div>
                <div className="join-info">
                    <span>📅 Dołączył: Grudzień 2024</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button
                    className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}
                >
                    ❤️ Polubione
                </button>
                <button
                    className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    🔖 Zapisane
                </button>
                <button
                    className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    💬 Komentarze
                </button>
            </div>

            {/* Content */}
            <div className="profile-content">
                {activeTab === 'liked' && renderVideoGrid(getLikedLaws())}
                {activeTab === 'saved' && renderVideoGrid(getSavedLaws())}
                {activeTab === 'comments' && renderComments()}
            </div>
        </div>
    );
};

export default Profile;
