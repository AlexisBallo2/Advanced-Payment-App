import React, { useState, useEffect } from "react";
import Entry from "./Entry";
import styles from "../../../styles/Group.module.css";

var itemCounter = 3;

export default function Group(props) {
  var propsData = props;
  var [groupItems, setGroupItems] = useState([]);
  var [whoPaid, setWhoPaid] = useState("");
  useEffect(() => {
    var currentItems = [];
    console.log("recieved payment, ", props.payment);
    console.log("current group and length: ", groupItems, groupItems.length);
    for (var i = 0; i < props.data.length; i++) {
      var tempObj = { id: i };
      currentItems.push(tempObj);
    }
    setGroupItems(currentItems);
    setWhoPaid(props.whoPaidArray[props.id]);
    console.log("new items and length: ", groupItems, groupItems.length);

    return () => {};
  }, [props.data]);

  var [content, setContent] = useState(props.data);

  //add person to group
  const addEntry = (obj) => {
    setGroupItems((current) => [...current, { id: current.length }]);
    console.log("items", groupItems);
    console.log("content", content);
  };

  //remove person from group
  const removeEntry = () => {
    console.log("current content", content);
    console.log("current items", groupItems);
    var tempItems = groupItems;
    tempItems.pop();
    setGroupItems(tempItems);

    var tempContent = content;
    tempContent.pop();
    setContent(tempContent);

    setGroupItems((current) => [...current]);
    setContent((current) => [...current]);
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
        {groupItems.map((item) => {
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
