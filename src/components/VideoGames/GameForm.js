import React, { useState, useEffect } from "react"
import { useHistory, useLocation, useParams } from "react-router"
import { Alert, Button, Form, FormGroup, FormText, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"
import CreatableSelect from 'react-select/creatable'
import { SocialRepo } from "../../repositories/SocialRepo"

export const GameForm = () => {
    const history = useHistory()
    const { gameId } = useParams()
    const [presentGame, setPresentGame] = useState(null)
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const [firstAttempt, setFirstAttempt] = useState(true)
    const [alert, setAlert] = useState(false)
    const [userChoices, setUserChoices] = useState({
        name: "",
        current: null,
        multiplayerCapable: null,
        chosenPlatforms: new Set(),
        tagArray: []
    })
    const [invalid, setInvalid] = useState({
        name: true,
        current: true,
        multiplayer: true,
        multiPlatforms: true,
        singlePlatform: true,
    })


    useEffect(
        () => {
            //on page load, GET platforms and tags
            GameRepo.getAllPlatforms().then(setPlatforms)
            TagRepo.getAll().then(setTags)
            
        }, []
    )

    useEffect(
        () => {
            if(gameId){
                SocialRepo.getCurrentUser()
                    .then(currentUser => {
                        GameRepo.get(parseInt(gameId))
                            .then(game => {
                                if(game.tags && game.platforms){
                                    const obj = {
                                        name: game.name,
                                        current: game.current,
                                        multiplayerCapable: game.multiplayer_capable,
                                        chosenPlatforms: new Set(),
                                        tagArray: []
                                    }
                                    //create a tag array from the game's associated taggedGames, and set as userChoices.tagArray value
                        
                                    let tagArray = []
                                    for (const tag of game.tags) {
                                        tagArray.push({ label: tag.tag, value: tag.id })
                                    }
                                    obj.tagArray = tagArray
                        
                                    //if a queued game (more than one platform possible), create a Set of platformIds from the game's associated gamePlatforms, and set as chosenPlatforms value
                                    let chosenPlatforms = new Set()
                                    for (const platform of game.platforms) {
                                        chosenPlatforms.add(platform.id)
                                    }
                                    obj.chosenPlatforms = chosenPlatforms
                        
                                    //set user choices using the obj constructed above
                                    setUserChoices(obj)
                                }
    
                                if(currentUser.id === game.user.id){
                                    setPresentGame(game)
                                } 
                            })
                    })

            }
        }, [gameId]
    )

    useEffect(
        () => {
            //when userChoices change (as the user interacts with form), setInvalid state so that it is always up-to-date before form submit
            const obj = {
                name: false,
                multiplayer: false,
                current: false,
                singlePlatform: false,
                multiPlatforms: false
            }

            //name
            if (userChoices.name === "") {
                obj.name = true
            }
            //multiplayer
            if (userChoices.multiplayerCapable === null) {
                obj.multiplayer = true
            }
            //current
            if (userChoices.current === null) {
                obj.current = true
            }
            //single and multi platform
            if (userChoices.chosenPlatforms?.size === 0) {
                obj.singlePlatform = true
                obj.multiPlatforms = true
            }

            setInvalid(obj)

        }, [userChoices]
    )

    //check for parameter's value in chosenPlatforms. Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setPlatform = (id) => {
        const copy = { ...userChoices }
        copy.chosenPlatforms.has(id)
            ? copy.chosenPlatforms.delete(id)
            : copy.chosenPlatforms.add(parseInt(id))
        setUserChoices(copy)
    }

    // Then, PUT operation to games based on userChoices.
    //Then, POST operations to tags, taggedGames, and gamePlatforms using the 
    //constructTags and constructGamePlatforms functions, with the edited game's id as an argument
    //Then, push user to current or queued based on if current on game is true or false
    const submitGame = () => {
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

        const gameFromUserChoices = {
            name: userChoices.name,
            current: userChoices.current,
            multiplayer_capable: userChoices.multiplayerCapable,
            tags: tagIdArray,
            platforms: Array.from(userChoices.chosenPlatforms)
        }

        Promise.all(promiseArray)
            .then(() => {
                if(presentGame){
                    GameRepo.modifyGame(gameFromUserChoices, presentGame.id)
                } else {
                    GameRepo.addGame(gameFromUserChoices)
                }
            })
            .then(() => {
                if (userChoices.current === true) {
                    history.push("/games/current")
                } else {
                    history.push("/games/queue")
                }
            })
    }


    return (
        <div className="row justify-content-center my-4">
            <Form className="my-4 p-5 col-9 gradient rounded border">
                {
                    presentGame
                        ? <h3> Edit a Game</h3>
                        : <h3> Add a New Game</h3>
                }
                <FormGroup className="mt-4">
                    <Label for="gameTitle">
                        Game Title
                    </Label>
                    <Input
                        id="gameTitle"
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
                    presentGame?.tagArray?.length > 0
                        ? <Alert color="success" style={{ fontSize: 15 }} className="p-2 border rounded-0">The user who recommended this used the tags: {presentGame.tagArray.join(", ")}</Alert>
                        : ""
                }
                <FormGroup>
                    <Label for="multiplayerSelect">
                        Multiplayer Capable?
                    </Label>
                    <Input
                        id="multiplayerSelect"
                        type="select"
                        invalid={!firstAttempt ? invalid.multiplayer : false}
                        value={userChoices.multiplayerCapable === null
                            ? "Choose an option..."
                            : userChoices.multiplayerCapable === true
                                ? "Yes"
                                : "No"
                        }
                        onChange={(event) => {
                            const copy = { ...userChoices }

                            if (event.target.value === "Yes") {
                                copy.multiplayerCapable = true
                            } else if (event.target.value === "No") {
                                copy.multiplayerCapable = false
                            } else {
                                copy.multiplayerCapable = null
                            }
                            setUserChoices(copy)
                        }
                        }
                    >
                        <option>
                            Choose an option...
                        </option>
                        <option>
                            Yes
                        </option>
                        <option>
                            No
                        </option>
                    </Input>
                    <FormText className="mb-2">
                        Does this game have an option for multiplayer (online or local)?
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
                                copy.chosenPlatforms.clear()
                            } else if (event.target.value === "Queued") {
                                copy.current = false
                            } else {
                                copy.current = null
                                copy.chosenPlatforms.clear()
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
                        Have you started this game (current) or are you thinking of playing it in the future (queued)?
                    </FormText>
                </FormGroup>
                {
                    userChoices.current === null ? "" :
                        userChoices.current === true
                            ? <FormGroup>
                                <Label for="exampleSelect">
                                    Platform
                                </Label>
                                <Input
                                    id="currentSelect"
                                    type="select"
                                    invalid={!firstAttempt ? invalid.singlePlatform : false}
                                    value={(Array.from(userChoices.chosenPlatforms))[0]}
                                    onChange={(event) => {
                                        const copy = { ...userChoices }
                                        copy.chosenPlatforms.clear()
                                        setUserChoices(copy)
                                        setPlatform(event.target.value)
                                    }}
                                >
                                    <option value="0">
                                        Choose an option...
                                    </option>
                                    {
                                        platforms.map(platform => {
                                            return <option value={platform.id} key={platform.id}>
                                                {platform.name}
                                            </option>
                                        })

                                    }
                                </Input>
                                <FormText>
                                    Select the platform you are currently playing the game on.
                                </FormText>
                            </FormGroup>
                            : <FormGroup

                                tag="fieldset"
                            >
                                <Label>
                                    Platforms
                                </Label>
                                {
                                    platforms.map(platform => {
                                        return <FormGroup key={`platform--${platform.id}`} check>
                                            <Input
                                                className="platformCheckbox"
                                                type="checkbox"
                                                invalid={!firstAttempt ? invalid.multiPlatforms : false}
                                                checked={userChoices.chosenPlatforms.has(platform.id) ? true : false}
                                                onChange={() => {
                                                    setPlatform(platform.id)
                                                }}
                                            />
                                            <Label check>
                                                {platform.name}
                                            </Label>
                                        </FormGroup>
                                    })
                                }
                                <FormText>
                                    Select each platform the game is available on and you own.
                                </FormText>
                            </FormGroup>
                }
                {
                    alert && presentGame
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                Please complete all required (!) fields. If you have no edits, click "Cancel".
                            </Alert>
                        </div>
                        : alert && !presentGame
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
                            submitGame()
                        } else {
                            setAlert(true)
                        }
                    }}>
                        Submit
                    </Button>
                    <Button color="info" onClick={() => { history.goBack() }} className="ms-3">
                        Cancel
                    </Button>
                </FormGroup>
            </Form >
        </div>
    )
}