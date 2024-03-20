import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Chat } from "./chat";
import { Dice } from "./dice";
import ZanzibarRules from "./ZanzibarRules"
import {calculate} from "../utils/scoreCal"

export const Play = ({ players, sum, setAuth }) => {
  const [isTurn, setTurn] = useState(true);
  const [res, setRes] = useState(false);
  const [isStart, setStart] = useState(false);
  const [rolledDice, setRoll] = useState([0, 0, 0]);
  const [skt, setSkt] = useState(null);

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
    });

    socket.on("rolledNo", (data) => {
      setRoll(data);
    });

    socket.on("turn", (data) => {
      console.log("Turn:", data);
      setTurn(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const logout = () => {
    setAuth(false);
  };

  const fun = (gotSum) => setRes(gotSum);

  const startGame = () => {
    skt.emit("start", 1);
  };

  const roll = () => {
    let gotSum = 0;
    const arr = [];
    for (let i = 0; i < players; i++) {
      arr.push(Math.round(Math.random() * 5) + 1);
      gotSum += arr[i];
    }
    fun(gotSum);
    skt.emit("rolled", arr);
   let ans=calculate(arr);
   console.log(ans);
  };

  if (isStart) {
    return (
      <div className="grid grid-rows-8 ">
        <span className="flex items-center justify-center bg-gradient-to-r from-green-300 to-blue-350 rounded-lg py-2 px-4 mb-2">
            <span
              className={`text-5xl font-extrabold ${
                res === sum ? "text-green-200" : "text-white"
              }`}
            >
              {res === sum ? "YOU WIN!" : "Keep Playing..."}
            </span>
          </span>


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
