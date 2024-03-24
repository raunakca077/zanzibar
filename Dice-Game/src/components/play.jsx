import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Chat } from "./chat";
import { Dice } from "./dice";
import ZanzibarRules from "./ZanzibarRules"
import {calculate,chipTransfer} from "../utils/scoreCal"
import cook from "universal-cookie";


const cki=new cook()


export const Play = ({ players, sum, setAuth }) => {
  const [isTurn, setTurn] = useState(true);
  const [res, setRes] = useState(false);
  const [isStart, setStart] = useState(false);
  const [rolledDice, setRoll] = useState([0, 0, 0]);
  const [skt, setSkt] = useState(null);
  // const chips = 15;
  const [winner,setWinner]=useState("");
  const [chipsArr,setChipsArr]=useState([]);
  const [pts,setPts]=useState({rank:0,score:""});
  const [lastPoints,setlastPoints]=useState("");

  useEffect(() => {
    const socket = io("http://localhost:3077");
    setSkt(socket);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("start", (data) => {
      setStart(true);
      setRes(false)
      
    });

    socket.on("newPts", (data) => {
      // console.log(data)
      setPts({rank:data.rank,score:data.score});
    });

    const checkWinner=(data)=>
  {
    
    
    if(pts.rank==0)
      {
        let val=calculate(data);
        setlastPoints(val.score)
        socket.emit("setPoints",val)
      }
     else{
      let p1=pts;
      let prevPoint=pts.rank;
      // console.log(pts)
      let p2=calculate(data);
      let newPoint=p2.rank;
      // console.log("hii")
      setlastPoints(p2.score)
      if(prevPoint<newPoint)
      {
        const temp=[{chips:chipsArr[0].chips - chipTransfer(p1.score) ,name:chipsArr[0].name},chipsArr[1]]
        setChipsArr(temp)
       
        if(chipsArr[0].chips<=1)
        {
          setRes(true);
          setWinner(chipsArr[0].name)
          
          setTimeout(() => {
            setChipsArr([])
            setStart(false)
          }, 5000);  
          
        }
      }
  
      else if(prevPoint>newPoint)
      {
        
        const temp=[chipsArr[0],{chips:chipsArr[1].chips - chipTransfer(pts.score) ,name:chipsArr[1].name}]
        setChipsArr(temp)
        
        if(chipsArr[1].chips<=1)
        {
          setRes(true);
          setWinner(chipsArr[1].name)
          setTimeout(() => {
            setChipsArr([])
            setStart(false)
          }, 5000);  
          
        }
      }
      socket.emit("setPoints",{rank:0,score:""})

  
     }
    //  console.log(pts)
  }


    socket.on("rolledNo", (data)=>
    {
      setRoll(rolledDice=>{return data});
      checkWinner(data)
    })

    socket.on("turn", (data) => {
      // console.log("Turn:", data);
      setTurn(data);
    });

    socket.on("updatedChips", (data) => {
      setChipsArr(chipsArr=>[...chipsArr,data]);        //ye itna simply nai hoga bro
    });

    return () => {
      socket.disconnect();
    };
  }, [pts,]);

  
  const logout = () => {
    setAuth(false);
  };

  // const fun = (gotSum) => setRes(gotSum);

  const startGame = () => {
    skt.emit("start", 1);
    skt.emit("chips",{chips:5,name:cki.cookies.name});

  };

  const roll = () => {
    let gotSum = 0;
    const arr = [];
    for (let i = 0; i < players; i++) {
      arr.push(Math.round(Math.random() * 5) + 1);
      gotSum += arr[i];
    }
    // fun(gotSum);
    skt.emit("rolled", arr);
    
  };

let dist=0

  if (isStart) {
    return (
      <div className="grid grid-rows-8 ">
        <span className="flex items-center justify-center bg-gradient-to-r from-green-300 to-blue-350 rounded-lg py-2 px-4 mb-2">
            <span
              className={`text-5xl font-extrabold  ${
                res === true ? "text-green-200 text-dark winner-name" : "text-white"
              }`}
            >
              {res === true ? `${winner} WINS !!` : "Keep Playing..."}
            </span>
           
          </span>

          <div className="flex items-center justify-center bg-gradient-to-r from-red-300 to-purple-350 rounded-lg py-2 px-4 mb-2">
          <span
            className={`text-3xl font-extrabold text-white  `}
          >
            {`last roll was : ${lastPoints}`}
          </span>
        </div>

          <div className="flex flex-columns">
            {
              chipsArr.map((i)=>
              {
                return <div className={`design1 absolute right-0 mt-${dist+=40} mr-4 flex `}><span>{i.name}</span><span className="ml-20 mt-1 text-6xl">{i.chips}</span></div>
              }) 
            }
{/* {     
     (chipsArr.length > 1)?(<div className="design1 absolute right-0 mt-40 mr-4 flex "><span >{chipsArr[1].name}</span><span className="ml-20 mt-1 text-6xl">{chipsArr[1].chips}</span></div>):(<div></div>)
} */}

          {/* <div className="design1 fixed right-0 mt-40 mr-4 flex"><span >{name}</span><span className="ml-20 mt-1 text-6xl">{chips}</span></div> */}
            </div>
          


        <br />
        <div className="flex justify-between">
          <Dice arr={rolledDice} skt={skt} />
          <Chat skt={skt} />

          <br />
          <br />

          {isTurn ? (
            <button
              className="text-white h-10 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={() => roll()}
            >
              Hold
            </button>
          ) : (
            <div className="design1">Other Player's Turn</div>
          )}
        </div>{" "}
        <br />
        <br />
        <button
            className="text-white w-64 h-16 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-lg px-5 py-2.5 mt-2"
            onClick={() => logout()}
          >
            LOGOUT
          </button>{" "}
        {/*mazze ke liye simply onClick={logout v likh sakte thee}*/}
      </div>
    );
  } else {
    return (<>
      <button onClick={startGame}  className="bg-orange-500 hover:bg-orange-600 text-white h-20  font-bold py-1 px-4 rounded w-24 mx-auto my-auto p-8"
>
        START
      </button>
        <ZanzibarRules/>
      </>
    );
  }
};
