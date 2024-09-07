import React, { useState, useEffect } from 'react';
import styles from '/styles/Water.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
export default function Reminders() {
  const [waterVisible, setWaterVisible] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputTime, setInputTime] = useState('Each hour');
  const [inputDescription, setInputDescription] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }

    const StorageReminders = () => {
      const storedReminders = localStorage.getItem('Reminders');
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    };
    StorageReminders();
  }, []);

  const toggleWater = () => {
    setWaterVisible(!waterVisible);
  };

  const handleAddReminder = async () => {
    if (inputTitle && inputDescription) {
      const newReminder = { title: inputTitle, time: inputTime, description: inputDescription };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('Reminders', JSON.stringify(updatedReminders));
      await requestNotificationPermission();
      scheduleNotification(inputTitle, inputDescription, convertTimeToMillis(inputTime));
      setWaterVisible(false);
      setInputTime('Each hour');
      setInputTitle('');
      setInputDescription('');
    } else {
      window.alert('Please fill in all fields')
    }
  };

  function requestNotificationPermission() {
    if ('Notification' in window) {
      return Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }

  function convertTimeToMillis(time) {
    switch (time) {
      case 'Each hour':
        return 3600000; 
      case 'Every 2 hours':
        return 7200000;
      case 'Every 6 hours':
        return 21600000; 
      default:
        return 3600000; 
    }
  }

  function scheduleNotification(title, description, interval) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        setInterval(() => {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, {
                    body: description,
                    icon: '/water.png',
                    tag: 'reminder',
                    renotify: true,
                    actions: [
                        {
                            action: 'add_record',
                            title: 'Add Record'
                        }
                    ]
                });
            });
        }, interval);
    }
}

  return (
    <>
    <Head>
      <title>Daily Water | Reminders</title>
    </Head>
      <nav className={styles.Nav}>
        <h1><Link href={'/'}>Daily Water</Link></h1>
        <h2>Reminders</h2>
        <div>
          <button><Link href={'/'}>Home</Link></button>
          <button><Link href={'/tools/tracking'}>Tracker</Link></button>
        </div>
      </nav>
      <main className={styles.Main}>
        <button className={styles.AddReminder} onClick={toggleWater}>
          {waterVisible ? 'Close' : 'Add Reminder'}
        </button>

        {waterVisible && (
          <div className={styles.water}>
            <h2>Add reminder</h2>
            <input
              placeholder="Enter reminder name"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
            />
            <textarea value={inputDescription} onChange={(e) => setInputDescription(e.target.value)} placeholder='Enter reminder description'/>
            <select onChange={(e) => setInputTime(e.target.value)}>
              <option value="Each hour">Each hour</option>
              <option value="Every 2 hours">Every 2 hours</option>
              <option value="Every 6 hours">Every 6 hours</option>
            </select>
            <div>
              <button onClick={handleAddReminder}>Add</button>
              <button onClick={() => setWaterVisible(false)}>Close</button>
            </div>
          </div>
        )}
        <div className={styles.Reminders}>
          {reminders.length > 0 ? (
            reminders.map((reminder, key) => (
              <Reminder key={key} title={reminder.title} time={reminder.time} description={reminder.description} />
            ))
          ) : (
            <h2 className={styles.NoActiveReminders}>No Reminders active</h2>
          )}
        </div>
      </main>
    </>
  );
}

export const Reminder = ({ title, time, description }) => {
  return (
    <div className={styles.Reminder}>
      <Image src={'/three-dots-vertical.svg'} width={30} height={30} className={styles.ThreeDots} alt='options'/>
      <label>{title}</label>
      <p>
        <Image src={'/clock.png'} width={20} height={20} alt='time'/>
        {time}
      </p>
      <p>{description}</p>
    </div>
  );
};
