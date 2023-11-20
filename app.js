/// Define practices

const worldPractice = {
  id: "world",
  name: "The world exists",
  roles: ["World"],
  actions: [
    {
      name: "[Actor]: Go to [Place]",
      conditions: [
        "practice.world.World.at.Actor!OtherPlace",
        "practice.world.World.connected.OtherPlace.Place"
      ],
      outcomes: [
        "insert practice.world.World.at.Actor!Place"
      ]
    }
  ]
};

const greetPractice = {
  id: "greet",
  name: "People can greet one another",
  roles: ["World"],
  actions: [
    {
      name: "[Actor]: Greet [Other]",
      conditions: [
        "practice.world.world.at.Actor!Place",
        "practice.world.world.at.Other!Place",
        "neq Actor Other",
        "not practice.greet.World.alreadyGreeted.Actor.Other",
        "not boundToPractice.Other"
      ],
      outcomes: [
        "insert practice.greet.World.alreadyGreeted.Actor.Other",
        //"insert practice.respondToGreeting.Other.Actor",
      ]
    },
    {
      name: "[Actor]: Take offense at [Other] not reciprocating greeting",
      conditions: [
        "practice.greet.World.alreadyGreeted.Actor.Other",
        "not practice.greet.World.alreadyGreeted.Other.Actor",
        "not boundToPractice.Other",
        "not offended.Actor.Other.ignoredMyGreeting"
      ],
      outcomes: [
        "insert offended.Actor.Other.ignoredMyGreeting",
      ]
    }
  ]
};

const jukeboxPractice = {
  // TODO Add themes for different song parts,
  // an action for reflecting on themes of the currently playing song part,
  // maybe agent preferences for specific songs?
  id: "jukebox",
  name: "A jukebox is here",
  data: [
    "song.closingStar",
    "songPart.prebeginning!beginning",
    "songPart.beginning!middle",
    "songPart.middle!end"
  ],
  roles: ["Place", "JukeboxGhost"],
  actions: [
    {
      name: "[Actor]: Queue up [Song] on the jukebox",
      conditions: [
        "not practice.jukebox.JukeboxGhost.playing",
        "practiceData.jukebox.song.Song",
        "neq Actor JukeboxGhost",
        "practice.world.world.at.Actor!Place",
      ],
      outcomes: [
        "insert practice.jukebox.JukeboxGhost.playing!Song!prebeginning"
      ]
    },
    {
      name: "[Actor]: Play [Part] of [Song]",
      conditions: [
        "eq Actor JukeboxGhost",
        "practice.jukebox.JukeboxGhost.playing!Song!PrevPart",
        "practiceData.jukebox.songPart.PrevPart!Part"
      ],
      outcomes: [
        "insert practice.jukebox.JukeboxGhost.playing!Song!Part"
      ]
    },
    {
      name: "[Actor]: Finish playing [Song]",
      conditions: [
        "eq Actor JukeboxGhost",
        "practice.jukebox.JukeboxGhost.playing!Song!end"
      ],
      outcomes: [
        "delete practice.jukebox.JukeboxGhost.playing"
      ]
    }
  ]
};

const tendBarPractice = {
  id: "tendBar",
  name: "[Bartender] is tending bar",
  data: [
    "beverageType.beer!alcoholic",
    "beverageType.cider!alcoholic",
    "beverageType.soda!nonalcoholic",
    "beverageType.water!nonalcoholic"
  ],
  roles: ["Place", "Bartender"],
  actions: [
    {
      name: "[Actor]: Order [Beverage]",
      conditions: [
        "neq Actor Bartender",
        "practice.world.world.at.Actor!Place",
        "not practice.tendBar.Bartender.customer.Actor!beverage",
        "practiceData.tendBar.beverageType.Beverage"
      ],
      outcomes: [
        "insert practice.tendBar.Bartender.customer.Actor!order!Beverage"
        // TODO insert an obligation-to-act on the part of the bartender?
      ]
    },
    {
      name: "[Actor]: Fulfill [Customer]'s order",
      conditions: [
        "eq Actor Bartender",
        "practice.tendBar.Bartender.customer.Customer!order!Beverage",
        "practice.world.world.at.Customer!Place",
        "practice.world.world.at.Bartender!Place"
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Customer!order",
        "insert practice.tendBar.Bartender.customer.Customer!beverage!Beverage"
      ]
    },
    {
      name: "[Actor]: Drink [Beverage]",
      conditions: [
        "practice.tendBar.Bartender.customer.Actor!beverage!Beverage"
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Actor!beverage"
        // TODO increase drunkenness if Beverage is alcoholic?
      ]
    },
    {
      name: "[Actor]: Spill [Beverage]",
      conditions: [
        "practice.tendBar.Bartender.customer.Actor!beverage!Beverage",
        "practice.world.world.at.Actor!Place", // for now only allow spills *at* bar
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Actor!beverage",
        "insert practice.tendBar.Bartender.customer.Actor!spill"
        // FIXME maybe spawn a separate spill practice like James D was playing with?
      ]
    },
    {
      name: "[Actor]: Clean up spill near [Customer]",
      conditions: [
        "practice.tendBar.Bartender.customer.Customer!spill",
        "practice.world.world.at.Actor!Place",
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Customer!spill"
        // FIXME mark politeness stuff for bartender vs spiller vs other customer cleaning it up?
        // make the bartender more annoyed?
      ]
    },
    {
      name: "[Actor]: Take offense at [Bartender] being away from bar",
      conditions: [
        "neq Actor Bartender",
        "practice.world.world.at.Actor!Place",
        "not practice.world.world.at.Bartender!Place",
        "not offended.Actor.Bartender.notTendingBar"
      ],
      outcomes: [
        "insert offended.Actor.Bartender.notTendingBar"
      ]
    },
    {
      name: "[Actor]: Clean glass",
      conditions: [
        "eq Actor Bartender",
        "practice.world.world.at.Bartender!Place"
      ],
      outcomes: []
    },
  ]
};

const ticTacToePractice = {
  id: "ticTacToe",
  name: "[Player1] and [Player2] are playing tic-tac-toe",
  roles: ["Player1", "Player2"],
  init: [
    // Who goes first?
    "insert practice.ticTacToe.Player1.Player2.whoseTurn!Player1!Player2",
    // Who plays which piece?
    "insert practice.ticTacToe.Player1.Player2.player.Player1.piece!o",
    "insert practice.ticTacToe.Player1.Player2.player.Player2.piece!x",
    // Initial board state
    "insert practice.ticTacToe.Player1.Player2.board.top.left!empty",
    "insert practice.ticTacToe.Player1.Player2.board.top.center!empty",
    "insert practice.ticTacToe.Player1.Player2.board.top.right!empty",
    "insert practice.ticTacToe.Player1.Player2.board.middle.left!empty",
    "insert practice.ticTacToe.Player1.Player2.board.middle.center!empty",
    "insert practice.ticTacToe.Player1.Player2.board.middle.right!empty",
    "insert practice.ticTacToe.Player1.Player2.board.bottom.left!empty",
    "insert practice.ticTacToe.Player1.Player2.board.bottom.center!empty",
    "insert practice.ticTacToe.Player1.Player2.board.bottom.right!empty"
  ],
  actions: [
    {
      name: "[Actor]: Play [Piece] at [Row] [Col]",
      conditions: [
        // Check whether this move should be possible
        "not practice.ticTacToe.Player1.Player2.gameOver",
        "practice.ticTacToe.Player1.Player2.whoseTurn!Actor!Other",
        "practice.ticTacToe.Player1.Player2.player.Actor.piece!Piece",
        "practice.ticTacToe.Player1.Player2.board.Row.Col!empty",
      ],
      outcomes: [
        "insert practice.ticTacToe.Player1.Player2.board.Row.Col!Piece",
        "insert practice.ticTacToe.Player1.Player2.whoseTurn!Other!Actor",
        "call ticTacToe_checkEndConditions Player1 Player2"
      ]
    },
    // Declare-winner actions
    {
      name: "[Actor]: Concede gracefully",
      conditions: [
        "practice.ticTacToe.Player1.Player2.gameOver!Winner!Loser",
        "eq Actor Loser"
      ],
      outcomes: [
        "insert Winner.ship.Loser.ticTacToeMemory!won",
        "insert Loser.ship.Winner.ticTacToeMemory!lost",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Gloat about victory",
      conditions: [
        "practice.ticTacToe.Player1.Player2.gameOver!Winner!Loser",
        "eq Actor Winner"
      ],
      outcomes: [
        "insert Winner.ship.Loser.ticTacToeMemory!won",
        "insert Loser.ship.Winner.ticTacToeMemory!lost",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Remark on the pointlessness of tic-tac-toe",
      conditions: [
        "practice.ticTacToe.Player1.Player2.gameOver!tie",
        "neq Actor Winner",
        "neq Actor Loser"
      ],
      outcomes: [
        "insert Player1.ship.Player2.ticTacToeMemory!tied",
        "insert Player2.ship.Player1.ticTacToeMemory!tied",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
  ],
  functions: [
    {
      name: "ticTacToe_checkEndConditions",
      params: ["Player1", "Player2"],
      cases: [
        {
          conditions: [
            "practice.ticTacToe.Player1.Player2.board.top.Col!Piece",
            "practice.ticTacToe.Player1.Player2.board.middle.Col!Piece",
            "practice.ticTacToe.Player1.Player2.board.bottom.Col!Piece",
            "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
            // Grab the loser so we can mark them as having lost
            "practice.ticTacToe.Player1.Player2.player.Loser",
            "neq Winner Loser"
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!Winner!Loser"
          ]
        },
        {
          conditions: [
            "practice.ticTacToe.Player1.Player2.board.Row.left!Piece",
            "practice.ticTacToe.Player1.Player2.board.Row.center!Piece",
            "practice.ticTacToe.Player1.Player2.board.Row.right!Piece",
            "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
            // Grab the loser so we can mark them as having lost
            "practice.ticTacToe.Player1.Player2.player.Loser",
            "neq Winner Loser"
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!Winner!Loser"
          ]
        },
        {
          conditions: [
            "practice.ticTacToe.Player1.Player2.board.top.left!Piece",
            "practice.ticTacToe.Player1.Player2.board.middle.center!Piece",
            "practice.ticTacToe.Player1.Player2.board.bottom.right!Piece",
            "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
            // Grab the loser so we can mark them as having lost
            "practice.ticTacToe.Player1.Player2.player.Loser",
            "neq Winner Loser"
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!Winner!Loser"
          ]
        },
        {
          conditions: [
            "practice.ticTacToe.Player1.Player2.board.top.right!Piece",
            "practice.ticTacToe.Player1.Player2.board.middle.center!Piece",
            "practice.ticTacToe.Player1.Player2.board.bottom.left!Piece",
            "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
            // Grab the loser so we can mark them as having lost
            "practice.ticTacToe.Player1.Player2.player.Loser",
            "neq Winner Loser"
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!Winner!Loser"
          ]
        },
        // Tie-game cases
        {
          conditions: [
            // Check that every row has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.top.C1!x",
            "practice.ticTacToe.Player1.Player2.board.top.C2!o",
            "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
            "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
            "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
            "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
            // Check that every column has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.R1.left!x",
            "practice.ticTacToe.Player1.Player2.board.R2.left!o",
            "practice.ticTacToe.Player1.Player2.board.R3.center!x",
            "practice.ticTacToe.Player1.Player2.board.R4.center!o",
            "practice.ticTacToe.Player1.Player2.board.R5.right!x",
            "practice.ticTacToe.Player1.Player2.board.R6.right!o",
            // Check that both *diagonals* have both piece types in 'em
            // (two corners per tie-game action)
            "practice.ticTacToe.Player1.Player2.board.top.left!P1",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
            "neq P1 P2", "neq P1 empty", "neq P2 empty",
            "practice.ticTacToe.Player1.Player2.board.top.right!P3",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
            "neq P3 P4", "neq P3 empty", "neq P4 empty",
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!tie"
          ]
        },
        {
          conditions: [
            // Check that every row has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.top.C1!x",
            "practice.ticTacToe.Player1.Player2.board.top.C2!o",
            "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
            "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
            "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
            "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
            // Check that every column has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.R1.left!x",
            "practice.ticTacToe.Player1.Player2.board.R2.left!o",
            "practice.ticTacToe.Player1.Player2.board.R3.center!x",
            "practice.ticTacToe.Player1.Player2.board.R4.center!o",
            "practice.ticTacToe.Player1.Player2.board.R5.right!x",
            "practice.ticTacToe.Player1.Player2.board.R6.right!o",
            // Check that both *diagonals* have both piece types in 'em
            // (two corners per tie-game action)
            "practice.ticTacToe.Player1.Player2.board.top.right!P1",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
            "neq P1 P2", "neq P1 empty", "neq P2 empty",
            "practice.ticTacToe.Player1.Player2.board.bottom.right!P3",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
            "neq P3 P4", "neq P3 empty", "neq P4 empty",
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!tie"
          ]
        },
        {
          conditions: [
            // Check that every row has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.top.C1!x",
            "practice.ticTacToe.Player1.Player2.board.top.C2!o",
            "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
            "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
            "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
            "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
            // Check that every column has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.R1.left!x",
            "practice.ticTacToe.Player1.Player2.board.R2.left!o",
            "practice.ticTacToe.Player1.Player2.board.R3.center!x",
            "practice.ticTacToe.Player1.Player2.board.R4.center!o",
            "practice.ticTacToe.Player1.Player2.board.R5.right!x",
            "practice.ticTacToe.Player1.Player2.board.R6.right!o",
            // Check that both *diagonals* have both piece types in 'em
            // (two corners per tie-game action)
            "practice.ticTacToe.Player1.Player2.board.bottom.right!P1",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
            "neq P1 P2", "neq P1 empty", "neq P2 empty",
            "practice.ticTacToe.Player1.Player2.board.bottom.left!P3",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
            "neq P3 P4", "neq P3 empty", "neq P4 empty",
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!tie"
          ]
        },
        {
          conditions: [
            // Check that every row has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.top.C1!x",
            "practice.ticTacToe.Player1.Player2.board.top.C2!o",
            "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
            "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
            "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
            "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
            // Check that every column has both piece types in it
            "practice.ticTacToe.Player1.Player2.board.R1.left!x",
            "practice.ticTacToe.Player1.Player2.board.R2.left!o",
            "practice.ticTacToe.Player1.Player2.board.R3.center!x",
            "practice.ticTacToe.Player1.Player2.board.R4.center!o",
            "practice.ticTacToe.Player1.Player2.board.R5.right!x",
            "practice.ticTacToe.Player1.Player2.board.R6.right!o",
            // Check that both *diagonals* have both piece types in 'em
            // (two corners per tie-game action)
            "practice.ticTacToe.Player1.Player2.board.bottom.left!P1",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
            "neq P1 P2", "neq P1 empty", "neq P2 empty",
            "practice.ticTacToe.Player1.Player2.board.top.left!P3",
            "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
            "neq P3 P4", "neq P3 empty", "neq P4 empty",
          ],
          outcomes: [
            "insert practice.ticTacToe.Player1.Player2.gameOver!tie"
          ]
        }
      ]
    }
  ]
};

/// Set up run loop

const queryInput = document.getElementById("query");
const topActionsDiv = document.getElementById("priorityactions");
const actionButtonsDiv = document.getElementById("otheractions");

function actuallyDoAction(praxishState, action) {
  const transcriptDiv = document.getElementById("transcript");
  const actionHTML = `<div class="action">
    <span class="actorname">${action.Actor}</span>
    <span class="actionname">${action.cleanName}</span>
  </div>`;
  transcriptDiv.innerHTML = actionHTML + transcriptDiv.innerHTML;
  console.log("Performing action ::", action.name, action);
  Praxish.performAction(praxishState, action);
}

function makeActionButton(praxishState, action) {
  const button = document.createElement("button");
  button.innerText = action.cleanName;
  button.onclick = ev => {
    // Perform the action
    actuallyDoAction(praxishState, action);
    // Clear the top actions
    topActionsDiv.innerHTML = "";
    // Redisplay the waiting-for-NPCs message
    actionButtonsDiv.innerHTML = `<span id="waitmsg">waiting for player's turn...</span>`;
    // Unpause the tick loop
    pausedForPlayer = false;
  };
  return button;
}

function submitPWIMQuery(praxishState, possibleActions) {
  // get query from text input
  const query = queryInput.value;
  queryInput.value = "";
  // set up the XHR
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:10000");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    console.log(xhr.responseText);
    const rankedActions = JSON.parse(xhr.responseText);
    console.log("ranked actions", rankedActions);
    // update UI to reflect the ranked actions
    const numTopActions = 3;
    const topActions = rankedActions.slice(0, numTopActions);
    const otherActions = rankedActions.slice(numTopActions);
    const highestPWIMScore = rankedActions[0].pwimScore;
    const lowestPWIMScore = rankedActions[rankedActions.length - 1].pwimScore;
    topActionsDiv.innerHTML = "";
    for (const topAction of topActions) {
      const bgcolor = scale(
        topAction.pwimScore,
        [lowestPWIMScore, highestPWIMScore],
        [170, 0]
      );
      const button = makeActionButton(praxishState, topAction);
      button.style.backgroundColor = `rgb(${bgcolor},${bgcolor},${bgcolor})`;
      topActionsDiv.append(button);
    }
    topActionsDiv.firstChild.focus(); // focus the first top-action button
    const actionButtonsDiv = document.getElementById("otheractions");
    actionButtonsDiv.innerHTML = "";
    for (const fallbackAction of otherActions) {
      const bgcolor = scale(
        fallbackAction.pwimScore,
        [lowestPWIMScore, highestPWIMScore],
        [170, 0]
      );
      const button = makeActionButton(praxishState, fallbackAction);
      button.style.backgroundColor = `rgb(${bgcolor},${bgcolor},${bgcolor})`;
      actionButtonsDiv.append(button);
    }
  }
  // send the XHR
  xhr.send(JSON.stringify({actions: possibleActions, query: query}));
}

const playerActorIdx = 0; // player actor is first
let pausedForPlayer = false; // start unpaused

// Given a list of `scoredActions` for a particular actor,
// return the action that the actor should actually perform.
function pickAction(scoredActions) {
  if (!scoredActions) return null;
  return scoredActions[0];
}

// Like `pickAction`, but chooses non-deterministically
// between highly scoring actions to add variety.
// Non-determinism complicates debugging and confuses the planner
// (which limits combinatorial explosion on the turns of non-focal actors
// by considering only a single possible next action per actor-turn),
// so we've stopped using this for now.
function pickActionNondeterministically(scoredActions) {
  if (!scoredActions) return null;
  const topScore = scoredActions[0].score;
  const firstNonTopscoringIdx = scoredActions.findIndex(pa => pa.score < topScore);
  if (firstNonTopscoringIdx > -1) {
    const bestScoringActions = scoredActions.slice(0, firstNonTopscoringIdx);
    return randNth(bestScoringActions);
  }
  return randNth(scoredActions);
}

// Given an exclusion logic `db` and a list of actor `goals`,
// return a numeric evaluation of the situation represented by the `db`
// in terms of these `goals`.
function evaluate(db, goals) {
  let score = 0;
  for (const goal of goals) {
    const results = Praxish.query(db, goal.conditions, {});
    score += (goal.utility * results.length);
  }
  return score;
}

// Given a `praxishState`, an `actor`, and a `searchDepth` (default: 0),
// return a list of possible actions that the `actor` can perform,
// sorted by a numeric `score` property representing how much utility
// the `actor` can expect to get from performing each action.
function scoreActions(praxishState, actor, searchDepth) {
  searchDepth = searchDepth || 0;
  let possibleActions = Praxish.getAllPossibleActions(praxishState, actor.name);
  // For practice-bound actors, filter possible actions to just those from the bound practice.
  // FIXME We should probably move this logic into `getAllPossibleActions`
  // so that we don't waste time generating actions that will never be performed.
  if (actor.boundToPractice) {
    possibleActions = possibleActions.filter(pa => pa.practiceID === actor.boundToPractice);
  }
  // Bail out early if no possible actions.
  if (possibleActions.length === 0) return null;
  // Speculatively perform each possible action
  // and score the outcome according to the actor's goals.
  for (const possibleAction of possibleActions) {
    const prevDB = clone(praxishState.db);
    Praxish.performAction(praxishState, possibleAction);
    possibleAction.score = 0;
    const goals = actor.goals || [];
    possibleAction.score = evaluate(praxishState.db, goals);
    if (searchDepth > 0 && goals.length > 0) {
      // Predict what will happen in the future if we decide to take this action now,
      // and add the value of predicted future actions to this action's score.
      // First, predict what other actors might do next.
      const discountFactor = 0.9; // Discount future outcomes relative to immediate ones
      const expectations = []; // Track our predictions of the future
      const prevActorIdx = praxishState.actorIdx;
      praxishState.actorIdx = advanceCursor(praxishState.actorIdx, praxishState.allChars);
      while (praxishState.actorIdx !== prevActorIdx) {
        // Figure out whose turn it is to act next
        const otherActor = praxishState.allChars[praxishState.actorIdx];
        // Predict their next action
        const possibleOtherActorActions = scoreActions(praxishState, otherActor);
        const predictedOtherActorAction = pickAction(possibleOtherActorActions);
        // Determine how good or bad this next action would be for us
        if (predictedOtherActorAction) {
          Praxish.performAction(praxishState, predictedOtherActorAction);
          const otherActorFutureScore = evaluate(praxishState.db, goals);
          possibleAction.score += (discountFactor * otherActorFutureScore);
          // Track our prediction
          expectations.push([predictedOtherActorAction.name, otherActorFutureScore]);
        }
        // Advance to the next actor
        praxishState.actorIdx = advanceCursor(praxishState.actorIdx, praxishState.allChars);
      }
      // Then predict what *we'll* probably do next.
      // This part is recursive: it'll trigger additional rounds of prediction
      // as needed to reach the specified `searchDepth`.
      const possibleNextActions = scoreActions(praxishState, actor, searchDepth - 1);
      const predictedNextAction = pickAction(possibleNextActions);
      const futureScore = predictedNextAction?.score || 0;
      possibleAction.score += (discountFactor * futureScore);
      expectations.push([predictedNextAction?.name, predictedNextAction?.score]);
      possibleAction.expectations = expectations.concat(predictedNextAction.expectations || []);
    }
    praxishState.db = prevDB;
  }
  // Sort actions by score and return the sorted list.
  possibleActions.sort((a, b) => b.score - a.score);
  return possibleActions;
}

// Given an `action`, assign it a `cleanName` property:
// a string that names the action but doesn't include the actor name as a prefix,
// to be displayed in the user interface.
// FIXME Push this up into Praxish core instead of prepending actor name by default?
function assignCleanName(action) {
  const [actorName, ...actionNameParts] = action.name.split(":");
  const actionName = actionNameParts.join(":").trim();
  action.cleanName = actionName;
}

// Given a `praxishState`, determine whose turn it is to act,
// select an action for that character to perform, and perform the action.
function tick(praxishState) {
  // Bail out early if we're waiting on the player to act.
  if (pausedForPlayer) return;
  // Figure out whose turn it is to act. For now, turntaking will just be simple round-robin.
  praxishState.actorIdx = advanceCursor(praxishState.actorIdx, praxishState.allChars);
  const actor = praxishState.allChars[praxishState.actorIdx];
  // If this is a player actor, populate the UI with possible actions
  // and wait for the player to pick one.
  // Otherwise, pick and perform a reasonable action autonomously.
  if (praxishState.actorIdx === playerActorIdx) {
    // Pause and wait for the player to act
    pausedForPlayer = true;
    // Focus the query input
    queryInput.focus();
    // Generate a list of possible actions
    const possibleActions = Praxish.getAllPossibleActions(praxishState, actor.name);
    // Assign each action a "clean name" that doesn't include the actor name as a prefix.
    // FIXME Push this up into Praxish core instead of prepending actor name by default?
    possibleActions.forEach(assignCleanName);
    // Update the query submit button to incorporate the current `possibleActions`,
    // and attach the same behavior to the Enter key on the query input
    const submitQueryButton = document.getElementById("submit");
    submitQueryButton.onclick = () => submitPWIMQuery(praxishState, possibleActions);
    queryInput.onkeyup = ev => {
      if (ev.key !== "Enter") return;
      submitQueryButton.click();
    };
    // Render an input (button?) for each of the `possibleActions`
    actionButtonsDiv.innerHTML = "";
    for (const possibleAction of possibleActions) {
      const button = makeActionButton(praxishState, possibleAction);
      actionButtonsDiv.appendChild(button);
    }
  }
  else {
    const scoredActions = scoreActions(praxishState, actor, 2);
    console.log("scoredActions", scoredActions);
    const actionToPerform = pickAction(scoredActions);
    if (!actionToPerform) {
      console.warn("No actions to perform", actor.name);
      return;
    }
    assignCleanName(actionToPerform);
    actuallyDoAction(praxishState, actionToPerform);
  }
}

/// Initialize our Praxish instance

const testPraxishState = Praxish.createPraxishState();
testPraxishState.allChars = [
  {
    name: "max",
    goals: [
      {
        name: "Order cider",
        utility: 5,
        conditions: ["practice.tendBar.Bartender.customer.max!order!cider"]
      },
      {
        name: "Order soda",
        utility: 5,
        conditions: ["practice.tendBar.Bartender.customer.max!order!soda"]
      },
      {
        name: "Avoid offending others",
        utility: -50,
        conditions: ["offended.Other.max"]
      },
      {
        name: "Take offense when expected",
        utility: 1,
        conditions: ["offended.max.Other"]
      },
    ]
  },
  {
    name: "nic",
    goals: [
      {
        name: "Order beer",
        utility: 5,
        conditions: ["practice.tendBar.Bartender.customer.nic!order!beer"]
      },
      {
        name: "Avoid offending others",
        utility: -50,
        conditions: ["offended.Other.nic"]
      },
      {
        name: "Take offense when expected",
        utility: 1,
        conditions: ["offended.nic.Other"]
      },
    ]
  },
  {
    name: "isaac",
    goals: [
      {
        name: "Stay at the bar",
        utility: 1,
        conditions: ["practice.world.world.at.isaac!barArea"]
      },
      {
        name: "Clean up spills",
        utility: -2,
        conditions: ["practice.tendBar.isaac.customer.Customer!spill"]
      },
      {
        name: "Serve customers",
        utility: -5,
        conditions: ["practice.tendBar.isaac.customer.Customer!order"]
      },
      {
        name: "Preferentially serve Nic",
        utility: -5,
        conditions: ["practice.tendBar.isaac.customer.nic!order"]
      },
      {
        name: "Avoid offending others",
        utility: -50,
        conditions: ["offended.Other.isaac"]
      },
      {
        name: "Take offense when expected",
        utility: 1,
        conditions: ["offended.isaac.Other"]
      },
    ]
  },
  {
    name: "jukebox",
    boundToPractice: "jukebox"
  },
  {
    name: "singer",
    goals: [
      {
        name: "Relax backstage",
        utility: 5,
        conditions: ["practice.world.world.at.singer!backstage"]
      },
      {
        name: "Avoid others",
        utility: -3,
        conditions: [
          "practice.world.world.at.singer!Place",
          "practice.world.world.at.Other!Place",
          "neq Other singer"
        ]
      },
      {
        name: "Avoid offending others",
        utility: -50,
        conditions: ["offended.Other.singer"]
      },
      {
        name: "Take offense when expected",
        utility: 1,
        conditions: ["offended.isaac.Other"]
      },
    ]
  }
];

Praxish.definePractice(testPraxishState, worldPractice);
const placePairs = [
  // outside to entrance
  ["outside", "entrance"],
  // entrance to main places
  ["entrance", "barArea"],
  ["entrance", "jukeboxCorner"],
  ["entrance", "stageArea"],
  // main place interconnections
  ["barArea", "jukeboxCorner"],
  ["barArea", "stageArea"],
  ["jukeboxCorner", "stageArea"],
  // stage-related places
  ["stageArea", "onstage"],
  ["onstage", "backstage"],
];
for (const [p1, p2] of placePairs) {
  Praxish.performOutcome(testPraxishState, `insert practice.world.world.connected.${p1}.${p2}`);
  Praxish.performOutcome(testPraxishState, `insert practice.world.world.connected.${p2}.${p1}`);
}
for (const actor of testPraxishState.allChars) {
  Praxish.performOutcome(testPraxishState, `insert practice.world.world.at.${actor.name}!outside`);
}
Praxish.performOutcome(testPraxishState, "insert practice.world.world.at.isaac!barArea");
Praxish.definePractice(testPraxishState, greetPractice);
Praxish.performOutcome(testPraxishState, "insert practice.greet.world");
Praxish.definePractice(testPraxishState, tendBarPractice);
Praxish.performOutcome(testPraxishState, "insert practice.tendBar.barArea.isaac");
Praxish.definePractice(testPraxishState, jukeboxPractice);
Praxish.performOutcome(testPraxishState, "insert boundToPractice.jukebox");
Praxish.performOutcome(testPraxishState, "insert practice.jukebox.jukeboxCorner.jukebox");

/// Kick off the run loop

window.setInterval(() => tick(testPraxishState), 1000);
