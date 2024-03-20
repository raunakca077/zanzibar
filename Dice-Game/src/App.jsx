import { Play } from "./components/play";
import {Signup} from "./components/signup";
import {Login} from "./components/login"

import Game from "./components/game"
import cook from "universal-cookie"
import { useState,useEffect } from "react";

function App()
{
    const [isReg,setReg]=useState(false)

  const [isAuth,setAuth]=useState(false);
return <div className="flex justify-between bg-[url('./assets/bg.png')] bg-cover bg-center">
  
  {(isAuth)?(<>
  {/* <Game/> */}
  <Play players={3} sum={7} setAuth={setAuth}/>
  </>):(<div className="w-screen">

  {isReg&&<Signup setAuth={setAuth}/>}
  {!isReg&&<Login setAuth={setAuth} setReg={setReg}/>}
  </div>

)
  }

</div>
}



export default App;