import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = ({ currentIndex, totalLaws }) => {
    return (
        <div className="navigation">
            <div className="progress-container">
                <div className="progress-info">
                    <span className="current">{currentIndex + 1}</span>
                    <span className="separator">/</span>
                    <span className="total">{totalLaws}</span>
                </div>
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / totalLaws) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {currentIndex < totalLaws - 1 && (
                <motion.div
                    className="scroll-hint"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <span className="hint-icon">👆</span>
                    <span className="hint-text">Przesuń w górę</span>
                </motion.div>
            )}
        </div>
    );
};

export default Navigation;
