// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body.data;
    const whoPaid = req.body.whoPaidData;

    return res.status(200).json(makeCalculation(data, whoPaid));
  }
}

function makeCalculation(data, whoPaid) {
  console.log("api recieved data: ", data, whoPaid);
  var whoPaidWhatArray = new Array(whoPaid.length).fill(0);
  var indivCosts = {};

  //for each bill
  for (var i = 0; i < data.length; i++) {
    var totalCost = 0;
    //for each item in bill
    for (var j = 0; j < data[i].length; j++) {
      var whoNeedstoPay = data[i][j].name;
      var howMuch = parseInt(data[i][j].indivCost);
      console.log(whoPaid[i], "paid", howMuch, "for", whoNeedstoPay);

      //add how much whoNeedstoPay to paid db

      if (typeof indivCosts[whoNeedstoPay] == "undefined") {
        //person has no payment history
        indivCosts[whoNeedstoPay] = 0;
        indivCosts[whoNeedstoPay] = indivCosts[whoNeedstoPay] + howMuch;
      } else {
        //add how much they need to pay to db
        indivCosts[whoNeedstoPay] += howMuch;
      }
      console.log(indivCosts[whoNeedstoPay]);
      totalCost += howMuch;
    }

    console.log(whoPaid[i], "paid", totalCost, " for this bill");

    //add how much the person spent into the db
    if (typeof indivCosts[whoPaid[i]] == "undefined") {
      //person has no payment history
      indivCosts[whoPaid[i]] = 0;
      indivCosts[whoPaid[i]] = indivCosts[whoPaid[i]] - totalCost;
    } else {
      //add how much they need to recieve to db
      indivCosts[whoPaid[i]] = indivCosts[whoPaid[i]] - totalCost;
    }
  }

  console.log(indivCosts);

  // beginning of the price deal
  var positives = {};
  var negatives = {};
  for (const [key, value] of Object.entries(indivCosts)) {
    if (value > 0) {
      positives[key] = value;
    } else {
      negatives[key] = value;
    }
  }

  ////console.log(Object.entries(positives))
  console.log("negatives", negatives);
  console.log("positives:", positives);

  var newpostup = [];
  for (const [key, value] of Object.entries(positives)) {
    //console.log(`${key}: ${value}`);
    newpostup.push([key, value]);
  }

  var newnegup = [];
  for (const [key, value] of Object.entries(negatives)) {
    //console.log(`${key}: ${value}`);
    newnegup.push([key, value]);
  }

  console.log("newpostup", newpostup);
  console.log("newnegup", newnegup);

  var transactions = [];

  //for each fam that needs money
  for (var a = 0; a < newnegup.length; a++) {
    //for each fam that needs to pay
    for (var x = 0; x < newpostup.length; x++) {
      //if (fam to pay) needs to pay less that the (fam to recieve) and the (fam to pay) still has money to pay
      if (newpostup[x][1] < Math.abs(newnegup[a][1]) && newpostup[x][1] > 0) {
        //(money recieving fam needs) = (previous needed money) - (payment from paying fam)
        newnegup[a][1] = newnegup[a][1] + newpostup[x][1];
        //log payment
        console.log(
          newpostup[x][0],
          " pay ",
          newnegup[a][0],
          ": ",
          newpostup[x][1]
        );
        transactions.push([newpostup[x][0], newnegup[a][0], newpostup[x][1]]);
        // reset the fams pay
        newpostup[x][1] = 0;
      }
    }
  }
  //for each fam that still needs to pay
  for (var y = 0; y < newpostup.length; y++) {
    //if still needs to pay up
    if (newpostup[y][1] > 0) {
      //print(newpostup[y][1])
      //for each fam to recieve...
      for (var z = 0; z < newnegup.length; z++) {
        //if still needs to recieve
        if (Math.abs(newnegup[z][1]) > 0) {
          //left required payment = payment - amount paid to reciever
          newpostup[y][1] = newpostup[y][1] + newnegup[z][1];
          console.log(
            newpostup[y][0],
            " pay ",
            newnegup[z][0],
            ": ",
            Math.abs(newnegup[z][1])
          );
          transactions.push([
            newpostup[y][0],
            newnegup[z][0],
            Math.abs(newnegup[z][1]),
          ]);
          //reciever is now satisfied
          newnegup[z][1] = 0;
        }
      }
    }

    newpostup[y][1] = 0;
  }

  console.log("transactions: ", transactions);
  return transactions;
}
