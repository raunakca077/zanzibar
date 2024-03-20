const scores = [
    { c: '4,5,6', score: "Zanzibar" },
    { c: '1,1,1', score: "Triple Ones" },
    { c: '2,2,2', score: "Triple Twos" },
    { c: '3,3,3', score: "Triple Threes" },
    { c: '4,4,4', score: "Triple Fours" },
    { c: '5,5,5', score: "Triple Fives" },
    { c: '6,6,6', score: "Triple Sixes" },
    { c: '1,2,3', score: "One Two Three" },
  ];

  const points = { 1: 100, 6: 60, 2: 2, 3: 3, 4: 4, 5: 5 };

function calculate(arr)
{
  
    let sortedArr = arr.sort();
    const nw=sortedArr.toString();
    let scoreMatch;

    for(const i of scores)
    {
        if(i.c===nw) {scoreMatch=i.score;}
    }
    if(scoreMatch)return scoreMatch;
    else 
    {
        let sm=0;
        for(let x of sortedArr)
        sm+=points[x];
        return sm;
    }
  
}
export {calculate}