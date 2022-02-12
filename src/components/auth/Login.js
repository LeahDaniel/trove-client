import React, { useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label, UncontrolledAlert } from "reactstrap"


export const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const invalidDialog = useRef()
    const history = useHistory()

    const handleLogin = (e) => {
        e.preventDefault()

        return fetch("http://127.0.0.1:8000/login", {
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
                    invalidDialog.current.showModal()
                }
            })
    }

    return (
        <main className="row justify-content-center my-5">
            <UncontrolledAlert
                    className="shadow-sm text-black p-4 col-9 "
                    color="danger">
                        <p>Thank you for demoing my site! To start with pre-made user data, use the following login:</p>
                        <p>Username: mitch</p>
                        <p>Password: me</p>
                        <p>You may also register a new account, but please use a fake password, such as "password"</p>
                </UncontrolledAlert>

            <div className="my-5 p-5 col-9 gradient rounded border shadow-sm">
                <dialog className="border-0" ref={invalidDialog}>
                    <div className="d-flex flex-column">
                        <div>
                            <Button className="float-end" close onClick={e => invalidDialog.current.close()}></Button>
                        </div>
                        <div className="m-4 pb-3">Username or password was not valid.</div>
                    </div>
                </dialog>

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
