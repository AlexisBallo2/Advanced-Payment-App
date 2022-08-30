import React, { useState, useEffect } from "react";
import Entry from "./Entry";
import styles from "../../../styles/Group.module.css";

var itemCounter = 3;

export default function Group(props) {
  var propsData = props;
  // console.log("getting data: ", props.data, " with length: ", props.data.length)
  var [items, setItems] = useState([]);
  var [whoPaid, setWhoPaid] = useState("");
  useEffect(() => {
    var currentItems = [];
    console.log("recieved payment, ", props.payment);
    console.log("current group and length: ", items, items.length);
    for (var i = 0; i < props.data.length; i++) {
      var tempObj = { id: i };
      currentItems.push(tempObj);
    }
    setItems(currentItems);
    setWhoPaid(props.whoPaidArray[props.id]);
    console.log("new items and length: ", items, items.length);

    return () => {};
  }, [props.data]);

  var [content, setContent] = useState(props.data);

  //add person to group
  const addEntry = (obj) => {
    setItems((current) => [...current, { id: current.length }]);
    console.log("items", items);
    console.log("content", content);
  };

  //remove person from group
  const removeEntry = () => {
    setItems((current) =>
      current.filter((obj) => {
        return obj.id !== current.length - 1;
      })
    );
  };

  //update current groups people
  const groupsUpdaterFunction = (data) => {
    var currentData = content;
    currentData[data.number] = data.value;
    setContent(currentData);
    console.log("passing currentData", currentData);
    props.updaterFunction({
      number: props.id,
      value: currentData,
      whoPaid: whoPaid,
    });
    console.log("content dat", content);
  };

  const whoPaidUpdater = (e) => {
    console.log("updating");
    setWhoPaid(e.target.value);
    props.WhoPaidUpdaterFunction({ number: props.id, whoPaid: e.target.value });
  };

  return (
    <div className={styles.group}>
      <h1 className={styles.groupHeader}> Bill {props.id + 1}</h1>
      <div className={styles.headers}>
        <span>Name</span> <span>$$</span>
      </div>
      <div>
        {items.map((item) => {
          return (
            <div key={item.id}>
              <div>
                <Entry
                  updater={groupsUpdaterFunction}
                  number={item.id}
                  data={props.data[item.id]}
                />
              </div>
            </div>
          );
        })}
        <div className={styles.costbuttonHolder}>
          <button onClick={() => addEntry()}>+</button>
          <button onClick={() => removeEntry()}>-</button>
        </div>
      </div>
      <div className={styles.whoPaidHolder}>
        <span>Who Paid: </span>{" "}
        <span>
          <input value={whoPaid} onChange={whoPaidUpdater} />
        </span>
      </div>
    </div>
  );
}
