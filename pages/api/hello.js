// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default function handler(req, res) {
  if (req.method === "POST") {
    const days = req.body.days;
    const money = req.body.costs;
    return res.status(200).json(makeCalculation(days, money));
  }
}

function makeCalculation(days, money) {
  console.log("days: ", days);
  console.log("money:", money);

  var data = days;
  /*
  = [
      [
          {name:"alexis", days: '5'},
          {name:"joe", days: '1'},
          {name:"chris", days: '1'}
      ],
      [
          {name:"seve", days: '4'}
      ],
      [  
          {name:"smith", days: '5'},
          {name:"carl", days: '1'},
          {name:"j", days: '1'}
      ],
      [  
          {name:"smith", days: '5'},
          {name:"carl", days: '1'},
          {name:"j", days: '1'}
      ]
  ]
  */
  var paid_array = money;
  for (var i = 0; i < paid_array.length; i++) {
    paid_array[i] = -parseInt(paid_array[i]);
  }
  console.log("paid array", paid_array);
  var totalCost = paid_array.reduce((partialSum, a) => partialSum + a, 0);
  console.log("total Cost", totalCost);

  var fam_days_array = [];
  var totalDays = 0;
  for (var i = 0; i < data.length; i++) {
    var fam_days = 0;
    for (var j = 0; j < data[i].length; j++) {
      fam_days += parseInt(data[i][j].days);
      totalDays += parseInt(data[i][j].days);
    }
    fam_days_array[i] = fam_days;
  }

  var dailyCost = Math.round(totalCost / totalDays);
  var fam_cost_array = [];

  console.log("fam days array:", fam_days_array)

  for (var i = 0; i < fam_days_array.length; i++) {
    if(fam_cost_array[i] == undefined){
      fam_cost_array[i] = 0;
    }
    console.log(" fam_cost_array[i]", fam_cost_array[i], fam_days_array[i], dailyCost, paid_array[i])
    //console.log("fam_days_array")
    fam_cost_array[i] = -(fam_days_array[i] * dailyCost) + paid_array[i];
  }

  console.log("fam days array", fam_days_array);
  console.log("total days total", totalDays);
  console.log("daily cost", dailyCost);
  console.log("cost per fam", fam_cost_array);

  // beginning of the price deal
  var positives = {};
  var negatives = {};
  for (var i = 0; i < paid_array.length; i++) {
    if (fam_cost_array[i] >= 0) {
      positives[i] = fam_cost_array[i];
    } else {
      negatives[i] = fam_cost_array[i];
    }
  }

  ////console.log(Object.entries(positives))
  console.log("negatives", negatives);
  console.log("positives:", positives);
  // postup = [(k, v) for k, v in positives.items()]
  // negup = [(k, v) for k, v in negatives.items()]
  // newnegup = list(negup)
  // newnegup = [list(ele) for ele in newnegup]
  // newpostup = list(postup)
  // newpostup = [list(ele) for ele in newpostup]
  // # print(postup,"\n",negup)
  // test = {tuple(negup): tuple(postup)}

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
  /*
  print('\n\n\n\n\n')
  print("final nenegup" , newnegup)
  print("final postup" , newpostup)
   
  console.log("positives", positives)
  console.log("negatives", negatives)

  */
}
//prev
//Origional code here
/*
list_of_people = {
        'baba': 14,
        'neely': 14,
        'babi': 14,
        'victoria': 13,
        'penny': 13,
        'george': 2,
        "jacob": 9, 
        'rory': 11,
        'greg': 1,
        'tracey': 1,
        'john': 0,
        'gail': 0,
        'peggy': 6,
        'alexis': 11,
        'cyrus': 14,
        'michael': 8,
        'joanna': 14,
        'thea': 14,
        'derek': 14,
        'andrea': 14,
        'sofie': 12,
        'anneke': 1,
        'stevan': 13,
        'mika': 12
        }


families = [
    ['alexis', 'cyrus', 'michael', 'joanna'],
    ['sofie', 'mika', 'stevan', 'anneke'], 
    ['rory', 'jacob', 'greg', 'tracey'] ,
    ['thea', 'derek', 'andrea'],
    ['victoria', 'penny', 'george'],
    ['baba', 'babi'],
    ['john', 'gail'],
    ['peggy'],
    ['neely']
]

total_cost_array = [0,0,0,0,0,0,0,0,0]
total_days_array = [0,0,0,0,0,0,0,0,0]
ballo_total_days = 0
vandernoo_total_days = 0
skill_total_days = 0
trelstad_total_days = 0
pisunyer_total_days = 0
abbot_total_days = 0
john_total_days = 0
peggy_total_days = 0
neely_total_days = 0

for i in range(len(families)):
    for x in range(len(families[i])):
       # print("person" , families[i][x], " in ", families[i])
        total_days_array[i] += list_of_people[families[i][x]]




#people who paid
total_cost_array[3] = -694
total_cost_array[4] = -400
total_cost_array[5] = -400


total_days = sum(total_days_array)
total_cost = abs(sum(total_cost_array))
daily = total_cost / total_days


print('daily cost is: ', daily)



for i in range(len(families)):
    total_cost_array[i] = round((total_cost_array[i]) + (total_days_array[i] * daily))
    print("total cost for ", families[i] , " is ", total_cost_array[i])
    #add below part




# beginning of the price deal
positives = {}
negatives = {}
for i in range(len(total_cost_array)):
    if total_cost_array[i] >= 0:
        positives[str(families[i])] = total_cost_array[i]

    else:
        negatives[str(families[i])] = total_cost_array[i]

# print(positives)
# print("\n")
# print(negatives)

# print(positives.i\tems())
postup = [(k, v) for k, v in positives.items()]
negup = [(k, v) for k, v in negatives.items()]
newnegup = list(negup)
newnegup = [list(ele) for ele in newnegup]
newpostup = list(postup)
newpostup = [list(ele) for ele in newpostup]
# print(postup,"\n",negup)
test = {tuple(negup): tuple(postup)}
# print('\nthis is the full dict',test)
# print("\nthis is the group who deserves money: ", negup)
# print("\nthis is the group who owes money: ",postup)
# for neg,pos in test.items():
# print("neg", neg)
# print('pos', pos)

print("new negup", newnegup)
print("postup:", postup)
print('new postup', newpostup)

print('\n\n\n\n\n')
# opperation 1

for x in range(0,len(newnegup)):
    #newgroup[x][0]
    newnegup[x][0]


#for each fam that needs money
for a in range(0, len(newnegup)):

    #for each fam that needs to pay
    for x in range(0, (len(newpostup))):

        #if (fam to pay) needs to pay less that the (fam to recieve) and the (fam to pay) still has money to pay
        if (newpostup[x][1]) < abs((newnegup[a][1])) and (newpostup[x][1]) > 0:
            #(money recieving fam needs) = (previous needed money) - (payment from paying fam)
            newnegup[a][1] = newnegup[a][1] + newpostup[x][1]
            #log payment
            print(newpostup[x][0], " pay ", newnegup[a][0], ": ", newpostup[x][1])
            # reset the fams pay
            newpostup[x][1] = 0

#for each fam that still needs to pay
for y in range(0, len(newpostup)):
    #if still needs to pay up
    if newpostup[y][1] > 0:
        #print(newpostup[y][1])
        #for each fam to recieve...
        for z in range(0, len(newnegup)):
            #if still needs to recieve
            if abs(newnegup[z][1]) > 0:
                #left required payment = payment - amount paid to reciever 
                newpostup[y][1] = newpostup[y][1] + newnegup[z][1]
                print(newpostup[y][0], ' pay ', newnegup[z][0], ": ", abs(newnegup[z][1]))
                #reciever is now satisfied
                newnegup[z][1] = 0

    newpostup[y][1] = 0

print('\n\n\n\n\n')
print("final nenegup" , newnegup)
print("final postup" , newpostup)
#print(everyone_bct_money)
*/
