const API_URL = '/api/events';
const token = localStorage.getItem('token');

// Verifica Autenticação
if (!token) {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const eventsContainer = document.getElementById('events-container');
    const dashboardError = document.getElementById('dashboard-error');
    
    // Modal
    const modal = document.getElementById('event-modal');
    const btnOpenModal = document.getElementById('btn-open-modal');
    const closeBtn = document.querySelector('.close-btn');
    const eventForm = document.getElementById('event-form');

    // Fetch e Renderiza Eventos
    const loadEvents = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            if (data.sucesso) {
                renderEvents(data.data);
            } else {
                dashboardError.innerText = 'Falha ao carregar eventos';
            }
        } catch (error) {
            dashboardError.innerText = 'Erro de conexão';
        }
    };

    const renderEvents = (events) => {
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>Nenhum evento encontrado. Crie o primeiro!</p>';
            return;
        }

        eventsContainer.innerHTML = '';
        
        // Vamos extrair a info do usuário do token de forma simples (gambiarra no frontend só para UX)
        let userId = null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            userId = payload.id;
        } catch(e) {}

        events.forEach(event => {
            const date = new Date(event.data).toLocaleDateString('pt-BR');
            const isOwner = event.criador && event.criador._id === userId;
            
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <h3>${event.titulo}</h3>
                <div class="meta">📅 ${date} &nbsp; 📍 ${event.local}</div>
                <p>${event.descricao}</p>
                <div class="meta" style="color:var(--text-muted)">Criado por: ${event.criador ? event.criador.nome : 'Desconhecido'}</div>
                ${isOwner ? `
                    <div class="event-actions">
                        <button class="btn btn-danger btn-delete" data-id="${event._id}">Deletar</button>
                    </div>
                ` : ''}
            `;
            eventsContainer.appendChild(card);
        });

        // Adicionar eventos de click aos botões de deletar
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                await deleteEvent(id);
            });
        });
    };

    // Criar Evento
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const eventData = {
            titulo: document.getElementById('evento-titulo').value,
            descricao: document.getElementById('evento-descricao').value,
            data: document.getElementById('evento-data').value,
            local: document.getElementById('evento-local').value
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });
            const data = await res.json();

            if (data.sucesso) {
                modal.style.display = 'none';
                eventForm.reset();
                loadEvents(); // Recarrega a lista
            } else {
                alert('Erro: ' + data.erro);
            }
        } catch (error) {
            alert('Erro de conexão ao criar evento');
        }
    });

    // Deletar Evento
    const deleteEvent = async (id) => {
        if (!confirm('Tem certeza que deseja deletar este evento?')) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.sucesso) {
                loadEvents();
            } else {
                alert('Erro: ' + data.erro);
            }
        } catch (error) {
            alert('Erro de conexão ao deletar evento');
        }
    };

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // Modal Events
    btnOpenModal.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    // Initial Load
    loadEvents();
});
