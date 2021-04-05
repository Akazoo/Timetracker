const apikey = 'f72e519f-0acd-4a32-a783-2d2a009fd23f';
const apihost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function () {

    // Funkcje API
    function apiListTasks() {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                }
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                    }
                    return resp.json();
                }
            )
    }

    function apiCreateTask(title, description) {

        return fetch(
            apihost + '/api/tasks',
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({title: title, description: description, status: 'open'})
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiDeleteTask(taskId) {

        return fetch(
            apihost + '/api/tasks/' + taskId,
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }

    function apiUpdateTask(taskId, title, description, status) {
        return fetch(
            apihost + '/api/tasks/' + taskId,
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: title, description: description, status: status}),
                method: 'PUT'
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                    }
                    return resp.json();
                }
            );
    }

    function apiCreateOperationForTask(taskId, description) {
        return fetch(
            apihost + '/api/tasks/' + taskId + '/operations',
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: description, timeSpent: 0}),
                method: 'POST'
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                    }
                    return resp.json();
                }
            );
    }

    function apiListOperationsForTask(taskId) {

        return fetch(
            apihost + '/api/tasks/' + taskId + '/operations',
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                }
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                    }
                    return resp.json();
                }
            );
    }

    function apiUpdateOperation(operationId, description, timeSpent) {
        return fetch(
            apihost + '/api/operations/' + operationId,
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({description: description, timeSpent: timeSpent}),
                method: 'PUT'
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                    }
                    return resp.json();
                }
            );

    }

    function apiDeleteOperation(operationId) {
        return fetch(
            apihost + '/api/operations/' + operationId,
            {
                headers: {
                    'Authorization': apikey,
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            })
            .then(
                function (resp) {
                    if (!resp.ok) {
                        alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                    }
                    return resp.json();
                }
            );
    }

    // Funkcje strony
    function renderTask(taskId, title, description, status) {

        // Tworzenie sekcji

        const section = document.createElement("section");
        section.className = 'card mt-5 shadow-sm';
        section.innerHTML = `
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5>${title}</h5>
        <h6 class="card-subtitle text-muted">${description}</h6>
      </div>
      <div>
        <button class="btn btn-outline-danger btn-sm ml-2">Delete</button>
      </div>
    </div>
    <ul class="list-group list-group-flush">
    </ul>
    <div class="card-body">
      <form>
      </form>
    </div> `
        if (status === 'open') {
            document.querySelector("main").firstElementChild.after(section)
        } else {
            document.querySelector("main").append(section);
        }

        // Dodawanie przycisku gdy open

        const finishButton = document.createElement('button');
        const deleteButton = section.querySelector(".btn");

        if (status === 'open') {

            finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
            finishButton.innerText = 'Finish';

            section.firstElementChild.lastElementChild.insertBefore(finishButton, deleteButton);
        }

        // Wypelnianie task operacjami

        const ul = section.querySelector("ul");
        apiListOperationsForTask(taskId).then(
            function (response) {
                response.data.forEach(
                    function (operation) {
                        renderOperation(ul, operation.id, status, operation.description, operation.timeSpent);
                    }
                );
            });

        // Usuwanie tasku

        deleteButton.addEventListener("click", evt => {
            apiDeleteTask(taskId);
            section.remove();
        });

        // Dodanie formularza gdy open

        const addOperationForm = section.querySelector("form");

        if (status === 'open') {
            addOperationForm.innerHTML = `  
            <div class="input-group">
          <input type="text" placeholder="Operation description" class="form-control" minlength="5">
          <div class="input-group-append">
            <button class="btn btn-info">Add</button>
          </div>
        </div>`;
        }

        // Dodawanie operacji

        addOperationForm.addEventListener("submit", ev => {
            ev.preventDefault();
            const input = addOperationForm.querySelector("input");
            apiCreateOperationForTask(taskId, input.value).then(
                function (operation) {
                    renderOperation(ul, operation.data.id, status, operation.data.description, operation.data.timeSpent);
                });
            input.value = "";
        })

        // Zakanczanie tasku

        finishButton.addEventListener("click", ev => {
            // dziala ale moze lepiej (dodaje na dol-niby dobrze)
            section.remove();
            apiUpdateTask(taskId, title, description, "close").then(response => {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status)
            });
        })

    }

    function renderOperation(operationsList, operationId, status, operationDescription, timeSpent) {

        // Tworzenie elementu listy

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
        <div>
          ${operationDescription}
          <span class="badge badge-success badge-pill ml-2">${timeChanger(timeSpent)}</span>
        </div>
        <div>
        </div>`;

        operationsList.appendChild(li);

        // Dodanie przycisku  i akcji gdy open

        if (status === 'open') {
            li.lastElementChild.innerHTML = `
            <button class="btn btn-outline-success btn-sm mr-2">+15m</button>
            <button class="btn btn-outline-success btn-sm mr-2">+1h</button>
            <button class="btn btn-outline-danger btn-sm">Delete</button>
            `;

            // Dodanie czasu 15m

            li.lastElementChild.children[0].addEventListener("click", evt => {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(response => {
                    li.firstElementChild.firstElementChild.innerText = timeChanger(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                })
            })

            // Dodanie czasu 1h

            li.lastElementChild.children[1].addEventListener("click", evt => {
                apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(response => {
                    li.firstElementChild.firstElementChild.innerText = timeChanger(response.data.timeSpent);
                    timeSpent = response.data.timeSpent;
                })
            })

            // Usuwanie operacji

            li.lastElementChild.children[2].addEventListener("click", evt => {
                apiDeleteOperation(operationId);
                li.remove();
            })
        }
    }

    // Dodatkowe funkcje
    function timeChanger(numberM) {

        const hours = Math.floor(numberM / 60);
        const minutes = numberM % 60;
        if (hours === 0) {
            return minutes + " m";
        } else {
            if (minutes === 0) {
                return hours + " h"
            } else {
                return hours + " h " + minutes + " m"
            }
        }
    }

    function start() {

        //pierwsze ladowanie drzewa

        apiListTasks().then(
            function (response) {
                response.data.forEach(
                    (task) => {
                        renderTask(task.id, task.title, task.description, task.status);
                    }
                );
            }
        );

        //tworzenie tasku

        const taskForm = document.querySelector(".js-task-adding-form");
        taskForm.addEventListener("submit", evt => {
            evt.preventDefault();
            const inputs = taskForm.querySelectorAll("input");
            apiCreateTask(inputs[0].value, inputs[1].value).then(
                function (response) {
                    renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
                });

            inputs[0].value = "";
            inputs[1].value = "";
            alert("Task created.");
        });

    }

    // Core
    start();

});