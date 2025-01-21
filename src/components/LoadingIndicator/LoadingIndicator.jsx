import React, { useState, useEffect } from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator = () => {
  const [loadingNumber, setLoadingNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingNumber((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.Loading_stage}>
      <div className={styles.Loading_cloud}>
        <div className={styles.Loading_cloudBubble1}></div>
        <div className={styles.Loading_cloudBubble2}></div>
        <div className={styles.Loading_cloudBubble3}></div>
        <div className={styles.Loading_cloudBubble4}></div>
        <span className={styles.Loading_number}>{loadingNumber}%</span>
      </div>
      <div className={styles.Loading_smallCloud1}>
        <div className={styles.Loading_smallCloudBubble}></div>
        <div className={styles.Loading_smallCloudBubble}></div>
      </div>
      <div className={styles.Loading_smallCloud2}>
        <div className={styles.Loading_smallCloudBubble}></div>
        <div className={styles.Loading_smallCloudBubble}></div>
      </div>
      <ul className={styles.Loading_list}>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className={styles.Loading_item}></li>
        ))}
      </ul>
      <div className={styles.Loading_band}></div>
      <div className={styles.Loading_factory}>
        <div className={styles.Loading_magic}></div>
        <div className={styles.Loading_screen}></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
