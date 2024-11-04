
document.addEventListener('DOMContentLoaded', carregarTarefas);

document.getElementById('task-form').addEventListener('submit', adicionarTarefa);

document.getElementById('filter-status').addEventListener('click', filtrarPorStatus);

document.getElementById('filter-priority').addEventListener('click', filtrarPorPrioridade);

let tarefas = [];
let filtro = 'todos';

function carregarTarefas() {
    tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    exibirTarefas();
    mostrarNotificacoes();
}


function adicionarTarefa(e) {
    e.preventDefault();
    const nome = document.getElementById('task-name').value;
    const data = document.getElementById('task-date').value;
    const prioridade = document.getElementById('task-priority').value;

    const tarefa = {
        id: Date.now(), 
        nome,
        data,
        prioridade,
        concluída: false,
    };

    tarefas.push(tarefa); 
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); 
    exibirTarefas(); 
    this.reset(); 
}


function exibirTarefas() {
    const listaTarefas = document.getElementById('task-list');
    listaTarefas.innerHTML = ''; 

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtro === 'concluídas') return tarefa.concluída;
        if (filtro === 'pendentes') return !tarefa.concluída;
        return true; 
    });

    tarefasFiltradas.forEach(tarefa => {
        const li = document.createElement('li');
        li.textContent = `${tarefa.nome} - ${tarefa.data} - ${tarefa.prioridade}`;
        if (tarefa.concluída) li.classList.add('concluída');

        const btnCompletar = document.createElement('button');
        btnCompletar.textContent = tarefa.concluída ? 'Reverter' : 'Completar';
        btnCompletar.classList.toggle('complete', tarefa.concluída); 
        btnCompletar.addEventListener('click', () => alternarCompleto(tarefa.id, btnCompletar));

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarTarefa(tarefa.id));

        li.appendChild(btnCompletar);
        li.appendChild(btnEditar);
        listaTarefas.appendChild(li);
    });
}

function alternarCompleto(id, btnCompletar) {
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            const novaTarefa = { ...tarefa, concluída: !tarefa.concluída };
            btnCompletar.classList.toggle('complete', novaTarefa.concluída); 
            return novaTarefa;
        }
        return tarefa;
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    exibirTarefas();
}


function editarTarefa(id) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id);
    if (tarefa) {
        document.getElementById('task-name').value = tarefa.nome;
        document.getElementById('task-date').value = tarefa.data;
        document.getElementById('task-priority').value = tarefa.prioridade;

       
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        exibirTarefas();
    }
}

function filtrarPorStatus() {
    filtro = filtro === 'todos' ? 'concluídas' : filtro === 'concluídas' ? 'pendentes' : 'todos';
    exibirTarefas();
}

function filtrarPorPrioridade() {
    tarefas.sort((a, b) => {
        const prioridades = { baixa: 1, media: 2, alta: 3 };
        return prioridades[a.prioridade] - prioridades[b.prioridade];
    });
    exibirTarefas();
}
