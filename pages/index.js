import React, { useState, useEffect } from "react";
import BillCalc from "./components/BillCalc";
import DaysCalc from "./components/DaysCalc";
import styles from "../styles/index.module.css"
var groupsCounter = 3;

export default function Home() {
  const [version, setVersion] = useState("Bill Calculator")
  const [id, setId] = useState("")

  const changeApp = () => {
    if(version == "Bill Calculator") {
      setVersion("Day Payment Calculator")
    } else {
      setVersion("Bill Calculator")
    }
  }

 return (
  <div>
    <div className={styles.page}>
      <div className={styles.paymentCalcHeader}>Payment Calculator 
      <p>{version}, ID: {id} </p> 
      <button onClick={() => changeApp()}>Change app</button>

      </div>
      </div>
    {version == "Bill Calculator" ? <BillCalc idUpdater = {setId}/> : <DaysCalc idUpdater = {setId}/>}
  
  </div>

 )
}
