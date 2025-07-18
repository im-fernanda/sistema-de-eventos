// utils.js
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
}

export function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600 border-opacity-50"></div>
            </div>
        `;
    }
}

export function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container && container.querySelector('.loading-spinner')) {
        container.querySelector('.loading-spinner').remove();
    }
}

export function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-white text-lg font-semibold toast-${type}`;
    if (type === "success") toast.classList.add("bg-green-600");
    else if (type === "error") toast.classList.add("bg-red-600");
    else toast.classList.add("bg-blue-600");
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

export function showMessage(message, type = "info") {
    showToast(message, type);
}
