import React, { useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { playNotificationSound } from '../../utils/sound';
import styles from './Notifications.module.css';

const Notifications: React.FC = () => {
    const { state, dispatch } = useApp();
    const { notifications } = state.ui;

    // Auto-dismiss logic: whenever notification changes, if there is one, set a timer to dismiss it
    useEffect(() => {
        if (notifications.length > 0) {
            playNotificationSound();
            const timer = setTimeout(() => {
                dispatch({ type: 'DISMISS_NOTIFICATION' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notifications, dispatch]);

    if (notifications.length === 0) return null;

    return (
        <div className={styles.container}>
            {notifications.map((msg, idx) => (
                <div key={idx} className={styles.toast}>
                    {msg}
                </div>
            ))}
        </div>
    );
};

export default Notifications;
