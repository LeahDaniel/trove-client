import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Trove } from "./components/Trove"
// import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/custom.scss'
import "./index.css"

ReactDOM.render(
    <BrowserRouter>
        <Trove />
    </BrowserRouter>,
    document.getElementById("root")
)