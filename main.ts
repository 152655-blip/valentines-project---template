namespace SpriteKind {
    export const Decal = SpriteKind.create()
    export const NPC = SpriteKind.create()
}


// -------------- DATA STRUCTURES -----------------------
//creating new types and interfaces is a touch too much 
//for what I want to cover in this class. 

//if you are confused about any of this let me know

interface Choice {
    id: string
    text: string
    nextScene?: string // used when no skill check exists
}

interface Scene {
    id: string
    title: string
    description: string
    choices: Choice[]
}

// -------- DATA ----------
const characters = [
    {
        name: 'robotnik',
        roborizz: 5,
        processingPower: 4,
        memory: 7
    },
    {
        name: 'roboamore',
        roborizz: 9,
        processingPower: 4,
        memory: 3
    },
    {
        name: 'robotalot',
        roborizz: 3,
        processingPower: 8,
        memory: 5
    }
]

const scenes: Scene[] = [
    {
        id: "scene_1",
        title: "First Contact",
        description: "Love rolls by and asks if you are humming. Emotional subroutines activate.",
        choices: [
            {
                id: "compliment",
                text: "Compliment Love",
                nextScene: "scene_2A"
            },
            {
                id: "lift_table",
                text: "Lift a table to impress her",
                nextScene: "scene_2A"
            },
            {
                id: "romantic_fact",
                text: "Recite a romantic fact",
                nextScene: "scene_2A"
            }
        ]
    },

    {
        id: "scene_2A",
        title: "Cupcake Mission",
        description: "You help Love deliver cupcakes. A stack of boxes starts to fall!",
        choices: [
            {
                id: "catch_boxes",
                text: "Catch all the boxes",
                nextScene: "scene_3A"
            },
            {
                id: "calculate_trajectory",
                text: "Calculate optimal catch path",
                nextScene: "scene_3A"
            },
            {
                id: "charm_joke",
                text: "Charm Love with a joke",
                nextScene: "bad_end"
            }
        ]
    },

    {
        id: "scene_2B",
        title: "Awkward Moment",
        description: "Things feel a little weird. Love seems unsure.",
        choices: [
            {
                id: "recover",
                text: "Try to recover and keep going",
                nextScene: "scene_3A"
            }
        ]
    },

    {
        id: "scene_3A",
        title: "Charging Dock Confession",
        description: "The café closes. Love stands beside you near the charging docks.",
        choices: [
            {
                id: "ask_valentine",
                text: "Ask Love to be your Valentine",
                nextScene: "good_end"
            },
            {
                id: "give_gift",
                text: "Give a perfectly calculated gift",
                nextScene: "bittersweet_end"
            },
            {
                id: "carry_home",
                text: "Offer to carry her home",
                nextScene: "bittersweet_end"
            }
        ]
    }
]

// ---------- CHOICES HELPER FUNCTIONS -----------

function getSceneById(id: string): Scene | undefined {
    return scenes.find(scene => scene.id === id)
}

function getChoice(choiceText: string): Choice | undefined {
    // Loop through all scenes to find the choice
    for (let scene of scenes) {
        // Loop through each choice in the scene
        for (let choice of scene.choices) {
            if (choice.text === choiceText) {
                return choice // Return the matching choice
            }
        }
    }
    return undefined // If no matching choice is found
}

function handleChoices(sce: Scene) {
    story.printText(sce.description, 80, 90)

    // Show the choices to the player one by one
    let choiceTexts: string[] = []
    for (let choice of sce.choices) {
        choiceTexts.push(choice.text)
    }
    story.showPlayerChoices(choiceTexts[0], choiceTexts[1], choiceTexts[2]) // Display the choices

    // After the player picks a choice, check the result
    story.startCutscene(function () {
        let selectedChoice = story.getLastAnswer() // Get the last answer as a string

        let choice = getChoice(selectedChoice)

        console.log('attempting to handle choice: ' + choice)

        if (choice) {
            // If there is a next scene, transition to it
            transitionToNextScene(choice.nextScene)
        }
    })
}

function transitionToNextScene(sceneId: string) {
    console.log('attempting to transition')
    let nextScene = getSceneById(sceneId)

    if (nextScene) {
        console.log('handling next scene: ' + nextScene)
        handleChoices(nextScene)
    } else {
        // Handle ending scenes
        console.log('handling ending scene: ' + sceneId)
        if (sceneId === "good_end") {
            story.printText("Synchronized systems. Love says yes.", 80, 90)
        } else if (sceneId === "bad_end") {
            story.printText("Love reboots her feelings. You sweep alone.", 80, 90)
        } else if (sceneId === "early_end") {
            story.printText("You lecture about appliance law for 12 minutes straight.", 80, 90)
        } else if (sceneId === "bittersweet_end") {
            story.printText("The moment passes. Maybe next Valentine's Day.", 80, 90)
        }
    }
}

// ---------- GAME HELPER FUNCTIONS ------------

function initializeElements() { //setup for some of the UI changes
    game.setDialogCursor(assets.image`a-button`)
}

function startStory() {
    let firstScene = getSceneById("scene_1")
    if (firstScene) {
        handleChoices(firstScene)
    }
}

function runGame() {
    tiles.setCurrentTilemap(tilemap`level`)
    scene.cameraFollowSprite(playerSprite)
    startStory()
}

function startGame() {
    game.splash('Valentines Template: ', 'Your subtitle here')
    runGame()
}   

// ----------- CONTROLLER TRIGGERS --------------

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    
})

// ------------- OVERLAP TRIGGERS ------------------

sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC, function (sprite, otherSprite) {
    //
})

// ------------ Game Update Triggers --------------

game.onUpdate(function () {
    //if we want to constantly check for certain conditions, we can do so here.
})

// ------------- GLOBAL VARIABLES ------------------

//game UI props
let playerSprite: Sprite = null
let npcSprite: Sprite = null

npcSprite = sprites.create(assets.image`npc`, SpriteKind.NPC)
npcSprite.setPosition(90, 90)

// ------------- RUNNING THE GAME ------------------
initializeElements()
startGame()
