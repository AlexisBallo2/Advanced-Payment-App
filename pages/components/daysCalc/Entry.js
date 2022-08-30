import React, { useState, useEffect } from "react";
import styles from "../../../styles/Entry.module.css";

export default function Entry(props) {
  const [value, setValue] = useState("");
  const [day, setDay] = useState("");
  //console.log("in entry with: ", props.data)
  useEffect(() => {
    //console.log((props.data))
    if((props.data) != undefined) {
        setValue(props.data.name)
        setDay(props.data.days)
    }

  }, [])
  
  var number = props.number;
  const handleChange = (e) => {
    setValue(e.target.value);
    props.updater({
      number: number,
      value: { name: e.target.value, days: day },
    });
  };
  const handleDayChange = (e) => {
    setDay(e.target.value);
    props.updater({
      number: number,
      value: { name: value, days: e.target.value },
    });
  };
  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
        className={styles.valueInput}
      ></input>
      <input
        className={styles.dayInput}
        value={day}
        onChange={handleDayChange}
      ></input>
    </div>
  );
}
