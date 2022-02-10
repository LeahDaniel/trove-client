import React, { useState, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'
import { SocialRepo } from "../../repositories/SocialRepo"

export const ShowForm = () => {
    const history = useHistory()
    const { showId } = useParams()
    const [presentShow, setPresentShow] = useState(null)
    const [streamingServices, setStreamingServices] = useState([])
    const [tags, setTags] = useState([])
    const [firstAttempt, setFirstAttempt] = useState(true)
    const [alert, setAlert] = useState(false)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        streamingService: 0,
        tagArray: []
    })
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        streaming: true,
    })


    useEffect(
        () => {
            //on page load, GET streaming services and tags
            TagRepo.getAll().then(setTags)
            ShowRepo.getAllStreamingServices().then(setStreamingServices)
        }, []
    )

    useEffect(() => {
        if (showId) {
            SocialRepo.getCurrentUser()
                .then(currentUser => {
                    ShowRepo.get(parseInt(showId))
                        .then(show => {
                            if (show.tags) {
                                //change name, current, and multiplayer values based on presentShow values
                                const obj = {
                                    name: show.name,
                                    current: show.current,
                                    streamingService: show.streaming_service.id,
                                    tagArray: []
                                }

                                //create a tag array from the show's associated taggedShows, and set as userChoices.tagArray value
                                let tagArray = []
                                for (const tag of show.tags) {
                                    tagArray.push({ label: tag.tag, value: tag.id })
                                }
                                obj.tagArray = tagArray

                                //set user choices using the obj constructed above
                                setUserChoices(obj)
                            }

                            if (currentUser.id === show.user.id) {
                                setPresentShow(show)
                            }
                        })
                })
        }

    }, [showId])

    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            const obj = {
                name: false,
                streaming: false,
                current: false
            }
            //name
            if (userChoices.name === "") {
                obj.name = true
            }
            //multiplayer
            if (userChoices.streamingService === 0) {
                obj.streaming = true
            }
            //current
            if (userChoices.current === null) {
                obj.current = true
            }

            setInvalid(obj)
        }, [userChoices]
    )

    const submitShow = () => {
        let tagIdArray = []
        let promiseArray = []

        for (const enteredTag of userChoices.tagArray) {
            if (enteredTag.__isNew__) {
                //post a new tag object with that enteredTag
                promiseArray.push(
                    TagRepo.addTag({ tag: enteredTag.value })
                        .then((res) => tagIdArray.push(res.id))
                )
            } else {
                tagIdArray.push(enteredTag.value)
            }
        }

        const showFromUserChoices = {
            name: userChoices.name,
            current: userChoices.current,
            streaming_service: userChoices.streamingService,
            tags: tagIdArray,
        }

        Promise.all(promiseArray)
            .then(() => {
                if (presentShow) {
                    ShowRepo.modifyShow(showFromUserChoices, presentShow.id)
                } else {
                    ShowRepo.addShow(showFromUserChoices)
                }
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/shows/current")
                } else {
                    history.push("/shows/queue")
                }
            })
    }


    return (
        <div className="row justify-content-center my-4">
            <Form className="my-4 p-5 col-9 gradient rounded border">
                {
                    presentShow
                        ? <h3> Edit a Show</h3>
                        : <h3> Add a New Show</h3>
                }
                <FormGroup className="mt-4">
                    <Label for="showTitle">
                        Show Title
                    </Label>
                    <Input
                        id="showTitle"
                        name="title"
                        //if this is not the first attempt at filling out the form, allow the 
                        //input to be marked as invalid (if the invalid state is true)
                        //Otherwise, do not mark field as invalid
                        invalid={!firstAttempt ? invalid.name : false}
                        //set value based on userChoices to allow form to pre-populate if user was pushed to form from edit button
                        //and so that the displayed entry changes as the user edits it (because of onChange)
                        value={userChoices.name}
                        //on change on field, set userChoices
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.name = event.target.value
                            setUserChoices(copy)
                        }}
                        className="mb-2"
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Genre Tags</Label>
                    <CreatableSelect
                        isMulti
                        isClearable
                        value={userChoices.tagArray}
                        options={
                            tags.map(tag => ({ label: tag.tag, value: tag.id }))
                        }
                        onChange={optionChoices => {
                            const copy = { ...userChoices }
                            copy.tagArray = optionChoices
                            setUserChoices(copy)
                        }}
                        id="tagSelect"
                        placeholder="Select or create tags..."
                    />
                </FormGroup>
                {
                    presentShow?.tagArray?.length > 0
                        ? <Alert color="success" style={{ fontSize: 15 }} className="p-2 border rounded-0">The user who recommended this used the tags: {presentShow.tagArray.join(", ")}</Alert>
                        : ""
                }
                <FormGroup>
                    <Label for="exampleSelect">
                        Streaming Service
                    </Label>
                    <Input
                        id="currentSelect"
                        type="select"
                        invalid={!firstAttempt ? invalid.streaming : false}
                        value={userChoices.streamingService}
                        onChange={(event) => {
                            const copy = { ...userChoices }
                            copy.streamingService = parseInt(event.target.value)
                            setUserChoices(copy)
                        }}
                    >
                        <option value="0">
                            Choose an option...
                        </option>
                        {
                            streamingServices.map(service => {
                                return <option value={service.id} key={service.id}>
                                    {service.service}
                                </option>
                            })

                        }
                    </Input>
                    <FormText>
                        Select the service you are currently watching the show on.
                    </FormText>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleSelect">
                        Current or Queued?
                    </Label>
                    <Input
                        id="currentSelect"
                        type="select"
                        invalid={!firstAttempt ? invalid.current : false}
                        value={userChoices.current === null
                            ? "Choose an option..."
                            : userChoices.current === true
                                ? "Current"
                                : "Queued"
                        }
                        onChange={(event) => {
                            const copy = { ...userChoices }

                            if (event.target.value === "Current") {
                                copy.current = true
                            } else if (event.target.value === "Queued") {
                                copy.current = false
                            } else {
                                copy.current = null
                            }
                            setUserChoices(copy)
                        }
                        }
                    >
                        <option>
                            Choose an option...
                        </option>
                        <option>
                            Current
                        </option>
                        <option>
                            Queued
                        </option>
                    </Input>
                    <FormText className="mb-2">
                        Have you started this show (current) or are you thinking of watching it in the future (queued)?
                    </FormText>
                </FormGroup>
                {
                    alert && presentShow
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields. If you have no edits, click "Cancel".
                            </Alert>
                        </div>
                        : alert && !presentShow
                            ? <div>
                                <Alert
                                    color="danger"
                                >
                                    Please complete all required (!) fields before submitting.
                                </Alert>
                            </div>
                            : ""
                }
                <FormGroup>
                    <Button color="info" onClick={(evt) => {
                        evt.preventDefault()

                        setFirstAttempt(false)

                        //check if every key on the "invalid" object is false
                        if (Object.keys(invalid).every(key => invalid[key] === false)) {
                            submitShow()
                        } else {
                            setAlert(true)
                        }
                    }}>
                        Submit
                    </Button>
                    <Button color="info" className="ms-3" onClick={() => { history.goBack() }} >
                        Cancel
                    </Button>
                </FormGroup>
            </Form >
        </div>
    )
}