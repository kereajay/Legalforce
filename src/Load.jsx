import React from "react";
import logo from "./assets/download.png";

function Load() {
    return (
        <div>
            <div
                className="loader border-t-2 rounded-full border-blue-500 bg-blue-300 animate-spin
           aspect-square w-16 flex justify-center items-center "
            >
                <img src={logo} alt=""  />
            </div>
        </div>
    );
}

export default Load;
