(function () {
  "use strict";

  function fixHeroImage() {
    var heroSection = document.querySelector("#root > div > section:first-of-type") ||
                      document.querySelector("#root > div > div:first-child");
    if (!heroSection) return;

    // Inject a style tag that overrides Framer Motion's inline opacity
    // This is more stable than MutationObserver which causes flashing
    var style = document.createElement("style");
    style.textContent =
      "#root > div > section:first-of-type img," +
      "#root > div > section:first-of-type [style*='opacity'] {" +
      "  opacity: 1 !important;" +
      "  visibility: visible !important;" +
      "}" +
      "#root > div > div:first-child img," +
      "#root > div > div:first-child [style*='opacity'] {" +
      "  opacity: 1 !important;" +
      "  visibility: visible !important;" +
      "}";
    document.head.appendChild(style);
  }

  function fixGalleryImages() {
    var gallery = document.getElementById("gallery");
    if (!gallery) return;

    var items = gallery.querySelectorAll("[style]");
    items.forEach(function (item) {
      if (item.style.aspectRatio) {
        item.style.setProperty("aspect-ratio", "4/3", "important");
        item.style.setProperty("position", "relative", "important");
        item.style.setProperty("width", "100%", "important");
        item.style.setProperty("overflow", "hidden", "important");

        var img = item.querySelector("img");
        if (img) {
          // Replace the small Client Project webp with local BCS.jpg
          if (img.src && img.src.indexOf("bcs_kitchen_1") !== -1) {
            img.src = "/bcs/assets/BCS.jpg";
          }
          img.style.setProperty("position", "absolute", "important");
          img.style.setProperty("inset", "0", "important");
          img.style.setProperty("width", "100%", "important");
          img.style.setProperty("height", "100%", "important");
          img.style.setProperty("object-fit", "cover", "important");
          img.style.setProperty("object-position", "center", "important");
        }
      }
    });
  }

  function removeInstagramLink() {
    var links = document.querySelectorAll('a[href*="instagram.com"]');
    links.forEach(function (link) {
      var card = link.closest("[style]");
      while (card && !card.style.border && card.parentElement) {
        card = card.parentElement.closest("[style]");
      }
      if (card) {
        var wrapper = card.parentElement;
        if (wrapper) {
          wrapper.remove();
        } else {
          card.remove();
        }
      } else {
        link.closest("div").remove();
      }
    });
  }

  function addQuoteForm() {
    var contactSection = null;
    var sections = document.querySelectorAll("section");
    sections.forEach(function (section) {
      var headings = section.querySelectorAll("h2");
      headings.forEach(function (h) {
        if (h.textContent && h.textContent.indexOf("Contact") !== -1) {
          contactSection = section;
        }
      });
    });
    if (!contactSection) return;

    var container = contactSection.querySelector(".container");
    if (!container) {
      var kids = contactSection.children;
      for (var i = 0; i < kids.length; i++) {
        if (kids[i].className && kids[i].className.indexOf("container") !== -1) {
          container = kids[i];
          break;
        }
      }
    }
    if (!container) container = contactSection;

    var formWrapper = document.createElement("div");
    formWrapper.className = "quote-form-wrapper";
    formWrapper.innerHTML = '<h3>Request a Free Quote</h3>' +
      '<p class="form-subtitle">Tell us about your project and we will get back to you within 24 hours.</p>' +
      '<form id="quote-form">' +
      '<div class="form-row">' +
      '<div><label for="qf-name">Full Name</label>' +
      '<input type="text" id="qf-name" name="name" placeholder="John Smith" required autocomplete="name" /></div>' +
      '<div><label for="qf-email">Email</label>' +
      '<input type="email" id="qf-email" name="email" placeholder="john@example.com" required autocomplete="email" inputmode="email" /></div>' +
      '</div>' +
      '<div class="form-row">' +
      '<div><label for="qf-phone">Phone Number</label>' +
      '<input type="tel" id="qf-phone" name="phone" placeholder="(902) 555-1234" autocomplete="tel" inputmode="tel" /></div>' +
      '<div><label for="qf-service">Service Needed</label>' +
      '<select id="qf-service" name="service" required>' +
      '<option value="" disabled selected>Select a service</option>' +
      '<option value="kitchen">Kitchen Renovation</option>' +
      '<option value="bathroom">Bathroom Renovation</option>' +
      '<option value="flooring">Hardwood &amp; Tile Flooring</option>' +
      '<option value="trim">Crown Moulding &amp; Trim</option>' +
      '<option value="doors-windows">Doors &amp; Windows</option>' +
      '<option value="backsplash">Backsplash Installation</option>' +
      '<option value="other">Other</option>' +
      '</select></div>' +
      '</div>' +
      '<div><label for="qf-message">Project Details</label>' +
      '<textarea id="qf-message" name="message" placeholder="Describe your project, timeline, and any specific requirements..." rows="4" required></textarea></div>' +
      '<div style="position:absolute;left:-9999px" aria-hidden="true" tabindex="-1">' +
      '<input type="text" name="website" tabindex="-1" autocomplete="off" /></div>' +
      '<button type="submit">Send Quote Request</button>' +
      '</form>';

    container.appendChild(formWrapper);

    document.getElementById("quote-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = this.querySelector('input[name="website"]');
      if (hp && hp.value) return;
      formWrapper.innerHTML = '<div class="form-success">' +
        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="oklch(0.76 0.12 75)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>' +
        '<h4>Quote Request Sent!</h4>' +
        '<p>Thanks! We will be in touch within 24 hours.</p>' +
        '</div>';
    });
  }

  function waitForApp(callback) {
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      var root = document.getElementById("root");
      if (root && root.children.length > 0 && document.getElementById("gallery")) {
        clearInterval(interval);
        setTimeout(callback, 200);
      } else if (attempts >= 80) {
        clearInterval(interval);
      }
    }, 100);
  }

  // Inject hero fix CSS immediately (no need to wait for React)
  fixHeroImage();

  // Fix everything else once gallery is ready
  waitForApp(function () {
    fixHeroImage();
    fixGalleryImages();
    removeInstagramLink();
    addQuoteForm();
  });
})();
