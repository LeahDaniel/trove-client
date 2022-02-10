import React, { useState } from "react"
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Input, Label, Alert } from "reactstrap"
import { SocialRepo } from "../../repositories/SocialRepo"

export const RecommendationModal = ({ openBoolean, setOpenBoolean, game, show, book, setBookRecoSuccess, setGameRecoSuccess, setShowRecoSuccess }) => {
    const [usernameEntry, setUsernameEntry] = useState("")
    const [messageEntry, setMessageEntry] = useState("")
    const [warningBoolean, setWarningBoolean] = useState(false)

    const submitRecommendation = (evt) => {
        evt.preventDefault()

        SocialRepo.getUserByUsername(usernameEntry)
            .then(foundUser => {
                if(foundUser.message){
                    setWarningBoolean(true)
                } else if (game) {
                    SocialRepo.addGameRecommendation({
                        recipient: foundUser.id,
                        game: game.id,
                        message: messageEntry
                    })
                        .then(() => setGameRecoSuccess(true))
                        .then(() => setOpenBoolean(false))
                        .then(() => setWarningBoolean(false))
                } else if (show) {
                    SocialRepo.addShowRecommendation({
                        recipient: foundUser.id,
                        show: show.id,
                        message: messageEntry
                    })
                        .then(() => setShowRecoSuccess(true))
                        .then(() => setOpenBoolean(false))
                        .then(() => setWarningBoolean(false))
                } else if (book) {
                    SocialRepo.addBookRecommendation({
                        recipient: foundUser.id,
                        book: book.id,
                        message: messageEntry
                    })
                        .then(() => setBookRecoSuccess(true))
                        .then(() => setOpenBoolean(false))
                        .then(() => setWarningBoolean(false))
                } 

            })

    }



    return (
        //control whether the modal is being displayed based on the openBoolean prop (changed when the Add to Current button on Game.js is clicked, or when close on modal is clicked)
        <Modal isOpen={openBoolean === true ? true : false}>
            <ModalBody className="mt-4">
                <FormGroup className="mt-4">
                    <Label>
                        Recipient's Username
                    </Label>
                    <Input
                        id="usernameEntry"
                        name="usernameEntry"
                        placeholder="Existing User's Username..."
                        type="username"
                        onChange={(event) => setUsernameEntry(event.target.value)}
                    >
                    </Input>
                </FormGroup>
                {
                    warningBoolean
                        ?
                        <div>
                            <Alert
                                color="danger"
                            >
                                This user does not exist. Please enter the username of an existing user or click "Cancel".
                            </Alert>
                        </div>
                        : ""
                }
                <FormGroup className="mt-4">
                    <Label>
                        Message
                    </Label>
                    <Input
                        id="messageEntry"
                        name="messageEntry"
                        type="textarea"
                        placeholder="Why are you recommending this?"
                        onChange={(event) => {
                            setMessageEntry(event.target.value)
                        }}
                    >
                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="info"
                    className="text-white"
                    onClick={submitRecommendation}
                >Submit
                </Button>
                {/* set boolean state to false when cancel button is clicked to hide modal */}
                <Button color="info" className="text-white" onClick={() => {
                    setWarningBoolean(false)
                    setOpenBoolean(false)
                }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}