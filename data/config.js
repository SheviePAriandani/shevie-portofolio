/* Site settings. Edit the text here; markup stays untouched. */
window.SITE_CONFIG = {
  name: "Shevie Putri Ariandani",
  updated: "October 2026",

  hero: {
    greeting: "Hello there",
    line: "Hi, I'm Shevie. A seventh-semester Informatics student, currently interning, and always learning.",
    sub: "Welcome to my little corner of the internet. Stay a while.",
    facts: [
      { label: "University", value: "UAD Yogyakarta" },
      { label: "Semester", value: "7" },
      { label: "Now", value: "internship" },
      { label: "Hobbies", value: "reading, drawing, dance" }
    ]
  },

  /* Intro video. See README.md for how to add it.
     provider: "youtube" (set id) or "file" (set src, for example "assets/video/intro.mp4") */
  video: {
    provider: "youtube",
    id: "",
    src: "",
    poster: "",
    title: "Self-introduction by Shevie Putri Ariandani",
    captions: "",
    script: "Hello everyone, good morning. My name is Shevie Putri Ariandani. Currently, I am a seventh-semester student, and I am also doing an internship. In the future, I hope to graduate on time and build a successful career where I can continue learning and growing. Nice to meet you all. Thank you."
  },

  /* Path to a public-safe CV PDF, for example "assets/docs/cv-shevie.pdf".
     The download button stays hidden while this is empty. */
  cvPdf: "",

  journals: {
    intro: "Five papers on game development that I read for the group assignment. Each card has a short summary and links to the article, the PDF, and the DOI.",
    note: "PDF links were checked against each journal's landing page. If a PDF does not open, use the article page or the DOI."
  },

  footer: {
    line: "Made for an English course at Universitas Ahmad Dahlan."
  }
};
