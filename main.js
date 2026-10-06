// Contact form: sends to Formspree with fetch, shows status inline.
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = form.querySelector(".form__status");
  const say = (key) => { status.textContent = form.dataset[key] || ""; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.action.includes("YOUR_FORM_ID")) { say("notConnected"); return; }
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    say("sending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      say("sent");
    } catch (err) {
      say("error");
    } finally {
      button.disabled = false;
    }
  });
})();
