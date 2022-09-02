import React, { useState, useEffect } from "react";
import BillCalc from "./components/BillCalc";
import DaysCalc from "./components/DaysCalc";
import styles from "../styles/index.module.css"
var groupsCounter = 3;

export default function Home() {
  const [version, setVersion] = useState("Bill Calculator")
  const [id, setId] = useState("")
  const [changeId, setChangeId] = useState(0)
  const changeApp = () => {
    if(version == "Bill Calculator") {
      setId("")
      setVersion("Day Payment Calculator")
    } else {
      setId("")
      setVersion("Bill Calculator")
    }
  }

  const changeIdFunction = () => {
    setChangeId(1)
  }
 return (
  <div>
    <div className={styles.page}>
      <div className={styles.paymentCalcHeader}>Payment Calculator 
      <p>{version}, ID: {id},  <button onClick = {() => changeIdFunction()}> change ID</button></p> 
      {/* <button onClick={() => changeApp()} className={styles.changeApp}>Change app</button> */}
      <div className = {styles.selectionHolder}>
        <button onClick={() => changeApp()} className={styles.changeAppButton} style = {{backgroundColor: version == "Bill Calculator" ? "green": "white"}}>Bill <br/> Calculator</button> 
        <button onClick={() => changeApp()} className={styles.changeAppButton} style = {{backgroundColor: version == "Day Payment Calculator" ? "green": "white"}} >Day <br/> Calculator</button>
      </div>

      </div>
      </div>
    {version == "Bill Calculator" ? 
      <BillCalc idUpdater = {setId} id = {id} setChangeId = {setChangeId} changeId = {changeId}/> 
        : 
      <DaysCalc idUpdater = {setId} id = {id} setChangeId = {setChangeId} changeId = {changeId}/> }
  
  </div>

 )
}
