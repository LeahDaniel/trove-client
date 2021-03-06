import React, { useEffect, useState } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { ShowRepo } from "../../repositories/ShowRepo"
import { TagRepo } from "../../repositories/TagRepo"

export const SearchShows = ({ userEntries, setUserEntries, current }) => {
    const [tags, setTags] = useState([])
    const [streamingServices, setStreamingServices] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(
        () => {
            ShowRepo.getAllStreamingServices().then(setStreamingServices)
                .then(() => {
                    if (current) {
                        TagRepo.getTagsOnCurrent().then((res) => setTags(res.currentShowTags))
                    } else{
                        TagRepo.getTagsOnQueued().then((res) => setTags(res.queuedShowTags))
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
                    : <Form className="pb-2 mt-5 px-2 bg-secondary sidebar shadow-sm text-white" style={{ borderRadius: 20 }} inline>
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
                                Streaming Service
                            </Label>
                            <Input
                                id="platformSelect"
                                name="select"
                                type="select"
                                value={userEntries.service}
                                onChange={(event) => {
                                    const userEntriesCopy = { ...userEntries }
                                    userEntriesCopy.service = event.target.value
                                    setUserEntries(userEntriesCopy)
                                }}
                            >
                                <option value="0"> Select one... </option>
                                {
                                    streamingServices.map(service => {
                                        return <option key={service.id} value={service.id}>{service.service} </option>
                                    })
                                }

                            </Input>
                        </FormGroup>
                        <FormGroup>
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
                                        service: "0",
                                        tags: new Set()
                                    }
                                    setUserEntries(userEntriesCopy)
                                }
                                }
                                color="info"
                                className="col-sm-9 col-md-7 col-lg-5 mt-2"
                                size="sm"
                            >
                                Clear Filters
                            </Button>
                        </FormGroup>
                    </Form>
            }
        </>
    )
}