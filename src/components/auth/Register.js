import React, { useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"

export const Register = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const passwordDialog = useRef()
    const usernameDialog = useRef()
    const history = useHistory()

    const handleRegister = (e) => {
        e.preventDefault()

        if (password === password2) {
            const newUser = {
                "username": username,
                "first_name": firstName,
                "last_name": lastName,
                "password": password
            }

            return fetch("http://127.0.0.1:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newUser)
            })
                .then(res => res.json())
                .then(res => {
                    if ("token" in res) {
                        localStorage.setItem("trove_token", res.token)
                        history.push("/")
                    } else {
                        usernameDialog.current.showModal()
                    }
                })
        } else {
            passwordDialog.current.showModal()
        }
    }

    return (
        <main className="row justify-content-center my-5">
            <div className="my-5 p-5 col-9 gradient rounded border shadow-sm">
                <dialog className="border-0" ref={passwordDialog}>
                    <div className="d-flex flex-column">
                        <div>
                            <Button close onClick={e => passwordDialog.current.close()} color="info" className="float-end" />
                        </div>
                        <div className="m-4 pb-3">Passwords do not match</div>
                    </div>
                </dialog>
                <dialog className="border-0" ref={usernameDialog}>
                    <div className="d-flex flex-column">
                        <div>
                            <Button close onClick={e => usernameDialog.current.close()} color="info" className="float-end" />
                        </div>
                        <div className="m-4 pb-3">Username is not available</div>
                    </div>
                </dialog>

                <Form onSubmit={handleRegister}>
                    <h1 className="pt-4">Trove</h1>
                    <h5 className="pt-4">Register for an Account</h5>
                    <FormGroup className="pt-3">
                        <Label htmlFor="InputFirstName"> First Name </Label>
                        <Input onChange={evt => setFirstName(evt.target.value)} type="firstName" id="firstName" className="form-control" placeholder="First Name" required autoFocus />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Label htmlFor="InputLastName"> Last Name </Label>
                        <Input onChange={evt => setLastName(evt.target.value)} type="lastName" id="lastName" className="form-control" placeholder="Last Name" required autoFocus />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Label htmlFor="InputUsername"> Username </Label>
                        <Input onChange={evt => setUsername(evt.target.value)} type="username" id="username" className="form-control" placeholder="Username" required autoFocus />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Label htmlFor="InputPassword"> Password </Label>
                        <Input onChange={evt => setPassword(evt.target.value)} type="password" id="password" className="form-control" placeholder="Password" required />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <label htmlFor="verifyPassword"> Verify Password </label>
                        <input onChange={evt => setPassword2(evt.target.value)} type="password" name="verifyPassword" className="form-control" placeholder="Verify password" required />
                    </FormGroup>
                    <FormGroup className="pt-3" >
                        <Button color="info" type="submit">Register</Button>
                    </FormGroup>
                </Form>

                <section className="pt-3">
                    Already registered? <Link to="/login">Login</Link>
                </section>
            </div>
        </main>
    )
}