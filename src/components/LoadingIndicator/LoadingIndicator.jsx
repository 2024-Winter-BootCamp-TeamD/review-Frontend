import React, { useState, useEffect } from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator = () => {
  const [loadingNumber, setLoadingNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingNumber((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.cloud}>
        <div className={styles.cloudBubble1}></div>
        <div className={styles.cloudBubble2}></div>
        <div className={styles.cloudBubble3}></div>
        <div className={styles.cloudBubble4}></div>
        <div className={styles.cloudDot1}></div>
        <div className={styles.cloudDot2}></div>
        <div className={styles.cloudDot3}></div>
        <div className={styles.cloudDot4}></div>
        <span className={styles.loadingNumber}>{loadingNumber}%</span>
      </div>
      <ul>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}></li>
        ))}
      </ul>
      <div className={styles.band}></div>
      <div className={styles.factory}>
        <div className={styles.magic}></div>
        <div className={styles.screen}></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
