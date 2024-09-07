import React, { useState, useEffect } from "react";
import styles from '/styles/Water.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Tracking() {
    const [trackingVisible, setTrackingVisible] = useState(false);
    const [inputTitle, setInputTitle] = useState('');
    const [inputAmount, setInputAmount] = useState('');
    const [inputUnit, setInputUnit] = useState('mL');
    const [records, setRecords] = useState([]);
    const [sortDate, setSortDate] = useState(getLocalDate());

    useEffect(() => {
        const storedRecords = localStorage.getItem('Records');
        if (storedRecords) {
            setRecords(JSON.parse(storedRecords));
        }
    }, []);

    const toggleTracker = () => {
        setTrackingVisible(!trackingVisible);
        setSortDate(getLocalDate());
    };

    const handleAddRecord = async () => {
        if (inputTitle && inputAmount && parseFloat(inputAmount) > 0) {
            const newRecord = { 
                title: inputTitle, 
                unit: inputUnit, 
                amount: inputAmount, 
                time: getLocalDate() + ' : ' + getLocalTime(),
            };
            console.log(newRecord.time)
            const updatedRecords = [...records, newRecord];
            setRecords(updatedRecords);
            localStorage.setItem('Records', JSON.stringify(updatedRecords));
            clearInputs();
            await requestNotificationPermission();
            const totalAmount = updatedRecords.reduce((total, record) => total + parseFloat(record.amount), 0);
            const description = totalAmount < 1500 ? 'Try striving for the 1500mL tomorrow!' : 'You drank enough today! Great job!';
            scheduleNotificationAtMidnight(`You drank ${totalAmount}mL today!`, description);
        } else {
            alert('Please enter a valid title and a positive amount.');
        }
    };

    const clearInputs = () => {
        setInputTitle('');
        setInputAmount('');
        setInputUnit('mL');
        setTrackingVisible(false);
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

    function scheduleNotificationAtMidnight(title, description) {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const now = new Date();
            const nextMidnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 0, 0
            );
            const timeUntilMidnight = nextMidnight.getTime() - now.getTime();

            setTimeout(() => {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, {
                        body: description,
                        icon: '/water.png',
                        tag: 'reminder',
                        renotify: true,
                    });
                });

                setInterval(() => {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.showNotification(title, {
                            body: description,
                            icon: '/water.png',
                            tag: 'reminder',
                            renotify: true,
                        });
                    });
                }, 24 * 60 * 60 * 1000); 
            }, timeUntilMidnight);
        }
    }
    const filteredRecords = records.filter((record) => record.time.slice(0, 10) === sortDate);
    
    return (
        <>
            <nav className={styles.Nav}>
                <h1><Link href={'/'}>Daily Water</Link></h1>
                <h2>Tracker</h2>
                <div>
                    <button><Link href={'/'}>Home</Link></button>
                    <button><Link href={'/tools/reminders'}>Reminders</Link></button>
                </div>
            </nav>
            <main className={styles.Main}>
                <button className={styles.AddReminder} onClick={toggleTracker}>
                    {trackingVisible ? 'Close' : 'Add Record'}
                </button>
                <input 
                    type="date" 
                    className={styles.SortDate} 
                    value={sortDate} 
                    onChange={(e) => setSortDate(e.target.value)}
                />
                {trackingVisible && (
                    <div className={styles.water}>
                        <h2>Add Record</h2>
                        <input
                            placeholder="Enter record name"
                            value={inputTitle}
                            onChange={(e) => setInputTitle(e.target.value)}
                            type="text"
                        />
                        <div className={styles.inputDiv}>
                            <input
                                placeholder="Enter record amount"
                                value={inputAmount}
                                onChange={(e) => setInputAmount(e.target.value)}
                                className={styles.input2}
                                type="number"
                                min={0}
                                max={5000}
                            />
                            <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)}>
                                <option value="mL">mL</option>
                            </select>
                        </div>
                        <div>
                            <button onClick={handleAddRecord}>Add</button>
                            <button onClick={toggleTracker}>Close</button>
                        </div>
                    </div>
                )}
                <div className={styles.Records}>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record, key) => (
                            <Record 
                                key={key} 
                                title={record.title} 
                                amount={record.amount} 
                                unit={record.unit} 
                                time={record.time} 
                                sortDate={sortDate} 
                            />
                        ))
                    ) : (
                        <h2 className={styles.NoActiveReminders}>No Records Today</h2>
                    )}
                </div>
            </main>
        </>
    );
}

export const Record = ({ title, amount, unit, time, sortDate }) => {
    const localTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const recordDate = new Date(time).toLocaleDateString();
    const displayTime = sortDate === recordDate ? localTime : `${recordDate} : ${localTime}`;

    return (
        <div className={styles.Reminder}>
            <Image src={'/three-dots-vertical.svg'} width={30} height={30} className={styles.ThreeDots} alt='options' />
            <label>{title}</label>
            <p>
                <Image src={'/clock.png'} width={20} height={20} alt='time' />
                {displayTime}
            </p>
            <p>{amount}{unit}</p>
        </div>
    );
};

function getLocalDate() {
    return new Date().toISOString().slice(0, 10);
}
function getLocalTime() {
    const localTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return localTime
}

function getTime() {
    return new Date().toISOString().slice(11, 16);
}