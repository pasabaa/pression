if( navigator.serviceWorker ){
    console.log('Se cargó el service worker');
    navigator.serviceWorker.register('./sw.js')
        .then( resp => console.log('Todo bien: ', resp))
        .catch(error => console.log('Algo mal: ', error))
} else{
    console.log('No se aceptó el service worker');
}

var selectedRow = null

function onFormSubmit() {

        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    
}

function readFormData() {
    var formData = {};
    formData["presionSistolica"] = document.getElementById("presionSistolica").value;
    formData["presionDiastolica"] = document.getElementById("presionDiastolica").value;
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    var resultPresion = 0;

    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.presionSistolica;

    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.presionDiastolica;

    resultPresion = data.presionSistolica/data.presionDiastolica;


    if(resultPresion <= 1.5){

        cell3 = newRow.insertCell(2);
        cell3.innerHTML = `<p class="fw-bold text-success">Es algo normal <i class="bi bi-emoji-laughing-fill"></i></p>`;

    } else if (resultPresion >= 1.5) {

        cell3 = newRow.insertCell(2);
        cell3.innerHTML = `<p class="fw-bold text-danger">No es algo normal <i class="bi bi-emoji-frown-fill"></i></p>`;

    } else {

        cell3 = newRow.insertCell(2);
        cell3.innerHTML = `<p class="fw-bold text-muted">Sin resultado <i class="bi bi-emoji-neutral-fill"></i></p>`;

    }
    
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a class="btn btn-sm bg-light" onClick="onEdit(this)"><i class="bi bi-pencil-square"></i></a>
                       <a class="btn btn-sm btn-danger" onClick="onDelete(this)"><i class="bi bi-trash-fill"></i></a>`;
}

function resetForm() {
    document.getElementById("presionSistolica").value = "";
    document.getElementById("presionDiastolica").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("presionSistolica").value = selectedRow.cells[0].innerHTML;
    document.getElementById("presionDiastolica").value = selectedRow.cells[1].innerHTML;
}
function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.presionSistolica;
    selectedRow.cells[1].innerHTML = formData.presionDiastolica;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        resetForm();
    }
}
