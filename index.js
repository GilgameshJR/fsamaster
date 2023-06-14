//Licensed under GNU GPL license. Made by Francesco Ratti 1998 in 2020, Computer Science and Engineering. Website: www.beasoft.it Email: francesco.ratti@hotmail.it
//Contact me for any question/collaboration request

function LoadConfig() {
    return GlobalOptions; //global variable located in config.js file
}

//prototypes and constructors
var MealyTileProto= {
    ToPrint: null,
};
var MooreTileProto= {
    ToPrint: null,
};
function AlertTimeout() {
    alert("Numero massimo di iterazioni per step superato (rischio di loop infinito). La condizione scelta potrebbe essere critica o insoddisfacibile, cambiala o riprova. Prosecuzione ignorando vincoli che hanno causato questo problema.");
}
function OutTilePrint(Out) {
    let Str = String();
    for (let i = 0; i < Out.length; i++) {
        if (Out[i] === -1) {
            Str += "-";
        } else {
            Str += Out[i].toString();
        }
    }
    return Str;
}

var MooreOutTileProto= {
    ToPrint:function () {
        return OutTilePrint(this.out);
    }
};

var StateIndexTileProto={
    ToPrint: null
};
var InputIndexTileProto={
    ToPrint: function () {
        //var StrToPrint=(this.value.toString())+"=";
        var StrToPrint=String();
        for (let i = 0; i < this.binaryValue.length; i++) {
            StrToPrint = StrToPrint.concat(this.binaryValue[i]);
        }
        return StrToPrint;
    }
};

function MooreOutTile() {
    this.out = null;
}
MooreOutTile.prototype = MooreOutTileProto;

function MealyTile() {
    this.Linkedstate = null;
    this.value = null;
    this.out = null;
}
MealyTile.prototype = MealyTileProto;

function MooreTile() {
    this.Linkedstate = null;
    this.value = null;
}
MooreTile.prototype = MooreTileProto;

function InputIndexTile() {
    this.value = null;
    this.binaryValue = null;
}

InputIndexTile.prototype = InputIndexTileProto;

function StateIndexTile() {
    this.value = null;
}
StateIndexTile.prototype = StateIndexTileProto;

//table related functions and "classes" (IIFC tecnique used)
function createArray(r, c) {
    var arr = new Array(r);
    for (let i = 0; i < r; i++)
        arr[i] = new Array(c);
    return arr;
}

function CreateColumnIndexNodes(IndexRow, StatesTableImpl, numofinputs) {
    const StatoTh = document.createElement("th");
    StatoTh.innerHTML="Stato | ingresso";
    IndexRow.append(StatoTh);
    for (let i=1; i<numofinputs+1; i++) {
        const th=document.createElement("th");
        th.innerHTML=StatesTableImpl[0][i].ToPrint();
        IndexRow.appendChild(th);
    }
    return IndexRow;
}
function MealyTable(numofstates, numofinputs) {
    var StatesTableImpl = createArray(numofstates + 1, numofinputs + 1);
    for (let i = 1; i < numofinputs+1; i++)
        StatesTableImpl[0][i] = new InputIndexTile();
    for (let i = 1; i < numofstates+1; i++)
        StatesTableImpl[i][0] = new StateIndexTile();
    for (let r = 1; r < numofstates +1 ; r++) {
        for (let c = 1; c < numofinputs + 1; c++) {
            StatesTableImpl[r][c] = new MealyTile();
        }
    }
    return {
        setContentTileByIndex: function (Index, Input, Tile) {
            //  if (!(Tile.prototype===MealyTileProto))
            //    return false;
            StatesTableImpl[Index + 1][Input + 1] = Tile;
        },
        getContentTileByIndex: function (Index, Input) {
            return StatesTableImpl[Index + 1][Input + 1];
        },
        setContentTileByState: function (State, Input, Tile) {
            this.setContentTileByIndex(this.getIndexNumber(State), Input, Tile);
        },
        getContentTileByState: function (State, Input) {
            return this.getContentTileByIndex(this.getIndexNumber(State), Input);
        },
        setStateIndexTile: function (Index, Tile) {
            // if (!(Tile.prototype===StateIndexTileProto))
            //   return false;
            StatesTableImpl[Index + 1][0] = Tile;
        },
        getStateIndexTile: function (Index) {
            return StatesTableImpl[Index + 1][0];
        },
        setInputIndexTile: function (Input, Tile) {
            // if (!(Tile.prototype===InputIndexTileProto))
            //   return false;
            StatesTableImpl[0][Input + 1] = Tile;
        },
        getInputIndexTile: function (Input) {
            return StatesTableImpl[0][Input + 1];
        },
        getIndexNumber: function (State) {
            for (let s = 0; s < numofstates; s++)
                if (this.getStateIndexTile(s).value === State)
                    return s;
        },
        printTable: function (NodeToPrintInto) {
            var ContainerParNode=document.createElement("div");
            var Table = document.createElement("table");
            Table.setAttribute("class", "mealytable");
            var IndexRow = document.createElement("tr");
            IndexRow = CreateColumnIndexNodes(IndexRow, StatesTableImpl, numofinputs);
            Table.appendChild(IndexRow);

            for (let r = 1; r < numofstates + 1; r++) {
                const tr = document.createElement("tr");
                const rowindex = document.createElement("th");
                rowindex.innerHTML=StatesTableImpl[r][0].ToPrint();
                tr.appendChild(rowindex);
                for (let c=1; c<numofinputs+1; c++) {
                    const td = document.createElement("td");
                    td.innerHTML = StatesTableImpl[r][c].ToPrint();
                    tr.appendChild(td);
                }
                Table.appendChild(tr);
            }
            ContainerParNode.appendChild(Table);
            NodeToPrintInto.appendChild(ContainerParNode)
        },
        getNumOfStates: function () {
            return numofstates;
        },
        getNumOfInputs: function () {
            return numofinputs;
        },
        removeState: function (State) {
            StatesTableImpl.splice(State+1, 1);
            numofstates--;
        },
        addState: function () {
            StatesTableImpl.push(new Array(numofinputs + 1));
            numofstates++;
            StatesTableImpl[numofstates][0] = new StateIndexTile();
            for (let c = 1; c < numofinputs + 1; c++) {
                StatesTableImpl[numofstates][c] = new MealyTile();
            }
        },
        swapStates: function (State1, State2, SwapNames) {
            swapStatesCommon(State1, State2, SwapNames, StatesTableImpl, numofstates, numofinputs);
        }
    }
}

function swapStatesCommon (State1, State2, SwapNames, StatesTableImpl, numofstates, numofinputs) {
    if (State1!==State2) {
        var Back = StatesTableImpl[State1 + 1];
        StatesTableImpl[State1 + 1] = StatesTableImpl[State2 + 1];
        StatesTableImpl[State2 + 1] = Back;
        if (SwapNames === false) {
            let BackIndex = StatesTableImpl[State1 + 1][0];
            StatesTableImpl[State1 + 1][0] = StatesTableImpl[State2 + 1][0];
            StatesTableImpl[State2 + 1][0] = BackIndex;
        }
        for (let s = 1; s < numofstates + 1; s++)
            for (let i = 1; i < numofinputs + 1; i++) {
                if (StatesTableImpl[s][i].Linkedstate === State1)
                    StatesTableImpl[s][i].Linkedstate = State2;
                else if (StatesTableImpl[s][i].Linkedstate === State2)
                    StatesTableImpl[s][i].Linkedstate = State1;
            }
    }
}

function isOutputValid(OutputString) {
    for (let i = 0; i < OutputString.length; i++) {
        if (!(OutputString[i] === "-" || OutputString[i] === "0" || OutputString !== "1"))
            return false;
    }
    return true;
}

function BuildOutputArray(OutputString) {
    var OutputArray = new Array(OutputString.length);

    for (let i = 0; i < OutputString.length; i++) {
        switch (OutputString[i]) {
            case "-": {
                OutputArray[i] = -1;
                break;
            }
            case "0": {
                OutputArray[i] = 0;
                break;
            }
            case "1": {
                OutputArray[i] = 1;
                break;
            }
            default: {
                return null;
            }
        }
    }
    return OutputArray;
}

function MooreUserTable(NumOfStates, NumOfInputs, NumOfOutputs) {
    var InputNodes = createArray(NumOfStates, NumOfInputs);
    var InputOutNodes = new Array(NumOfStates);
    return {
        PrintTable: function (NodeToPrintInto) {
            var Table = document.createElement("table");
            Table.setAttribute("class", "mooreusertable");
            var NumOfBits = Math.ceil(Math.log2(NumOfInputs));

            var UpperLeftIndexHeader = document.createElement("th");
            UpperLeftIndexHeader.innerHTML = "Stato | ingresso";
            var TableRowIndex = document.createElement("tr");
            TableRowIndex.appendChild(UpperLeftIndexHeader);
            for (let i = 0; i < NumOfInputs; i++) {
                //let StrToPrint = (i.toString()) + "=";
                let StrToPrint = String();
                var Bin = DecToBin(i, NumOfBits);
                for (let iter = 0; iter < Bin.length; iter++) {
                    StrToPrint = StrToPrint.concat(Bin[iter]);
                }
                let StateIndexHeader = document.createElement("th");
                StateIndexHeader.innerHTML = StrToPrint;
                TableRowIndex.appendChild(StateIndexHeader);
            }
            var OutIndexHeader = document.createElement("th");
            OutIndexHeader.innerHTML = "OUT";
            TableRowIndex.appendChild(OutIndexHeader);
            Table.appendChild(TableRowIndex);
            for (let s = 0; s < NumOfStates; s++) {
                let TableRow = document.createElement("tr");
                let TableHeader = document.createElement("th");
                TableHeader.innerHTML = "S" + s.toString();
                TableRow.appendChild(TableHeader);
                for (let i = 0; i < NumOfInputs; i++) {
                    let TableData = document.createElement("td");
                    let SLabel = document.createElement("label");
                    SLabel.innerHTML = "S ";
                    let ContentInput = document.createElement("input");
                    ContentInput.setAttribute("type", "text");
                    InputNodes[s][i] = ContentInput;
                    TableData.appendChild(SLabel);
                    TableData.appendChild(ContentInput);
                    TableRow.appendChild(TableData);
                }
                let OutTableData = document.createElement("td");
                let OutInput = document.createElement("input");
                OutInput.setAttribute("type", "text");
                InputOutNodes[s] = OutInput;
                OutTableData.appendChild(InputOutNodes[s]);
                TableRow.appendChild(OutTableData);
                Table.appendChild(TableRow);
            }
            NodeToPrintInto.appendChild(Table);
        }, getMooreTable: function () {
            var FinalTable = MooreTable(NumOfStates, NumOfInputs);
            FillColumnsIndexFirstStep(FinalTable, NumOfInputs);

            for (let s = 0; s < NumOfStates; s++) {
                FinalTable.getStateIndexTile(s).value = s;

                for (let i = 0; i < NumOfInputs; i++) {
                    let FutureStateStr = (InputNodes[s][i]).value.trim();
                    if (FutureStateStr.length === 0)
                        return -1;
                    let FutureStateTile = FinalTable.getContentTileByIndex(s, i);
                    if (FutureStateStr !== "-") {
                        let FutureState = parseInt(FutureStateStr);
                        if (isNaN(FutureState))
                            return -2;
                        if (FutureState < 0 || FutureState >= NumOfStates)
                            return -3;

                        FutureStateTile.Linkedstate = FutureState;
                    } else {
                        FutureStateTile.Linkedstate = -1;
                    }
                }
                let CurrOut = InputOutNodes[s].value.trim();
                if (CurrOut.length === 0)
                    return -1;
                if (CurrOut.length !== NumOfOutputs)
                    return -5;
                let Res = BuildOutputArray(CurrOut);
                if (Res === null)
                    return -4;

                FinalTable.getOutputTileByIndex(s).out = Res;
            }
            return FinalTable;
        }, importExistingTable: function (ExistingTable) {
            if (!(ExistingTable.getNumOfStates()===NumOfStates && ExistingTable.getNumOfInputs()===NumOfInputs))
                return false;
            for (let s=0; s<NumOfStates; s++) {
                InputOutNodes[s].value=OutTilePrint(ExistingTable.getOutputTileByIndex(s).out);
                for (let i=0; i<NumOfInputs; i++) {
                    InputNodes[s][i].value=PrintFutureState(ExistingTable.getContentTileByIndex(s, i).Linkedstate);
                }
            }
        }
    }
}


function MealyUserTable(NumOfStates, NumOfInputs, NumOfOutputs) {
    var InputContentNodes = createArray(NumOfStates, NumOfInputs);
    var InputOutNodes = createArray(NumOfStates, NumOfInputs);
    return {
        PrintTable: function (NodeToPrintInto) {
            var Table = document.createElement("table");
            Table.setAttribute("class", "mealyusertable");
            var NumOfBits = Math.ceil(Math.log2(NumOfInputs));

            var UpperLeftIndexHeader = document.createElement("th");
            UpperLeftIndexHeader.innerHTML = "Stato | ingresso";
            var TableRowIndex = document.createElement("tr");
            TableRowIndex.appendChild(UpperLeftIndexHeader);
            for (let i = 0; i < NumOfInputs; i++) {
                //let StrToPrint = (i.toString()) + "=";
                let StrToPrint = String();
                var Bin = DecToBin(i, NumOfBits);
                for (let iter = 0; iter < Bin.length; iter++) {
                    StrToPrint = StrToPrint.concat(Bin[iter]);
                }
                let StateIndexHeader = document.createElement("th");
                StateIndexHeader.innerHTML = StrToPrint;
                TableRowIndex.appendChild(StateIndexHeader);
            }
            Table.appendChild(TableRowIndex);
            for (let s = 0; s < NumOfStates; s++) {
                let TableRow = document.createElement("tr");
                let TableHeader = document.createElement("th");
                TableHeader.innerHTML = "S" + s.toString();
                TableRow.appendChild(TableHeader);
                for (let i = 0; i < NumOfInputs; i++) {
                    let TableData = document.createElement("td");

                    let SLabel = document.createElement("label");
                    SLabel.innerHTML = "S ";

                    let ContentInput = document.createElement("input");
                    ContentInput.setAttribute("type", "text");
                    InputContentNodes[s][i] = ContentInput;

                    let OutInput = document.createElement("input");
                    OutInput.setAttribute("type", "text");
                    InputOutNodes[s][i] = OutInput;

                    TableData.appendChild(SLabel);
                    TableData.appendChild(ContentInput);
                    let SlashLbl = document.createElement("label");
                    SlashLbl.innerHTML = " / ";
                    TableData.appendChild(SlashLbl);
                    TableData.appendChild(OutInput);
                    TableRow.appendChild(TableData);
                }
                Table.appendChild(TableRow);
            }
            NodeToPrintInto.appendChild(Table);
        }, getMealyTable: function () {
            var FinalTable = MealyTable(NumOfStates, NumOfInputs);
            FillColumnsIndexFirstStep(FinalTable, NumOfInputs);

            for (let s = 0; s < NumOfStates; s++) {
                FinalTable.getStateIndexTile(s).value = s;

                for (let i = 0; i < NumOfInputs; i++) {
                    let FutureStateStr = InputContentNodes[s][i].value.trim();
                    if (FutureStateStr.length === 0)
                        return -1;
                    let Tile = FinalTable.getContentTileByIndex(s, i);
                    if (FutureStateStr !== "-") {
                        let FutureState = parseInt(FutureStateStr);
                        if (isNaN(FutureState))
                            return -2;
                        if (FutureState < 0 || FutureState >= NumOfStates)
                            return -3;

                        Tile.Linkedstate = FutureState;
                    } else {
                        Tile.Linkedstate = -1;
                    }

                    let CurrOut = InputOutNodes[s][i].value.trim();
                    if (CurrOut.length === 0)
                        return -1;
                    if (CurrOut.length !== NumOfOutputs)
                        return -5;
                    let Res = BuildOutputArray(CurrOut);
                    if (Res === null)
                        return -4;

                    Tile.out = Res;
                }
            }
            return FinalTable;
        }, importExistingTable: function (ExistingTable) {
            if (!(ExistingTable.getNumOfStates()===NumOfStates && ExistingTable.getNumOfInputs()===NumOfInputs))
                return false;
            for (let s=0; s<NumOfStates; s++) {
                for (let i=0; i<NumOfInputs; i++) {
                    let CurrTile=ExistingTable.getContentTileByIndex(s, i);
                    InputOutNodes[s][i].value=OutTilePrint(CurrTile.out);
                    InputContentNodes[s][i].value=PrintFutureState(CurrTile.Linkedstate);
                }
            }
        }
    }
}
function SolveOrchestrator(NumOfStates, NumOfInputs, TableContainer, OneHotCoding, FFTransitions, Bits, Implement, isMoore, NumOfOutputs, ExistingTable, HomeState) {
    var UserTable;
    if (isMoore) {
        UserTable = MooreUserTable(NumOfStates, NumOfInputs, NumOfOutputs);
    } else {
        UserTable = MealyUserTable(NumOfStates, NumOfInputs, NumOfOutputs);
    }
    let Indent_0Div=IndentDivGenerator();
    TableContainer.appendChild(Indent_0Div);
    let Indent2_0Div;
    if (!ExistingTable)
        Indent_0Div.appendChild(h3NodeGenerator("Tabella degli stati della macchina da semplificare"));
    Indent2_0Div=Indent2DivGenerator();
    Indent_0Div.appendChild(Indent2_0Div);

    //Indent2_0Div.appendChild(DivNodeGenerator("Inserisci stati futuri e valori per tutte le uscite:"));
    let InputSuggestion=DivNodeGenerator(" - per Don't Care, sia per stati che per uscite");
    InputSuggestion.setAttribute("class", "notes");
    Indent2_0Div.appendChild(InputSuggestion);
    UserTable.PrintTable(Indent2_0Div);
    if (ExistingTable)
        UserTable.importExistingTable(ExistingTable);

    var Par = document.createElement("div");

    var HomeStateLbl = document.createElement("label");
    HomeStateLbl.setAttribute("for", "customhomestate");
    HomeStateLbl.innerHTML = "Stato iniziale: ";
    Par.appendChild(HomeStateLbl);

    var HomeStateInput = document.createElement("input");
    HomeStateInput.setAttribute("type", "number");
    HomeStateInput.setAttribute("min", "0");
    HomeStateInput.setAttribute("max", (NumOfStates - 1).toString());
    HomeStateInput.setAttribute("id", "customhomestate");
    if (ExistingTable)
        HomeStateInput.setAttribute("value", HomeState);
    HomeStateInput.style.marginRight = "1em";

    Par.appendChild(HomeStateInput);

    var TableContainer2 = document.createElement("div");

    var Button = document.createElement("input");
    Button.value = "Semplificazione";
    Button.setAttribute("type", "button");
    var FillErrorNode=document.createElement("p");
    FillErrorNode.setAttribute("class", "presenterror");
    Button.addEventListener("click", function () {
        FillErrorNode.innerHTML = "";
        TableContainer2.innerHTML = "";
        var HomeState = parseInt(HomeStateInput.value);
        if (isNaN(HomeState)) {
            FillErrorNode.innerHTML = "Inserisci un valore di stato iniziale valido";
            HomeStateLbl.setAttribute("class", "presenterror");
            return;
        } else
            HomeStateLbl.removeAttribute("class");
        if (!(HomeState>=0 && HomeState<NumOfStates)) {
            FillErrorNode.innerHTML = "Lo stato iniziale inserito non esiste";
            HomeStateLbl.setAttribute("class", "presenterror");
            return;
        } else
            HomeStateLbl.removeAttribute("class");

        var FinalTable;
        if (isMoore)
            FinalTable = UserTable.getMooreTable();
        else
            FinalTable = UserTable.getMealyTable();
        if (FinalTable === -1) {
            FillErrorNode.innerHTML = "Compila tutte le celle della tabella.";
            return;
        }
        if (FinalTable === -2) {
            FillErrorNode.innerHTML = "Puoi inserire solo numeri o - (per DC) nelle celle degli stati.";
            return;
        }
        if (FinalTable === -3) {
            FillErrorNode.innerHTML = "Hai inserito nella tabella stati futuri inesistenti.";
            return;
        }
        if (FinalTable === -4) {
            FillErrorNode.innerHTML = "Puoi inserire solo 0, 1 o - (per DC) nelle celle delle uscite.";
            return;
        }
        if (FinalTable === -5) {
            if (NumOfOutputs===1)
                FillErrorNode.innerHTML = "Inserisci uno e un solo valore in ogni cella di uscita.";
            else
                FillErrorNode.innerHTML = "Inserisci " + NumOfOutputs.toString() + " valori (uno per uscita) in ogni cella di uscita.";
            return;
        }
        if (isMoore) {
            MooreTileProto.ToPrint = MooreStandardContentPrint;
        } else {
            MealyTileProto.ToPrint = MealyStandardContentPrint;
        }
        StateIndexTileProto.ToPrint = StandardStIndexPrint;

        //FinalTable.printTable(TableContainer2);
        if (isMoore) {
            SimplifyTableMoore(FinalTable, HomeState, TableContainer2, NumOfStates, NumOfInputs, Implement, FFTransitions, OneHotCoding, HasDCinputMooreHandler(FinalTable, HomeState), HasDCoutputMooreHandler(FinalTable, HomeState), NumOfOutputs);
        } else {
            SimplifyTableMealy(FinalTable, HomeState, TableContainer2, NumOfStates, NumOfInputs, Implement, FFTransitions, OneHotCoding, HasDCMealyHandler(FinalTable, HomeState, true), HasDCMealyHandler(FinalTable, HomeState, false), NumOfOutputs);
        }
        TableContainer2.scrollIntoView();
    });
    Par.appendChild(FillErrorNode);
    Par.appendChild(Button);
    Indent2_0Div.appendChild(Par);
    TableContainer.appendChild(TableContainer2);
}

function MooreTable(numofstates, numofinputs) {
    var StatesTableImpl = createArray(numofstates + 1, numofinputs + 2);
    for (let i = 1; i < numofinputs + 1; i++)
        StatesTableImpl[0][i] = new InputIndexTile();
    for (let i = 1; i < numofstates + 1; i++)
        StatesTableImpl[i][0] = new StateIndexTile();
    for (let r = 1; r < numofstates + 1; r++) {
        for (let c = 1; c < numofinputs + 1; c++) {
            StatesTableImpl[r][c] = new MooreTile();
        }
    }
    for (let i = 1; i < numofstates + 1; i++)
        StatesTableImpl[i][numofinputs + 1] = new MooreOutTile();
    return {
        setContentTileByIndex: function (Index, Input, Tile) {
            //    if (!(Tile.prototype===MooreTileProto))
            //      return false;
            StatesTableImpl[Index + 1][Input + 1] = Tile;
        },
        getContentTileByIndex: function (Index, Input) {
            return StatesTableImpl[Index + 1][Input + 1];
        },
        setContentTileByState: function (StateNum, Input, Tile) {
            this.setContentTileByIndex(this.getIndexNumber(StateNum), Input, Tile);
        },
        getContentTileByState: function (StateNum, Input) {
            return this.getContentTileByIndex(this.getIndexNumber(StateNum), Input);
        },
        setStateIndexTile: function (Index, Tile) {
            //   if (!(Tile.prototype===StateIndexTileProto))
            //     return false;
            StatesTableImpl[Index + 1][0] = Tile;
        },
        getStateIndexTile: function (Index) {
            return StatesTableImpl[Index + 1][0];
        },
        setInputIndexTile: function (Input, Tile) {
            //  if (!(Tile.prototype===InputIndexTileProto))
            //    return false;
            StatesTableImpl[0][Input + 1] = Tile;
        },
        getOutputTileByIndex: function (Index) {
            return StatesTableImpl[Index + 1][numofinputs + 1];
        },
        setOutputTileByIndex: function (Index, Tile) {
            //  if (!(Tile.prototype===MooreOutTileProto))
            //    return false;
            StatesTableImpl[Index + 1][numofinputs + 1] = Tile;
        },
        getOutputTileByState: function (StateNum) {
            return this.getOutputTileByIndex(this.getIndexNumber(StateNum));
        },
        setOutputTileByState: function (StateNum, Tile) {
            this.setOutputTileByIndex(this.getIndexNumber(StateNum), Tile);
        },
        getInputIndexTile: function (Input) {
            return StatesTableImpl[0][Input + 1];
        },
        getIndexNumber: function (State) {
            for (let s = 0; s < numofstates; s++)
                if (this.getStateIndexTile(s).value === State)
                    return s;
        },
        printTable: function (NodeToPrintInto) {
            var ContainerParNode=document.createElement("div");
            var Table = document.createElement("table");
            Table.setAttribute("class", "mooretable");
            var IndexRow = document.createElement("tr");
            IndexRow = CreateColumnIndexNodes(IndexRow, StatesTableImpl, numofinputs);
            const thout = document.createElement("th");
            thout.innerHTML = "OUT";
            IndexRow.appendChild(thout);
            Table.appendChild(IndexRow);

            for (let r = 1; r < numofstates + 1; r++) {
                const tr = document.createElement("tr");
                const rowindex = document.createElement("th");
                rowindex.innerHTML = StatesTableImpl[r][0].ToPrint();
                tr.appendChild(rowindex);
                for (let c = 1; c < numofinputs + 1; c++) {
                    const td = document.createElement("td");
                    td.innerHTML = StatesTableImpl[r][c].ToPrint();
                    tr.appendChild(td);
                }
                const td = document.createElement("td");
                td.innerHTML = StatesTableImpl[r][numofinputs + 1].ToPrint();
                tr.appendChild(td);
                Table.appendChild(tr);
            }
            ContainerParNode.appendChild(Table);
            NodeToPrintInto.appendChild(ContainerParNode);
        },
        getNumOfStates: function () {
            return numofstates;
        },
        getNumOfInputs: function () {
            return numofinputs;
        },
        removeState: function (State) {
            StatesTableImpl.splice(State + 1, 1);
            numofstates--;
        },
        addState: function () {
            StatesTableImpl.push(new Array(numofinputs + 2));
            numofstates++;
            StatesTableImpl[numofstates][0] = new StateIndexTile();
            StatesTableImpl[numofstates][numofinputs + 1] = new MooreOutTile();
            for (let c = 1; c < numofinputs + 1; c++) {
                StatesTableImpl[numofstates][c] = new MooreTile();
            }
        },
        swapStates: function (State1, State2, SwapNames) {
            swapStatesCommon(State1, State2, SwapNames, StatesTableImpl, numofstates, numofinputs);
        }
    }
}
//processing and algorithmic functions
function RandomFutureState(Tile, NumOfStates) {
    // if (!(Tile.prototype===MooreTileProto || Tile.prototype===MealyTileProto))
    //   return false;
    Tile.Linkedstate = Math.round(Math.random() * (NumOfStates - 1));
    return Tile;
}

function RandomOutput(Tile, NumOfOutputs) {
    // if (!(Tile.prototype===MooreOutTileProto))
    //   return false;
    var Res = new Array(NumOfOutputs);
    for (let i = 0; i < NumOfOutputs; i++)
        Res[i] = Math.round(Math.random());
    Tile.out = Res;
    return Tile;
}

function DecToBin(DecimalNum, NumOfBits) {
    var Binario = new Array(NumOfBits);

    var i=NumOfBits-1;
    while (DecimalNum>0) {
        const Quoziente=Math.trunc(DecimalNum/2);
        const Resto=DecimalNum-(Quoziente*2);
        Binario[i]=Resto.toString();
        DecimalNum=Quoziente;
        i--
    }

    var ZeroString=(0).toString();
    while (i>=0) {
        Binario[i]=ZeroString;
        i--;
    }

    return Binario;
}
//string in input
function BinToDec(BinaryNumStr) {
    var Parziale=0;
    var Multiplier=1;
    for (let i=(BinaryNumStr.length-1); i>=0; i--) {
        Parziale+=BinaryNumStr[i]*Multiplier;
        Multiplier=Multiplier*2;
    }
    return Parziale;
}
function DecToOneHot(DecimalNum, NumOfBits) {
    var OneHot=new Array(NumOfBits);

    var ZeroString=(0).toString();
    let RightIVal=NumOfBits-DecimalNum-1;
    for (let i=0; i<NumOfBits; i++) {
        if (i===RightIVal)
            OneHot[i]=(1).toString();
        else {
            OneHot[i] = ZeroString;
        }
    }
    return OneHot;
}
function ReplaceWithMatchingFF(CurrentStatusStrArr, FutureStatusStrArr, Bits, FFTransitions) {
    var ResultArray=new Array(Bits);
    for (let i=0; i<Bits; i++) {
        let Choice=BinToDec((CurrentStatusStrArr[i]+FutureStatusStrArr[i]));
        ResultArray[i]=FFTransitions[Choice];
    }
    return ResultArray;
}
function FillColumnsIndexFirstStep(Table, NumOfInputs) {
    var NumOfBits=Math.ceil(Math.log2(NumOfInputs));
    for (let i=0; i<NumOfInputs; i++) {
        const CurrTile=Table.getInputIndexTile(i);
        CurrTile.value=i;
        CurrTile.binaryValue=DecToBin(i, NumOfBits);
        Table.setInputIndexTile(i, CurrTile);
    }
    return Table;
}
function EncodeStates(Table, NumOfStates, NumOfInputs, OneHot, Bits) {
    if (OneHot) {
        for (let s=0; s<NumOfStates; s++) {
            const CurrTile = Table.getStateIndexTile(s);
            CurrTile.value = DecToOneHot(s, Bits);
            Table.setStateIndexTile(s, CurrTile);
            for (let i = 0; i < NumOfInputs; i++) {
                let CurrTile = Table.getContentTileByIndex(s, i);
                if (CurrTile.Linkedstate === -1) {
                    let Temp = new Array(Bits);
                    for (let tmp = 0; tmp < Bits; tmp++)
                        Temp[tmp] = "-";
                    CurrTile.value = Temp;
                } else
                    CurrTile.value = DecToOneHot(CurrTile.Linkedstate, Bits);
                Table.setContentTileByIndex(s, i, CurrTile);
            }
        }
    } else {
        for (let s=0; s<NumOfStates; s++) {
            const CurrTile = Table.getStateIndexTile(s);
            CurrTile.value = DecToBin(s, Bits);
            Table.setStateIndexTile(s, CurrTile);
            for (let i = 0; i < NumOfInputs; i++) {
                let CurrTile = Table.getContentTileByIndex(s, i);
                if (CurrTile.Linkedstate === -1) {
                    let Temp = new Array(Bits);
                    for (let tmp = 0; tmp < Bits; tmp++)
                        Temp[tmp] = "-";
                    CurrTile.value = Temp;
                } else
                    CurrTile.value = DecToBin(CurrTile.Linkedstate, Bits);
                Table.setContentTileByIndex(s, i, CurrTile);
            }
        }
    }
    return Table;
}
function TurnIntoExcitationsTable(Table, NumOfStates, NumOfInputs, FFTransition, Bits) {
    for (let s = 0; s < NumOfStates; s++) {
        const Status = Table.getStateIndexTile(s).value;
        for (let i = 0; i < NumOfInputs; i++) {
            let TileToEdit = Table.getContentTileByIndex(s, i);
            if (TileToEdit.Linkedstate !== -1)
                TileToEdit.value = ReplaceWithMatchingFF(Status, TileToEdit.value, Bits, FFTransition);
            //Table.setContentTileByIndex(s, i, TileToEdit);
        }
    }
}

function ArrayToStringAsCsv(BinaryStrArr) {
    var ToPrintStr = String();
    ToPrintStr = ToPrintStr.concat(BinaryStrArr);
    return ToPrintStr;
}

function BinaryToString(BinaryStrArr) {
    var StrToPrint = String();
    for (let i = 0; i < BinaryStrArr.length; i++) {
        StrToPrint = StrToPrint += BinaryStrArr[i];
    }
    return StrToPrint;
}
function BinaryToStringAsCsvMoore() {
    return ArrayToStringAsCsv(this.value);
}
function BinaryToStringMoore() {
    return BinaryToString(this.value);
}
function BinaryToStringAsCsvMealy() {
    ToPrintStr = (ArrayToStringAsCsv(this.value) + " / " + OutTilePrint(this.out));
    return ToPrintStr;
}
function BinaryToStringMealy() {
    ToPrintStr=(BinaryToString(this.value)+" / "+ OutTilePrint(this.out));
    return ToPrintStr;
}
function ImplementTable(Table, TableContainer, FFTransition, NumOfStates, NumOfInputs, OneHot, Bits, isMealy) {
    PrintRequiredFFNum(TableContainer, Bits);
    EncodeStates(Table, NumOfStates, NumOfInputs, OneHot, Bits);
    //set proper print functions for tiles
    if (isMealy) {
        StateIndexTileProto.ToPrint=BinaryToStringMoore;
        MealyTileProto.ToPrint= BinaryToStringMealy;
    } else {
        StateIndexTileProto.ToPrint = BinaryToStringMoore;
        MooreTileProto.ToPrint = BinaryToStringMoore;
    }
    TableContainer.appendChild(DivNodeGenerator("Tabella degli stati codificata:"));
    Table.printTable(TableContainer);
    //implement Flip Flop
    TurnIntoExcitationsTable(Table, NumOfStates, NumOfInputs, FFTransition, Bits);
    if (isMealy) {
        StateIndexTileProto.ToPrint=BinaryToStringAsCsvMoore;
        MealyTileProto.ToPrint = BinaryToStringAsCsvMealy;
    } else {
        StateIndexTileProto.ToPrint = BinaryToStringAsCsvMoore;
        MooreTileProto.ToPrint = BinaryToStringAsCsvMoore;
    }
    TableContainer.appendChild(DivNodeGenerator("Tabella delle eccitazioni:"));
    Table.printTable(TableContainer);
}

function PrintRequiredFFNum(NodeToPrintInto, NumOfFFs) {
    var parel=document.createElement("div");
    if (NumOfFFs===1)
        parel.innerHTML = "Richiesto 1 registro di memoria (Flip Flop).";
    else
        parel.innerHTML = "Richiesti " + (NumOfFFs.toString()) + " registri di memoria (Flip Flop).";
    NodeToPrintInto.appendChild(parel);
}

function ReachTreeNode(Value) {
    this.value = Value;
    this.sons = [];
}

function PrintReachTreeRecursor(Root) {
    var ToPrint = String();
    if (Root.value !== -1) {
        if (Root.sons.length > 0)
            ToPrint = " " + (Root.value).toString() + " {";
        else
            ToPrint = " " + (Root.value).toString();

        for (let i = 0; i < Root.sons.length; i++) {
            ToPrint = ToPrint.concat(PrintReachTreeRecursor(Root.sons[i]));
        }

        if (Root.sons.length > 0)
            ToPrint = ToPrint.concat(" }");
    }
    return ToPrint;
}
function ReachTreeRecurs(Encountered, Root, MainRoot, Table, NodeToPrintInto, Verbose) {
    //write sons statuses
    var NumOfInputs=Table.getNumOfInputs();
    var CurrStatuses=new Array(Table.getNumOfStates());
    for (let tmp=0; tmp<CurrStatuses.length; tmp++)
        CurrStatuses[tmp]=false;

    for (let i=0; i<NumOfInputs; i++) {
        let Linkedstate = Table.getContentTileByIndex(Root.value, i).Linkedstate;
        if (Linkedstate !== -1 && CurrStatuses[Linkedstate] === false) {
            Root.sons.push(new ReachTreeNode(Linkedstate));
            CurrStatuses[Linkedstate] = true;
        }
    }
    if (Verbose)
        var ToPrint = PrintReachTreeRecursor(MainRoot) + " -> ";
    //check whether sons have already been checked and mark them in case
    for (let i=0; i<Root.sons.length; i++) {
        if (Encountered[Root.sons[i].value]===true)
            Root.sons[i].value=-1;
        else
            Encountered[Root.sons[i].value]=true;
    }
    if (Verbose) {
        var ReachabilityAnalNode = document.createElement("div");
        ReachabilityAnalNode.innerHTML = ToPrint + PrintReachTreeRecursor(MainRoot);
        NodeToPrintInto.appendChild(ReachabilityAnalNode);
    }
    //recursion on sons
    for (let i=0; i<Root.sons.length; i++) {
        if (Root.sons[i].value!==-1) {
            Encountered = ReachTreeRecurs(Encountered, Root.sons[i], MainRoot, Table, NodeToPrintInto, Verbose);
        }
    }
    return Encountered;
}
function CheckUnreachable(Table, HomeState, NodeToPrintInto, Verbose) {
    var Encountered=new Array(Table.getNumOfStates());
    for (let i=0; i<Encountered.length; i++) {
        Encountered[i]=false;
    }
    Encountered[HomeState]=true;
    var Root = new ReachTreeNode(HomeState, Table.getNumOfInputs());

    return ReachTreeRecurs(Encountered, Root, Root, Table, NodeToPrintInto, Verbose);
}
function DeleteUnreachableStates(TableContainer, Table, HomeState, Verbose) {
    //var NumOfInputs=Table.getNumOfInputs();
    var NumOfStates=Table.getNumOfStates();
    if (Verbose) {
        var HomeStateNode = document.createElement("div");
        HomeStateNode.innerHTML = "Stato iniziale: S" + HomeState.toString();
        TableContainer.appendChild(HomeStateNode);
    }
    //delete not encountered statuses
    var Encountered = CheckUnreachable(Table, HomeState, TableContainer, Verbose);
    var RemovedStates = [];
    let offset = 0;
    for (let i=0; i<Encountered.length; i++) {
        if (Encountered[i]===false) {
            Table.removeState(i-offset);
            offset++;
            RemovedStates.push(i);
        }
    }

    if (Verbose) {
        var RemovedStatesNode = document.createElement("div");
        if (RemovedStates.length > 0) {
            if (RemovedStates.length === 1)
                RemovedStatesNode.innerHTML = "Stato " + RemovedStates.toString() + " irraggiungibile. Lo elimino.";
            else
                RemovedStatesNode.innerHTML = "Stati " + RemovedStates.toString() + " irraggiungibili. Li elimino.";

            //NumOfStates=Table.getNumOfStates();
            TableContainer.appendChild(RemovedStatesNode);
            Table.printTable(TableContainer);
            /*
            questo algotirmo assegna a tutti gli stati, in modo ordinato, nuovi numeri di stato in ordine crescente partendo da 0 (utile nel caso in cui siano stati rimossi stati irraggiungibili)
            let Changed=false;
            for (let s=0; s<NumOfStates; s++) {
                let OldState=Table.getStateIndexTile(s).value;
                if (OldState!==s) {
                    Changed=true;
                    Table.getStateIndexTile(s).value = s;
                    let NewName=document.createElement("div");
                    NewName.innerHTML="Stato "+OldState.toString()+" diventa "+s.toString();
                    TableContainer.appendChild(NewName);
                    for (let si = 0; si < NumOfStates; si++) {
                        for (let i = 0; i < NumOfInputs; i++) {
                            let CurrTile = Table.getContentTileByIndex(si, i);
                            if (CurrTile.Linkedstate === OldState)
                                CurrTile.Linkedstate = s;
                        }
                    }
                }
            }
            if (Changed)
                Table.printTable(TableContainer);
             */
        } else {
            RemovedStatesNode.innerHTML = "Tutti gli stati sono raggiungibili.";
            TableContainer.appendChild(RemovedStatesNode);
        }
    }
}
function AreAllStatesReachable(EncounteredArray) {
    for (let i=0; i<EncounteredArray.length; i++) {
        if (EncounteredArray[i] === false) {
            return false;
        }
    }
    return true;
}
function HowManyUnreachables(EncounteredArray) {
    var counter=0;
    for (let i=0; i<EncounteredArray.length; i++) {
        if (EncounteredArray[i] === false) {
            counter++;
        }
    }
    return counter;
}
function ShuffleStates(Table, NumOfStates, HomeState) {
    for (let State1 = 0; State1 < NumOfStates; State1++) {
        if (State1 !== HomeState) {
            let State2;
            do {
                State2 = Math.round(Math.random() * (NumOfStates - 1));
            } while (State2 === HomeState);

            Table.swapStates(State1, State2, false);
        }
    }
}

function ReArrange(Entropy) {
    return Math.round(Math.random() * 100) < Math.round(Entropy);
}

function RedundantRandomizer(NumOfCopies) {
    return Math.round(Math.random() * (NumOfCopies - 1));
}

//PAULL UNGER ALGORITHM____________
var PHTileProto = {
    onInputFutureStateArr: null,
    onInputFutureStateIndis: null,
    areDist: false,
    areIndist: false,
    toPrint: function (changed, FullySpecified) {
        var StringToPrint = String();
        if (this.areDist === true) {
            StringToPrint = "X";
        } else if (FullySpecified && (this.areIndist || !changed)) {
            StringToPrint = "~";
        } else {
            for (let i = 0; i < this.onInputFutureStateArr.length; i++) {
                let currInputFutureState = this.onInputFutureStateArr[i];
                let currInputIndist = this.onInputFutureStateIndis[i];
                /*if (currInputFutureState === true)
                    CurrString = ("i" + (i.toString()) + ":{==}<br>");*/
                if (currInputFutureState !== true) {
                    let CurrString = String();
                    let diff = true;
                    for (let int = i - 1; int >= 0 && diff === true; int--) {
                        if (currInputFutureState[0] === this.onInputFutureStateArr[int][0] && currInputFutureState[1] === this.onInputFutureStateArr[int][1]) {
                            diff = false;
                        }
                    }
                    if (diff) {
                        if (currInputIndist === true)
                            if (FullySpecified)
                                CurrString += "~";
                            else
                                CurrString += "V";

                        CurrString = ("{" + (currInputFutureState[0].toString()) + "-" + (currInputFutureState[1].toString()) + "}<br>");
                        StringToPrint = StringToPrint.concat(CurrString);
                    }
                }
            }
            if (this.areIndist || !changed)
                StringToPrint = StringToPrint.concat("V");
        }
        return StringToPrint;
    }
};

function PHTile() {
    this.onInputFutureStateArr = null;
    this.onInputFutureStateIndis = null;
}

PHTile.prototype = PHTileProto;

function PaullUngerTable(NumOfStates, NumOfInputs, FullySpecified) {
    var RealStates = new Array(NumOfStates);
    var NumOfRows = NumOfStates - 1;
    var TableImpl = new Array(NumOfRows);
    /*
    for (let i=0; i<NumOfStates; i++)
        RealStates[i]=i;*/
    var IndexChanged = false;
    var MaxArrayBound = NumOfRows - 1;
    for (let i = 0; i < NumOfRows; i++) {
        TableImpl[i] = new Array(i + 1);
        for (let intern = 0; intern < i + 1; intern++) {
            TableImpl[i][intern] = new PHTile();
            TableImpl[i][intern].onInputFutureStateArr = new Array(NumOfInputs);
            TableImpl[i][intern].onInputFutureStateIndis = new Array(NumOfInputs);
        }
    }

    function AdjustCoord(State1, State2) {
        if (State1 === State2) {
            console.log("Invalid PHTable bounds: same state requested");
            return null;
        }
        if (State2 >= State1) {
            const TmpState1 = State1;
            State1 = State2;
            State2 = TmpState1;
        }
        State1--;
        if (State1 > MaxArrayBound || State1 < 0 || State2 > MaxArrayBound || State2 < 0) {
            console.log("Invalid PHTable bounds");
            return null;
        }
        return [State1, State2];
    }

    function getRealNumber(index) {
        if (RealStates[index])
            return RealStates[index];
        else
            return index;
    }

    return {
        getPHTileByIndex: function (State1Index, State2Index) {
            const Coordinates = AdjustCoord(State1Index, State2Index);
            return TableImpl[Coordinates[0]][Coordinates[1]];
        },
        setPHTileByIndex: function (State1Index, State2Index, Tile) {
            const Coordinates = AdjustCoord(State1Index, State2Index);
            TableImpl[Coordinates[0]][Coordinates[1]] = Tile;
        },
        printTable: function (NodeToPrintInto, changed) {
            var ContainerParNode = document.createElement("div");
            var TableNode = document.createElement("table");
            TableNode.setAttribute("class", "paullungertable");
            for (let r = 0; r < NumOfRows; r++) {
                const RowNode = document.createElement("tr");
                const CurrRow = TableImpl[r];
                const RowIndex = document.createElement("th");
                RowIndex.innerHTML = ("S" + ((getRealNumber(r + 1)).toString()));
                RowNode.appendChild(RowIndex);
                for (let c = 0; c < r + 1; c++) {
                    const TDNode = document.createElement("td");
                    TDNode.innerHTML = CurrRow[c].toPrint(changed, FullySpecified);
                    RowNode.appendChild(TDNode);
                }
                TableNode.appendChild(RowNode);
            }
            const ColumnIndexRowNode = document.createElement("tr");
            ColumnIndexRowNode.appendChild(document.createElement("th"));
            for (let c = 0; c < NumOfRows; c++) {
                const ColumnIndex = document.createElement("th");
                ColumnIndex.innerHTML = ("S" + ((getRealNumber(c)).toString()));
                ColumnIndexRowNode.appendChild(ColumnIndex);
            }
            TableNode.appendChild(ColumnIndexRowNode);
            ContainerParNode.appendChild(TableNode);
            NodeToPrintInto.appendChild(ContainerParNode);
        },
        setStateNumber: function (index, RealNumber) {
            if (index !== RealNumber) {
                IndexChanged = true;
                RealStates[index] = RealNumber;
            }
        },
        getPHTileByNumber: function (State1, State2) {
            return this.getPHTileByIndex(this.getIndexNumber(State1), this.getIndexNumber(State2));
        },
        setPHTileByNumber: function (State1, State2, Tile) {
            this.setPHTileByIndex(this.getIndexNumber(State1), this.getIndexNumber(State2), Tile);
        },
        getIndexNumber: function (State) {
            if (IndexChanged === true) {
                for (let i = 0; i < NumOfStates; i++) {
                    if (RealStates[i] && RealStates[i] === State)
                        return i;
                }
            }
            return State;
        },
        getStateNumber: function (Index) {
            if (IndexChanged === true && RealStates[Index]) {
                return RealStates[Index];
            }
            return Index
        }
    }
}

function PrintPaullUngerIntro(NodeToPrintInto, FullySpecified) {
    var Title = document.createElement("h3");
    if (FullySpecified)
        Title.innerHTML = "Analisi di equivalenza";
    else
        Title.innerHTML = "Analisi di compatibilità";
    NodeToPrintInto.appendChild(Title);
}

function PauLLUngerDoNextSteps(PHTable, NumOfStates, NumOfInputs, TableContainer, Verbose) {
    var changed;
    var iter = 1;
    do {
        changed = false;
        for (let s1 = 0; s1 < NumOfStates - 1; s1++) {
            for (let s2 = s1 + 1; s2 < NumOfStates; s2++) {
                let PHTile = PHTable.getPHTileByIndex(s1, s2);
                if (PHTile.areIndist === false && PHTile.areDist === false) {
                    let areIndist = true;
                    for (let inp = 0; inp < NumOfInputs; inp++) {
                        let CurrInputFutureState = PHTile.onInputFutureStateArr[inp];
                        if (PHTile.onInputFutureStateIndis[inp] === false) {
                            if (((CurrInputFutureState[0] === PHTable.getStateNumber(s1) || CurrInputFutureState[0] === PHTable.getStateNumber(s2)) && (CurrInputFutureState[1] === PHTable.getStateNumber(s1) || CurrInputFutureState[1] === PHTable.getStateNumber(s2))) || PHTable.getPHTileByNumber(CurrInputFutureState[0], CurrInputFutureState[1]).areIndist === true) {
                                changed = true; //not needed
                                PHTile.onInputFutureStateIndis[inp] = true;
                            } else {
                                areIndist = false;
                                if (PHTable.getPHTileByNumber(CurrInputFutureState[0], CurrInputFutureState[1]).areDist === true) {
                                    PHTile.areDist = true;
                                    changed = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (areIndist) {
                        PHTile.areIndist = true;
                        changed = true;
                    }
                }
            }
        }
        if (Verbose) {
            if (changed && iter===1)
                TableContainer.appendChild(DivNodeGenerator("Propagazione delle distinguibilità:"));
            if (changed === false) {
                TableContainer.appendChild(DivNodeGenerator("Tabella delle implicazioni finale:"));
            }
            PHTable.printTable(TableContainer, changed);
        }
        iter++;
    } while (changed);

    var AtLeastOneCompat = false;
    for (let s1 = 0; s1 < NumOfStates - 1; s1++) {
        for (let s2 = s1 + 1; !AtLeastOneCompat && s2 < NumOfStates; s2++) {
            let Tile = PHTable.getPHTileByIndex(s1, s2);
            if (Tile.areDist === false)
                AtLeastOneCompat = true;
        }
    }
    return AtLeastOneCompat;
}

function FromNumberToLetters(Index) {
    var Alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var Quot = Math.floor(Index / Alphabet.length);
    if (Quot === 0) {
        return Alphabet[Index];
    }
    var Resto = Math.floor(Index % (Alphabet.length * Quot));
    return Alphabet[Resto] + Quot.toString();
}

function CreateMaxCompatibilityClasses(PHTable, NumOfStates, NodeToPrintInto, Verbose, FullySpecified) {
    var InitialStates = new Array(NumOfStates);
    for (let s = 0; s < NumOfStates; s++) {
        InitialStates[s] = PHTable.getStateNumber(s);
    }
    if (Verbose) {
        if (FullySpecified)
            NodeToPrintInto.appendChild(DivNodeGenerator("Identificazione delle classi di equivalenza:"));
        else
            NodeToPrintInto.appendChild(DivNodeGenerator("Identificazione delle classi di massima compatibilità:"));

        NodeToPrintInto.appendChild(DivNodeGenerator("Insieme degli stati: {" + ArrayToStringAsCsv(InitialStates) + "}"));
    }

    //var Final=new Array();
    var GlobalResult = new Array(NumOfStates);
    var Tmp = new Array(1);
    Tmp[0] = InitialStates;
    GlobalResult[0] = Tmp;
    for (let iter = 0; iter < NumOfStates - 1 && GlobalResult[iter]; iter++) {
        let CurrIterResult = [];
        let IncompatibileStates = [];

        for (let s2index = iter + 1; s2index < NumOfStates; s2index++) {
            if (PHTable.getPHTileByIndex(iter, s2index).areDist === true)
                IncompatibileStates.push(InitialStates[s2index]);
        }
        let CurrState = InitialStates[iter];

        var StrToPrint;
        if (Verbose) {
            StrToPrint = "Analizzo S" + CurrState.toString();
            if (IncompatibileStates.length === 0)
                StrToPrint += ": nessuna incompatibilità -> ";
            else
                StrToPrint += ": incompatibile con " + ArrayToStringAsCsv(IncompatibileStates) + " -> ";
        }

        for (let block = 0; block < GlobalResult[iter].length; block++) {
            let StateFound = false;
            let FoundOnce = false;
            //let AllAnalysed=true;
            let WithState = [];
            let WithoutState = [];

            for (let s = 0; s < GlobalResult[iter][block].length; s++) {
                if (GlobalResult[iter][block][s] === CurrState) {
                    StateFound = true;
                    WithState.push(CurrState);
                } else {
                    WithoutState.push(GlobalResult[iter][block][s]);
                    let FoundIncompat = false;
                    for (let inc = 0; inc < IncompatibileStates.length; inc++) {
                        if (GlobalResult[iter][block][s] === IncompatibileStates[inc]) {
                            FoundOnce = true;
                            FoundIncompat = true;
                            break;
                        }
                    }
                    if (FoundIncompat === false)
                        WithState.push(GlobalResult[iter][block][s]);
                }
            }
            if (StateFound && FoundOnce) {
                CurrIterResult.push(WithState);
                CurrIterResult.push(WithoutState);
                if (Verbose)
                    StrToPrint += "{" + ArrayToStringAsCsv(WithState) + "} {" + ArrayToStringAsCsv(WithoutState) + "}, "
            } else {
                CurrIterResult.push(GlobalResult[iter][block]);
                if (Verbose)
                    StrToPrint += "{" + ArrayToStringAsCsv(GlobalResult[iter][block]) + "}, "
            }
        }
        GlobalResult[iter + 1] = CurrIterResult;
        if (Verbose)
            NodeToPrintInto.appendChild(DivNodeGenerator(StrToPrint));
    }

    let cln = 0;
    var ClassesStr = String();
    for (let c1 = 0; c1 < GlobalResult[NumOfStates - 1].length; c1++) {
        let equal = false;
        for (let c2 = 0; c2 < GlobalResult[NumOfStates - 1].length; c2++) {
            if (c1 !== c2) {
                let equal1 = true;
                for (let s1 = 0; s1 < GlobalResult[NumOfStates - 1][c1].length; s1++) {
                    let found = false;
                    for (let s2 = 0; s2 < GlobalResult[NumOfStates - 1][c2].length; s2++) {
                        if (GlobalResult[NumOfStates - 1][c1][s1] === GlobalResult[NumOfStates - 1][c2][s2]) {
                            found = true;
                            break;
                        }
                    }
                    if (found === false) {
                        equal1 = false;
                        break;
                    }
                }
                if (equal1) {
                    equal = true;
                    break;
                }
            }
        }
        if (equal) {
            GlobalResult[NumOfStates - 1].splice(c1, 1);
            c1--;
        } else {
            if (Verbose) {
                ClassesStr += FromNumberToLetters(cln) + ": {" + ArrayToStringAsCsv(GlobalResult[NumOfStates - 1][c1]) + "} ";
                cln++;
            }
        }
    }
    if (Verbose)
        NodeToPrintInto.appendChild(DivNodeGenerator("Classi: " + ClassesStr));

    return GlobalResult[NumOfStates - 1];
}

function PrintSimplifiedTableTitle(TableContainer) {
    TableContainer.appendChild(DivNodeGenerator("Tabella degli stati della macchina minima:"));
}
function PrintInitialPHTable(NodeToPrintInto) {
    NodeToPrintInto.appendChild(DivNodeGenerator("Realizzazione della tabella delle implicazioni iniziale:"));
}

function AreOutputCompatible(Output1, Output2, DCoutput) {
    /*if (!Output1 instanceof String)
        Output1=Output1.toString();
    if (!Output2 instanceof String)
        Output2=Output2.toString();
*/
    if (Output1.length !== Output2.length) {
        return false;
    }
    for (let i = 0; i < Output1.length; i++) {
        if (!(Output1[i] === Output2[i] || (DCoutput && (Output1[i] === -1 || Output2[i] === -1)))) {
            return false;
        }
    }
    return true;
}

function PaullUngerOrchestratorMealy(TableToFillWith, NumOfStates, NumOfInputs, TableContainer, Verbose, DCinput, DCoutput) {
    let PUindent;
    if (Verbose) {
        PrintPaullUngerIntro(TableContainer, !(DCinput || DCoutput));
        PUindent=Indent2DivGenerator();
        TableContainer.appendChild(PUindent);
        PrintInitialPHTable(PUindent);
    }
    //set-up table
    var AtLeastOneCompat = false;
    var PHTable = PaullUngerTable(NumOfStates, NumOfInputs, !(DCinput || DCoutput));
    for (let s1 = 0; s1 < NumOfStates - 1; s1++) {
        for (let s2 = s1 + 1; s2 < NumOfStates; s2++) {
            let PHTile = PHTable.getPHTileByIndex(s1, s2);
            let areIndist = true;
            for (let inp = 0; inp < NumOfInputs; inp++) {
                let Tile1 = TableToFillWith.getContentTileByIndex(s1, inp);
                let Tile2 = TableToFillWith.getContentTileByIndex(s2, inp);
                let RealS1Number = TableToFillWith.getStateIndexTile(s1).value;
                let RealS2Number = TableToFillWith.getStateIndexTile(s2).value;
                PHTable.setStateNumber(s1, RealS1Number);
                PHTable.setStateNumber(s2, RealS2Number);
                if (!AreOutputCompatible(Tile1.out, Tile2.out, DCoutput)) {
                    PHTile.areDist = true;
                    areIndist = false;
                    break;
                }
                if ((DCinput && (Tile1.Linkedstate === -1 || Tile2.Linkedstate === -1)) || (Tile1.Linkedstate === Tile2.Linkedstate) || ((Tile1.Linkedstate === RealS1Number || Tile1.Linkedstate === RealS2Number) && (Tile2.Linkedstate === RealS1Number || Tile2.Linkedstate === RealS2Number))) {
                    AtLeastOneCompat = true;
                    PHTile.onInputFutureStateArr[inp] = true;
                    PHTile.onInputFutureStateIndis[inp] = true;
                } else {
                    PHTile.onInputFutureStateIndis[inp] = false;
                    areIndist = false;
                    let TempArr = new Array(2);
                    TempArr[0] = Tile1.Linkedstate;
                    TempArr[1] = Tile2.Linkedstate;
                    PHTile.onInputFutureStateArr[inp] = TempArr;
                }
            }
            if (areIndist) {
                PHTile.areIndist = true;
            }
        }
    }
    if (Verbose)
        PHTable.printTable(PUindent, true);

    if (!(AtLeastOneCompat && PauLLUngerDoNextSteps(PHTable, NumOfStates, NumOfInputs, PUindent, Verbose)))
        return null;

    return CreateMaxCompatibilityClasses(PHTable, NumOfStates, PUindent, Verbose, !(DCinput || DCoutput));
}

function inWhichClique(StateToSearch, CliquesArr) {
    for (let c = 0; c < CliquesArr.length; c++) {
        let CurrClique = CliquesArr[c];
        for (let s = 0; s < CurrClique.length; s++)
            if (CurrClique[s] === StateToSearch)
                return c;
    }
}

function PaullUngerOrchestratorMoore(TableToFillWith, NumOfStates, NumOfInputs, TableContainer, Verbose, DCinput, DCoutput) {
    let PUindent;
    if (Verbose) {
        PrintPaullUngerIntro(TableContainer, !(DCinput || DCoutput));
        PUindent=Indent2DivGenerator();
        TableContainer.appendChild(PUindent);
        PrintInitialPHTable(PUindent);
    }
    //set-up table
    var AtLeastOneCompat = false;
    var PHTable = PaullUngerTable(NumOfStates, NumOfInputs, !(DCinput || DCoutput));
    for (let s1 = 0; s1 < NumOfStates - 1; s1++) {
        for (let s2 = s1 + 1; s2 < NumOfStates; s2++) {
            let PHTile = PHTable.getPHTileByIndex(s1, s2);
            let OutTile1 = TableToFillWith.getOutputTileByIndex(s1);
            let OutTile2 = TableToFillWith.getOutputTileByIndex(s2);
            let RealS1Number = TableToFillWith.getStateIndexTile(s1).value;
            let RealS2Number = TableToFillWith.getStateIndexTile(s2).value;

            PHTable.setStateNumber(s1, RealS1Number);
            PHTable.setStateNumber(s2, RealS2Number);
            if (AreOutputCompatible(OutTile1.out, OutTile2.out, DCoutput)) {
                let areIndist = true;
                for (let inp = 0; inp < NumOfInputs; inp++) {
                    let Tile1 = TableToFillWith.getContentTileByIndex(s1, inp);
                    let Tile2 = TableToFillWith.getContentTileByIndex(s2, inp);
                    if ((DCinput && (Tile1.Linkedstate === -1 || Tile2.Linkedstate === -1)) || (Tile1.Linkedstate === Tile2.Linkedstate) || ((Tile1.Linkedstate === RealS1Number || Tile1.Linkedstate === RealS2Number) && (Tile2.Linkedstate === RealS1Number || Tile2.Linkedstate === RealS2Number))) {
                        AtLeastOneCompat = true;
                        PHTile.onInputFutureStateArr[inp] = true;
                        PHTile.onInputFutureStateIndis[inp] = true;
                    } else {
                        PHTile.onInputFutureStateIndis[inp] = false;
                        areIndist = false;
                        let TempArr = new Array(2);
                        TempArr[0] = Tile1.Linkedstate;
                        TempArr[1] = Tile2.Linkedstate;
                        PHTile.onInputFutureStateArr[inp] = TempArr;
                    }
                }
                if (areIndist) {
                    PHTile.areIndist = true;
                }
            } else {
                PHTile.areDist = true;
            }
        }
    }
    if (Verbose)
        PHTable.printTable(PUindent, true);

    if (!(AtLeastOneCompat && PauLLUngerDoNextSteps(PHTable, NumOfStates, NumOfInputs, PUindent, Verbose)))
        return null;

    return CreateMaxCompatibilityClasses(PHTable, NumOfStates, PUindent, Verbose, !(DCinput || DCoutput));
}

//END OF PAULL UNGER ALGORITHM____________
function h3NodeGenerator(TextToPrint) {
    var Node = document.createElement("h3");
    Node.innerHTML = TextToPrint;
    return Node;
}

function h2NodeGenerator(TextToPrint) {
    var Node = document.createElement("h2");
    Node.innerHTML = TextToPrint;
    return Node;
}

function DivNodeGenerator(TextToPrint) {
    var Node = document.createElement("div");
    Node.innerHTML = TextToPrint;
    return Node;
}

function IndentDivGenerator() {
    var NewDiv=document.createElement("div");
    NewDiv.setAttribute("class", "indent1");
    return NewDiv;
}
function Indent2DivGenerator() {
    var NewDiv=document.createElement("div");
    NewDiv.setAttribute("class", "indent2");
    return NewDiv;
}
function PrintInitialState(NodeToPrintInto, HomeState) {
    var InitialStateStr = "Stato iniziale: S" + parseInt(HomeState);
    NodeToPrintInto.appendChild(DivNodeGenerator(InitialStateStr));
}

function PrintGenerateMainIntro(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h2NodeGenerator("Generazione della tabella degli stati"));
}

function PrintGenerateIntro(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h3NodeGenerator("Generazione della tabella degli stati secondo le specifiche indicate"));
}

function PrintGenerateMinimumIntro(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h3NodeGenerator("Generazione della tabella degli stati della macchina minima secondo le specifiche indicate"));
}

function PrintSolveIntro(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h2NodeGenerator("Semplificazione"));
}

function PrintUnreachebleStatesGenerated(NodeToPrintInto, UnreachablesNum, DCinput) {
    var ToPrint;
    if (DCinput)
        ToPrint = "La replicazione e le condizioni DC su stati hanno generato " + UnreachablesNum.toString();
    else
        ToPrint = "La replicazione ha generato " + UnreachablesNum.toString();

    if (UnreachablesNum === 1)
        ToPrint += " stato irraggiungibile.";
    else
        ToPrint += " stati irraggiungibili.";
    NodeToPrintInto.appendChild(DivNodeGenerator(ToPrint));
}

function PrintUnreachableStatesAdded(NodeToPrintInto, AddedNum, TotalNum) {
    var ToPrint = "Aggiunta di " + AddedNum.toString();
    if (AddedNum === 1)
        ToPrint += " stato irraggiungibile";
    else
        ToPrint += " stati irraggiungibili";
    ToPrint += " per ottenere " + TotalNum.toString();
    if (TotalNum === 1)
        ToPrint += " stato irraggiungibile totale.";
    else
        ToPrint += " stati irraggiungibili totali.";
    NodeToPrintInto.appendChild(DivNodeGenerator(ToPrint));
}

function PrintImplementTitle(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h3NodeGenerator("Implementazione"));
}

function PrintUnreachableDeleteTitle(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h3NodeGenerator("Identificazione degli stati irraggiungibili"));
}

function PrintReplicateTitle(NodeToPrintInto, NumOfCopies) {
    if (NumOfCopies===1)
        NodeToPrintInto.appendChild(h3NodeGenerator("Replicazione (1 volta) e accoppiamento"));
    else
        NodeToPrintInto.appendChild(h3NodeGenerator("Replicazione ("+NumOfCopies.toString()+" volte) e accoppiamento"));
}

function PrintDCTitle(NodeToPrintInto) {
    NodeToPrintInto.appendChild(h3NodeGenerator("Aggiunta delle condizioni di Don't Care"));
}

function CreateMinimumTableMoore(Cliques, TableContainer, NumOfStatesRedu, NumOfInputs, TableRedu, NumOfOutputs) {
    var SimplifiedMoore;
    var SimplifiedNumOfS = Cliques.length;
    PrintSimplifiedTableTitle(TableContainer);
    if (SimplifiedNumOfS < NumOfStatesRedu) {
        //PrintClasses(Cliques, TableContainer);
        SimplifiedMoore = MooreTable(SimplifiedNumOfS, NumOfInputs);
        FillColumnsIndexFirstStep(SimplifiedMoore, NumOfInputs);
        StateIndexTileProto.ToPrint = function () {
            return this.value;
        };
        MooreTileProto.ToPrint=function () {
            if (this.Linkedstate===-1)
                return "-";
            return this.value.toString();
        };
        for (let s = 0; s < SimplifiedNumOfS; s++) {
            const CurrTile = SimplifiedMoore.getStateIndexTile(s);
            CurrTile.value = FromNumberToLetters(s);
            SimplifiedMoore.setStateIndexTile(s, CurrTile);
            let OutTileToBeWritten = SimplifiedMoore.getOutputTileByIndex(s);

            let OutToBuild = new Array(NumOfOutputs);
            for (let it = 0; it < NumOfOutputs; it++) {
                OutToBuild[it] = -1;
            }
            let SpecifiedOutFound = false;
            for (let int1 = 0; !SpecifiedOutFound && int1 < Cliques[s].length; int1++) {
                let Curr = TableRedu.getOutputTileByState(Cliques[s][int1]);
                for (let it = 0; it < NumOfOutputs; it++) {
                    if (Curr.out[it] !== -1 && OutToBuild[it] === -1) {
                        OutToBuild[it] = Curr.out[it];
                    }
                }
                let FullySpecifiedOut = true;
                for (let it = 0; it < NumOfOutputs; it++) {
                    if (OutToBuild[it] === -1)
                        FullySpecifiedOut = false;
                }
                if (FullySpecifiedOut) {
                    SpecifiedOutFound = true;
                }
            }
            OutTileToBeWritten.out = OutToBuild;
            for (let i = 0; i < NumOfInputs; i++) {
                let SpecifiedStateFound = false;
                let ToBeWritten = SimplifiedMoore.getContentTileByIndex(s, i);
                for (let int = 0; !SpecifiedStateFound && int < Cliques[s].length; int++) {
                    let Curr = TableRedu.getContentTileByState(Cliques[s][int], i);
                    if (Curr.Linkedstate !== -1) {
                        SpecifiedStateFound = true;
                        ToBeWritten.Linkedstate = inWhichClique(Curr.Linkedstate, Cliques);
                        ToBeWritten.value=FromNumberToLetters(ToBeWritten.Linkedstate);
                    }
                }
                if (!SpecifiedStateFound) {
                    ToBeWritten.Linkedstate = -1;
                }
            }
        }
        SimplifiedMoore.printTable(TableContainer);
    } else {
        PrintAlreadyMinimum(TableContainer);
        SimplifiedMoore = TableRedu;
    }
    return SimplifiedMoore;
}

function HasDCoutputMooreRecurs(Table, HomeState, VisitedNodes) {
    if (HasBeenVisited(VisitedNodes, HomeState))
        return VisitedNodes;

    var CurrOut = Table.getOutputTileByState(HomeState).out;
    if (OutHasAtLeastOneDC(CurrOut))
        return true;

    VisitedNodes.push(HomeState);
    for (let i = 0; i < Table.getNumOfInputs(); i++) {
        let FutureState = Table.getContentTileByState(HomeState, i).Linkedstate;
        if (FutureState !== -1) {
            let Res = HasDCoutputMooreRecurs(Table, FutureState, VisitedNodes);
            if (Res === true)
                return true;
            else
                VisitedNodes = Res;
        }
    }
    return VisitedNodes;
}
function HasDCoutputMooreHandler(Table, HomeState) {
    return HasDCoutputMooreRecurs(Table, HomeState, []) === true;
}

function HasDCinputMooreRecurs(Table, HomeState, VisitedNodes) {
    if (HasBeenVisited(VisitedNodes, HomeState))
        return VisitedNodes;

    VisitedNodes.push(HomeState);
    for (let i = 0; i < Table.getNumOfInputs(); i++) {
        let FutureState = Table.getContentTileByState(HomeState, i).Linkedstate;
        if (FutureState === -1) {
            return true;
        } else {
            let Res = HasDCinputMooreRecurs(Table, FutureState, VisitedNodes);
            if (Res === true)
                return true;
            else
                VisitedNodes = Res;
        }
    }
    return VisitedNodes;
}

function HasDCinputMooreHandler(Table, HomeState) {
    return HasDCinputMooreRecurs(Table, HomeState, []) === true;
}

function HasDCMealyRecurs(Table, HomeState, VisitedNodes, onInput) {
    if (HasBeenVisited(VisitedNodes, HomeState))
        return VisitedNodes;

    VisitedNodes.push(HomeState);
    for (let i = 0; i < Table.getNumOfInputs(); i++) {
        let CurrTile = Table.getContentTileByState(HomeState, i);
        let FutureState = CurrTile.Linkedstate;
        if (onInput === true) {
            if (FutureState === -1)
                return true;
        } else {
            if (OutHasAtLeastOneDC(CurrTile.out))
                return true;
        }
        if (FutureState !== -1) {
            let Res = HasDCMealyRecurs(Table, FutureState, VisitedNodes, onInput);
            if (Res === true)
                return true;
            else
                VisitedNodes = Res;
        }
    }
    return VisitedNodes;
}

function HasDCMealyHandler(Table, HomeState, onInput) {
    return HasDCMealyRecurs(Table, HomeState, [], onInput) === true;
}

function CreateMinimumTableMealy(Cliques, TableContainer, NumOfStatesRedu, NumOfInputs, TableRedu, NumOfOutputs) {
    var SimplifiedNumOfS = Cliques.length;
    var SimplifiedMealy;
    PrintSimplifiedTableTitle(TableContainer);
    if (SimplifiedNumOfS < NumOfStatesRedu) {
        //PrintClasses(Cliques, TableContainer);
        SimplifiedMealy = MealyTable(SimplifiedNumOfS, NumOfInputs);
        FillColumnsIndexFirstStep(SimplifiedMealy, NumOfInputs);
        StateIndexTileProto.ToPrint = function () {
            return this.value;
        };
        MealyTileProto.ToPrint=function () {
            var State;
            if (this.Linkedstate===-1)
                State="-";
            else
                State=this.value.toString();
            return State+" / "+OutTilePrint(this.out);
        };
        for (let s = 0; s < SimplifiedNumOfS; s++) {
            const CurrTile = SimplifiedMealy.getStateIndexTile(s);
            CurrTile.value = FromNumberToLetters(s);
            SimplifiedMealy.setStateIndexTile(s, CurrTile);

            for (let i = 0; i < NumOfInputs; i++) {
                let Tile = SimplifiedMealy.getContentTileByIndex(s, i);

                let OutToBuild = new Array(NumOfOutputs);
                for (let it = 0; it < NumOfOutputs; it++) {
                    OutToBuild[it] = -1;
                }
                let SpecifiedOutFound = false;

                let SpecifiedStateFound = false;
                for (let int = 0; !(SpecifiedStateFound && SpecifiedOutFound) && int < Cliques[s].length; int++) {
                    let ContentTile = TableRedu.getContentTileByState(Cliques[s][int], i);
                    if (!SpecifiedStateFound && ContentTile.Linkedstate !== -1) {
                        SpecifiedStateFound = true;
                        Tile.Linkedstate = inWhichClique(ContentTile.Linkedstate, Cliques);
                        Tile.value=FromNumberToLetters(Tile.Linkedstate);
                    }
                    if (!SpecifiedOutFound) {
                        for (let it = 0; it < NumOfOutputs; it++) {
                            if (ContentTile.out[it] !== -1 && OutToBuild[it] === -1) {
                                OutToBuild[it] = ContentTile.out[it];
                            }
                        }

                        let FullySpecifiedOut = true;
                        for (let it = 0; it < NumOfOutputs; it++) {
                            if (OutToBuild[it] === -1)
                                FullySpecifiedOut = false;
                        }
                        if (FullySpecifiedOut) {
                            SpecifiedOutFound = true;
                        }
                    }
                }
                Tile.out = OutToBuild;
                if (!SpecifiedStateFound) {
                    Tile.Linkedstate = -1;
                }
            }
        }
        SimplifiedMealy.printTable(TableContainer);
    } else {
        PrintAlreadyMinimum(TableContainer);
        //PrintSimplifiedTableTitle(TableContainer);
        SimplifiedMealy = TableRedu;
    }
    return SimplifiedMealy;
}

MooreStandardContentPrint = function () {
    if (this.Linkedstate === -1)
        return "-";
    else
        return ("S" + this.Linkedstate);
};
StandardStIndexPrint = function () {
    return ("S" + this.value);
};

//ORCHESTRATORS______
function MooreOrchestratorAdvanced(NumOfStates, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, NumOfCopies, DesiredUnreachable, Entropy, Implement, DCinput, DCoutput, Options, NumOfOutputs, DCinputConstraint, DCoutputConstraint, InstantSimplify, MinimumLimit, MaximumLimit) {
    var FullySpecified = true;
    if (DCinput || DCoutput)
        FullySpecified = false;
    var Table;
    var HomeState = 0;
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            break;
        }
        TableContainer.innerHTML = "";
        var FoundMinimum = false;
        var attempts = 0;
        //var HomeState;
        while (FoundMinimum === false) {
            if (attempts===MaxIterationsForStep) {
                AlertTimeout();
                break;
            }
            Table = MooreTable(NumOfStates, NumOfInputs);
//1st step (table generation using random values)
            FillColumnsIndexFirstStep(Table, NumOfInputs);
            //fill row index (statues) value and content tiles+output with random values
            Table = SetUpTableContentMoore(Table, NumOfStates, NumOfInputs, false, 100, false, 100, HomeState, NumOfOutputs);
            for (let i = 0; i < NumOfStates && FoundMinimum === false; i++) {
                if (AreAllStatesReachable(CheckUnreachable(Table, i, TableContainer, false))) {
                    let PHRes = PaullUngerOrchestratorMoore(Table, NumOfStates, NumOfInputs, TableContainer, false, false, false);
                    if (PHRes === null || PHRes.length === NumOfStates) {
                        FoundMinimum = true;
                        //HomeState = i;
                        Table.swapStates(i, 0, false);
                    }
                    break;
                }
            }
            attempts++;
        }

        if (!FullySpecified || MinimumLimit || MaximumLimit)
            TableContainer.style.display = "none";

        //set "how to print" function in content tiles
        MooreTileProto.ToPrint = MooreStandardContentPrint;
        StateIndexTileProto.ToPrint = StandardStIndexPrint;
        PrintGenerateMainIntro(TableContainer);
        var IndentDiv=IndentDivGenerator();
        TableContainer.appendChild(IndentDiv);
        PrintGenerateMinimumIntro(IndentDiv);
        let Indent2_0Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2_0Div);
        PrintInitialState(Indent2_0Div, HomeState);
        Table.printTable(Indent2_0Div);

        PrintReplicateTitle(IndentDiv, NumOfCopies);
        let Indent2_1Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2_1Div);
        var NumOfStatesRedu = NumOfStates * NumOfCopies;
        var TableRedu = MooreTable(NumOfStatesRedu, NumOfInputs);
        FillColumnsIndexFirstStep(TableRedu, NumOfInputs);
        for (let s = 0; s < NumOfStates; s++) {
            for (let repl = 0; repl < NumOfCopies; repl++) {
                let CurrState = s + repl * NumOfStates;
                let CurrStateIndex = TableRedu.getStateIndexTile(CurrState);
                CurrStateIndex.value = CurrState;
                for (let i = 0; i < NumOfInputs; i++) {
                    let ReferState = Table.getContentTileByIndex(s, i);
                    let CurrContent = TableRedu.getContentTileByIndex(CurrState, i);
                    if (ReArrange(Entropy))
                        CurrContent.Linkedstate = ReferState.Linkedstate + RedundantRandomizer(NumOfCopies) * NumOfStates;
                    else
                        CurrContent.Linkedstate = ReferState.Linkedstate + repl * NumOfStates;
                }
                TableRedu.getOutputTileByIndex(CurrState).out = [...Table.getOutputTileByIndex(s).out];
            }
        }
        TableRedu.printTable(Indent2_1Div);

        var RealUnreachables;
        if (!DCinput) {
            RealUnreachables = HowManyUnreachables(CheckUnreachable(TableRedu, HomeState, IndentDiv, false));
            PrintUnreachebleStatesGenerated(Indent2_1Div, RealUnreachables, DCinput);
        }

        if (!FullySpecified)
            PrintDCTitle(IndentDiv);
        iter++;
    } while ((DCinput && DCinputOrchestratorMoore(TableRedu, HomeState, Options["DCinputProbability"] , DCinputConstraint)===false) || (DCoutput && DCoutputOrchestratorMoore(TableRedu, HomeState, Options["DCoutputProbability"], DCoutputConstraint)===false) || LimitsViolated(true, MinimumLimit, MaximumLimit, TableRedu, HomeState, NumOfStatesRedu, NumOfInputs, DCinput, DCoutput));
    TableContainer.style.display = "block";
    let Indent2_2Div=Indent2DivGenerator();
    IndentDiv.appendChild(Indent2_2Div);
    TableRedu.printTable(Indent2_2Div);

    if (DCinput) {
        RealUnreachables = HowManyUnreachables(CheckUnreachable(TableRedu, HomeState, IndentDiv, false));
        PrintUnreachebleStatesGenerated(Indent2_2Div, RealUnreachables, DCinput);
    }

    if (RealUnreachables < DesiredUnreachable) {
        let FirstAddedStateNum = TableRedu.getNumOfStates();
        IndentDiv.appendChild(h3NodeGenerator("Modifica per rispettare il vincolo imposto sul numero di stati irraggiungibili"));
        let Indent2_3Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2_3Div);
        let ToBeAdded = DesiredUnreachable - RealUnreachables;
        PrintUnreachableStatesAdded(Indent2_3Div, ToBeAdded, DesiredUnreachable);
        NumOfStatesRedu = TableRedu.getNumOfStates() + ToBeAdded;
        //NumOfInputs = TableRedu.getNumOfInputs();
        for (let ctr = 0; ctr < ToBeAdded; ctr++) {
            TableRedu.addState();
            let NewStateNum = TableRedu.getNumOfStates() - 1;
            TableRedu.getStateIndexTile(NewStateNum).value = NewStateNum;
            RandomOutput(TableRedu.getOutputTileByIndex(NewStateNum), NumOfOutputs);
            for (let i = 0; i < NumOfInputs; i++) {
                const WrittenTile = RandomFutureState(TableRedu.getContentTileByIndex(NewStateNum, i), NumOfStatesRedu);
                TableRedu.setContentTileByIndex(NewStateNum, i, WrittenTile);
            }
        }
        if (DCoutput)
            AddDCtoOutputMoore(TableRedu, Options["DCoutputProbability"], false, false,[FirstAddedStateNum,]);
        if (DCinput)
            AddDCtoInput(TableRedu, Options["DCinputProbability"], false, false, [FirstAddedStateNum,]);
        TableRedu.printTable(Indent2_3Div);
    }

    IndentDiv.appendChild(h3NodeGenerator("Tabella degli stati finale"));
    ShuffleStates(TableRedu, NumOfStatesRedu, HomeState);
    let Indent2_4Div=Indent2DivGenerator();
    IndentDiv.appendChild(Indent2_4Div);
    Indent2_4Div.appendChild(DivNodeGenerator("Ordino casualmente gli stati:"));
    if (InstantSimplify) {
        TableRedu.printTable(Indent2_4Div);
        SimplifyTableMoore(TableRedu, HomeState, TableContainer, NumOfStatesRedu, NumOfInputs, Implement, FFTransition, OneHot, DCinput, DCoutput, NumOfOutputs);
    } else {
        SolveOrchestrator(NumOfStatesRedu, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, Implement, true, NumOfOutputs, TableRedu, HomeState);
    }
}

function DCoutputOrchestratorMoore(Table, HomeState, DCoutputProbability, Constraint) {
    let ResCheck;
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            return false;
        }
        if (AddDCtoOutputMoore(Table, DCoutputProbability, true, Constraint)===false)
            return false;
        ResCheck = HasDCoutputMooreHandler(Table, HomeState);
        iter++;
    } while (!ResCheck);
    return (ResCheck && (!Constraint || NotAllUndefinedMooreHandler(Table, HomeState)));
}

function DCinputOrchestratorMoore(Table, HomeState, DCinputProbability, Constraint) {
    let ResCheck;
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            return false;
        }
        if (AddDCtoInput(Table, DCinputProbability, true, Constraint)===false)
            return false;
        ResCheck = HasDCinputMooreHandler(Table, HomeState);
        iter++;
    } while (!ResCheck);
    return ResCheck;
}

function SetUpTableContentMoore(Table, NumOfStates, NumOfInputs, DCinput, DCinputProbability, DCoutput, DCoutputProbability, HomeState, NumOfOutputs, DCinputConstraint, DCoutputConstraint) {
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            break;
        }
        for (let s = 0; s < NumOfStates; s++) {
            const CurrTile = Table.getStateIndexTile(s);
            CurrTile.value = s;
            Table.setStateIndexTile(s, CurrTile);
        }
        for (let s = 0; s < NumOfStates; s++) {
            //outputs
            let Otile = Table.getOutputTileByIndex(s);
            Otile = RandomOutput(Otile, NumOfOutputs);
            Table.setOutputTileByIndex(s, Otile);
            //content
            for (let i = 0; i < NumOfInputs; i++) {
                let Tile = Table.getContentTileByIndex(s, i);
                Tile = RandomFutureState(Tile, NumOfStates);
                Table.setContentTileByIndex(s, i, Tile);
            }
        }
        iter++;
    } while ((DCinput && DCinputOrchestratorMoore(Table, HomeState, DCinputProbability, DCinputConstraint) === false) || (DCoutput && DCoutputOrchestratorMoore(Table, HomeState, DCoutputProbability, DCoutputConstraint) === false));
    return Table;
}

function SimplifyTableMoore(Table, HomeState, TableContainer, NumOfStates, NumOfInputs, Implement, FFTransition, OneHot, DCinput, DCoutput, NumOfOutputs) {
    var SimplifiedNumOfS = NumOfStates;
    var SimplifiedMoore = Table;
    if (NumOfStates>1 || Implement)
        PrintSolveIntro(TableContainer);
    var IndentDiv=IndentDivGenerator();
    TableContainer.appendChild(IndentDiv);
    if (NumOfStates > 1) {
        PrintUnreachableDeleteTitle(IndentDiv);
        let UnreachableIndent=Indent2DivGenerator();
        IndentDiv.appendChild(UnreachableIndent);
        DeleteUnreachableStates(UnreachableIndent, Table, HomeState, true);
        NumOfStates = Table.getNumOfStates();
        SimplifiedNumOfS=NumOfStates;
        //ImplementTable(SimplifiedMoore, TableContainer, FFTransition, SimplifiedNumOfS, NumOfInputs, OneHot, SimplifiedBits);
        if (NumOfStates > 1) {

            var PHRes = PaullUngerOrchestratorMoore(Table, NumOfStates, NumOfInputs, IndentDiv, true, DCinput, DCoutput);
            let Indent2Div=Indent2DivGenerator();
            IndentDiv.appendChild(Indent2Div);
            if (PHRes === null) {
                PrintAlreadyMinimum(Indent2Div);
            } else {
                SimplifiedNumOfS = PHRes.length;
                SimplifiedMoore = CreateMinimumTableMoore(PHRes, Indent2Div, NumOfStates, NumOfInputs, Table, NumOfOutputs);
            }
        }
    }
    if (Implement) {
        PrintImplementTitle(IndentDiv);

        let Indent2Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2Div);

        var SimplifiedBits;
        if (OneHot || SimplifiedNumOfS === 1)
            SimplifiedBits = SimplifiedNumOfS;
        else
            SimplifiedBits = Math.ceil(Math.log2(SimplifiedNumOfS));
        ImplementTable(SimplifiedMoore, Indent2Div, FFTransition, SimplifiedNumOfS, NumOfInputs, OneHot, SimplifiedBits, false);
    }
}

function LimitsViolated(isMoore, MinimumLimit, MaximumLimit, Table, HomeState, NumOfStates, NumOfInputs, DCinput, DCoutput) {
    var Limit=false;
    var Ignore=true;
    if (MaximumLimit && MaximumLimit!==NumOfStates) {
        Limit = MaximumLimit;
        Ignore=false;
    }
    else {
        if (MinimumLimit) {
            if (MinimumLimit>1) {
                Limit = 1;
                Ignore=false;
            }
        }
    }
    let Repeat=false;
    if (MinimumLimit || MaximumLimit) {
        let OutputClasses;
        if (!Ignore) {
            if (isMoore)
                OutputClasses = OutClassesNumMooreHandler(Table, HomeState, Limit);
            else
                OutputClasses = OutClassesNumMealyHandler(Table, HomeState, Limit);
        }
        if (Ignore || ((!MinimumLimit || (MinimumLimit<=1 || OutputClasses > 1)) && (!MaximumLimit || OutputClasses <= MaximumLimit))) {
            let TableCopy;
            if (isMoore) {
                TableCopy = MooreTable(NumOfStates, NumOfInputs);
                for (let s = 0; s < NumOfStates; s++) {
                    TableCopy.getStateIndexTile(s).value = s;
                    TableCopy.getOutputTileByIndex(s).out = Table.getOutputTileByIndex(s).out;
                    for (let i = 0; i < NumOfInputs; i++) {
                        TableCopy.getContentTileByIndex(s, i).Linkedstate = Table.getContentTileByIndex(s, i).Linkedstate;
                    }
                }
            } else {
                TableCopy=MealyTable(NumOfStates, NumOfInputs);
                for (let s = 0; s < NumOfStates; s++) {
                    TableCopy.getStateIndexTile(s).value = s;
                    for (let i = 0; i < NumOfInputs; i++) {
                        let OldTile=Table.getContentTileByIndex(s, i);
                        let NewTile=TableCopy.getContentTileByIndex(s, i);
                        NewTile.Linkedstate = OldTile.Linkedstate;
                        NewTile.out = OldTile.out;
                    }
                }
            }
            DeleteUnreachableStates(undefined, TableCopy, HomeState, false);
            NumOfStates=TableCopy.getNumOfStates();
            let PHRes;
            if (isMoore)
                PHRes = PaullUngerOrchestratorMoore(TableCopy, NumOfStates, NumOfInputs, undefined, false, DCinput, DCoutput);
            else
                PHRes = PaullUngerOrchestratorMealy(TableCopy, NumOfStates, NumOfInputs, undefined, false, DCinput, DCoutput);
            if (PHRes !== null)
                NumOfStates = PHRes.length;
            if (!((!MinimumLimit || NumOfStates >= MinimumLimit) && (!MaximumLimit || NumOfStates <= MaximumLimit))) {
                Repeat = true;
            }
        } else
            Repeat=true;
    }
    return Repeat;
}
function MooreOrchestratorSimple(NumOfStates, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, Implement, DCinput, DCoutput, Options, NumOfOutputs, DCinputConstraint, DCoutputConstraint, InstantSimplify, MinimumLimit, MaximumLimit) {
    var HomeState = 0;
    var iter=0;
    var Table;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            break;
        }
        Table = MooreTable(NumOfStates, NumOfInputs);
        //var HomeState = Math.round(Math.random() * (NumOfStates - 1));
//1st step (table generation using random values)
        FillColumnsIndexFirstStep(Table, NumOfInputs);
        //fill row index (statues) value and content tiles+output with random values
        Table = SetUpTableContentMoore(Table, NumOfStates, NumOfInputs, DCinput, Options["DCinputProbability"], DCoutput, Options["DCoutputProbability"], HomeState, NumOfOutputs, DCinputConstraint, DCoutputConstraint);
        iter++;
    } while (LimitsViolated(true, MinimumLimit, MaximumLimit, Table, HomeState, NumOfStates, NumOfInputs, DCinput, DCoutput));
    PrintGenerateMainIntro(TableContainer);
    var IndentDiv=IndentDivGenerator();
    TableContainer.appendChild(IndentDiv);
    PrintGenerateIntro(IndentDiv);

    if (InstantSimplify) {
        var Indent2Div = Indent2DivGenerator();
        IndentDiv.appendChild(Indent2Div);
        PrintInitialState(Indent2Div, HomeState);
        //set "how to print" function in content tiles
        MooreTileProto.ToPrint = MooreStandardContentPrint;
        StateIndexTileProto.ToPrint = StandardStIndexPrint;
        Table.printTable(Indent2Div);
        SimplifyTableMoore(Table, HomeState, TableContainer, NumOfStates, NumOfInputs, Implement, FFTransition, OneHot, DCinput, DCoutput, NumOfOutputs);
    } else {
        SolveOrchestrator(NumOfStates, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, Implement, true, NumOfOutputs, Table, HomeState);
    }
}

function PrintAlreadyMinimum(NodeToPrintInto) {
    NodeToPrintInto.appendChild(DivNodeGenerator("Tutti gli stati sono distinguibili. La macchina è minima."));
}

function PrintFutureState(LinkedState) {
    if (LinkedState===-1)
        return "-";
    return LinkedState.toString();
}
function MealyStandardContentPrint() {
    var State;
    var Out = OutTilePrint(this.out);
    if (this.Linkedstate === -1)
        State = "- / ";
    else
        State = "S" + this.Linkedstate.toString() + " / ";
    return State + Out;
}

function OutHasDcOnly(Out) {
    for (let i = 0; i < Out.length; i++) {
        if (Out[i] !== -1)
            return false;
    }
    return true;
}

function OutHasAtLeastOneDC(Out) {
    for (let i = 0; i < Out.length; i++) {
        if (Out[i] === -1)
            return true;
    }
    return false;
}

function AddDCtoOutputMoore(Table, DCoutputProbability, DCneeded, Constraint, StateBounds) {
    var NumOfStates = Table.getNumOfStates();
    let Si = 0;
    let Sf = NumOfStates-1;
    if (StateBounds) {
        if (StateBounds[0])
            Si = StateBounds[0];
        if (StateBounds[1])
            Sf = StateBounds[1];
    }

    if (Constraint) {
        var iterO = 0;
        do {
            if (iterO > MaxIterationsForStep)
                return false;

            let LastS = null;
            for (let s = Sf; LastS === null && s >= Si; s--) {
                let Otile = Table.getOutputTileByIndex(s);
                if (!OutHasAtLeastOneDC(Otile.out)) {
                    LastS = s;
                }
            }
            if (LastS === null)
                return false;

            var DCoutputEffective = !DCneeded;
            let AllMarked = true;
            for (let s = Si; s < LastS || (s === LastS && !AllMarked); s++) {
                let Otile = Table.getOutputTileByIndex(s);
                let CurrOut = Otile.out;

                    let CurrNotMarked = true;
                    for (let out = 0; out < CurrOut.length; out++) {
                        if (CurrOut[out]!==-1) {
                            if (ReArrange(DCoutputProbability)) {
                                CurrNotMarked = false;
                                DCoutputEffective = true;
                                Otile.out[out] = -1;
                            }
                        } else {
                            CurrNotMarked=false;
                        }
                    }
                    if (CurrNotMarked)
                        AllMarked = false;
                    else
                        Table.setOutputTileByIndex(s, Otile);

            }
            iterO++;
        } while (DCoutputEffective === false);
    } else {
        for (let s = Si; s <= Sf; s++) {
            let Otile = Table.getOutputTileByIndex(s);
            let CurrOut = Otile.out;
                for (let out = 0; out < CurrOut.length; out++) {
                    if (CurrOut[out]!==-1) {
                        if (ReArrange(DCoutputProbability)) {
                            DCoutputEffective = true;
                            Otile.out[out] = -1;
                        }
                    }
                }
                Table.setOutputTileByIndex(s, Otile);
        }
    }
    return true;
}

function HasBeenVisited(VisitedStatuses, CurrentStatus) {
    for (let i = 0; i < VisitedStatuses.length; i++) {
        if (VisitedStatuses[i] === CurrentStatus)
            return true;
    }
    return false;
}

function NotAllUndefinedMooreRecurs(Table, HomeState, VisitedStatuses) {
    if (HasBeenVisited(VisitedStatuses, HomeState))
        return VisitedStatuses;
    var CurrOut = Table.getOutputTileByState(HomeState).out;
    if (!OutHasAtLeastOneDC(CurrOut)) {
        return true;
    }
    var NumOfInput = Table.getNumOfInputs();
    VisitedStatuses.push(HomeState);
    for (let i = 0; i < NumOfInput; i++) {
        let FutureState = Table.getContentTileByState(HomeState, i).Linkedstate;
        if (FutureState !== -1) {
            let Res = NotAllUndefinedMooreRecurs(Table, FutureState, VisitedStatuses);
            if (Res === true) {
                return true;
            } else {
                VisitedStatuses = Res;
            }
        }
    }
    return VisitedStatuses;
}

function NotAllUndefinedMooreHandler(Table, HomeState) {
    return NotAllUndefinedMooreRecurs(Table, HomeState, []) === true;
}

function CompatibleWithSomething(FoundSymbols, CurrOut) {
    for (let i=0; i<FoundSymbols.length; i++) {
        if (AreOutputCompatible(FoundSymbols[i], CurrOut, true)) {
            for (let int=0; int<CurrOut.length; int++) {
                if (CurrOut[int]!==-1 && FoundSymbols[i][int]===-1)
                    FoundSymbols[i][int]=CurrOut[int];
            }
            return true;
        }
    }
    return false;
}

function OutClassesNumMooreRecurs(Table, HomeState, FoundSymbol, VisitedStatuses, Limit, Equal) {
    if (HasBeenVisited(VisitedStatuses, HomeState))
        return [false, FoundSymbol, VisitedStatuses];
    var CurrOut = Table.getOutputTileByState(HomeState).out;
    if (!OutHasDcOnly(CurrOut)) {
        if (!CompatibleWithSomething(FoundSymbol, CurrOut)) {
            FoundSymbol.push(CurrOut);
            if (Limit && FoundSymbol.length > Limit)
                return [true, FoundSymbol, VisitedStatuses];
        }
    }

    var NumOfInput = Table.getNumOfInputs();
    VisitedStatuses.push(HomeState);
    for (let i = 0; i < NumOfInput; i++) {
        let FutureState = Table.getContentTileByState(HomeState, i).Linkedstate;
        if (FutureState !== -1) {
            let Res = OutClassesNumMooreRecurs(Table, FutureState, FoundSymbol, VisitedStatuses);
            FoundSymbol = Res[1];
            if (Res[0] === true) {
                return Res;
            } else {
                VisitedStatuses = Res[2];
            }
        }
    }
    return [false, FoundSymbol, VisitedStatuses];
}


function OutClassesNumMooreHandler(Table, HomeState, Limit) {
    var Res = OutClassesNumMooreRecurs(Table, HomeState, [], [], Limit);
    return Res[1].length;
}

function NotAllUndefinedMealyRecurs(Table, HomeState, VisitedStatuses) {
    if (HasBeenVisited(VisitedStatuses, HomeState))
        return VisitedStatuses;

    VisitedStatuses.push(HomeState);
    for (let i = 0; i < Table.getNumOfInputs(); i++) {
        let Tile = Table.getContentTileByState(HomeState, i);
        if (!OutHasAtLeastOneDC(Tile.out))
            return true;
        let FutureState = Tile.Linkedstate;
        if (FutureState !== -1) {
            let Ret = NotAllUndefinedMealyRecurs(Table, FutureState, VisitedStatuses);
            if (Ret === true)
                return true;
            else {
                VisitedStatuses = Ret;
            }
        }
    }
    return VisitedStatuses;
}
function NotAllUndefinedMealyHandler(Table, HomeState) {
    return NotAllUndefinedMealyRecurs(Table, HomeState, []) === true;
}

function OutClassesNumMealyRecurs(Table, HomeState, FoundSymbol, VisitedStatuses, Limit) {
    if (HasBeenVisited(VisitedStatuses, HomeState))
        return [false, FoundSymbol, VisitedStatuses];

    for (let i = 0; i < Table.getNumOfInputs(); i++) {
        var CurrOut = Table.getContentTileByState(HomeState, i).out;
        if (!OutHasDcOnly(CurrOut)) {
            if (!CompatibleWithSomething(FoundSymbol[i], CurrOut)) {
                FoundSymbol[i].push(CurrOut);
                if (Limit && FoundSymbol[i].length > Limit)
                    return [true, FoundSymbol, VisitedStatuses];
            }
        }
    }
    VisitedStatuses.push(HomeState);
    for (let i = 0; i < Table.getNumOfInputs(); i++) {
        let FutureState = Table.getContentTileByState(HomeState, i).Linkedstate;
        if (FutureState !== -1) {
            let Ret = OutClassesNumMealyRecurs(Table, FutureState, FoundSymbol, VisitedStatuses);
            FoundSymbol = Ret[1];
            if (Ret[0]===true) {
                return Ret;
            }
            else {
                VisitedStatuses = Ret[2];
            }
        }
    }
    return [false, FoundSymbol, VisitedStatuses];
}

function OutClassesNumMealyHandler(Table, HomeState, Limit) {
    var EmptyFoundSymbol = new Array(Table.getNumOfInputs());
    for (let i = 0; i < EmptyFoundSymbol.length; i++)
        EmptyFoundSymbol[i] = [];

    var Res = OutClassesNumMealyRecurs(Table, HomeState, EmptyFoundSymbol, [], Limit);
    var OutputClasses = Res[1];
    var Max = OutputClasses[0].length;
    for (let i = 1; i < OutputClasses.length; i++)
        if (OutputClasses[i].length > Max)
            Max = OutputClasses[i].length;
    return Max;
}

function MealyOrchestratorAdvanced(NumOfStates, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, NumOfCopies, DesiredUnreachable, Entropy, Implement, DCinput, DCoutput, Options, NumOfOutputs, DCinputConstraint, DCoutputConstraint, InstantSimplify, MinimumLimit, MaximumLimit) {
    var FullySpecified = true;
    if (DCoutput || DCinput)
        FullySpecified = false;
    var Table;
    var iter=0;
    if (!FullySpecified || MinimumLimit || MaximumLimit)
        TableContainer.style.display = "none";
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            break;
        }
        var attempts = 0;
        TableContainer.innerHTML = "";
        var FoundMinimum = false;
        //var HomeState;
        var HomeState = 0;
        while (FoundMinimum === false) {
            if (attempts===MaxIterationsForStep) {
                AlertTimeout();
                break;
            }
            Table = MealyTable(NumOfStates, NumOfInputs);
            //1st step (table generation using random values)
            FillColumnsIndexFirstStep(Table, NumOfInputs);
            //fill row index (statues) value and content tiles+output with random values
            Table = SetUpTableContentMealy(Table, NumOfStates, NumOfInputs, false, 100, false, 100, HomeState, NumOfOutputs);
            for (let i = 0; i < NumOfStates && FoundMinimum === false; i++) {
                if (AreAllStatesReachable(CheckUnreachable(Table, i, TableContainer, false))) {
                    let PHRes = PaullUngerOrchestratorMealy(Table, NumOfStates, NumOfInputs, TableContainer, false, false, false);
                    if (PHRes === null || PHRes.length === NumOfStates) {
                        FoundMinimum = true;
                        //HomeState = i;
                        Table.swapStates(i, 0, false);
                    }
                    break;
                }
            }
            attempts++;
        }
//set "how to print" function in content tiles
        //set "how to print" function in content tiles
        MealyTileProto.ToPrint = MealyStandardContentPrint;
        StateIndexTileProto.ToPrint = StandardStIndexPrint;

        PrintGenerateMainIntro(TableContainer);
        var IndentDiv=IndentDivGenerator();
        TableContainer.appendChild(IndentDiv);
        PrintGenerateMinimumIntro(IndentDiv);
        let Indent2_0Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2_0Div);
        PrintInitialState(Indent2_0Div, HomeState);
        Table.printTable(Indent2_0Div);

        PrintReplicateTitle(IndentDiv, NumOfCopies);
        let Indent2_1Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2_1Div);
        var NumOfStatesRedu = NumOfStates * NumOfCopies;
        var TableRedu = MealyTable(NumOfStatesRedu, NumOfInputs);
        FillColumnsIndexFirstStep(TableRedu, NumOfInputs);
        for (let s = 0; s < NumOfStates; s++) {
            for (let repl = 0; repl < NumOfCopies; repl++) {
                let CurrState = s + repl * NumOfStates;
                let CurrStateIndex = TableRedu.getStateIndexTile(CurrState);
                CurrStateIndex.value = CurrState;
                for (let i = 0; i < NumOfInputs; i++) {
                    let ReferState = Table.getContentTileByIndex(s, i);
                    let CurrContent = TableRedu.getContentTileByIndex(CurrState, i);
                    CurrContent.out = [...ReferState.out];
                    if (ReArrange(Entropy))
                        CurrContent.Linkedstate = ReferState.Linkedstate + RedundantRandomizer(NumOfCopies) * NumOfStates;
                    else
                        CurrContent.Linkedstate = ReferState.Linkedstate + repl * NumOfStates;
                }
            }
        }
        TableRedu.printTable(Indent2_1Div);

        var RealUnreachables;
        if (!DCinput) {
            RealUnreachables = HowManyUnreachables(CheckUnreachable(TableRedu, HomeState, IndentDiv, false));
            PrintUnreachebleStatesGenerated(Indent2_1Div, RealUnreachables, DCinput);
        }

        if (!FullySpecified)
            PrintDCTitle(IndentDiv);
        iter++
    } while ((DCinput && DCinputOrchestratorMealy(TableRedu, HomeState, Options["DCinputProbability"] , DCinputConstraint)===false) || (DCoutput && DCoutputOrchestratorMealy(TableRedu, HomeState, Options["DCoutputProbability"], DCoutputConstraint)===false) || LimitsViolated(false, MinimumLimit, MaximumLimit, TableRedu, HomeState, NumOfStatesRedu, NumOfInputs, DCinput, DCoutput));
    TableContainer.style.display = "block";
    let Indent2_2Div=Indent2DivGenerator();
    IndentDiv.appendChild(Indent2_2Div);
    TableRedu.printTable(Indent2_2Div);
    if (DCinput) {
        RealUnreachables = HowManyUnreachables(CheckUnreachable(TableRedu, HomeState, IndentDiv, false));
        PrintUnreachebleStatesGenerated(Indent2_2Div, RealUnreachables, DCinput);
    }
    if (RealUnreachables < DesiredUnreachable) {
        let ToBeAdded = DesiredUnreachable - RealUnreachables;
        let FirstAddedStateNum = TableRedu.getNumOfStates();
        IndentDiv.appendChild(h3NodeGenerator("Modifica per rispettare il vincolo imposto sul numero di stati irraggiungibili"));
        let Indent2_3Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2_3Div);
        PrintUnreachableStatesAdded(Indent2_3Div, ToBeAdded, DesiredUnreachable);
        NumOfStatesRedu = TableRedu.getNumOfStates() + ToBeAdded;
        //NumOfInputs = TableRedu.getNumOfInputs();
        for (let ctr = 0; ctr < ToBeAdded; ctr++) {
            TableRedu.addState();
            let NewStateNum = TableRedu.getNumOfStates() - 1;

            TableRedu.getStateIndexTile(NewStateNum).value = NewStateNum;
            for (let i = 0; i < NumOfInputs; i++) {
                let WrittenTile = RandomFutureState(TableRedu.getContentTileByIndex(NewStateNum, i), NumOfStatesRedu);
                WrittenTile = RandomOutput(WrittenTile, NumOfOutputs);
                TableRedu.setContentTileByIndex(NewStateNum, i, WrittenTile);
            }
        }
        if (DCoutput)
            AddDCtoOutputMealy(TableRedu, Options["DCoutputProbability"], false, false, [FirstAddedStateNum,]);
        if (DCinput)
            AddDCtoInput(TableRedu, Options["DCinputProbability"], false, false, [FirstAddedStateNum,]);
        TableRedu.printTable(Indent2_3Div);
    }

    IndentDiv.appendChild(h3NodeGenerator("Tabella degli stati finale"));
    ShuffleStates(TableRedu, NumOfStatesRedu, HomeState);
    let Indent2_4Div=Indent2DivGenerator();
    IndentDiv.appendChild(Indent2_4Div);
    Indent2_4Div.appendChild(DivNodeGenerator("Ordino casualmente gli stati:"));

    if (InstantSimplify) {
        TableRedu.printTable(Indent2_4Div);
        SimplifyTableMealy(TableRedu, HomeState, TableContainer, NumOfStatesRedu, NumOfInputs, Implement, FFTransition, OneHot, DCinput, DCoutput, NumOfOutputs);
    } else {
        SolveOrchestrator(NumOfStatesRedu, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, Implement, false, NumOfOutputs, TableRedu, HomeState);
    }
}

function AddDCtoOutputMealy(Table, DCoutputProbability, DCneeded, Constraint, StateBounds, InputBounds) {
    var NumOfStates = Table.getNumOfStates();
    var NumOfInputs = Table.getNumOfInputs();
    let Si = 0;
    let Sf = NumOfStates-1;
    if (StateBounds) {
        if (StateBounds[0])
            Si = StateBounds[0];
        if (StateBounds[1])
            Sf = StateBounds[1];
    }
    let Ii = 0;
    let If = NumOfInputs-1;
    if (InputBounds) {
        if (InputBounds[0])
            Ii = InputBounds[0];
        if (InputBounds[1])
            If = InputBounds[1];
    }
    if (Constraint) {
        var DCoutputEffective = !DCneeded;
        var iterO = 0;
        var StartFromLeft = true;
        do {
            if (iterO > MaxIterationsForStep)
                return false;

            let StartToSeekFromLeft = (Sf === 0 || Sf % 2 === 0);
            let FoundCoordinates = [null, null];
            for (let s = Sf; s >= Si && FoundCoordinates[0] === null; s--) {
                if (StartToSeekFromLeft) {
                    for (let i = Ii; i <= If && FoundCoordinates[0] === null; i++) {
                        if (!OutHasAtLeastOneDC(Table.getContentTileByIndex(s, i).out)) {
                            FoundCoordinates[0] = s;
                            FoundCoordinates[1] = i;
                        }
                    }
                } else {
                    for (let i = If; i >= Ii && FoundCoordinates[0] === null; i--) {
                        if (!OutHasAtLeastOneDC(Table.getContentTileByIndex(s, i).out)) {
                            FoundCoordinates[0] = s;
                            FoundCoordinates[1] = i;
                        }
                    }
                }
                StartToSeekFromLeft = !StartToSeekFromLeft;
            }
            if (FoundCoordinates[0] === null || FoundCoordinates[1] === null)
                return false;

            let AllMarked = true;
            for (let s = Si; s <= Sf; s++) {
                if (StartFromLeft) {
                    for (let i = Ii; i <= If && !((s === FoundCoordinates[0] && i === FoundCoordinates[1]) && AllMarked); i++) {
                        let Tile = Table.getContentTileByIndex(s, i);
                        let CurrOut = Tile.out;
                        let CurrNotMarked = true;
                        for (let out = 0; out < CurrOut.length; out++) {
                            if (CurrOut[out] !== -1) {
                                if (ReArrange(DCoutputProbability)) {
                                    CurrNotMarked = false;
                                    DCoutputEffective = true;
                                    Tile.out[out] = -1;
                                }
                            } else {
                                CurrNotMarked = false;
                            }
                            if (CurrNotMarked)
                                AllMarked = false;
                            else
                                Table.setContentTileByIndex(s, i, Tile);
                        }
                    }
                } else {
                    for (let i = If; i >= Ii && !((s === FoundCoordinates[0] && i === FoundCoordinates[1]) && AllMarked); i--) {
                        let Tile = Table.getContentTileByIndex(s, i);
                        let CurrOut = Tile.out;
                        let CurrNotMarked = true;
                        for (let out = 0; out < CurrOut.length; out++) {
                            if (CurrOut[out] !== -1) {
                                if (ReArrange(DCoutputProbability)) {
                                    CurrNotMarked = false;
                                    DCoutputEffective = true;
                                    Tile.out[out] = -1;
                                }
                            } else {
                                CurrNotMarked = false;
                            }
                        }
                        if (CurrNotMarked)
                            AllMarked = false;
                        else
                            Table.setContentTileByIndex(s, i, Tile);
                    }
                }
                StartFromLeft = !StartFromLeft;
            }
            iterO++;
        } while (DCoutputEffective === false);
    } else {
        for (let s = Si; s <= Sf; s++) {
            for (let i = Ii; i <= If; i++) {
                let Tile = Table.getContentTileByIndex(s, i);
                let CurrOut = Tile.out;
                for (let out = 0; out < CurrOut.length; out++) {
                    if (CurrOut[out] !== -1) {
                        if (ReArrange(DCoutputProbability)) {
                            DCoutputEffective = true;
                            Tile.out[out] = -1;
                        }
                    }
                }
                Table.setContentTileByIndex(s, i, Tile);
            }
        }
    }
    return true;
}

function AddDCtoInput(Table, DCinputProbability, DCneeded, Constraint, StateBounds, InputBounds) {
    var NumOfStates = Table.getNumOfStates();
    var NumOfInputs = Table.getNumOfInputs();
    let Si = 0;
    let Sf = NumOfStates-1;
    if (StateBounds) {
        if (StateBounds[0])
            Si = StateBounds[0];
        if (StateBounds[1])
            Sf = StateBounds[1];
    }
    let Ii = 0;
    let If = NumOfInputs-1;
    if (InputBounds) {
        if (InputBounds[0])
            Ii = InputBounds[0];
        if (InputBounds[1])
            If = InputBounds[1];
    }
    if (Constraint) {
        var DCinputEffective = !DCneeded;
        var iterC = 0;
        var StartFromLeft = true;
        do {
            if (iterC > MaxIterationsForStep)
                return false;


            for (let s = Si; s <= Sf; s++) {
                if (StartFromLeft) {
                    let LastI = null;
                    for (let tmp = If; LastI === null && tmp >= Ii; tmp--) {
                        let Tile = Table.getContentTileByIndex(s, tmp);
                        if (Tile.Linkedstate !== -1)
                            LastI = tmp;
                    }
                    if (LastI === null)
                        return false;

                    let AllMarked = true;
                    for (let i = Ii; i < LastI || (i === LastI && !AllMarked); i++) {
                        let Tile = Table.getContentTileByIndex(s, i);
                        if (Tile.Linkedstate !== -1) {
                            if (ReArrange(DCinputProbability)) {
                                DCinputEffective = true;
                                Tile.Linkedstate = -1;
                                Table.setContentTileByIndex(s, i, Tile);
                            } else {
                                AllMarked = false;
                            }
                        }
                    }
                } else {
                    let FirstI = null;
                    for (let tmp = Ii; FirstI === null && tmp <= If; tmp++) {
                        let Tile = Table.getContentTileByIndex(s, tmp);
                        if (Tile.Linkedstate !== -1)
                            FirstI = tmp;
                    }
                    if (FirstI === null)
                        return false;

                    let AllMarked = true;
                    for (let i = If; i > FirstI || (i === FirstI && !AllMarked); i--) {
                        let Tile = Table.getContentTileByIndex(s, i);
                        if (Tile.Linkedstate !== -1) {
                            if (ReArrange(DCinputProbability)) {
                                DCinputEffective = true;
                                Tile.Linkedstate = -1;
                                Table.setContentTileByIndex(s, i, Tile);
                            } else {
                                AllMarked = false;
                            }
                        }
                    }
                }
                StartFromLeft = !StartFromLeft;
            }
            iterC++;
        } while (DCinputEffective === false);
    } else {
        for (let s = Si; s <= Sf; s++) {
            for (let i = Ii; i <= If; i++) {
                let Tile = Table.getContentTileByIndex(s, i);
                if (Tile.Linkedstate !== -1) {
                    if (ReArrange(DCinputProbability)) {
                        DCinputEffective = true;
                        Tile.Linkedstate = -1;
                        Table.setContentTileByIndex(s, i, Tile);
                    }
                }
            }
        }
    }
    return true;
}

function DCoutputOrchestratorMealy(Table, HomeState, DCoutputProbability, Constraint) {
    let ResCheck;
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            return false;
        }
        if (AddDCtoOutputMealy(Table, DCoutputProbability, true, Constraint)===false)
            return false;
        ResCheck = HasDCMealyHandler(Table, HomeState, false);
        iter++;
    } while (!ResCheck);
    return (ResCheck && (!Constraint || NotAllUndefinedMealyHandler(Table, HomeState)));
}

function DCinputOrchestratorMealy(Table, HomeState, DCinputProbability, Constraint) {
    let ResCheck;
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            return false;
        }
        if (AddDCtoInput(Table, DCinputProbability, true, Constraint)===false)
            return false;
        ResCheck = HasDCMealyHandler(Table, HomeState, true);
        iter++;
    } while (!ResCheck);
    return ResCheck;
}

function SetUpTableContentMealy(Table, NumOfStates, NumOfInputs, DCinput, DCinputProbability, DCoutput, DCoutputProbability, HomeState, NumOfOutputs, DCinputConstraint, DCoutputConstraint) {
    var iter=0;
    do {//stateIndex
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            break;
        }
        for (let s = 0; s < NumOfStates; s++) {
            const CurrTile = Table.getStateIndexTile(s);
            CurrTile.value = s;
            Table.setStateIndexTile(s, CurrTile);
        }
        //output and content
        for (let s = 0; s < NumOfStates; s++) {
            for (let i = 0; i < NumOfInputs; i++) {
                let Tile = Table.getContentTileByIndex(s, i);
                Tile = RandomOutput(Tile, NumOfOutputs);
                Tile = RandomFutureState(Tile, NumOfStates);
                Table.setContentTileByIndex(s, i, Tile);
            }
        }
        iter++;
    } while ((DCinput && DCinputOrchestratorMealy(Table, HomeState, DCinputProbability, DCinputConstraint) === false) || (DCoutput && DCoutputOrchestratorMealy(Table, HomeState, DCoutputProbability, DCoutputConstraint) === false));
    return Table;
}

function SimplifyTableMealy(Table, HomeState, TableContainer, NumOfStates, NumOfInputs, Implement, FFTransition, OneHot, DCinput, DCoutput, NumOfOutputs) {
    var SimplifiedNumOfS = NumOfStates;
    var SimplifiedMealy = Table;
    if (NumOfStates>1 || Implement)
        PrintSolveIntro(TableContainer);
    var IndentDiv=IndentDivGenerator();
    TableContainer.appendChild(IndentDiv);
    if (NumOfStates > 1) {
        PrintUnreachableDeleteTitle(IndentDiv);
        let UnreachableIndent=Indent2DivGenerator();
        IndentDiv.appendChild(UnreachableIndent);
        DeleteUnreachableStates(UnreachableIndent, Table, HomeState, true);
        NumOfStates = Table.getNumOfStates();
        SimplifiedNumOfS=NumOfStates;

        if (NumOfStates > 1) {
            var PHRes = PaullUngerOrchestratorMealy(Table, NumOfStates, NumOfInputs, IndentDiv, true, DCinput, DCoutput);
            let Indent2Div=Indent2DivGenerator();
            IndentDiv.appendChild(Indent2Div);
            if (PHRes === null) {
                PrintAlreadyMinimum(Indent2Div);
            } else {
                SimplifiedNumOfS = PHRes.length;
                SimplifiedMealy = CreateMinimumTableMealy(PHRes, Indent2Div, NumOfStates, NumOfInputs, Table, NumOfOutputs);
            }
        }
    }
    if (Implement) {
        PrintImplementTitle(IndentDiv);

        let Indent2Div=Indent2DivGenerator();
        IndentDiv.appendChild(Indent2Div);

        var SimplifiedBits;
        if (OneHot || SimplifiedNumOfS === 1)
            SimplifiedBits = SimplifiedNumOfS;
        else
            SimplifiedBits = Math.ceil(Math.log2(SimplifiedNumOfS));
        ImplementTable(SimplifiedMealy, Indent2Div, FFTransition, SimplifiedNumOfS, NumOfInputs, OneHot, SimplifiedBits, true);
    }
}

function MealyOrchestratorSimple(NumOfStates, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, Implement, DCinput, DCoutput, Options, NumOfOutputs, DCinputConstraint, DCoutputConstraint, InstantSimplify, MinimumLimit, MaximumLimit) {
    var FullySpecified = true;
    var HomeState = 0;
    var iter=0;
    do {
        if (iter===MaxIterationsForStep) {
            AlertTimeout();
            break;
        }
        var Table = MealyTable(NumOfStates, NumOfInputs);
        //var HomeState = Math.round(Math.random() * (NumOfStates - 1));
        //1st step (table generation using random values)
        FillColumnsIndexFirstStep(Table, NumOfInputs);
        //fill row index (statues) value and content tiles+output with random values
        SetUpTableContentMealy(Table, NumOfStates, NumOfInputs, DCinput, Options["DCinputProbability"], DCoutput, Options["DCoutputProbability"], HomeState, NumOfOutputs, DCinputConstraint, DCoutputConstraint);
        iter++;
    } while (LimitsViolated(false, MinimumLimit, MaximumLimit, Table, HomeState, NumOfStates, NumOfInputs, DCinput, DCoutput));
    PrintGenerateMainIntro(TableContainer);
    var IndentDiv=IndentDivGenerator();
    TableContainer.appendChild(IndentDiv);
    PrintGenerateIntro(IndentDiv);
    if (InstantSimplify) {
        var Indent2Div = Indent2DivGenerator();
        IndentDiv.appendChild(Indent2Div);
        PrintInitialState(Indent2Div, HomeState);
        //set "how to print" function in content tiles
        MealyTileProto.ToPrint = MealyStandardContentPrint;
        StateIndexTileProto.ToPrint = StandardStIndexPrint;
        Table.printTable(Indent2Div);
        SimplifyTableMealy(Table, HomeState, TableContainer, NumOfStates, NumOfInputs, Implement, FFTransition, OneHot, DCinput, DCoutput, NumOfOutputs);
    } else {
        SolveOrchestrator(NumOfStates, NumOfInputs, TableContainer, OneHot, FFTransition, Bits, Implement, false, NumOfOutputs, Table, HomeState);
    }
}

function NumberCompareLE(NumberVal, ReferenceValue) {
    if (isNaN(NumberVal))
        return false;
    return NumberVal <= ReferenceValue;
}

function NumberCompareGE(NumberVal, ReferenceValue) {
    if (isNaN(NumberVal))
        return false;
    return NumberVal >= ReferenceValue;
}

function NumberCompareE(NumberVal, ReferenceValue) {
    if (isNaN(NumberVal))
        return false;
    return NumberVal === ReferenceValue;
}

function NumberCompareG(NumberVal, ReferenceValue) {
    if (isNaN(NumberVal))
        return false;
    return NumberVal > ReferenceValue;
}

function NumberCompareL(NumberVal, ReferenceValue) {
    if (isNaN(NumberVal))
        return false;
    return NumberVal < ReferenceValue;
}

function PageOrchestrator() {
    var MachineTypeNode = document.getElementById("machinetype");
    var NumOfStatesNode = document.getElementById("numofstates");
    var NumOfInputsNode = document.getElementById("numofinputs");
    var TableContainerNode = document.getElementById("tablecontainer");
    var MachineCodeNode = document.getElementById("machinecode");
    var FFLabelNode = document.getElementById("numberofff");
    var FlipFlopTypeNode = document.getElementById("flipflop");
    var FillErrorNode = document.getElementById("fillerror");
    var NumOfCopiesNode = document.getElementById("numofcopies");
    var DesiredUnreachableNode = document.getElementById("numofunreachables");
    var EntropyNode = document.getElementById("entropy");
    var ImplementNode = document.getElementById("implement");
    var ImplementOpt = document.getElementById("implementopt");
    var AdvancedNode = document.getElementById("advanced");
    //var SimpleNode=document.getElementById("simple");
    var AdvancedOptNode = document.getElementById("advancedopt");
    var NumOfStatesLbl = document.getElementById("numofstateslbl");
    var MaxUnreachablesNode = document.getElementById("maxunreachables");
    var NumberOfFFlbl = document.getElementById("numberoffflbl");
    var FullySpecifiedNode = document.getElementById("fullyspecified");
    var DcOptNode = document.getElementById("dcopt");
    var DcInputNode = document.getElementById("dcinput");
    var DcOutputNode = document.getElementById("dcoutput");
    var FullySpecifiedNodeBlock = document.getElementById("fullyspecifiedblock");
    var SimpleNode = document.getElementById("simple");
    var NumOfOutputsNode = document.getElementById("numofoutputs");
    var ConfirmBtnNode = document.getElementById("confirmbtn");
    var GenerateOnlyBtnNode=document.getElementById("generateonlybtn");
    var SolveNode = document.getElementById("solve");
    var AllowedCharNode = document.getElementById("allowedchars");
    var DCinputProbabilityNode = document.getElementById("DCinputProbability");
    var DCoutputProbabilityNode = document.getElementById("DCoutputProbability");
    var DcInputLblNode = document.getElementById("dcinputlbl");
    var DcOutputLblNode = document.getElementById("dcoutputlbl");
    var NumOfInputsLblNode = document.getElementById("numofinputslbl");
    var NumOfOutputsLblNode = document.getElementById("numofoutputslbl");
    var NumOfCopiesLblNode = document.getElementById("numofcopieslbl");
    var NumOfUnreachablesLblNode = document.getElementById("numofunreachableslbl");
    var EntropyLblNode = document.getElementById("entropylbl");
    var ImplementWarningNode = document.getElementById("allowedchars");
    var FFinputTitleNode = document.getElementById("ffinputtitle");
    var DCinputConstraintNode = document.getElementById("DCinputConstraint");
    var DCoutputConstraintNode = document.getElementById("DCoutputConstraint");
    var LimitsBlockNode = document.getElementById("limitsblock");
    var LimitsNode = document.getElementById("limits");
    var LimitsOptNode = document.getElementById("limitsopt");
    var MaxLimitEnabledNode = document.getElementById("maxlimitenabled");
    var MaxLimitNode = document.getElementById("maxlimit");
    var MinLimitBlockNode = document.getElementById("minlimitblock");
    var MinLimitEnabledNode = document.getElementById("minlimitenabled");
    var MinLimitNode = document.getElementById("minlimit");
    var MinLimitLblNode = document.getElementById("minlimitlbl");
    var MaxLimitLblNode = document.getElementById("maxlimitlbl");
    var LimitsLblNode = document.getElementById("limitslbl");
    var LimitsDescriptionNode = document.getElementById("limitsdescription");
    var LimitsWarningNode = document.getElementById("limitswarning");

    var FFTransitionsNodes = new Array(4);
    for (let i = 0; i < 4; i++) {
        FFTransitionsNodes[i] = document.getElementById(("inputfor" + (i.toString())));
    }

    var NumOfStates;
    var NumOfInputs;
    var NumOfOutputs;
    var OneHotCoding;
    var NumOfCopies;
    var UnreachableMin;
    var Entropy;
    var Implement;
    var Advanced;
    var Simple;
    var Solve;
    var MinLimit;
    var MaxLimit;

    var Configs = LoadConfig();
    var CommonConfigs = Configs["Common"];
    var AdvancedModeConfigs = Configs["AdvancedMode"];
    var OthersConfigs = Configs["Others"];

    var Bits;

    var FillFlipFlop = function (ArrToWriteInto, InputForValArr) {
        if (!(ArrToWriteInto.length === 4 && InputForValArr.length === 4)) {
            console.log("error in JS code: wrong array lenghts for Flip Flop Preset");
            return;
        }
        for (let imp = 0; imp < 4; imp++) {
            ArrToWriteInto[imp].value = InputForValArr[imp];
        }
    };
    var FFInputsLegit = function () {
        var NumOfFFInputs = FFTransitionsNodes[0].value.length;
        for (let i = 0; i < 4; i++) {
            let CurrInput = FFTransitionsNodes[i].value.trim();
            if (CurrInput.length === 0 || CurrInput.length !== NumOfFFInputs)
                return false;
            for (let intern = 0; intern < CurrInput.length; intern++) {
                let CurrChar = CurrInput[intern];
                if (!(CurrChar === '0' || CurrChar === '1' || CurrChar === '-'))
                    return false;
            }
        }
        return true;
    };
    var LimitsUpdaterImpl = function () {
        Advanced = AdvancedNode.checked;
        Simple = SimpleNode.checked;
        Solve = SolveNode.checked;
        NumOfStates = parseInt(NumOfStatesNode.value);
        NumOfOutputs = parseInt(NumOfOutputsNode.value);
        NumOfCopies = parseInt(NumOfCopiesNode.value);
        var ToReturn={
            MinLimitEnabled: false,
            MaxLimitEnabled: false
        };

        if (Solve || (Advanced && FullySpecifiedNode.checked)) {
            LimitsBlockNode.style.display = "none";
        } else {
            LimitsBlockNode.style.display = "block";
            ToReturn.MaxLimitEnabled = MaxLimitEnabledNode.checked;
            if (Solve || (FullySpecifiedNode.checked && Advanced) || NumberCompareLE(NumOfStates, 1) || (DcOutputNode.checked && !FullySpecifiedNode.checked && NumberCompareL(NumOfStates, 3) && NumberCompareL(NumOfOutputs, 2) && NumberCompareE(parseInt(MachineTypeNode.selectedIndex), 0) && (!Advanced || NumberCompareL(NumOfCopies, 2))) || (FullySpecifiedNode.checked === false && DcOutputNode.checked && DCoutputConstraintNode.checked === false)) {
                MinLimitBlockNode.style.display = "none";
            } else {
                MinLimitBlockNode.style.display = "block";
                ToReturn.MinLimitEnabled = MinLimitEnabledNode.checked;
            }
        }
        return ToReturn;
    };
    var ValidateLimitsAdvanced = function (NumOfStates, NumOfCopies, NumOfInputs, NumOfOutputs, MinimumStates, NodeToPrintErrorInto) {

    };
    var ValidateLimitsOthers = function (NumOfStates, NumOfInputs, NumOfOutputs, NodeToPrintErrorInto) {
        
    };
    var RefreshMaxUnreachablesLblImpl = function () {
        Advanced = AdvancedNode.checked;
        NumOfStates = parseInt(NumOfStatesNode.value);
        NumOfCopies = parseInt(NumOfCopiesNode.value);
        UnreachableMin = parseInt(DesiredUnreachableNode.value);

        if (Advanced && NumberCompareG(NumOfStates, 1) && NumberCompareG(NumOfCopies, 0) && FullySpecifiedNode.checked && NumberCompareGE(UnreachableMin, 0))
            MaxUnreachablesNode.value = Math.max(NumOfStates * (NumOfCopies - 1), UnreachableMin);
        else
            MaxUnreachablesNode.value = "";
    };
    var RefreshBitLblImpl = function () {
        ClearIfSolveModeImpl();
        Implement = ImplementNode.checked;
        if (Implement) {
            Advanced = AdvancedNode.checked;
            if (!Advanced || FullySpecifiedNode.checked) {
                NumOfStates = parseInt(NumOfStatesNode.value);
                if (NumberCompareG(NumOfStates, 0)) {
                    if (MachineCodeNode.selectedIndex === 1) {
                        OneHotCoding = true;
                        Bits = NumOfStates;
                    } else {
                        OneHotCoding = false;
                        if (NumberCompareE(NumOfStates, 1))
                            Bits = NumOfStates;
                        else
                            Bits = Math.ceil(Math.log2(NumOfStates));
                    }
                    FFLabelNode.innerHTML = Bits;
                }
            } else {
                FFLabelNode.innerHTML = "";
            }
        }
    };

    var CanProceed = function () {
        NumOfStates = parseInt(NumOfStatesNode.value);
        NumOfInputs = parseInt(NumOfInputsNode.value);
        NumOfCopies = parseInt(NumOfCopiesNode.value);
        NumOfOutputs = parseInt(NumOfOutputsNode.value);
        Entropy = parseFloat(EntropyNode.value);
        UnreachableMin = parseInt(DesiredUnreachableNode.value);
        Implement = ImplementNode.checked;
        Advanced = AdvancedNode.checked;
        Simple = SimpleNode.checked;

        var DcInputProbability = parseInt(DCinputProbabilityNode.value);
        var DcOutputProbability = parseInt(DCoutputProbabilityNode.value);

        var CanProceedBool = true;
        let ErrorToPrint = String();

        var MarkAsError = function (Condition, LabelNode, Condition2, AddToString, ErrorString) {
            if (Condition) {
                if (Condition2) {
                    LabelNode.removeAttribute("class");
                } else {
                    LabelNode.setAttribute("class", "presenterror");
                    if (AddToString)
                        ErrorToPrint+=ErrorString;
                    CanProceedBool = false;
                }
            }
            else {
                LabelNode.setAttribute("class", "presenterror");
                CanProceedBool = false;
            }
        };
        let MaxNumOfInputs;
        let MaxNumOfOutputs;
        if (Advanced) {
            MaxNumOfInputs=AdvancedModeConfigs["MaxNumOfInputs"];
            MaxNumOfOutputs=AdvancedModeConfigs["MaxNumOfOutputs"];
            let MaxMinimumStates = AdvancedModeConfigs["MaxMinimumStates"];
            let IgnoreMaxMinimumStates = MaxMinimumStates === -1;
            MarkAsError(NumberCompareGE(UnreachableMin, 0), NumOfUnreachablesLblNode, IgnoreMaxMinimumStates || (UnreachableMin <= MaxMinimumStates), true, "Il numero minimo di stati irraggiungibili deve essere al massimo " + MaxMinimumStates.toString() + ". ");

            if (NumberCompareG(NumOfStates, 0)) {
                if (NumberCompareG(NumOfCopies, 0)) {
                    let MaxTotalStates = AdvancedModeConfigs["MaxTotalStates"];
                    let IgnoreMaxTotalStates = MaxTotalStates === -1;
                    if (IgnoreMaxTotalStates || ((NumOfStates * NumOfCopies) <= MaxTotalStates)) {
                        NumOfStatesLbl.removeAttribute("class");
                        NumOfCopiesLblNode.removeAttribute("class");
                    } else {
                        NumOfStatesLbl.setAttribute("class", "presenterror");
                        NumOfCopiesLblNode.setAttribute("class", "presenterror");
                        ErrorToPrint+="Il numero degli stati (Numero di stati*Numero di replicazioni) deve essere al massimo " + MaxTotalStates.toString() + ". ";
                        CanProceedBool = false;
                    }
                } else {
                    NumOfCopiesLblNode.setAttribute("class", "presenterror");
                    NumOfStatesLbl.removeAttribute("class");
                    CanProceedBool = false;
                }
            }
            else {
                NumOfStatesLbl.setAttribute("class", "presenterror");
                if (NumberCompareG(NumOfCopies, 0)) {
                    NumOfCopiesLblNode.removeAttribute("class");
                } else {
                    NumOfCopiesLblNode.setAttribute("class", "presenterror");
                }
                CanProceedBool = false;
            }
            MarkAsError(NumberCompareGE(Entropy, 0) && NumberCompareLE(Entropy, 100), EntropyLblNode, true, false);
        } else {
            MaxNumOfInputs = OthersConfigs["MaxNumOfInputs"];
            MaxNumOfOutputs=OthersConfigs["MaxNumOfOutputs"];
            let MaxNumOfStates = OthersConfigs["MaxNumOfStates"];
            let IgnoreMaxNumOfStates = MaxNumOfStates === -1;
            MarkAsError(NumberCompareG(NumOfStates, 0), NumOfStatesLbl, IgnoreMaxNumOfStates || (NumOfStates <= MaxNumOfStates), true, "Il numero degli stati deve essere al massimo " + MaxNumOfStates.toString() + ". ");

            NumOfCopiesLblNode.removeAttribute("class");
            NumOfUnreachablesLblNode.removeAttribute("class");
            EntropyLblNode.removeAttribute("class");
        }
        let IgnoreMaxNumOfInputs = MaxNumOfInputs === -1;
        MarkAsError(NumberCompareG(NumOfInputs, 0), NumOfInputsLblNode, IgnoreMaxNumOfInputs || (NumOfInputs <= MaxNumOfInputs), true, "Il numero degli ingressi deve essere al massimo " + MaxNumOfInputs.toString() + ". ");
        let IgnoreMaxNumOfOutputs = MaxNumOfOutputs === -1;
        MarkAsError(NumberCompareG(NumOfOutputs, 0), NumOfOutputsLblNode, IgnoreMaxNumOfOutputs || (NumOfOutputs <= MaxNumOfOutputs), true, "Il numero degli uscite deve essere al massimo " + MaxNumOfOutputs.toString() + ". ");

        MarkAsError(NumberCompareGE(DcOutputProbability, 5) && NumberCompareLE(DcOutputProbability, 95), DcOutputLblNode, true, false);
        MarkAsError(NumberCompareGE(DcInputProbability, 5) && NumberCompareLE(DcInputProbability, 95), DcInputLblNode, true, false);

        MinLimit=undefined;
        MaxLimit=undefined;
        var LimitsEnabled=LimitsUpdaterImpl();
        if (LimitsEnabled.MinLimitEnabled) {
            MinLimit = parseInt(MinLimitNode.value);
            let MinErrorStr;
            if (FullySpecifiedNode.checked)
                MinErrorStr="Il numero minimo di classi di equivalenza deve essere al massimo "+NumOfStates.toString()+". ";
            else
                MinErrorStr="Il numero minimo di classi di massima compatibilità deve essere al massimo "+NumOfStates.toString()+". ";
            MarkAsError(NumberCompareGE(MinLimit, 0), MinLimitLblNode, isNaN(NumOfStates) || MinLimit<=NumOfStates, true, MinErrorStr);
        }
        if (LimitsEnabled.MaxLimitEnabled) {
            MaxLimit = parseInt(MaxLimitNode.value);
            let MaxErrorStr;
            if (FullySpecifiedNode.checked)
                MaxErrorStr="Il numero massimo di classi di equivalenza deve essere superiore al minimo. ";
            else
                MaxErrorStr="Il numero massimo di classi di massima compatibilità deve essere superiore al minimo. ";
            MarkAsError(NumberCompareGE(MaxLimit, 0), MaxLimitLblNode, isNaN(MinLimit) || MaxLimit>=MinLimit, true, MaxErrorStr);
        }

        if (Implement) {
            if (FFInputsLegit())
                ImplementWarningNode.setAttribute("class", "notes");
            else {
                ImplementWarningNode.setAttribute("class", "presenterror");
                CanProceedBool = false;
            }
        } else {
            ImplementWarningNode.setAttribute("class", "notes");
        }

        if (CanProceedBool) {
            FillErrorNode.innerHTML = "";
        } else {
            if (ErrorToPrint.length===0)
                FillErrorNode.innerHTML = "Compila tutti i campi con valori validi";
            else
                FillErrorNode.innerHTML = ErrorToPrint;
        }
        return CanProceedBool;
    };
    var fullyspecifiedchangedImpl = function () {
        if (FullySpecifiedNode.checked) {
            LimitsDescriptionNode.innerHTML="Se attivato, itera nel tentativo di soddisfare il requisito impostato.";
            LimitsWarningNode.style.display="none";
            DcOptNode.style.display = "none";
            LimitsLblNode.innerHTML=" Vincolare il numero classi di equivalenza";
            MaxLimitLblNode.innerHTML=" Numero massimo di classi di equivalenza ";
            MinLimitLblNode.innerHTML=" Numero minimo di classi di equivalenza ";
        } else {
            LimitsDescriptionNode.innerHTML="Se attivato, itera nel tentativo di soddisfare il requisito impostato. Può alterare la probabilità di distribuzione di DC.";
            LimitsWarningNode.style.display="block";
            MaxUnreachablesNode.value = "";
            DcOptNode.style.display = "block";
            DcOutputNode.checked = true;
            DcInputNode.checked = true;
            var DcInputPreference = DcInputNode.parentElement.nextElementSibling;
            DcInputPreference.style.display="block";
            var DcOutputPreference = DcOutputNode.parentElement.nextElementSibling;
            DcOutputPreference.style.display="block";
            LimitsLblNode.innerHTML=" Vincolare il numero classi di massima compatibilità";
            MaxLimitLblNode.innerHTML=" Numero massimo di classi di massima compatibilità ";
            MinLimitLblNode.innerHTML=" Numero minimo di classi di massima compatibilità ";
        }
        RefreshMaxUnreachablesLblImpl();
        LimitsUpdaterImpl();
        RefreshBitLblImpl();
    };
    var ClearIfSolveModeImpl=function () {
        Solve=SolveNode.checked;
        if (Solve)
            TableContainerNode.innerHTML="";
    };
    return {
        ClearIfSolveMode: ClearIfSolveModeImpl,
        RefreshMaxUnreachablesLbl: RefreshMaxUnreachablesLblImpl,
        implementChanged: function () {
            ClearIfSolveModeImpl();
            Implement = ImplementNode.checked;
            if (Implement) {
                ImplementOpt.style.display = "block";
            } else
                ImplementOpt.style.display = "none";
            RefreshBitLblImpl();
        },
        fullyspecifiedchanged: fullyspecifiedchangedImpl,
        refreshBitLbl: RefreshBitLblImpl,
        stateChanged: function () {
            Advanced=AdvancedNode.checked;
            NumOfStates=parseInt(NumOfStatesNode.value);
            if (!isNaN(NumOfStates)) { //&& !MaxLimitEnabledNode.checked) {
                MaxLimitNode.setAttribute("max", NumOfStates.toString());
                MinLimitNode.setAttribute("max", NumOfStates.toString());
                if (Advanced)
                    MaxLimitNode.value = Math.ceil(NumOfStates * 1.5);
                else
                    MaxLimitNode.value = NumOfStates;
            }
            ClearIfSolveModeImpl();
            RefreshBitLblImpl();
            RefreshMaxUnreachablesLblImpl();
            LimitsUpdaterImpl();
        },
        dcchanged: function () {
            if (!(DcInputNode.checked || DcOutputNode.checked)) {
                FullySpecifiedNode.checked = true;
                //this_________________________________________________________
                let ClickEv = document.createEvent('HTMLEvents');
                ClickEv.initEvent("click", true, false);
                FullySpecifiedNode.dispatchEvent(ClickEv);
                //or this_____________________________________________________
                //fullyspecifiedchangedImpl();
            } else {
                var DcInputPreference = DcInputNode.parentElement.nextElementSibling;
                if (DcInputNode.checked)
                    DcInputPreference.style.display = "block";
                else
                    DcInputPreference.style.display = "none";

                var DcOutputPreference = DcOutputNode.parentElement.nextElementSibling;
                if (DcOutputNode.checked)
                    DcOutputPreference.style.display = "block";
                else
                    DcOutputPreference.style.display = "none";
            }
        },
        typeChanged: function () {
            Advanced = AdvancedNode.checked;
            Solve = SolveNode.checked;
            FillErrorNode.innerHTML = "";
            TableContainerNode.innerHTML = "";
            if (Solve) {
                ConfirmBtnNode.value = "Avanti";
                //DcOptNode.style.display="none";
                FullySpecifiedNodeBlock.style.display = "none";
                GenerateOnlyBtnNode.style.display="none";
            } else {
                ConfirmBtnNode.value = "Generazione e semplificazione";
                FullySpecifiedNodeBlock.style.display = "block";
                GenerateOnlyBtnNode.style.display="inline";
            }
            if (Advanced) {
                AdvancedOptNode.style.display = "block";
                NumOfStatesLbl.innerHTML = "Numero di stati della macchina minima di partenza ";
                //NumOfInputsLbl.innerHTML="Numero di ingressi della macchina: ";
                NumberOfFFlbl.innerHTML = "Registri di memoria (Flip Flop) richiesti post-semplificazione: ";
                RefreshMaxUnreachablesLblImpl();
            } else {
                AdvancedOptNode.style.display = "none";
                NumOfStatesLbl.innerHTML = "Numero di stati ";
                //NumOfInputsLbl.innerHTML="Numero di ingressi della macchina: ";
                NumberOfFFlbl.innerHTML = "Registri di memoria (Flip Flop) richiesti ante-semplificazione: ";
            }
            let ChangeEv = document.createEvent('HTMLEvents');
            ChangeEv.initEvent("change", true, false);
            NumOfStatesNode.dispatchEvent(ChangeEv);
        },
        limitsupdater: LimitsUpdaterImpl,
        generate: function (InstantSimplify) {
            TableContainerNode.innerHTML = "";
            if (CanProceed()) {
                FillErrorNode.innerHTML = "";
                var MachineType = parseInt(MachineTypeNode.selectedIndex);
                var FFTransitions = new Array(4);
                for (let i = 0; i < 4; i++) {
                    FFTransitions[i] = FFTransitionsNodes[i].value;
                }
                var NumOfPossibleInputs = Math.ceil(Math.pow(2, NumOfInputs));
                var DcInput = !FullySpecifiedNode.checked && DcInputNode.checked;
                var DcOutput = !FullySpecifiedNode.checked && DcOutputNode.checked;
                CommonConfigs.DCinputProbability=parseInt(DCinputProbabilityNode.value);
                CommonConfigs.DCoutputProbability=parseInt(DCoutputProbabilityNode.value);

                switch (MachineType) {
                    case 0: {
                        if (Advanced)
                            MooreOrchestratorAdvanced(NumOfStates, NumOfPossibleInputs, TableContainerNode, OneHotCoding, FFTransitions, Bits, NumOfCopies, UnreachableMin, Entropy, Implement, DcInput, DcOutput, CommonConfigs, NumOfOutputs, DCinputConstraintNode.checked, DCoutputConstraintNode.checked, InstantSimplify, MinLimit,MaxLimit);
                        else if (Simple)
                            MooreOrchestratorSimple(NumOfStates, NumOfPossibleInputs, TableContainerNode, OneHotCoding, FFTransitions, Bits, Implement, DcInput, DcOutput, CommonConfigs, NumOfOutputs, DCinputConstraintNode.checked, DCoutputConstraintNode.checked, InstantSimplify, MinLimit,MaxLimit);
                        else {
                            SolveOrchestrator(NumOfStates, NumOfPossibleInputs, TableContainerNode, OneHotCoding, FFTransitions, Bits, Implement, true, NumOfOutputs);
                        }
                        break;
                    }
                    case 1: {
                        if (Advanced)
                            MealyOrchestratorAdvanced(NumOfStates, NumOfPossibleInputs, TableContainerNode, OneHotCoding, FFTransitions, Bits, NumOfCopies, UnreachableMin, Entropy, Implement, DcInput, DcOutput, CommonConfigs, NumOfOutputs, DCinputConstraintNode.checked, DCoutputConstraintNode.checked, InstantSimplify, MinLimit,MaxLimit);
                        else if (Simple)
                            MealyOrchestratorSimple(NumOfStates, NumOfPossibleInputs, TableContainerNode, OneHotCoding, FFTransitions, Bits, Implement, DcInput, DcOutput, CommonConfigs, NumOfOutputs, DCinputConstraintNode.checked, DCoutputConstraintNode.checked, InstantSimplify, MinLimit,MaxLimit);
                        else {
                            SolveOrchestrator(NumOfStates, NumOfPossibleInputs, TableContainerNode, OneHotCoding, FFTransitions, Bits, Implement,  false, NumOfOutputs);
                        }
                        break;
                    }
                }
                TableContainerNode.scrollIntoView();
            }
        },
        FlipFlopChange: function () {
            TableContainerNode.innerHTML="";
            function EnableFFinputs(Disabled) {
                for (let f=0; f<FFTransitionsNodes.length; f++) {
                    FFTransitionsNodes[f].disabled=Disabled;
                }
            }
            function SetPlaceHolder() {
                var PlaceholderText="Nuple";
                for (let f=0; f<FFTransitionsNodes.length; f++) {
                    FFTransitionsNodes[f].setAttribute("placeholder", PlaceholderText);
                }
            }
            function RemovePlaceHolder() {
                for (let f=0; f<FFTransitionsNodes.length; f++) {
                    FFTransitionsNodes[f].removeAttribute("placeholder");
                }
            }

            switch (FlipFlopTypeNode.selectedIndex) {
                case 0: { //T
                    FillFlipFlop(FFTransitionsNodes, ["0", "1", "1", "0"]);
                    break;
                }
                case 1: { //D
                    FillFlipFlop(FFTransitionsNodes, ["0", "1", "0", "1"]);
                    break;
                }
                case 2: { //SR
                    FillFlipFlop(FFTransitionsNodes, ["0-", "10", "01", "-0"]);
                    break;
                }
                default: {
                    FillFlipFlop(FFTransitionsNodes, ["", "", "", ""]);
                    break;
                }
            }
            if (FlipFlopTypeNode.selectedIndex===3) {
                EnableFFinputs(false);
                FFinputTitleNode.innerHTML="Ingresso (XYZ...)";
                SetPlaceHolder();
                AllowedCharNode.style.display="block";
            } else {
                EnableFFinputs(true);
                FFinputTitleNode.innerHTML="Ingresso";
                RemovePlaceHolder();
                AllowedCharNode.style.display="none";
            }
        },
        appendFFinputChangeLstn: function (ListenerToAppend) {
            for (let i = 0; i < 4; i++) {
                FFTransitionsNodes[i].addEventListener("keyup", ListenerToAppend);
                FFTransitionsNodes[i].addEventListener("change", ListenerToAppend);
            }
        },
        initialize: function () {
            this.FlipFlopChange();
            DCinputProbabilityNode.value=CommonConfigs.DCinputProbability;
            DCoutputProbabilityNode.value=CommonConfigs.DCoutputProbability;
            for (let i=0; i<FFTransitionsNodes.length; i++) {
                FFTransitionsNodes[i].addEventListener("change", function () {
                    TableContainerNode.innerHTML="";
                });
                FFTransitionsNodes[i].addEventListener("keyup", function () {
                    TableContainerNode.innerHTML="";
                });
            }
            Advanced=AdvancedNode.checked;
            Simple=SimpleNode.checked;
        },
        limitsenabled: function() {
            if (LimitsNode.checked) {
                MaxLimitEnabledNode.checked=true;
                MinLimitEnabledNode.checked=true;
                LimitsOptNode.style.display = "block";
            }
            else
                LimitsOptNode.style.display="none";
        },
        limitclicked: function () {
            if (!(MaxLimitEnabledNode.checked || MinLimitEnabledNode.checked)) {
                LimitsNode.checked=false;
                let ClickEv = document.createEvent('HTMLEvents');
                ClickEv.initEvent("click", true, false);
                LimitsNode.dispatchEvent(ClickEv);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var Orchestrator = PageOrchestrator();
    document.getElementById("confirmbtn").addEventListener("click", function () {
        Orchestrator.generate(true);
    });
    document.getElementById("generateonlybtn").addEventListener("click", function () {
        Orchestrator.generate(false)
    });

    document.getElementById("numofstates").addEventListener("keyup", Orchestrator.stateChanged);
    document.getElementById("numofstates").addEventListener("change", Orchestrator.stateChanged);

    document.getElementById("numofoutputs").addEventListener("keyup", Orchestrator.limitsupdater);
    document.getElementById("numofoutputs").addEventListener("change", Orchestrator.limitsupdater);

    document.getElementById("numofcopies").addEventListener("change", Orchestrator.limitsupdater);

    document.getElementById("machinetype").addEventListener("change", Orchestrator.limitsupdater);

    document.getElementById("DCoutputConstraint").addEventListener("click", Orchestrator.limitsupdater);

    document.getElementById("numofcopies").addEventListener("keyup", Orchestrator.RefreshMaxUnreachablesLbl);
    document.getElementById("numofcopies").addEventListener("change", Orchestrator.RefreshMaxUnreachablesLbl);
    document.getElementById("numofunreachables").addEventListener("change", Orchestrator.RefreshMaxUnreachablesLbl);
    document.getElementById("numofunreachables").addEventListener("keyup", Orchestrator.RefreshMaxUnreachablesLbl);

    document.getElementById("machinecode").addEventListener("change", Orchestrator.refreshBitLbl);

    document.getElementById("flipflop").addEventListener("change", Orchestrator.FlipFlopChange);

    document.getElementById("implement").addEventListener("change", Orchestrator.implementChanged);

    document.getElementById("advanced").addEventListener("click", Orchestrator.typeChanged);
    document.getElementById("simple").addEventListener("click", Orchestrator.typeChanged);

    document.getElementById("fullyspecified").addEventListener("click", Orchestrator.fullyspecifiedchanged);
    document.getElementById("dcinput").addEventListener("click", Orchestrator.dcchanged);
    document.getElementById("dcoutput").addEventListener("click", Orchestrator.dcchanged);
    document.getElementById("solve").addEventListener("click", Orchestrator.typeChanged);


    document.getElementById("numofinputs").addEventListener("change", Orchestrator.ClearIfSolveMode);

    document.getElementById("limits").addEventListener("click", Orchestrator.limitsenabled);
    document.getElementById("minlimitenabled").addEventListener("click", Orchestrator.limitclicked);
    document.getElementById("maxlimitenabled").addEventListener("click", Orchestrator.limitclicked);

    Orchestrator.initialize();
    /*
    Orchestrator.FlipFlopChange();
    Orchestrator.typeChanged();
    Orchestrator.fullyspecifiedchanged();
    */
});