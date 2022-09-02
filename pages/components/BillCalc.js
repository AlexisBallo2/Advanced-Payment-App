import React, { useState, useEffect } from "react";
import Group from "./billCalc/Group";
import styles from "../../styles/index.module.css";
import Swal from "sweetalert2";
import Image from "next/image";

var groupsCounter = 3;

export default function BillCalc(props) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [whoPaidArray, setWhoPaidArray] = useState([]);
  const [popupShow, setpopupShow] = useState(true);
  var [inc, setInc] = useState(2);
  const [groups, setGroups] = useState([{ id: 0 }]);
  const [text, setText] = useState("ajda");
  const [fullData, setfullData] = useState([
    [
      {
        name: "alexis",
        indivCost: "10",
      },
    ],
  ]);

  useEffect(() => {
    console.log("use effect")
    if(props.changeId == 1) {
      setpopupShow(1)
      props.setChangeId(0)
    }
  },[props])


  useEffect(() => {
    console.log("data from state", fullData);
    fetch("/api/billCalc/getDBData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupName: groupName,
        type:"Bill"
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("billCalc getDBData returns: ", data)
        console.log(data.todos);
        if (data.todos.length == 0) {
        } else {
          console.log("data recieved from api", data);
          let returnedData = JSON.parse(data.todos[0].dataArray);
          //var defCost = ["alexis", "johna"]
          var defCost = data.todos[0].costArray.slice(1, -1);
          var newdefCost = defCost.split(",");
          for (var i = 0; i < newdefCost.length; i++) {
            newdefCost[i] = newdefCost[i].slice(1, -1);
            // console.log(newdefCost[i])
          }
          console.log("parsed defCost", newdefCost);
   
          
          setWhoPaidArray(newdefCost);

          var tempGroupObj = [];
          for (var i = 0; i < returnedData.length; i++) {
            var tempObj = { id: i };
            tempGroupObj.push(tempObj);
          }
          setGroups(tempGroupObj);
          console.log("who paid", whoPaidArray);
          console.log("data", returnedData);
          setfullData(returnedData);
        }
      });

    return () => {};
  }, [groupName]);

  if (popupShow) {
    setpopupShow(false);
    const { value: recieveedstuff } = Swal.fire({
      title: "Advanced Bill Calculator",
      html: "Enter the different bills! </br> </br> If you have a code enter it below! If you dont, create a new code!",
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
    console.log("full data: ", fullData);
    setLoading(true);
    fetch("/api/billCalc/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: fullData, whoPaidData: whoPaidArray }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("returned calculated dat, ", data);
        setData(data);
        setLoading(false);
        setText("alexis \n Joe");
        for (var i = 0; i < data.length; i++) {
          data[i] = data[i][0] + " pays " + data[i][1] + ": $" + data[i][2];
        }
        Swal.fire({
          title: "Performed Calculation",
          html: data.join("</br>"),
        });
      });
  };

  const updateDB = () => {
    console.log("states data", fullData);
    fetch("/api/billCalc/setDBData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataArray: JSON.stringify(fullData),
        groupName: groupName,
        costArray: whoPaidArray,
        type:"Bill"
      }),
    });
  };

  const addGroup = (obj) => {
    console.log("groups type before update: ", groups);
    var tempGroup = { id: groups.length };
    var tempGroupsArray = groups;
    // tempGroupsArray.push(tempGroup)
    //setGroups(tempGroupsArray);
    setGroups((current) => [...current, tempGroup]);

    console.log("did we add a new group: groupsList: ", groups);
    var newGroupToAdd = [
      { name: "", indivCost: "" },
      { name: "", indivCost: "" },
    ];
    // fullData.push(newGroupToAdd)
    //setfullData(fullData)
    setfullData((current) => [...current, newGroupToAdd]);
    console.log(
      "adding a new group to fullData: fulldata: ",
      fullData,
      "data info: ",
      fullData[groups.length - 1]
    );

    setfullData((current) => [...current]);
    setGroups((current) => [...current])
  };

  const removeGroup = () => {
    console.log("are we here");

    var tempGroupsArray = groups;
    tempGroupsArray.pop();
    setGroups(tempGroupsArray);

    var tempDataArray = fullData;
    fullData.pop();
    setfullData(tempDataArray);
    console.log("removed. New fulldata array:", fullData);

    setfullData((current) => [...current]);
    setGroups((current) => [...current])
  };

  const updaterFunction = (data) => {
    var currentData = fullData;

    fullData[data.number] = data.value;
    setfullData(currentData);
    console.log("full data", currentData);
  };

  const WhoPaidUpdaterFunction = (data) => {
    whoPaidArray[data.number] = data.whoPaid;
    console.log("updating whopaidarray: ", whoPaidArray);
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
                whoPaidArray={whoPaidArray}
                WhoPaidUpdaterFunction={WhoPaidUpdaterFunction}
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

      <div></div>
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
