import React, { useState, useEffect } from "react";
import styles from "../../../styles/Entry.module.css";

export default function Entry(props) {
  const [name, setName] = useState("");
  const [indivCost, setIndivCost] = useState("");
  //console.log("in entry with: ", props.data)
  useEffect(() => {
    //console.log((props.data))
    if((props.data) != undefined) {
        setName(props.data.name)
        setIndivCost(props.data.indivCost)
    }

  }, [])
  
  var number = props.number;
  const handleChange = (e) => {
    setName(e.target.value);
    props.updater({
      number: number,
      value: { name: e.target.value, indivCost: indivCost },
    });
  };
  const handleIndivCostChange = (e) => {
    setIndivCost(e.target.value);
    props.updater({
      number: number,
      value: { name: name, indivCost: e.target.value },
    });
  };
  return (
    <div>
      <input
        value={name}
        onChange={handleChange}
        className={styles.valueInput}
      ></input>
      <input
        className={styles.dayInput}
        value={indivCost}
        onChange={handleIndivCostChange}
      ></input>
    </div>
  );
}
