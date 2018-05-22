var Tile = {
    BOUNDARY: -1,
    GROUND: 0,
    WALL: 1,
    UNDESTRUCTIBLE_WALL: 2,
    ENTRANCE: 3,
    EXIT: 4
};

var Item = {
    VOID: 0,
    PICKAXE: 1,
    PATH_HIGHLIGHT: 2,
    BOMB: 3,
    TELEPORTER: 4,
    COIN: 5
};


var Maze = {
    generate: function (w, h, items) {
        // ------------------ Method body ------------------
        var model = createEmptyModel(w, h);

        createMaze(model.maze, [{x: 0, y: 0}], 1, w * h); // Génération du labyrinthe


        // GARDER CES 3 APPELS DANS CET ORDRE !
        placeEntrance(model); // Placement de l'entrée du labyrinthe (aléatoirement sur segment inférieur)
        computeDistances(model.maze, model.entrance.x, model.entrance.y, 0); // Calcul des distances depuis l'entrée

        placeExit(model); // Aléatoirement sur le bord du labyrinthe, le plus éloigné possible de l'entrée

        placeItems(model, items); // Placement aléatoire des objets

        return model;


        // ------------------ Function definitions ------------------
        // (these functions use the above variable directly)
        function createEmptyModel(w, h) {
            // Tableau à 2 dimensions (1re: X, 2e: Y) de w*h cellules (chaque cellule est un sommet)
            // En haut à gauche : [0][0]
            // En bas à droite : [w][h]
            var maze = new Array(w);

            for (var x = 0; x < w; x++) {
                maze[x] = new Array(h);

                for (var y = 0; y < h; y++) {
                    // Création des objets représentant les sommets du graphe (intersections du labyrinthe; le graphe est une grille)
                    maze[x][y] = {up: false, down: false, left: false, right: false};
                }
            }

            return {
                width: w,
                height: h,
                maze: maze,
                entrance: {x: 0, y: 0},
                exit: {x: 0, y: 0},
                items: []
            };
        }

        // Connecte ou déconnecte le sommet (x;y) au sommet correspondant à la direction dir (up, down, left, right)
        function link(maze, x, y, dir, linked) {
            linked = !!linked;

            if (dir == 'up' && y > 0) {
                maze[x][y].up = linked;
                maze[x][y - 1].down = linked;
            }

            else if (dir == 'down' && y < h - 1) {
                maze[x][y].down = linked;
                maze[x][y + 1].up = linked;
            }

            else if (dir == 'left' && x > 0) {
                maze[x][y].left = linked;
                maze[x - 1][y].right = linked;
            }

            else if (dir == 'right' && x < w - 1) {
                maze[x][y].right = linked;
                maze[x + 1][y].left = linked;
            }
        }

        // Retourne les voisins de (x;y) qui ne sont reliés à personne
        function getIsolatedNeighbours(maze, x, y) {
            var isIsolated = function (maze, cellInfo) {
                var cell = maze[cellInfo.x][cellInfo.y];

                return !(cell.up || cell.down || cell.left || cell.right);
            };

            return getNeighbours(maze, x, y, isIsolated);
        }

        // Retourne les voisins atteignables de (x;y)
        function getReachableNeighbours(maze, x, y) {
            var isReachable = function (maze, cellInfo) {
                //console.log( cellInfo.dir );
                //console.log( maze[x][y] );
                return (
                    (cellInfo.dir == 'up' && maze[x][y].up)
                    || (cellInfo.dir == 'down' && maze[x][y].down)
                    || (cellInfo.dir == 'left' && maze[x][y].left)
                    || (cellInfo.dir == 'right' && maze[x][y].right)
                    );
            };

            return getNeighbours(maze, x, y, isReachable);
        }

        // Retourne les voisins du sommet (x;y) après les avoir filtrés avec la fonction test
        function getNeighbours(maze, x, y, test) {
            if (typeof test != 'function')
                test = function () {
                    return true
                };

                var neighbours = [];

                var cells = [
                {x: x, y: y - 1, dir: 'up'},
                {x: x, y: y + 1, dir: 'down'},
                {x: x - 1, y: y, dir: 'left'},
                {x: x + 1, y: y, dir: 'right'}
                ];

                for (var i = 0; i < cells.length; i++) {
                // On ne garde pas les voisins qui sont en dehors du tableau
                if (cells[i].x >= 0 && cells[i].x < w && cells[i].y >= 0 && cells[i].y < h) {
                    if (test(maze, cells[i]))
                        neighbours.push(cells[i]);
                }
            }

            return neighbours;
        }

        // Calcule le nombre d'intersections à traverser depuis (x;y) pour arriver sur les cellules du modèle
        function computeDistances(maze, x, y, current_dist) {
            // On ne fait rien si une distance a été définie pour (x;y)
            if (maze[x][y].distance !== undefined)
                return;

            // On stocke la distance dans la cellule
            maze[x][y].distance = current_dist;

            // Chercher les cellules connectées à (x;y)
            var reachable = getReachableNeighbours(maze, x, y);

            //console.log( "Atteignables depuis " + x + " ; " + y + " ===> " + reachable.length );

            for (var i = 0; i < reachable.length; i++) {
                computeDistances(maze, reachable[i].x, reachable[i].y, current_dist + 1);
            }
        }

        function createMaze(maze, visited_bindable_cells, visited_cells, total_cells) {
            // On continue à relier des cellules tant que toutes les cellules n'ont pas été visitées
            while (visited_cells < total_cells) {
                // On sélectionne une des cellules visitées (et ayant encore au moins un voisin isolé) au hasard
                var rand_idx = randIdx(visited_bindable_cells.length);
                var rand_cell = visited_bindable_cells[rand_idx];


                // On récupère les cellules voisines isolées (qui n'ont encore jamais été connectées)
                var isolated = getIsolatedNeighbours(maze, rand_cell.x, rand_cell.y);


                if (isolated.length == 0) {
                    // Si la cellule n'a plus de voisins isolé, on retire la cellule de la liste
                    visited_bindable_cells.splice(rand_idx, 1);
                }

                else {
                    // On sélectionne un des voisins isolés au hasard
                    var isol = isolated[randIdx(isolated.length)];

                    // On relie le voisin isolé aux cellules visitées
                    link(maze, rand_cell.x, rand_cell.y, isol.dir, true);

                    // On incrémente le compteur de cellules visitées
                    visited_cells++;

                    // On ajoute la cellule nouvellement reliée aux cellules visitées
                    visited_bindable_cells.push({x: isol.x, y: isol.y});
                }
            }
        }

        // Place l'entrée du labyrinthe
        function placeEntrance(model) {
            model.entrance.x = randInt(0, w - 1);
            model.entrance.y = h - 1;
        }

        // Place la sortie du labyrinthe
        function placeExit(model) {
            var maze = model.maze;
            var maxDist = 0;

            for (var x = 0; x < w; x++) {
                for (var y = 0; y < h; y++) {
                    // On mémorise la cellule de BORDURE la plus éloignée possible de l'entrée
                    if (maze[x][y].distance > maxDist && (x == 0 || y == 0 || x == (w - 1) || y == (h - 1))) {
                        maxDist = maze[x][y].distance;
                        model.exit.x = x;
                        model.exit.y = y;
                    }
                }
            }

            model.exit.distance_from_entrance = maxDist;
        }

        function placeItems( model, items )
        {
            var maze = model.maze;
            /*var avg = 0;

            for (var x = 0; x < w; x++)
            {
                for (var y = 0; y < h; y++)
                {
                    avg += maze[x][y].distance;
                }
            }

            avg = avg/(model.width*model.height);*/

            var delta = model.exit.distance_from_entrance;

            for ( var i = 0; i < items.length; i++ )
            {
                var interval_coefs = getDistanceIntervalFactors( items[i] );
                dist_min = interval_coefs.min * delta;
                dist_max = interval_coefs.max * delta;

                var candidates = getCellsFromDistance( model, dist_min, dist_max );
                var cell = null;

                while ( candidates.length > 0 && cell === null )
                {
                    var randIndex = Math.floor( Math.random() * candidates.length );

                    cell = candidates[ randIndex ];

                    for (var j = 0; j < model.items.length && cell !== null; j++)
                    {
                        if ( model.items[j].x == cell.x && model.items[j].y == cell.y  )
                        {
                            cell = null;
                            candidates.splice( randIndex, 1 );
                        }
                    }
                }

                model.items.push({
                    type: items[i],
                    x: cell.x,
                    y: cell.y
                });
            }
        }

        // Retourn les coefficients définissant les distances en nombre d'intersections auxquelles
        // l'objet du type passé en paramètre est plaçable
        function getDistanceIntervalFactors(item_type) {
            switch (item_type) {
                case Item.PICKAXE:
                case Item.BOMB:
                case Item.TELEPORTER:
                case Item.PATH_HIGHLIGHT:
                return {min: 0.25, max: 0.75};

                case Item.COIN:
                case Item.VOID:
                default:
                return {min: 0.15, max: 0.85};
                //return {min: 0.25, max: 0.95};
            }
        }

        function getCellsFromDistance( model, dist_min, dist_max )
        {
            var maze = model.maze;
            var candidates = [];

            for (var x = 0; x < maze.length; x++)
            {
                for (var y = 0; y < maze[x].length; y++)
                {
                    if ( maze[x][y].distance >= dist_min && maze[x][y].distance <= dist_max )
                    {
                        candidates.push( {x: x, y: y} );
                    }
                }
            }

            return candidates;
        }

        // Retourne un entier dans l'intervalle [min;max] (bornes incluses)
        function randInt(min, max) {
            return (min + Math.floor(Math.random() * (max - min + 1)));
        }

        // Retourne un entier positif ou nul dans l'intervalle [0;max[ (max non compris)
        function randIdx(max) {
            return randInt(0, max - 1);
        }

    },
    getViewModel: function (model) {
        // ------------------ Method body ------------------


        // IMPORTANT !!
        // Ajustement du modèle (inversion des dimensions du tableau:
        // On passe de [x][y] (préférable pour la génération)
        // à [y][x] (préférable pour l'affichage)
        var switched_maze = new Array(model.height); // 1re dimension : Y
        for (var i = 0; i < model.height; i++)
            switched_maze[i] = new Array(model.width); // 2e dimension : X

        for (var x = 0; x < model.width; x++) {
            for (var y = 0; y < model.height; y++) {
                switched_maze[y][x] = model.maze[x][y];
            }
        }
        // Après cette ligne, le modèle est ajusté.
        model.maze = switched_maze;


        //création du tableau modèle
        var viewModelWidth = model.width * 2 + 3;
        var viewModelHeight = model.height * 2 + 3;


        var tabModel = new Array(viewModelHeight);

        for (var i = 0; i < viewModelHeight; i++) {
            tabModel[i] = new Array(viewModelWidth);
        }

        addBorder(tabModel);
        addUnbreakableWall(tabModel);
        addEntranceExit(tabModel, model.maze, model.exit, model.entrance);
        addWayWall(tabModel, model.maze);
        addItem(tabModel, model.items);


        return tabModel;


        // ------------------ Function definitions ------------------
        function getTile(TileTYPE, ItemTYPE) {
            switch (TileTYPE) {
                case Tile.BOUNDARY:
                return {type: TileTYPE, walkable: false, destructible: false, fillable: false, content: ItemTYPE};
                case Tile.GROUND:
                return {type: TileTYPE, walkable: true, destructible: false, fillable: true, content: ItemTYPE};
                case Tile.WALL:
                return {type: TileTYPE, walkable: false, destructible: true, fillable: false, content: ItemTYPE};
                case Tile.UNDESTRUCTIBLE_WALL:
                return {type: TileTYPE, walkable: false, destructible: false, fillable: false, content: ItemTYPE};
                case Tile.ENTRANCE:
                return {type: TileTYPE, walkable: true, destructible: false, fillable: false, content: ItemTYPE};
                case Tile.EXIT:
                return {type: TileTYPE, walkable: true, destructible: false, fillable: false, content: ItemTYPE};
            }
        }

        //fonction qui ajoute les frontières du jeu
        function addBorder(tabModel) {
            //remplir les lignes
            for (var i = 0; i < tabModel.length; i++) {
                tabModel[i][0] = getTile(Tile.BOUNDARY, Item.VOID);
                tabModel[i][tabModel[0].length - 1] = getTile(Tile.BOUNDARY, Item.VOID);
            }
            //remplire les colonnes
            for (var i = 1; i < tabModel[0].length - 1; i++) {
                tabModel[0][i] = getTile(Tile.BOUNDARY, Item.VOID);
                tabModel[tabModel.length - 1][i] = getTile(Tile.BOUNDARY, Item.VOID);
            }
        }


        //ajouter les murs incassables de délimitation de l'espace de jeux
        function addUnbreakableWall(tabModel) {
            //remplir les lignes
            for (var i = 1; i < tabModel.length - 1; i++) {
                tabModel[i][1] = getTile(Tile.UNDESTRUCTIBLE_WALL, Item.VOID);
                tabModel[i][tabModel[0].length - 2] = getTile(Tile.UNDESTRUCTIBLE_WALL, Item.VOID);
            }
            //remplire les colonnes
            for (var i = 2; i < tabModel[0].length - 2; i++) {
                tabModel[1][i] = getTile(Tile.UNDESTRUCTIBLE_WALL, Item.VOID);
                tabModel[tabModel.length - 2][i] = getTile(Tile.UNDESTRUCTIBLE_WALL, Item.VOID);
            }
        }


        //fontion qui ajoute l'entrée et la sortie
        function addEntranceExit(tabModel, maze, exit, entrance) {
            //Gère si la sortie est vers le haut
            if (exit.y === 0) {
                tabModel[1][exit.x * 2 + 2] = getTile(Tile.EXIT, Item.VOID);
            }
            //Gère si la sortie est vers la gauche
            else if (exit.x === 0) {
                tabModel[exit.y * 2 + 2][1] = getTile(Tile.EXIT, Item.VOID);
            }
            //Gère si la sortie est vers la droite
            else if (exit.x === maze[0].length - 1) {
                tabModel[exit.y * 2 + 2][exit.x * 2 + 2 + 1] = getTile(Tile.EXIT, Item.VOID);
            }
            //gère si la sortie est vers le bas
            else {
                tabModel[exit.y * 2 + 2 + 1][exit.x * 2 + 2] = getTile(Tile.EXIT, Item.VOID);
            }
            //positionner l'entrée en bas au centre

            if (entrance.y === 0) {
                tabModel[1][entrance.x * 2 + 2] = getTile(Tile.ENTRANCE, Item.VOID);
            }
            else if (entrance.x === 0) {
                tabModel[entrance.y * 2 + 2][1] = getTile(Tile.ENTRANCE, Item.VOID);
            }
            else if (entrance.x === maze[0].length - 1) {
                tabModel[entrance.y * 2 + 2][entrance.x * 2 + 2 + 1] = getTile(Tile.ENTRANCE, Item.VOID);
            }
            else {
                tabModel[entrance.y * 2 + 2 + 1][entrance.x * 2 + 2] = getTile(Tile.ENTRANCE, Item.VOID);
            }

        }


        //fonction pour ajouter les chemins et les murs du labyrinthe
        function addWayWall(tabModel, maze) {

            for (var i = 2; i < tabModel.length - 2; i++) { // Y <=> i
                for (var j = 2; j < tabModel[0].length - 2; j++) { // X <=> j
                    //si c'est un mur entre 4 points de passage
                    if (i % 2 !== 0 && j % 2 !== 0) {
                        tabModel[i][j] = getTile(Tile.WALL, Item.VOID);
                    }
                    //si c'est un point de passage obligatoire
                    else if (i % 2 === 0 && j % 2 === 0) {
                        tabModel[i][j] = getTile(Tile.GROUND, Item.VOID);
                    }
                    //gère les chemins verticaux
                    else if (i % 2 !== 0 && maze[(i - 1) / 2 - 1][j / 2 - 1].down === true) {
                        tabModel[i][j] = getTile(Tile.GROUND, Item.VOID);
                    }
                    //gère les murs verticaux
                    else if (i % 2 !== 0 && maze[(i - 1) / 2 - 1][j / 2 - 1].down === false) {
                        tabModel[i][j] = getTile(Tile.WALL, Item.VOID);
                    }
                    //gère les chemins horizontaux
                    else if (j % 2 !== 0 && maze[i / 2 - 1][(j - 1) / 2 - 1].right === true) {
                        tabModel[i][j] = getTile(Tile.GROUND, Item.VOID);
                    }
                    //gère les murs horizontaux
                    else {
                        tabModel[i][j] = getTile(Tile.WALL, Item.VOID);
                    }
                }
            }
        }


        //Ajout les objets
        function addItem(tabModel, itemList) {
            for (var i = 0; i < itemList.length; i++) {
                tabModel[itemList[i].y * 2 + 2][itemList[i].x * 2 + 2] = getTile(Tile.GROUND, itemList[i].type);
            }
        }

    },

};


/////////////////////////////////////////////////////////////////////////////////////

//Variables declaration

//Items of the level
var items = [Item.COIN, Item.COIN, Item.COIN]; //Every level has 3 coins

//Weight and Height of the level
var w = 0;
var h = 0;

//Maze
var viewModel;
var maze;

//Canevas
var canevas = document.querySelector("canvas");
var ctx = canevas.getContext('2d'); //context
//Size of the canvas
var canvas_width = 0;
var canvas_heigth = 0;

//Music
var GameMusic;

//Positions of the bunny, exit and entry
var bunnyX, bunnyY; //X & Y values of the bunny
var bunnyR, bunnyC; //row and column of the bunny

var exitX, exitY, entryX, entryY;  //X & Y values of the exit and entry
var exitC, exitR, entryC, entryR; //row and column of the exit and entry

var bunnyDirection = 38; //Default bunny direction (up)

//Game's variables
var endGame = false;
var startChrono = false;
var explosion = false;
var cptSprite = 0;
var pickAxeAvailable = false;

//Player's score variables
var coinsPicked = 0;
var level = currentLevel;
var seconds = 0;


//Init function
function init() {
    browseMaze(); //Browse the maze
    getSprites(); //Get the sprites
    checkEntry(); //Check where is the entry

}

//Function that check
function checkEntry()
{
    if(entryC == 1)
        entree.src = "/labyrinth-hero/public/image/entry_left.png";

    else if(Math.floor(entryC/2) == w)
        entree.src = "/labyrinth-hero/public/image/entry_right.png";


}

//Browse the maze and return the position values of the entry, exit and the bunny
function browseMaze() {

    for (var y = 0; y < maze.length; y++) {
        for (var x = 0; x < maze[0].length; x++) {

            switch (maze[y][x].type) {
                case 3: // entry & bunny
                    entryX = 24 * x;
                    entryC = x;
                    entryY = 24 * y;
                    entryR = y;
                    bunnyX = entryX;
                    bunnyY = entryY;
                    bunnyR = y;
                    bunnyC = x;
                    break;
                case 4: // exit
                    exitX = 24 * x;
                    exitC = x;
                    exitY = 24 * y;
                    exitR = y;
                    break;
            }
        }
    }
}


//Create the new images
var frontiere = new Image();
var sol = new Image();
var mur = new Image();
var murIndestructible = new Image();
var entree = new Image();
var sortie = new Image();
var pickaxe = new Image();
var bulb = new Image();
var bomb = new Image();
var teleporter = new Image();

//Set the source of the images created
frontiere.src = "/labyrinth-hero/public/image/frontiere.png";
sol.src = "/labyrinth-hero/public/image/sand.png";
mur.src = "/labyrinth-hero/public/image/brick.png";
murIndestructible.src = "/labyrinth-hero/public/image/indestructible.png";
entree.src = "/labyrinth-hero/public/image/entree.png";
sortie.src = "/labyrinth-hero/public/image/exit.png";
pickaxe.src = "/labyrinth-hero/public/image/objects/pickaxe.png";
bulb.src = "/labyrinth-hero/public/image/objects/bulb.png";
bomb.src = "/labyrinth-hero/public/image/objects/bomb.png";
teleporter.src = "/labyrinth-hero/public/image/objects/teleporter.png";

//Declare new arrays that will contain the sprites (images)
var spritesCoin = [];
var spritesExplosions = [];
var spritesDown = [];
var spritesUp = [];
var spritesLeft = [];
var spritesRight = [];

//Function that create images from the .png files and add them in the corresponding arrays
function getSprites() {
    for (var i = 1; i < 4; i++) {
        var img = new Image();
        img.src = '/labyrinth-hero/public/image/bunny/down/down' + i + ".png";
        spritesDown.push(img);
    }

    for (var i = 1; i < 4; i++) {
        var img = new Image();
        img.src = '/labyrinth-hero/public/image/bunny/left/left' + i + ".png";
        spritesLeft.push(img);
    }

    for (var i = 1; i < 4; i++) {
        var img = new Image();
        img.src = '/labyrinth-hero/public/image/bunny/up/up' + i + ".png";
        spritesUp.push(img);
    }

    for (var i = 1; i < 4; i++) {
        var img = new Image();
        img.src = '/labyrinth-hero/public/image/bunny/right/right' + i + ".png";
        spritesRight.push(img);
    }

    for (var i = 1; i < 7; i++) {
        var img = new Image();
        img.src = '/labyrinth-hero/public/image/objects/coin/coin' + i + ".png";
        spritesCoin.push(img);
    }

    for (var i = 1; i < 13; i++) {
        var img = new Image();
        img.src = '/labyrinth-hero/public/image/events/explosion/explosion' + i + ".png";
        spritesExplosions.push(img);
    }
}

//Function that returns the tile type of an item
function getTile(TileTYPE, ItemTYPE) {
    switch (TileTYPE) {
        case Tile.BOUNDARY:
        return {type: TileTYPE, walkable: false, destructible: false, fillable: false, content: ItemTYPE};
        case Tile.GROUND:
        return {type: TileTYPE, walkable: true, destructible: false, fillable: true, content: ItemTYPE};
        case Tile.WALL:
        return {type: TileTYPE, walkable: false, destructible: true, fillable: false, content: ItemTYPE};
        case Tile.UNDESTRUCTIBLE_WALL:
        return {type: TileTYPE, walkable: false, destructible: false, fillable: false, content: ItemTYPE};
        case Tile.ENTRANCE:
        return {type: TileTYPE, walkable: true, destructible: false, fillable: false, content: ItemTYPE};
        case Tile.EXIT:
        return {type: TileTYPE, walkable: true, destructible: false, fillable: false, content: ItemTYPE};
    }
}

//Function to add an item to the items panel
function addItem(item) {

    var ul = document.getElementById("bonus"); //Get the panel
    var li = document.createElement("li"); //Create the element
    li.setAttribute("id", item);
    ul.appendChild(li);
    var img = document.createElement("img"); //Create an image element
    img.setAttribute("src", "/labyrinth-hero/public/image/objects/" + item + ".png"); //Set the source from the item

    if (item == "bomb") //If it is a bomb
    {
        img.setAttribute("draggable", "true"); //The image is draggable
        img.setAttribute("ondragstart", "drag(event)"); //The image can be dragged
    }
    else if (item == "pickaxe") //If it is a pickaxe
    {
        img.setAttribute("onclick", "cassBrick()"); //Destroy the brick when clicked
        img.setAttribute("draggable", "false"); //The image cannot be dragged
    }

    else //If it is something else
    {
        img.setAttribute("draggable", "false"); //The image cannot be dragged
        img.setAttribute("ondragstart", "");
    }

    li.appendChild(img); //append the image

}


function clearItems()
{
    document.getElementById('nb').innerHTML = '0';
    document.getElementById('chrono').innerHTML = '00:00.000';

    var ul = document.getElementById('bonus');

    while ( ul.hasChildNodes() )
    {
        ul.removeChild( ul.firstChild );
    }
}


//Function called at each frame
function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas_width, canvas_heigth);

    drawMaze(); //draw the maze
    drawObjects(); //draw the objects
    drawBunny(); //draw the bunny
    pickObject(); //pick the object when the bunny touch it

    if (explosion == true)
        drawExplosion(); //draw the explosion

    if (!endGame) //Game not over
    {
        requestAnimationFrame(loop); //Do the loop again
    }

    else //If the game is over
    {
        //Display an alert
        swal({
            title: "You won!",
            text: "Good job!",
            icon: "success",
            buttons: [
            'Go back to the level page',
            'Go to the next level'
            ],
        }).then(function(isConfirm) {
            if (isConfirm) {
                newGame();
                return;
            } else {
                window.location.href = "/labyrinth-hero/public/play";
            }
        });
        sendScore();  //Send the score to the player
        level++;
    }


    if (bunnyC == exitC && bunnyR == exitR) //If the bunny is on the exit case
    {
        endGame = true; //End the game
        chronoStop(); //Stop the chonometer
    }


}


//Function to pick an object (detect a collision between the bunny and an item on the floor)
function pickObject() {
    if (maze[bunnyR][bunnyC].content != 0) //Check if there is an object where the bunny is
    {
        switch (maze[bunnyR][bunnyC].content) //Check the item type
        {
            case 1: //The pickaxe
                //items.push(pickaxe); //add the pickaxe to the items of the player
                addItem("pickaxe"); //add the pickaxe to the items panel
                pickAxeAvailable = true; //set the availability of the pick axe to true
                maze[bunnyR][bunnyC].content = 0; //remove the item from the ground
                break;

            case 2: //The bulb
                //items.push(bulb); //add the bulb to the items of the player
                addItem("bulb"); //add the bulb to the items panel
                maze[bunnyR][bunnyC].content = 0; //remove the item from the ground
                break;

            case 3: //The bomb
                //items.push(bomb); //add the bomb to the items of the player
                addItem("bomb"); //add the bomb to the items panel
                maze[bunnyR][bunnyC].content = 0; //remove the item from the ground
                break;

            case 4: //The teleporter
                //items.push(teleporter); //add the teleporter to the items of the player
                addItem("teleporter"); //add the teleporter to the items panel
                maze[bunnyR][bunnyC].content = 0;
                break;

            case 5: //A coin
                coinsPicked++; //Increase the number of coins picked
                addCoin(); //increase the number of coins picked in the items panel
                GameMusic.playSound("coin"); //Play the sound of a coin picked
                maze[bunnyR][bunnyC].content = 0; //remove the coin from the ground
                break;

            }
        }
    }

//Function that increase the number of coins in the player's panel
function addCoin() {
    var cpt = document.getElementById("nb"); //Get the element
    cpt.textContent = coinsPicked; //Set the number of coins picked
}

//Variable for the explosion's drawing
var cptExplosion = 0;
var cptSpriteExplosion = 0;

//Position of explosion variables
var explodeY = 0, explodeX = 0;

//Function that draws the explosion of the bomb
function drawExplosion() {
    if (cptExplosion == 10) {
        GameMusic.playSound("bomb"); //Plays the sound from the 10 iterations
    }

    if (cptExplosion % 10 == 0) //If the cptExplosion is a multiple of 10
        cptSpriteExplosion++; //increase the sprite counter

    ctx.drawImage(spritesExplosions[cptSpriteExplosion], explodeX * 24 - 32, explodeY * 24 - 32, 96, 96); //draw the explosion with its current sprite

    cptExplosion++; //increase the explosion cpt

    if (cptSpriteExplosion == 8) //when the sprite counter == 8
    {
        explodeBomb(maze, explodeX, explodeY); //destroy the adjacent cases
    }
    if (cptExplosion == 110) //when the counter == 110
    {
        explosion = false; //set the explosion to false (=> stop the explosion)

    }

}

//Variable counter
var cptCoins = 0, cptTime = 0;

//Function that draws the objects on the grounf
function drawObjects() {
    if (cptCoins == 6) //==> last sprite
        cptCoins = 0; //reset the counter to 0

    //Browse in the maze
    for (var y = 0; y < maze.length; y++) {
        for (var x = 0; x < maze[0].length; x++) {
            switch (maze[y][x].content) { //Check the content of the cell
                case 1: //PICKAXE
                ctx.drawImage(pickaxe, x * 24, y * 24, 24, 24);
                break;
                case 2: //BULB
                ctx.drawImage(bulb, x * 24, y * 24, 24, 24);
                break;
                case 3: //BOMB
                ctx.drawImage(bomb, x * 24, y * 24, 24, 24);
                break;
                case 4: //TELEPORTER
                ctx.drawImage(teleporter, x * 24, y * 24, 24, 24);
                break;
                case 5: //COIN
                    ctx.drawImage(spritesCoin[cptCoins], x * 24, y * 24, 24, 24); //draw the coin with its current sprite
                    break;
                }
            }
        }

    cptTime++; //increase the time counter
    if (cptTime == 10) //every 10 iteration
    {
        cptCoins++; //increase the sprite's coin counter
        cptTime = 0; //reset the time counter to 0
    }


}

//Function that draws the maze
function drawMaze() {
    for (var y = 0; y < maze.length; y++) {
        for (var x = 0; x < maze[0].length; x++) {
            switch (maze[y][x].type) { //Check for the cell type
                case 0: //GROUND
                ctx.drawImage(sol, x * 24, y * 24, 24, 24);
                break;
                case 1: //WALL
                ctx.drawImage(mur, x * 24, y * 24, 24, 24);
                break;
                case 2: //Indestructible wall
                ctx.drawImage(murIndestructible, x * 24, y * 24, 24, 24);
                break;
                case 3: //Entry
                ctx.drawImage(entree, x * 24, y * 24, 24, 24);
                break;
                case 4: //Exit
                ctx.drawImage(sortie, x * 24, y * 24, 24, 24);
                break;
            }
        }
    }
}

//Function that draws the bunny
function drawBunny() {
    switch (bunnyDirection) //Check for the current direction of the bunny
    {
        case 37: //left
        ctx.drawImage(spritesLeft[cptSprite], bunnyX, bunnyY, 24, 24);
        break;
        case 39: //right
        ctx.drawImage(spritesRight[cptSprite], bunnyX, bunnyY, 24, 24);
        break;
        case 38: //up
        ctx.drawImage(spritesUp[cptSprite], bunnyX, bunnyY, 24, 24);
        break;
        case 40: //down
        ctx.drawImage(spritesDown[cptSprite], bunnyX, bunnyY, 24, 24);
        break;
    }

}

//Called when a key of the keyboard is pressed
window.onkeydown = function (ev) {

    cptSprite++; //Increase the sprite counter

    if (cptSprite == 3)
        cptSprite = 0; //reset the counter to 0

    if (ev.keyCode == 37 || ev.keyCode == 65) //Key "a" or left
    {
        bunnyDirection = 37; //set the bunny direction

        if (maze[bunnyR][bunnyC - 1].walkable) { //Check that the left cell is walkable
            bunnyC--; //update the position of the bunny
            bunnyX -= 24;
        }

    }
    else if (ev.keyCode == 39 || ev.keyCode == 68) //Key "d" or right
    {

        bunnyDirection = 39; //set the bunny direction

        if (maze[bunnyR][bunnyC + 1].walkable) { //Check that the right cell is walkable
            bunnyC++; //update the position of the bunny
            bunnyX += 24;
        }

    }

    else if (ev.keyCode == 38 || ev.keyCode == 87) //Key "w" or up
    {

        bunnyDirection = 38; //set the bunny direction

        if (maze[bunnyR - 1][bunnyC].walkable) { //Check that the down cell is walkable
            bunnyR--; //update the position of the bunny
            bunnyY -= 24;
        }

    }
    else if (ev.keyCode == 40 || ev.keyCode == 83) //Key "s" or down
    {
        bunnyDirection = 40; //set the bunny direction

        if (maze[bunnyR + 1][bunnyC].walkable) { //Check that the down cell is walkable
            bunnyY += 24; //update the position of the bunny
            bunnyR++;
        }
    }

    else if (ev.keyCode == 80 && pickAxeAvailable == true) //Key "p" and pick axe available
    {
        cassBrick(); //Destroy the brick the bunny faces
        pickAxeAvailable = false; //set the pick axe availability to false

    }
};

//Function that destroy the brick
function cassBrick() {
    //Get the position of the bunny
    var x = bunnyC;
    var y = bunnyR;

    switch (bunnyDirection) //Check the bunny's current direction
    {
        case 37: //The bunny is facing left
            if (maze[y][x - 1].type == Tile.WALL) //Check that the front cell is a wall
            {
                maze[y][x - 1].type = 0; //set the type to 0
                maze[y][x - 1].walkable = true; //set the walkable property to true
                removePickAxe(); //remove the pickaxe from the panel
            }
            break;

        case 39: //The bunny is facing right
            if (maze[y][x + 1].type == Tile.WALL) { //Check that the front cell is a wall
                maze[y][x + 1].type = 0; //set the type to 0
                maze[y][x + 1].walkable = true; //set the walkable property to true
                removePickAxe(); //remove the pickaxe from the panel
            }
            break;
        case 38: ///The bunny is facing up
            if (maze[y - 1][x].type == Tile.WALL) { //Check that the front cell is a wall
                maze[y - 1][x].type = 0;
                maze[y - 1][x].walkable = true;
                removePickAxe(); //remove the pickaxe from the panel
            }
            break;
        case 40: ///The bunny is facing down
            if (maze[y + 1][x].type == Tile.WALL) { //Check that the front cell is a wall
                maze[y + 1][x].type = 0; //set the type to 0
                maze[y + 1][x].walkable = true; //set the walkable property to true
                removePickAxe(); //remove the pickaxe from the panel
            }
            break;
        }
    }

//Function that remove the pickaxe to the items panel
function removePickAxe() {

    GameMusic.playSound("pickaxe"); //play a sound for the pickaxe
    var pickaxeImage = document.getElementById("pickaxe");
    pickaxeImage.parentNode.removeChild(pickaxeImage);

}

//Variable for the chronometer
var start, end, diff, timerID;
var min, sec, msec;

//Function that simulates a chronometer
function chrono() {

    end = new Date(); //current time
    diff = end - start; //difference between the start and the current time
    diff = new Date(diff); //difference to time
    msec = diff.getMilliseconds(); //get the ms from the diff
    sec = diff.getSeconds(); //get the sec from the diff
    min = diff.getMinutes(); //get the min from the diff

    //Variables that will be used in the panel
    var msecD, secD, minD;

    //Add a 0 before number with 1 digit
    if (min < 10) {
        minD = "0" + min
    }
    else
        minD = min;
    if (sec < 10) {
        secD = "0" + sec
    }
    else
        secD = sec;

    msecD = oneDigit(msec);

    //Display the chronometer in the panel
    document.getElementById('chrono').innerHTML = minD + ":" + secD + "." + msecD;
    timerID = setTimeout("chrono()", 10)
}

//Function that translate a number to a One Digit number
function oneDigit(number) {

    if (number < 10)
        return number;
    if (number < 100)
        return Math.trunc(number / 10);
    if (number < 1000)
        return Math.trunc(number / 100);

}

//Function that starts the chronometer
function chronoStart() {
    start = new Date(); //set start time to current time
    chrono(); //start the chronometer
}

//Function that stops the chronometer
function chronoStop() {
    clearTimeout(timerID);
    seconds = (min * 60) + sec + (msec / 1000);

}

//Function that prevent default behavior for drag functions
function allowDrop(ev) {
    ev.preventDefault();
}

//Function called when an object is dragged
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

//Function called when an object is dropped
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.innerHTML = document.getElementById(data);

    y = ev.clientY - ev.target.getBoundingClientRect().y;
    x = ev.clientX - ev.target.getBoundingClientRect().x;

    var bomb = document.getElementById("bomb");
    bomb.parentNode.removeChild(bomb);

    adaptCell(y, x);
}

//Function that translate y and x coordinates to the corresponding cell
function adaptCell(y, x) {

    var cellSize = 24;

    y = y / cellSize;
    x = x / cellSize;

    y = Math.floor(y);
    x = Math.floor(x);

    explodeX = x;
    explodeY = y;

    explosion = true; //set the explosion to true
}

//Function that call the destruction function on the adjacent cases
function explodeBomb(tabModel, x, y) {

    destruction(y, x, tabModel);
    destruction(y - 1, x - 1, tabModel);
    destruction(y - 1, x, tabModel);
    destruction(y - 1, x + 1, tabModel);
    destruction(y, x - 1, tabModel);
    destruction(y, x + 1, tabModel);
    destruction(y + 1, x + 1, tabModel);
    destruction(y + 1, x, tabModel);
    destruction(y + 1, x - 1, tabModel);
    destruction(y - 2, x - 2, tabModel);
    destruction(y - 2, x - 1, tabModel);
    destruction(y - 2, x, tabModel);
    destruction(y - 2, x + 1, tabModel);
    destruction(y - 2, x + 2, tabModel);
    destruction(y - 1, x - 2, tabModel);
    destruction(y - 1, x + 2, tabModel);
    destruction(y, x - 2, tabModel);
    destruction(y, x + 2, tabModel);
    destruction(y + 1, x - 2, tabModel);
    destruction(y + 1, x + 2, tabModel);
    destruction(y + 2, x - 2, tabModel);
    destruction(y + 2, x - 1, tabModel);
    destruction(y + 2, x, tabModel);
    destruction(y + 2, x + 1, tabModel);
    destruction(y + 2, x + 2, tabModel);

}

//Function that replace the tile of the case with the GROUD Tile
function destruction(y, x, tabModel) {

    if (y >= 2 && x >= 2 && y <= tabModel.length - 3 && x <= tabModel[0].length - 3) {
        tabModel[y][x].type = Tile.GROUND;
        tabModel[y][x].walkable = true;
    }
}

//Object containing player's score values to be send
var toSend;

//Function that send the score to the server (level, score, seconds, coins)
function sendScore() {

    toSend = {
        lvl: level, //send the current level
        sec: seconds, //send the seconds
        coins: coinsPicked //send the number of coins picked
    };

    $.post({
        url: "/labyrinth-hero/public/api/savescore",
        // headers: {  'Access-Control-Allow-Origin': "https://hes.dynu.net/labyrinth-hero/public/api/savescore" },
        data: toSend
    });

    console.log(toSend);
}

//Function that request the description of the next level
function getNextLevel() {
    $.get({
        url: "/labyrinth-hero/public/api/getlevel/"+level,
        //headers: {  'Access-Control-Allow-Origin': "https://hes.dynu.net/labyrinth-hero/public/api/getlevel" },
        dataType: 'json',
        async: false,
        success: function (data) {

            if (data.levelname != 0) { //if the level != 0
                level = data.levelname; //get the level number and set it to the current level
                w = data.width; //get the level width and set it to the current width
                h = data.height; //get the level height and set it to the current height

                if (data.pickaxe) { //if there is a pickaxe
                    items.push(Item.PICKAXE); //add a pickaxe to the items of the level
                }

                if (data.bomb) //if there is a bomb
                    items.push(Item.BOMB); //add a bomb to the items of the level
            }
            else {
                level = 20;
                w = 36;
                h = 15;
                items.push(Item.PICKAXE);
                items.push(Item.BOMB);
            }
        }
    });
}

//Function that create a new game/maze corresponding to the next level
function newGame(callback) {

    clearItems();

    //Game's variables
    endGame = false;
    startChrono = false;
    explosion = false;
    cptSprite = 0;
    pickAxeAvailable = false;

    //Player's score variables
    coinsPicked = 0;
    seconds = 0;

    items = [Item.COIN, Item.COIN, Item.COIN]; //Every level has 3 coins

    getNextLevel(); //Get the description of the next level

    model = Maze.generate(w, h, items); //Get the model
    viewModel = Maze.getViewModel(model); //Get the view model
    maze = viewModel;

    //Set the size of the canvas
    canvas_width = maze[0].length * 24;
    canvas_heigth = maze.length * 24;
    canevas.width = canvas_width;
    canevas.height = canvas_heigth;

    //Init the game and request the loop function
    init();

    //Start the chrono
    if (startChrono == false) { //if the chrono is not started
        startChrono = true; //set the chrono to started
        chronoStart(); //start the chronometer
    }

    window.onload = loop();
}

//jQuery function that initalize the audio when the document is ready
$(document).ready(function () {
    GameMusic = (function () {
        return {
            playSound: function (soundName) {
                var sound = document.getElementById('gameSound_' + soundName);

                if (sound instanceof HTMLAudioElement) {
                    sound.play();
                }
            },
            setMusicToggle: function (audioId, buttonId) {
                var audio = document.getElementById(audioId);

                $('#' + buttonId).click(function () {
                    if (audio.paused) audio.play();
                    else audio.pause();
                });
            }
        };
    })();

    GameMusic.setMusicToggle('gameMusic', 'btnToggleMusic');

    $('#btnPlaySound').click(function () {
        GameMusic.playSound($('#soundName').val());
    });

});

window.onload = newGame(); //Create a new game when the page is loaded
