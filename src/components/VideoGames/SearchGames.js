import React, { useEffect, useState } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchGames = ({ userEntries, setUserEntries, current }) => {
    const [platforms, setPlatforms] = useState([])
    const [tags, setTags] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(
        () => {
            GameRepo.getAllPlatforms().then(setPlatforms)
                .then(() => {
                    if(current){
                        TagRepo.getTagsOnCurrent().then((res) => setTags(res.currentGameTags))
                    } else{
                        TagRepo.getTagsOnQueued().then((res) => setTags(res.queuedGameTags))
                    }
                })
                .then(() => setLoading(false))
        }, []
    )

    //check for parameter's value in chosenPlatforms. Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setTag = (id) => {
        const copy = { ...userEntries }
        copy.tags.has(id)
            ? copy.tags.delete(id)
            : copy.tags.add(id)
        setUserEntries(copy)
    }


    return (
        <>
            {
                isLoading
                    ? <div className="pb-2 mt-5 px-2"></div>
                    : <Form className="pb-2 mt-5 px-2 bg-secondary shadow-sm text-white sidebar" style={{ borderRadius: 20 }} inline>
                        <FormGroup className="pt-4">
                            <Label for="nameSearch">
                                Search by Title
                            </Label>
                            <Input
                                id="nameSearch"
                                type="search"
                                placeholder="Title contains..."
                                value={userEntries.name}
                                onChange={(event) => {
                                    const userEntriesCopy = { ...userEntries }
                                    userEntriesCopy.name = event.target.value
                                    setUserEntries(userEntriesCopy)
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="platformSelect">
                                Platform
                            </Label>
                            <Input
                                id="platformSelect"
                                name="select"
                                type="select"
                                value={userEntries.platform}
                                onChange={(event) => {
                                    const userEntriesCopy = { ...userEntries }
                                    userEntriesCopy.platform = event.target.value
                                    setUserEntries(userEntriesCopy)
                                }}
                            >
                                <option value="0"> Select one... </option>
                                {platforms.map(platform => {
                                    return <option value={platform.id} key={platform.id}>{platform.name}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="multiplayerSelect">
                                Multiplayer Capable
                            </Label>
                            <Input
                                id="multiplayerSelect"
                                name="select"
                                type="select"
                                value={userEntries.multiplayer}
                                onChange={(event) => {
                                    const copy = { ...userEntries }
                                    copy.multiplayer = event.target.value
                                    setUserEntries(copy)
                                }}
                            >
                                <option value=""> Select one... </option>
                                <option value="True"> Yes </option>
                                <option value="False"> No </option>

                            </Input>
                        </FormGroup>
                        <FormGroup >
                            <Label>
                                Tags
                            </Label>
                            <div>
                                {
                                    tags.length > 0
                                        ? tags.map(tag => {
                                            return <Button
                                                key={`tag--${tag.id}`}
                                                active={userEntries.tags.has(tag.id) ? true : false}
                                                color="checkbox"
                                                style={{ borderRadius: '20px' }}
                                                outline
                                                size="sm"
                                                className="mx-1 my-2 text-white"
                                                onClick={() => setTag(tag.id)}
                                            >
                                                {tag.tag}
                                            </Button>

                                        })
                                        : ""
                                }
                            </div>
                        </FormGroup>
                        <FormGroup className='row justify-content-center'>
                            <Button
                                onClick={() => {
                                    let userEntriesCopy = { ...userEntries }
                                    userEntriesCopy = {
                                        name: "",
                                        multiplayer: "",
                                        platform: "0",
                                        tags: new Set()
                                    }
                                    setUserEntries(userEntriesCopy)
                                }
                                }
                                color="info"
                                size="sm"
                                className="col-sm-9 col-md-7 col-lg-5 mt-2"
                            >
                                Clear Filters
                            </Button>
                        </FormGroup>
                    </Form>
            }
        </>
    )
}