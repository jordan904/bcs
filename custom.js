(function () {
  "use strict";

  function waitForApp(callback, maxAttempts) {
    var attempts = 0;
    var limit = maxAttempts || 50;
    var interval = setInterval(function () {
      attempts++;
      var root = document.getElementById("root");
      if (root && root.children.length > 0) {
        clearInterval(interval);
        // Small delay to let React finish rendering
        setTimeout(callback, 300);
      } else if (attempts >= limit) {
        clearInterval(interval);
      }
    }, 100);
  }

  function removeInstagramLink() {
    // Find all links pointing to instagram
    var links = document.querySelectorAll('a[href*="instagram.com"]');
    links.forEach(function (link) {
      // Walk up to find the card container (usually the parent with rounded styling)
      var card = link.closest('[class*="rounded"]') || link.parentElement;
      if (card) {
        card.remove();
      }
    });

    // Also remove any standalone instagram text/icons
    var allText = document.querySelectorAll("span, p, a");
    allText.forEach(function (el) {
      if (el.textContent.includes("@bcscarpentryservices") && !el.closest(".quote-form-wrapper")) {
        var card = el.closest('[class*="rounded"]') || el.closest('[class*="flex"]');
        if (card && card.querySelector("svg")) {
          card.remove();
        }
      }
    });
  }

  function addQuoteForm() {
    // Find the contact section - look for the "Get in Touch" heading
    var sections = document.querySelectorAll("section");
    var contactSection = null;

    sections.forEach(function (section) {
      var headings = section.querySelectorAll("h2, h3");
      headings.forEach(function (h) {
        if (h.textContent.toLowerCase().includes("get in touch") || h.textContent.toLowerCase().includes("contact")) {
          contactSection = section;
        }
      });
    });

    if (!contactSection) return;

    // Find the grid inside contact section
    var grid = contactSection.querySelector('[class*="grid"]');
    if (!grid) return;

    // Create the form wrapper
    var formWrapper = document.createElement("div");
    formWrapper.className = "quote-form-wrapper";
    formWrapper.innerHTML =
      '<h3>Request a Free Quote</h3>' +
      '<p class="form-subtitle">Tell us about your project and we\'ll get back to you within 24 hours.</p>' +
      '<form id="quote-form">' +
      '  <div class="form-row">' +
      '    <div>' +
      '      <label for="qf-name">Full Name</label>' +
      '      <input type="text" id="qf-name" name="name" placeholder="John Smith" required autocomplete="name" />' +
      '    </div>' +
      '    <div>' +
      '      <label for="qf-email">Email</label>' +
      '      <input type="email" id="qf-email" name="email" placeholder="john@example.com" required autocomplete="email" inputmode="email" />' +
      '    </div>' +
      '  </div>' +
      '  <div class="form-row">' +
      '    <div>' +
      '      <label for="qf-phone">Phone Number</label>' +
      '      <input type="tel" id="qf-phone" name="phone" placeholder="(902) 555-1234" autocomplete="tel" inputmode="tel" />' +
      '    </div>' +
      '    <div>' +
      '      <label for="qf-service">Service Needed</label>' +
      '      <select id="qf-service" name="service" required>' +
      '        <option value="" disabled selected>Select a service</option>' +
      '        <option value="kitchen">Kitchen Renovation</option>' +
      '        <option value="bathroom">Bathroom Renovation</option>' +
      '        <option value="flooring">Hardwood & Tile Flooring</option>' +
      '        <option value="trim">Crown Moulding & Trim</option>' +
      '        <option value="doors-windows">Doors & Windows</option>' +
      '        <option value="backsplash">Backsplash Installation</option>' +
      '        <option value="other">Other</option>' +
      '      </select>' +
      '    </div>' +
      '  </div>' +
      '  <div>' +
      '    <label for="qf-message">Project Details</label>' +
      '    <textarea id="qf-message" name="message" placeholder="Describe your project, timeline, and any specific requirements..." rows="4" required></textarea>' +
      '  </div>' +
      '  <div style="position:absolute;left:-9999px" aria-hidden="true" tabindex="-1">' +
      '    <input type="text" name="website" tabindex="-1" autocomplete="off" />' +
      '  </div>' +
      '  <button type="submit">Send Quote Request</button>' +
      '</form>';

    // Insert the form after the grid (below the contact cards + map)
    grid.parentElement.insertBefore(formWrapper, grid.nextSibling);

    // Handle form submission
    var form = document.getElementById("quote-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Check honeypot
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) return;

      // Show success
      formWrapper.innerHTML =
        '<div class="form-success">' +
        '  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="oklch(0.76 0.12 75)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>' +
        '  <h4>Quote Request Sent!</h4>' +
        '  <p>Thanks! We\'ll be in touch within 24 hours.</p>' +
        '</div>';
    });
  }

  waitForApp(function () {
    removeInstagramLink();
    addQuoteForm();
  });
})();
