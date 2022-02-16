import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label, Modal } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"

export const Register = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [openPassword, setOpenPassword] = useState(false)
    const [openUsername, setOpenUsername] = useState(false)
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

            return fetch("https://trove-server.herokuapp.com/register", {
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
                        TagRepo.seedTags(res.token)
                        history.push("/")
                    } else {
                        setOpenUsername(true)
                    }
                })
        } else {
            setOpenPassword(true)
        }
    }

    return (
        <main className="row justify-content-center my-5">
            <div className="my-5 p-5 col-9 gradient rounded border shadow-sm">
                <Modal isOpen={openPassword === true ? true : false}>
                    <div className="d-flex flex-column">
                        <div>
                            <Button close onClick={e => setOpenPassword(false)} color="info" className="float-end" />
                        </div>
                        <div className="m-4 pb-3">Passwords do not match</div>
                    </div>
                </Modal>
                <Modal isOpen={openUsername === true ? true : false}>
                    <div className="d-flex flex-column">
                        <div>
                            <Button close onClick={e => setOpenUsername(false)} color="info" className="float-end" />
                        </div>
                        <div className="m-4 pb-3">Username is not available</div>
                    </div>
                </Modal>

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