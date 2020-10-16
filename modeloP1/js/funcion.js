var http = new XMLHttpRequest;
var fechaSeteada;


window.onload = function()
{
    var fecha = new Date();
    fechaSeteada =  fecha.getFullYear() + "-" + (fecha.getMonth()+ 1) +  "-" + fecha.getDate();

    document.getElementById("idSpinner").hidden=false;
    
    http.onreadystatechange = callbackGrilla;
    http.open("GET", "http://localhost:3000/personas", true);
    http.send();
    
    ////// captar el doble click
    var eventoClick = document.getElementById("tCuerpo");
    eventoClick.addEventListener("dblclick", hacer_click);
  
    var btnModificar = document.getElementById("btnModificar");
    btnModificar.addEventListener("click", Modificar);

    var btnCerrar = document.getElementById("btnCerrar");
    btnCerrar.addEventListener("click", Cerrar);

    var btnEliminar = document.getElementById("btnEliminar");
    btnEliminar.addEventListener("click", Eliminar);

}

function callbackGrilla()
{
    if(http.readyState == 4 && http.status == 200)
    {
        armarGrilla(JSON.parse(http.responseText));
    }
}

var tCuerpo;

function armarGrilla(jsonObj)
{
    tCuerpo = document.getElementById("tCuerpo");

    for(var i = 0; i<jsonObj.length; i++)
    {
        var row = document.createElement("tr");
        row.setAttribute("idPersona",jsonObj[i].id); /////dudo

        var cel0 = document.createElement("td");
        var text0 = document.createTextNode(jsonObj[i].id);
        cel0.appendChild(text0);
        row.appendChild(cel0);
        cel0.hidden = true;

        var cel1 = document.createElement("td");
        var text1 = document.createTextNode(jsonObj[i].nombre);
        cel1.appendChild(text1);
        row.appendChild(cel1);

        var cel2 = document.createElement("td");
        var text2 = document.createTextNode(jsonObj[i].apellido);
        cel2.appendChild(text2);
        row.appendChild(cel2);
    
        var cel3 = document.createElement("td");
        var text3 = document.createTextNode(jsonObj[i].fecha);
        cel3.appendChild(text3);
        row.appendChild(cel3);

        var cel4 = document.createElement("td");
        var text4 = document.createTextNode(jsonObj[i].sexo);
        cel4.appendChild(text4);
        row.appendChild(cel4);

        tCuerpo.appendChild(row);
    }

    document.getElementById("idSpinner").hidden = true;
}

function hacer_click(e)
    {
        // document.getElementById("idSpinner").hidden = false;
        // for(var i=0;i<5000;i++){
        //     var j=0;
        //     j++;
        //     console.log(j);
        //  }
        //  if(j = 1000){
        //     document.getElementById("idContenedor").hidden = false;
        //      }
        //      document.getElementById("idSpinner").hidden = true;
        console.log(e.target.parentNode);
        var trClick = e.target.parentNode;
        document.getElementById("fname").value = trClick.childNodes[1].innerHTML;
        document.getElementById("lname").value = trClick.childNodes[2].innerHTML;
        document.getElementById("fecha").value = trClick.childNodes[3].innerHTML;
        rowGlobal = trClick;
        if(trClick.childNodes[4].innerHTML == "Female")
        {
            document.getElementById("femenino").checked = true;
        }else
        {
            document.getElementById("masculino").checked = true;
        }
        document.getElementById("idContenedor").hidden = false;
}

function Cerrar(evento)
{
    var contenedor = document.getElementById("idContenedor");
    contenedor.hidden = true;
}
///////
function Modificar(evento)
{
    var nombre = document.getElementById("fname").value;
    var apellido = document.getElementById("lname").value;
    var fecha = document.getElementById("fecha").value;
    var masculino = document.getElementById("masculino");
    var femenino = document.getElementById("femenino");
    auxFecha = obtenerFecha(fecha);
    if(auxFecha < Date.now())
        {
            if(nombre.length >= 3 && apellido.length >= 3 && (masculino.checked == true || femenino.checked == true))
            {
                var resultado = confirm("Esta seguro que desea modificar una persona?");
                var httpPost = new XMLHttpRequest();
                if(resultado == true)
                {
                    document.getElementById("idSpinner").hidden=false;
                    document.getElementById("idContenedor").hidden=true;
                   
                    httpPost.onreadystatechange=function()
                    {
                        if(httpPost.readyState==4&&http.status==200)
                        {
                                document.getElementById("lname").className="sinError";
                                document.getElementById("fname").className="sinError";
                                document.getElementById("fecha").className="sinError";
                                rowGlobal.childNodes[1].innerHTML = nombre;
                                rowGlobal.childNodes[2].innerHTML = apellido;
                                rowGlobal.childNodes[3].innerHTML = fecha;
                                if(masculino.checked == true)
                                {
                                    rowGlobal.childNodes[4].innerHTML = "Male";
                                }else if(femenino.checked == true)
                                {
                                    rowGlobal.childNodes[4].innerHTML = "Female"
                                }
                                document.getElementById("idSpinner").hidden=true;
                        }
                    }
    
                    httpPost.open("POST","http://localhost:3000/editar",true);
                    httpPost.setRequestHeader("Content-Type","application/json");
                    if(masculino.checked == true)
                    {
                        var json = {"id" : rowGlobal.getAttribute("idPersona"),"nombre" : nombre, "apellido" : apellido, "fecha" : fecha, "sexo" : "Male"};
                    }else if(femenino.checked == true)
                    {
                        var json = {"id" : rowGlobal.getAttribute("idPersona"),"nombre" : nombre, "apellido" : apellido, "fecha" : fecha, "sexo" : "Female"};
                    }
                    
                    httpPost.send(JSON.stringify(json));
                }       
            }else
            {
                document.getElementById("lname").className="error";
                document.getElementById("fname").className="error";
                alert("Nombre/Apellido deben tener mas de 3 caracteres");
                return;
            }
        }else
        {
            alert("La fecha debe ser menor al dia de hoy");
            document.getElementById("fecha").className="error";
            return;
        }
        
}
function obtenerFecha(auxFecha){

    let data= new Date();
    var fechaEnArray = auxFecha.split("-");//Divide un string en un array delimitado por -
    //osea nos da un array de 3 donde en el index 0 esta el año, 1 el mes y 2 el dia
    data.setFullYear(fechaEnArray[0]);
    //Los meses para un date arrancan de 0. Si los tenemos que setear -1 y cuando los mostramos +1
    data.setMonth(fechaEnArray[1]-1);
    data.setDate(fechaEnArray[2]);

    return data;
}

function Eliminar(){
    document.getElementById("idSpinner").hidden=false;
    document.getElementById("idContenedor").hidden=true;
   
    var httpPost = new XMLHttpRequest();
    httpPost.onreadystatechange=function()
    {
        if(httpPost.readyState==4&&http.status==200)
        {
                rowGlobal.remove();
                document.getElementById("idSpinner").hidden=true;  
        }
    }
    httpPost.open("POST","http://localhost:3000/eliminar",true);
    httpPost.setRequestHeader("Content-Type","application/json");
    var json = {"id" : rowGlobal.getAttribute("idPersona")};
    httpPost.send(JSON.stringify(json));
}
///////

    // http.setRequestHeader("Content-Type", "application/json");
    // http.send(JSON.stringify(data));
