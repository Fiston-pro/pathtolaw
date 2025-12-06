import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [likedVideos, setLikedVideos] = useState(new Set());
    const [savedVideos, setSavedVideos] = useState(new Set());
    const [userComments, setUserComments] = useState([]);

    const toggleLike = (lawId) => {
        setLikedVideos(prev => {
            const newLikes = new Set(prev);
            if (newLikes.has(lawId)) {
                newLikes.delete(lawId);
            } else {
                newLikes.add(lawId);
            }
            return newLikes;
        });
    };

    const toggleSave = (lawId) => {
        setSavedVideos(prev => {
            const newSaves = new Set(prev);
            if (newSaves.has(lawId)) {
                newSaves.delete(lawId);
            } else {
                newSaves.add(lawId);
            }
            return newSaves;
        });
    };

    const addComment = (lawId, comment) => {
        const newComment = {
            id: Date.now(),
            lawId,
            ...comment,
            time: 'Teraz'
        };
        setUserComments(prev => [newComment, ...prev]);
    };

    const isLiked = (lawId) => likedVideos.has(lawId);
    const isSaved = (lawId) => savedVideos.has(lawId);

    const value = {
        likedVideos: Array.from(likedVideos),
        savedVideos: Array.from(savedVideos),
        userComments,
        toggleLike,
        toggleSave,
        addComment,
        isLiked,
        isSaved
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
