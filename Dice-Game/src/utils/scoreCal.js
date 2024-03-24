const scores = [
    { c: '4,5,6', score: "Zanzibar",rank:1 },
    { c: '1,1,1', score: "Triple Ones",rank:2},
    { c: '2,2,2', score: "Triple Twos" ,rank:3},
    { c: '3,3,3', score: "Triple Threes",rank:4 },
    { c: '4,4,4', score: "Triple Fours",rank:5 },
    { c: '5,5,5', score: "Triple Fives",rank:6 },
    { c: '6,6,6', score: "Triple Sixes" ,rank:7},
    { c: '1,2,3', score: "One Two Three",rank:8},
  ];

  const points = { 1: 100, 6: 60, 2: 2, 3: 3, 4: 4, 5: 5 };

function calculate(arr)
{
  
    let sortedArr = arr.sort();
    const nw=sortedArr.toString();

    for(const i of scores)
    {
        if(i.c===nw) {return {score:i.score,rank:i.rank};}
    }
   
        let sm=0;
        for(let x of sortedArr)
        sm+=points[x];
        return {score:sm,rank:-1*sm};
  
}

function chipTransfer(score) {
    if (typeof score === "number") {
      return 1;
    } else if (score === "One Two Three") {
      return 2;
    } else if (score.startsWith("Triple")) {
      return 3;
    } else if (score === "Zanzibar") {
      return 4;
    }
  }

export {calculate,chipTransfer}