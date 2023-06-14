var GlobalOptions = {
    Common: {
        "DCinputProbability": 30,
        "DCoutputProbability": 30
    },

    AdvancedMode: {
        "MaxTotalStates": 20, //NumOfStates * NumOfCopies
        "MaxNumOfInputs": 4,
        "MaxMinimumStates": 10,
        "MaxNumOfOutputs": 4
    },

    Others: { //Simple Mode and Solver
        "MaxNumOfStates": 20,
        "MaxNumOfInputs": 4,
        "MaxNumOfOutputs": 4
    }
};

var MaxIterationsForStep = 1000; //max iterations for each step to avoid infinite loops (it's an escape condition). No warning when reached, the algorithm just ends.

/*
è possibile personalizzare lo stile di ogni tabella aggiungendo al CSS (index.css):
(si tratta di classi assegnate ad elementi di tipo table, ad esempio tutte le tabelle di macchine di Moore saranno elementi table di classe mooretable)

.paullungertable {

}
.mooretable {

}
.mealytable {

}
//tabelle delle macchine da compilare dall'utente
.mooreusertable {

}
.mealyusertable {

}
 */