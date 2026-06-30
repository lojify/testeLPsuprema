// js/reserva-form.js
// Validação simples e feedback visual do formulário de reservas.
// Sem reload de página; graceful degradation se JS falhar (form continua
// utilizável via validação HTML nativa / submissão normal).

export function initReservaForm() {
  const form = document.getElementById("reserva-form");
  if (!form) return;

  const confirmacao = document.getElementById("form-confirmacao");

  const validators = {
    nome: (v) => v.trim().length >= 3 || "Informe seu nome completo.",
    telefone: (v) => /^[\d\s()+-]{8,}$/.test(v.trim()) || "Telefone inválido.",
    data: (v) => !!v || "Selecione uma data.",
    horario: (v) => !!v || "Selecione um horário.",
    pessoas: (v) => (Number(v) >= 1 && Number(v) <= 20) || "Informe entre 1 e 20 pessoas.",
  };

  function getGroup(input) {
    return input.closest(".form-group");
  }

  function showError(field, result) {
    const input = form.querySelector(`#${field}`);
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    const group = input ? getGroup(input) : null;
    const isValid = result === true;

    if (errorEl) errorEl.textContent = isValid ? "" : result;
    if (group) group.classList.toggle("invalido", !isValid);
    return isValid;
  }

  function validateField(field) {
    const input = form.querySelector(`#${field}`);
    if (!input || !validators[field]) return true;
    return showError(field, validators[field](input.value));
  }

  Object.keys(validators).forEach((field) => {
    const input = form.querySelector(`#${field}`);
    if (!input) return;
    input.addEventListener("blur", () => validateField(field));
    input.addEventListener("input", () => {
      const group = getGroup(input);
      if (group && group.classList.contains("invalido")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalidInput = null;

    Object.keys(validators).forEach((field) => {
      const ok = validateField(field);
      if (!ok) {
        allValid = false;
        if (!firstInvalidInput) firstInvalidInput = form.querySelector(`#${field}`);
      }
    });

    if (!allValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
    }

    // Simula envio (substituir por fetch real para o backend/CRM do cliente)
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
      }
      if (confirmacao) confirmacao.classList.add("is-visivel");
      form.reset();

      setTimeout(() => {
        if (confirmacao) confirmacao.classList.remove("is-visivel");
      }, 6000);
    }, 700);
  });
}
