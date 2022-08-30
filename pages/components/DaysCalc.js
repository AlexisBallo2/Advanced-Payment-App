import React, { useState, useEffect } from "react";
import Group from "./daysCalc/Group";
import styles from "../../styles/index.module.css";
import Swal from "sweetalert2";
import Image from "next/image";

var groupsCounter = 3;

export default function DaysCalc(props) {
  const [data, setData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [popupShow, setpopupShow] = useState(true);
  var [inc, setInc] = useState(2);
  const [groups, setGroups] = useState([]);
  const [fullData, setfullData] = useState([
    [
    ],
  ]);

  useEffect(() => {
    console.log("data from state", fullData);
    fetch("/api/daysCalc/getDBData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName: groupName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.todos);
        if (data.todos.length == 0) {
        } else {
          let returnedData = JSON.parse(data.todos[0].dataArray);
          var defCost = data.todos[0].costArray
            .toString()
            .slice(1, -1)
            .split(",");
          console.log(
            "default cost: ",
            data.todos[0].costArray.toString().slice(1, -1).split(",")
          );
          for (var i = 0; i < defCost.length; i++) {
            defCost[i] = parseInt(defCost[i]);
          }
          var tempGroupObj = [];
          for (var i = 0; i < returnedData.length; i++) {
            var tempObj = { id: i };
            tempGroupObj.push(tempObj);
          }
          setGroups(tempGroupObj);
          let returnedCost = JSON.parse(data.todos[0].costArray);
          console.log("data", returnedData);
          console.log("cost data", defCost);
          setfullData(returnedData);
          setCostData(defCost);
        }
      });

    return () => {};
  }, [groupName]);

  if (popupShow) {
    setpopupShow(false);
    const { value: recieveedstuff } = Swal.fire({
      title: "Advanced Payment Calculator",
      html: 'Enter family members in the "Name" column, and the amount of days they were there in the "Days" column. Enter the amount that the family/group spend for the group in the "Family Paid" box. Then press calculate! </br> </br> If you have a groupname/want a groupname, please enter it below!',
      // This app is intended to be used as a platform to calculate "who pays who what". This app was inspired by watching family members struggle to calculate the amount of $ owed after family vacations.
      input: "text",
      showCancelButton: true,
      inputValue: "",
      inputValidator: (value) => {
        console.log(value);
        setGroupName(value);
        props.idUpdater(value)
        return;
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }

  const calculate = () => {
    console.log("full data: ", fullData, " and ", costData);
    setLoading(true);
    fetch("/api/daysCalc/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ days: fullData, costs: costData }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("returned calculated dat, ", data);
        setData(data);
        setLoading(false);
      });
  };

  const updateDB = () => {
    console.log("states data", fullData);
    console.log("states data", costData);
    console.log("saving to db with id", groupName);
    fetch("/api/setDBData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataArray: JSON.stringify(fullData),
        costArray: JSON.stringify(costData),
        groupName: groupName,
      }),
    });
  };

  const addGroup = (obj) => {
    console.log("groups type before update: ", groups);
    var tempGroup = { id: groups.length };
    var tempGroupsArray = groups;
    tempGroupsArray.push(tempGroup)
    setGroups(tempGroupsArray);

;
    var newGroupToAdd = [
      { name: "", days: "" },
    ];
    var tempFullData = fullData;
    tempFullData.push(newGroupToAdd)
    setfullData(tempFullData)
    // fullData.push(newGroupToAdd)
    //setfullData(fullData)

    var tempCostData = costData;
    tempCostData.push(0)
    setCostData(tempCostData)

    setCostData((current) => [...current]);
    setfullData((current) => [...current]);
    setGroups((current) => [...current])

    console.log(
      "adding a new group to fullData: fulldata: ",
      fullData,
      "data info: ",
      fullData[groups.length - 1]
    );
  };

  const removeGroup = () => {
    console.log("are we here");

    var tempGroupsArray = groups;
    tempGroupsArray.pop();
    setGroups(tempGroupsArray);

    var tempCostArray = costData;
    tempCostArray.pop();
    setCostData(tempCostArray);

    var tempDataArray = fullData;
    fullData.pop();
    setfullData(tempDataArray);


    setCostData((current) => [...current]);
    setfullData((current) => [...current]);
    setGroups((current) => [...current])

  };

  const updaterFunction = (data) => {
    var currentData = fullData;
    var currentCostData = costData;
    currentCostData[data.number] = data.cost;
    setCostData(currentCostData);
    fullData[data.number] = data.value;
    setfullData(currentData);
    console.log("full data", currentData);
    console.log("costs", currentCostData);
  };

  return (
    <div className={styles.page}>
      <div className={styles.groupHolder}>
        {groups.map((item) => {
          return (
            <div key={item.id} className={styles.holder}>
              <Group
                id={item.id}
                updaterFunction={updaterFunction}
                data={fullData[item.id]}
                payment={costData[item.id]}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.buttons}>
        <button onClick={() => addGroup()}>Add Group</button>
        <button onClick={() => removeGroup()}>Remove Group</button>
        <button onClick={() => calculate()}>Calculate</button>
        <button onClick={() => updateDB()}>Save</button>
      </div>

      <div>
        {data.length == 0
          ? ""
          : data.map((dat) => (
              <p key={dat}>
                {fullData[parseInt(dat[0])][0].name}'s group pays {fullData[parseInt(dat[1])][0].name}'s group:
                ${dat[2]}
              </p>
            ))}
      </div>
      <div className={styles.aboutMe}>
        by{" "}
        <a
          href="https://alexisballo.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alexis Ballo
        </a>
      </div>
      <div className={styles.question}>
        <img
          className={styles.image}
          src="https://static.vecteezy.com/system/resources/previews/006/253/524/original/outline-question-mark-icon-free-vector.jpg"
          width="30px"
          height="30px"
        />
      </div>
    </div>
  );
}
