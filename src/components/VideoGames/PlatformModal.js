import React, { useState } from "react"
import { Modal, ModalBody, ModalFooter, Button, FormGroup, Input } from "reactstrap"
import { GameRepo } from "../../repositories/GameRepo"

export const PlatformModal = ({ openBoolean, setOpenBoolean, game, addToCurrent }) => {
    const [chosenPlatformId, setChosenPlatformId] = useState(0)

    return (
        //control whether the modal is being displayed based on the openBoolean prop (changed when the Add to Current button on Game.js is clicked, or when close on modal is clicked)
        <Modal isOpen={openBoolean === true ? true : false}>
            <ModalBody className="mt-4">
                Please select which platform you chose to play this game on.
                <FormGroup className="mt-4">
                    <Input
                        id="exampleSelect"
                        name="select"
                        type="select"
                        onChange={(event) => {
                            setChosenPlatformId(parseInt(event.target.value))
                        }}
                    >
                        {/* select for each platform currently associated with the game object prop*/}
                        <option value="0">Choose a platform...</option>
                        {
                            game.platforms.map(platform => {
                                return <option key={platform.id} value={platform.id}>
                                    {platform.name}
                                </option>
                            })
                        }
                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="info"
                    className="text-white"
                    onClick={() => {
                        //on submit, delete all platforms for the present game, then re-add the one that was chosen
                        //on this modal. Call the addToCurrent function (from props) to perform PUT operation and push user to current list
                        GameRepo.deletePlatformsForOneGame(game)
                            .then(() => {
                                GameRepo.addPlatform({
                                    gameId: game.id,
                                    platformId: chosenPlatformId
                                })
                            })
                            .then(addToCurrent)
                    }}
                >
                    Submit
                </Button>
                {/* set boolean state to false when cancel button is clicked to hide modal */}
                <Button color="info" className="text-white" onClick={() => { setOpenBoolean(false) }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}