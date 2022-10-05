const form = document.getElementById("formularioTotal"); //esto permite seleccionar el formulario en el html

form.addEventListener("submit", function (event) { // con este comando se habilita que cuando el usuario accione el boton, se inicie el codigo
    event.preventDefault(); //con esto se evita que la pagina se envie cuando se da click en enviar el formulario
    let formularioTotalData  = new FormData(formularioTotal); //Esto hace del formulario un objeto, para poder acceder a las propiedades: (ejemplo .get)
    let formularioObj = convertirformularioTotalDataInObj (formularioTotalData); 
    saveformularioObj (formularioObj);
    insertRowEntablaid(formularioObj);
    form.reset();
}
);

function drawCategories () {     //Crea un array y lo itera con un for para cargarlo en el formulario
  let allcategories = [
    "Sueldo", "Alquiler", "Diversion", "Comida", "Impuestos"
  ]
  for (let index = 0; index < allcategories.length; index++) {
    const element = allcategories[index];
    insertCategory(element)
  }
}

function insertCategory(categoryName) {    //  Se crea esta funcion para ionsertar contenido html
  const selectElement = document.getElementById("label4")  //se elije el "campo" que se quiere modificar
  let htmltoInsert =`<option>${categoryName}</option>`     //Esta linea crea una variable con la forma que tendra el contenido que se va a insertar
  selectElement.insertAdjacentHTML("beforeend",htmltoInsert)  //Este metodo permite insertar contenidoHTML. El primer valor es en donde, el segundo lo que se inserta
}


//Esta funcion empieza a "trabajar" cuando se carga el HTML y sirve para
//obtrener del local sotrage la tabla cargada con los datos del formulario.
document.addEventListener("DOMContentLoaded",function() {   
  drawCategories ()  //Esta funcion carga las categoprias en el formulario desde un array con JS 
  const myformularioObjarray = JSON.parse(localStorage.getItem("formularioTotalData")); // Se crea un array parse el objet del local storage
  myformularioObjarray.forEach(Formularioelement => {                   //se aplica una itaracion a cada elemento del array
  insertRowEntablaid(Formularioelement)
  });                                                 
                                                                
}
)
//funcion para crear un indice de datos
function getNewFormularioID () {       
  //se accede a la informacion del local storage
  let lastFormularioID = localStorage.getItem("lastFormularioID") || "-1"; // se escribe asi por si no hay nada en la "base de datos"
 //Se va a parsear y se la va a sumar uno a los datos guardados (si los hay)
  let newFormularioID = JSON.parse(lastFormularioID) + 1;
//Se guarda en el local storage la id
  localStorage.setItem("lastFormularioID",JSON.stringify(newFormularioID))
  return newFormularioID;
}

function convertirformularioTotalDataInObj (formularioTotalData) { //Permite convertir en un objeto los valores del formulario, 
  let opcion =  formularioTotalData.get("opcion");                 //De esta forma es posible que se puedan transofrmar a JSON luego
  let label2 =  formularioTotalData.get("label2");
  let label3 =  formularioTotalData.get("label3");
  let label4 =  formularioTotalData.get("label4");
  let FormularioID = getNewFormularioID();
  return {
    "opcion": opcion,
    "label2": label2,
    "label3": label3,
    "label4": label4,
    "FormularioID": FormularioID
  }
}

function insertRowEntablaid(formularioObj) {
    let tablaidref = document.getElementById("tablaid"); //aca se selecciona la tabla, con
   
    let newRowRef = tablaidref.insertRow(-1); // Con la referencia de la tabla, se inserta una fila, esta se ubica en la posicion inicial con un -1
    
    //A la fila insertada se le pasa un atributo personalizado con el ID que se obtiene desde el ObjetoFormulario, este a su vez lo obtiene del local storage.   
    newRowRef.setAttribute("Data-Formulario-ID",formularioObj["FormularioID"]) 

    let newCellRef = newRowRef.insertCell(0); //se utiliza la variable anterior para poner tambien las celdas.
    newCellRef.textContent = formularioObj["opcion"];
   
    newCellRef = newRowRef.insertCell(1);
    newCellRef.textContent = formularioObj["label2"];
   
    newCellRef = newRowRef.insertCell(2);
    newCellRef.textContent = formularioObj["label3"];
   
    newCellRef = newRowRef.insertCell(3);
    newCellRef.textContent = formularioObj["label4"];

    let newDeleteCell = newRowRef.insertCell(4);
    let Deletebutton = document.createElement("button");
    Deletebutton.textContent = "Eliminar"
    newDeleteCell.appendChild(Deletebutton)

    Deletebutton.addEventListener("click", (event) => { //Accedo a la fila del boton eliminar y la elimio al tocar boton
      let FormularioRow = event.target.parentNode.parentNode;
      let FormularioID = FormularioRow.getAttribute("Data-Formulario-ID");
      console.log(FormularioID)
      FormularioRow.remove()  
      deleteFormularioID(FormularioID)
    })
}

function deleteFormularioID(FormularioID) {
  // Se accede al local sotrage y se crea un array
    let myformularioObjarray = JSON.parse(localStorage.getItem("formularioTotalData"));
  // En el Array creado se busca con un metodo filter todos los elementos que no sean el elejido con el boton.
    let formularioIndexInarray = myformularioObjarray.filter(element => element.FormularioID != FormularioID);
    //Se declara la variable que se guardara en el local sotrage
    let FormularioArrayJSON = JSON.stringify(formularioIndexInarray);   
    //se almacena en el local storage el array en formato json la nueva base de datos con la fila que se ha elminado          
    localStorage.setItem("formularioTotalData", FormularioArrayJSON);
  }

// Esta funcion trabaja sobre el objeto que surje de los datos del formulario,// ademas la transofrma en un json para que pueda luego se utilizada por el local server 
function saveformularioObj (formularioObj) {                            
   
  //Se declara un Array al que se accede desde el local storage transformando el array.json existente o en su defecto creando un array vacio
  let myFormularioArray = JSON.parse(localStorage.getItem("formularioTotalData")) || []; 
  //Al array declarado se le inserta los datos del formulario
  myFormularioArray.push(formularioObj);
  //Se transorma a json nuevamente el array
  let FormularioArrayJSON = JSON.stringify(myFormularioArray);   
  //se almacena en el local storag el array en formato json           
  localStorage.setItem("formularioTotalData", FormularioArrayJSON);
}