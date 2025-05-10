export function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 class="text-4xl font-bold">Login Page</h1>
    </div>
  `;
}
