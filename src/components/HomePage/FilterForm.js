import { useState, useEffect } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"

export const FilterForm = ({ userEntries, setUserEntries }) => {
    const [tags, setTags] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(
        () => {
            TagRepo.getTagsOnAny().then(setTags)
                .then(() => setIsLoading(false))
        }, []
    )

    //check for parameter's value in userEntries.tags Delete if it exists (representing unchecking a box), add it if it doesn't (checking a box)
    const setTag = (id) => {
        const copy = { ...userEntries }
        copy.tags.has(id)
            ? copy.tags.delete(id)
            : copy.tags.add(id)
        setUserEntries(copy)
    }

    return (
        <div className="col-3 text-white">
            {
                isLoading
                    ? ""
                    : <Form className="pb-2 mt-5 px-3 bg-secondary shadow-sm" style={{ borderRadius: 20 }} inline>

                        <h5 className="text-center pt-5 pb-4">Filters</h5>

                        <FormGroup>
                            <Label for="titleSearch">
                                Search by Title
                            </Label>
                            <Input
                                id="titleSearch"
                                type="search"
                                placeholder="Title contains..."
                                value={userEntries.title}
                                onChange={(event) => {
                                    const userEntriesCopy = { ...userEntries }
                                    userEntriesCopy.title = event.target.value
                                    setUserEntries(userEntriesCopy)
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="currentSelect">
                                Current or Queued?
                            </Label>
                            <Input
                                id="currentSelect"
                                name="select"
                                type="select"
                                value={userEntries.current}
                                onChange={(event) => {
                                    const copy = { ...userEntries }
                                    copy.current = event.target.value
                                    setUserEntries(copy)
                                }}
                            >
                                <option value=""> Select one... </option>
                                <option value="True"> Current </option>
                                <option value="False"> Queued </option>

                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Tags
                            </Label>
                            <div className="d-flex flex-row flex-wrap justify-content-start">
                                {
                                    tags.length > 0
                                        ? tags.map(tag => {
                                            return <Button
                                                key={`tag--${tag.id}`}
                                                active={userEntries.tags.has(tag.id) ? true : false}
                                                color="checkbox"
                                                style={{ borderRadius: '20px', fontWeight: 500 }}
                                                outline
                                                size="sm"
                                                className="mx-1 my-2 text-truncate text-white"
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
                                    const reset = {
                                        title: "",
                                        tags: new Set(),
                                        current: ""
                                    }
                                    setUserEntries(reset)
                                }
                                }
                                color="info"
                                size="sm"
                                className="col-sm-11 col-md-9 col-lg-7 col-xl-5 mt-2"
                            >
                                Clear Filters
                            </Button>
                        </FormGroup>
                    </Form>
            }
        </div>
    )
}