var board;
var score = 0;
var rows = 4;
var columns = 4;
var restart = document.getElementById("restart");

window.onload = function() {
    setGame();
}

function setGame() {
    board = [[0,0,0,0],
             [0,0,0,0],
             [0,0,0,0],
             [0,0,0,0]];

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.querySelector(".grid-container").appendChild(tile);
        }
    }

    setTile();
    setTile();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 2048)
            tile.classList.add("x" + num.toString());
        if (num == 2048) {
            setTimeout(() => {
                alert("You win!");
                restartGame();
            }, 100);
        }

    }
}

function hasEmpty() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
}

function setTile() {
    if (!hasEmpty()) {
        return ;
    }

    let found = false
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            let randomValue = Math.random() < 0.5 ? 2 : 4;
            board[r][c] = randomValue;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 2);
            found = true;
        }
    }
}

function removeZeros(row) {
    return row.filter(num => num > 0);
}

function slide(row) {
    row = removeZeros(row);
    
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i+1]) {
            row[i] *= 2;
            row.splice(i+1, 1);
            score += row[i];
            document.getElementById("score").innerText = score;
        }
    }

    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function moveLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++)    {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function moveRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++)    {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function moveUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];
        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function moveDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];
        for (let r = 0; r < rows; r++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function restartGame() {
    let grid = document.querySelector(".grid-container");

    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    score = 0;
    document.getElementById("score").innerText = score;
    setGame();
}

function canMove() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }

            if (c < columns && board[r][c] === board[r][c+1]) {
                return true;
            }
            if (r < rows && board[r][c] === board[r+1][c]) {
                return true;
            }
        }
    }
    return false;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        moveUp();
        setTile();
    } else if (event.key === "ArrowDown") {
        moveDown();
        setTile();
    } else if (event.key === "ArrowLeft") {
        moveLeft();
        setTile();
    } else if (event.key === "ArrowRight") {
        moveRight();
        setTile();
    }
    if (!hasEmpty()) {
        if (!canMove()) {
            alert("Game over!");
            restartGame();
        }
    }
});

restart.addEventListener("click", () => {
    restartGame();
})