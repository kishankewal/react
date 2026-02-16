import { useState } from "react";

// useState return an array of [ valueYouGaveInUseState,  setterMethod to change the value]
// useState only updates its values after lifecycle is finished
// useState works like {
// 1. you change the value. useState marks it to react and ask react to re render the value
// 2. stateValue will only be changed after the current component life cycle is finished
// }


const UseState = () => {
    const [ name, setName ] = useState<string>('');
    const [ count, setCount ] = useState<number>(0);
    // setCount(count + 1);
    // setCount(count + 1);
    function addCount(){
        setCount(count + 1);
    }

    return(
        <div>
            {/* { name }
            <div>
                <input type="text" placeholder="Type here to see magic.." value={name} onChange={(e) => setName(e.target.value)}/>
            </div> */}
            <button onClick={() => addCount()}>Count++ {count}</button>

        </div>
    )
}
export default UseState;