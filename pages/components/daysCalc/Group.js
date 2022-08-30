import React, { useState, useEffect } from "react";
import Entry from "./Entry";
import styles from "../../../styles/Group.module.css";

var itemCounter = 3;

export default function Group(props) {
  var propsData = props;
  // console.log("getting data: ", props.data, " with length: ", props.data.length)
  var [items, setItems] = useState([]);
  var [cost, setCost] = useState(0);
  useEffect(() => {
    console.log("in usestate, ", props)
    var currentItems = [];

    console.log("recieved payment, ", props.payment);
    if(props.payment == undefined){
      setCost(0)
    } else {
      setCost(props.payment);

    }

    for (var i = 0; i < props.data.length; i++) {
      var tempObj = { id: i };
      currentItems.push(tempObj);
    }
    setItems(currentItems);
    console.log("Entries items and length: ", items, items.length);

    return () => {};
  }, []);

  var [content, setContent] = useState(props.data);

  //add person to group
  const addEntry = () => {
    // var tempItems = items
    var tempItem = { id: items.length }
    var tempItems = items
    tempItems.push(tempItem);
    setItems(tempItems)


    var tempContentItem = { name: "", days: 0 }
    var tempContent = content
    tempContent.push(tempContentItem)
    setContent(tempContent)


    //setItems((current) => [...current, tempItem]);
   // setContent((current) => [...current, tempContent]);
    // console.log("items", items);
    // console.log("content", content);
    setItems((current) => [...current])
    setContent((current) => [...current])
    console.log("changed entries,", items)
    console.log("changed content, ", content)
  };

  //remove person from group
  const removeEntry = () => {
    console.log("in removeEntry, with ", items)

    var currentItems = items
    items.pop()
    setItems(items)

    var currentContent = content
    currentContent.pop()
    setContent(currentContent)

   //  var tempItems = items;
   //  tempItems.pop();
   //  setItems(tempItems);

   //  var tempContent = content;
   //  tempContent.pop();
   //  setContent(tempContent);
   //  // setItems((current) =>
   //  //   current.filter((obj) => {
   //  //     return obj.id !== current.length - 1;
   //  //   })
   // // );
  setItems((current) => [...current])
  setContent((current) => [...current])
  console.log("changed entries,", items)
  console.log("changed content, ", content)

  };

  //update current groups people
  const groupsUpdaterFunction = (data) => {
    var currentData = content;
    currentData[data.number] = data.value;
    setContent(currentData);
    console.log("passing currentData", currentData);
    props.updaterFunction({ number: props.id, value: currentData, cost: cost });
    console.log("content dat", content);
  };

  const setCostChange = (e) => {
    var value = e.target.value;
    console.log("cost change", value);
    if (e.target.value == "") {
      console.log("nada");
      //setCost("0")
      setCost(e.target.value);
    } else {
      setCost(e.target.value);
      console.log("cost");
    }
    props.updaterFunction({
      number: props.id,
      value: content,
      cost: parseInt(e.target.value),
    });
  };
  return (
    <div className={styles.group}>
      <h1 className={styles.groupHeader}> Group {props.id + 1}</h1>
      <div className={styles.headers}>
        <span>Name</span> <span>Days</span>
      </div>
      <div>
        {items.map((item) => {
          return (
            <div key={item.id}>
                <Entry
                  updater={groupsUpdaterFunction}
                  number={item.id}
                  data={props.data[item.id]}
                />
            </div>
          );
        })}
        <div className={styles.costbuttonHolder}>
          <button onClick={() => addEntry()}>+</button>
          <button onClick={() => removeEntry()}>-</button>
        </div>
        <div className={styles.costbuttonHolder}>
          <span className={styles.costText}> Family Paid:</span>
          <input
            value={cost}
            onChange={setCostChange}
            className={styles.costInput}
          ></input>
        </div>
      </div>
    </div>
  );
}
