//Bien hardcodeada la API
const API = "https://portfolio-api-three-black.vercel.app/api/v1/publicProjects/251943";


const projectsGrid = document.getElementById('projectsGrid');
const loading = document.getElementById('loading');


function showLoading() { //Para mostrar el loading
    loading.style.display = 'block';
    projectsGrid.style.display = 'none';
}

function hideLoading() { //Para ocultar el loading
    loading.style.display = 'none';
    projectsGrid.style.display = 'grid';
}

//Como odio hacer cards en JS
function createProjectCard(project) {
    const { title, description, technologies, repository, images } = project;
    
    const imageHtml = images && images.length > 0 //Por si no hay imagen
        ? `<img src="${images[0]}" alt="${title}" class="project-image">` 
        : `<div class="no-image">Sin imagen</div>`;
    
        //Para las tecnologias
    const techTags = technologies ? technologies.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('') : '';
    
    //Simple template para la card
    return ` 
        <div class="project-card">
            ${imageHtml}
            <div class="project-content">
                <h3 class="project-title">${title || 'Sin titulo'}</h3>
                <p class="project-description">${description || 'Sin descripcion'}</p>
                <div class="project-technologies">${techTags}</div>
                <a href="${repository || '#'}" class="project-link" target="_blank">
                    Ver Repositorio
                </a>
            </div>
        </div>
    `;
}

//Para cachar los proyectos
async function fetchProjects() {
    showLoading(); // Mostrar loading al iniciar la fetch
    
    try {
        const response = await fetch(API);
        const data = await response.json();
        
        console.log('Projects:', data);
        
        const projects = Array.isArray(data) ? data : data.projects || [];
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<div class="no-projects"><h3>No hay proyectos</h3></div>';
        } else {
            projectsGrid.innerHTML = projects.map(createProjectCard).join('');
        }
        
    } catch (error) {
        console.error('Error:', error);
        projectsGrid.innerHTML = `
            <div class="error-message">
                <h3>Error al cargar proyectos</h3>
                <p>Intenta de nuevo mas tarde</p>
                <button onclick="fetchProjects()" class="btn-primary">Reintentar</button>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

//Un mejor scroll para los enlaces internos
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => { //Para los anchors, links pues
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

//Cada que carga la pagina
document.addEventListener('DOMContentLoaded', function() {
    fetchProjects();
    initSmoothScroll();
});