import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label, Modal, UncontrolledAlert } from "reactstrap"


export const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [openBoolean, setOpenBoolean] = useState(false)
    const history = useHistory()

    const handleLogin = (evt) => {
        evt.preventDefault()

        return fetch("https://trove-server.herokuapp.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
            .then(res => res.json())
            .then(res => {
                if ("valid" in res && res.valid && "token" in res) {
                    localStorage.setItem("trove_token", res.token)
                    history.push("/")
                }
                else {
                    setOpenBoolean(true)
                }
            })
    }

    return (
        <main className="row justify-content-center my-5">
            <div className="my-5 p-5 col-9 gradient rounded border shadow-sm">
                <Modal isOpen={openBoolean === true ? true : false} centered>
                    <div className="d-flex flex-column">
                        <div>
                            <Button className="float-end" close onClick={e => setOpenBoolean(false)}></Button>
                        </div>
                        <div className="m-4 pb-3">Username or password was not valid.</div>
                    </div>
                </Modal>

                <Form onSubmit={handleLogin}>
                    <h1 className="pt-4">Trove</h1>
                    <h5 className="pt-4">Please Sign In</h5>
                    <FormGroup className="pt-3">
                        <Label htmlFor="InputUsername"> Username </Label>
                        <Input onChange={evt => setUsername(evt.target.value)} type="username" id="username" className="form-control" placeholder="Username" required autoFocus />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Label htmlFor="InputPassword"> Password </Label>
                        <Input onChange={evt => setPassword(evt.target.value)} type="password" id="password" className="form-control" placeholder="Password" required />
                    </FormGroup>
                    <FormGroup className="pt-3" >
                        <Button color="info" type="submit">Sign In</Button>
                    </FormGroup>
                </Form>

                <section className="pt-3">
                    <Link to="/register">Not a member yet?</Link>
                </section>
            </div>
        </main>
    )
}
