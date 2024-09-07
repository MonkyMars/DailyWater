import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Water from './water'
import React, {useEffect} from "react";

const Home: NextPage = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);
  

  return (
  <>
    <Head>
        <title>Daily Water</title>
        <link rel="icon" href="/water.png"/>
    </Head>
    <Water/>
  </>
  );
};

export default Home;
