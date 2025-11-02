// Prefilled WhatsApp share message
const eventInfo = {
  title: "River Revive – Pune River Cleaning Camp",
  date: "14 Oct 2025",
  time: "9:00 AM",
  place: "Bhide Bridge, Pune",
  capacity: "Up to 1000 participants",
  phone: "+91 84120 11008",
  links: {
    instagram: "https://www.instagram.com/riverrevive/",
    facebook: "https://www.facebook.com/share/1K8sMSbfWQ/",
    whatsappChannel: "https://chat.whatsapp.com/GNSfS7d4hxWEzAUlZtHUwr?mode=ems_wa_t"
  }
};

function buildShareText() {
  return [
    "Join the River Revive – Pune River Cleaning Camp 🌊",
    `Date: ${eventInfo.date} · Time: ${eventInfo.time}`,
    `Location: ${eventInfo.place}`,
    `${eventInfo.capacity}`,
    `Contact: ${eventInfo.phone}`,
    "",
    "Follow & updates:",
    `IG: ${eventInfo.links.instagram}`,
    `FB: ${eventInfo.links.facebook}`,
    `WhatsApp Channel: ${eventInfo.links.whatsappChannel}`
  ].join("\n");
}

// Universal WhatsApp share/link formats
// wa.me with text works across platforms and is preferred for web
function getWhatsAppShareURL(text) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/?text=${encoded}`;
}

// Click-to-chat to the contact number if needed
function getWhatsAppDMURLToNumber(number, text) {
  const digits = number.replace(/[^\d]/g, "");
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${digits}?text=${encoded}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const shareBtn = document.getElementById("share-whatsapp");
  const contactBtn = document.getElementById("whatsapp-contact");

  if (shareBtn) {
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = getWhatsAppShareURL(buildShareText());
      window.open(url, "_blank", "noopener");
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const text = "Hello River Revive team! I want to participate in the river cleaning camp.";
      const url = getWhatsAppDMURLToNumber(eventInfo.phone, text);
      window.open(url, "_blank", "noopener");
    });
  }
});