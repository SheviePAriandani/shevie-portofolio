/* CV content. Items marked [CONFIRM] are kept off the page until Shevie approves them. */
window.SITE_CV = {
  headline: "Informatics Engineering student, Universitas Ahmad Dahlan",
  profile: "Seventh-semester Informatics Engineering student at Universitas Ahmad Dahlan, currently doing an internship. I hope to graduate on time and build a career where I can keep learning and growing.",

  /* Personal data, added at the request of the site owner. Set to null to hide the whole block. */
  personal: [
    { label: "Name", value: "Shevie Putri Ariandani" },
    { label: "Place and date of birth", value: "Kulon Progo, 18 January 2005" },
    { label: "Gender", value: "Female" },
    { label: "Religion", value: "Islam" },
    { label: "Citizenship", value: "Indonesian" }
  ],

  education: [
    { school: "Universitas Ahmad Dahlan, Yogyakarta", detail: "Informatics Engineering", period: "2023 to present" },
    { school: "SMAN 1 Prembun", detail: "Senior high school", period: "2019 to 2023" },
    { school: "SMPN 1 Prembun", detail: "Junior high school", period: "2016 to 2019" }
  ],

  /* "english" stays empty where the English wording is still a [CONFIRM] item.
     The page then shows the original Indonesian name only. */
  experience: [
    { original: "Panitia P2k Universitas Ahmad Dahlan 2024", english: "", org: "" },
    { original: "Panitia P2k Universitas Ahmad Dahlan 2025", english: "", org: "" },
    { original: "Pengurus UKM Tari 2024/2025", english: "", org: "" },
    { original: "Panitia Buwaca Satwatika 3rd 2024", english: "", org: "" }
  ],

  /* Shown only when filled. Example:
     { company: "", role: "", period: "", description: "" } */
  internship: null,

  /* Shown only when filled. Example: ["Skill one", "Skill two"] */
  skills: ["Blender", "Unity", "Canva", "IbisPaint", "Figma", "Godot", "Roblox Studio"],

  interests: [
    { icon: "book", label: "Reading books" },
    { icon: "gamepad", label: "Playing games" },
    { icon: "dance", label: "Dance" },
    { icon: "brush", label: "Drawing" },
    { icon: "yarn-stitch", label: "Knitting" }
  ],

  /* Contact details, added at the request of the site owner. Set to null to show "Available on request" instead. */
  contactDetails: [
    { icon: "phone", label: "Phone", value: "0821-5898-8188", href: "tel:+6282158988188" },
    { icon: "mail", label: "Email", value: "shevieariandani@gmail.com", href: "mailto:shevieariandani@gmail.com" }
  ],
  contact: "Available on request"
};
