import styles from '../styles/Water.module.css'
import Link from 'next/link';

export default function Nav() {
    return(
        <nav className={styles.Nav}>
            <h2>Daily Water</h2>
            <p></p>
            <div>
                <button><Link href={'/tools/tracking'}>Tracker</Link></button>
                <button><Link href={'/tools/reminders'}>Reminders</Link></button>
            </div>
        </nav>
    )
}