import styles from '../styles/Water.module.css'
import Nav from '../components/Nav'
import { useState } from 'react';

export default function Water() {
    return (
      <>
      <Nav/>
      <header className={styles.header}>
        <h1>
          Daily Water
        </h1>
        <p>Drink more water with Daily Water! Get an reminder for hydrating yourself, or keep track of how much you drink</p>
      </header>
      </>
    );
  }
  