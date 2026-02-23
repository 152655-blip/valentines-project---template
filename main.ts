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
const scenes: Scene[] = [
    {
        id: "scene_start",
        title: "The Mysterious Note",
        description: "Sassy Susan is walking past the CLA when she slips on a note that reads: 'I like you!' The hallway suddenly feels very suspicious.",
        choices: [
            {
                id: "announce",
                text: "Loudly ask who wrote the note",
                nextScene: "scene_public_confession"
            },
            {
                id: "investigate",
                text: "Casually investigate the handwriting",
                nextScene: "scene_investigation"
            }
        ]
    },

    {
        id: "scene_public_confession",
        title: "Public Confession Chaos",
        description: "Susan shouts her question. Everyone freezes. A janitor drops a mop. Confidence is required.",
        choices: [
            {
                id: "lock_eyes",
                text: "Lock eyes with Justin Mosley",
                nextScene: "scene_justin_confrontation"
            },
            {
                id: "panic",
                text: "Panic and flee to the vending machines",
                nextScene: "ending_vending_machine"
            }
        ]
    },

    {
        id: "scene_investigation",
        title: "Sneaky Investigation",
        description: "Susan studies the handwriting and notices Justin Mosley acting extremely normal in a suspicious way.",
        choices: [
            {
                id: "confront",
                text: "Politely confront Justin",
                nextScene: "scene_justin_confrontation"
            },
            {
                id: "follow",
                text: "Follow Justin like a rom-com detective",
                nextScene: "scene_following_justin"
            }
        ]
    },

    {
        id: "scene_following_justin",
        title: "Following Justin",
        description: "Susan attempts stealth. She immediately trips over a backpack. Stealth skill required.",
        choices: [
            {
                id: "reveal",
                text: "Reveal yourself dramatically",
                nextScene: "scene_justin_confrontation"
            },
            {
                id: "hide",
                text: "Hide behind a clearly too-small plant",
                nextScene: "ending_plant"
            }
        ]
    },

    {
        id: "scene_justin_confrontation",
        title: "Justin Revealed",
        description: "Justin admits the note was for Susan. Romance sparks — until Billy Bob bursts in demanding a Valentine date.",
        choices: [
            {
                id: "say_yes_bob",
                text: "Say yes to Billy Bob out of confusion",
                nextScene: "ending_bad_billy_bob"
            },
            {
                id: "choose_justin",
                text: "Say no and choose Justin",
                nextScene: "scene_post_conflict"
            }
        ]
    },

    {
        id: "scene_post_conflict",
        title: "After the Drama",
        description: "Billy Bob storms off dramatically. The hallway settles. Justin looks hopeful. Susan must decide what she wants.",
        choices: [
            {
                id: "date_justin",
                text: "Go on Valentine's Day dinner with Justin",
                nextScene: "ending_good"
            },
            {
                id: "go_home",
                text: "Decide love is too chaotic and go home",
                nextScene: "ending_neutral"
            }
        ]
    }
];


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
    if (choiceTexts.length < 2) {
        console.log('ERROR: THERE MUST BE AT LEAST 2 CHOICES')

    } else if (choiceTexts.length == 2) {
        story.showPlayerChoices(choiceTexts[0], choiceTexts[1]) // Display the choices

    } else if (choiceTexts.length == 3) {
        story.showPlayerChoices(choiceTexts[0], choiceTexts[1], choiceTexts[2]) // Display the choices
    }
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
        if (nextScene.title === "Public Confession Chaos"){
            scene.setBackgroundImage(assets.image`bg`)
        } else if (nextScene.title === "Sneaky Investigation"){
            scene.setBackgroundImage(assets.image`rename_this`)//TODO: Make this background
        } else if (nextScene.title === "Following Justin"){
            scene.setBackgroundImage(assets.image`rename_this`)//TODO: Make this background
        } else if (nextScene.title === "Justin Revealed"){
            scene.setBackgroundImage(assets.image`rename_this`)//TODO: Make this background
        } else if (nextScene.title === "After the Drama"){
            scene.setBackgroundImage(assets.image`rename_this`)//TODO: Make this background
        }
        handleChoices(nextScene)
    } else {
        // Handle ending scenes
        console.log('handling ending scene: ' + sceneId)
        if (sceneId === "ending_good") {
            scene.setBackgroundImage(assets.image`ending_good_bg`) //TODO: MAKE THIS BACKGROUND
            story.printText("Susan and Justin have a sweet Valentine's Day. Fries are shared. Chaos rests. Love wins.", 80, 90)
        } else if (sceneId === "ending_bad_billy_bob") {
            scene.setBackgroundImage(assets.image`ending_bad_bg`) //TODO: MAKE THIS BACKGROUND
            story.printText("Billy Bob brings his mom's, coupons, and asks to split the bill. Justin skateboards away sadly.", 80, 90)
        } else if (sceneId === "ending_neutral") {
            scene.setBackgroundImage(assets.image`ending_nuetral_bg`) //TODO: MAKE THIS BACKGROUND
            story.printText("Susan stays home, eats chocolate, and watches rom-coms. Justin texts a heart emoji. Peaceful.",80, 90)
        } else if (sceneId === "ending_vending_machine") {
            scene.setBackgroundImage(assets.image`ending_vending_bg`) //TODO: MAKE THIS BACKGROUND
            story.printText("Susan leans on a vending machine. It tips over. She's trapped until maintenance arrives.",80, 90)
        } else if (sceneId === "ending_plant") {
            scene.setBackgroundImage(assets.image`ending_plant_bg`) //TODO: MAKE THIS BACKGROUND
            story.printText("Security escorts Susan out for hiding behind a plant. Valentine's Day is spent banned from the building.",80, 90)
        }
    }
}

// ---------- GAME HELPER FUNCTIONS ------------

function initializeElements() { //setup for some of the UI changes
    game.setDialogCursor(assets.image`a-button`)
}

function startStory() {
    let firstScene = getSceneById("scene_start")
    if (firstScene) {
        handleChoices(firstScene)
    }
}

function runGame() {
    scene.setBackgroundImage(assets.image`Paper`)
    startStory()
}

function startGame() {
    game.splash('Valentines Template: ', 'Your subtitle here') //TODO: You're supposed to change this
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
