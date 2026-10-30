/* The five journals. Do not reword citations, DOIs, or links. */
window.SITE_JOURNALS = [
  {
    id: "j1",
    title: "Development of a Web-Based First Person Shooter Game Using Unity with the Game Development Life Cycle Method",
    original: "Pengembangan Game First Person Shooter Berbasis Web Menggunakan Unity dengan Metode Game Development Life Cycle",
    lang: "Indonesian",
    authors: "Alghivary, M. M., Suharso, A., & Defiyanti, S.",
    year: "2025",
    venue: "JATI (Jurnal Mahasiswa Teknik Informatika)",
    detail: "9(1), 1152 to 1159.",
    tags: ["unity"],
    summary: "The authors develop a browser-based first person shooter in Unity that runs without extra installation, motivated by the limits local developers face: capital, technology access, project management, and marketing. They follow the Game Development Life Cycle (GDLC) through concept and planning, pre-production, production, and testing. Shooting, respawn, and interface features were built in Visual Studio and checked with black-box testing. The authors conclude that GDLC helps resolve technical obstacles and produces a game that fits user needs.",
    article: "https://ejournal.itn.ac.id/jati/article/view/12643",
    pdf: "https://ejournal.itn.ac.id/jati/article/download/12643/6994",
    doi: "https://doi.org/10.36040/jati.v9i1.12643",
    doiText: "10.36040/jati.v9i1.12643",
    note: ""
  },
  {
    id: "j2",
    title: "Exploration Game Application “Nusa Sang Penjelajah” Using Unity and C#",
    original: "Aplikasi Permainan Eksplorasi “Nusa Sang Penjelajah” Menggunakan Unity dan C#",
    lang: "Indonesian",
    authors: "Rachman, A., & Sari, R. N.",
    year: "2025",
    venue: "Jurnal Minfo Polgan",
    detail: "14(2), 3626 to 3632.",
    tags: ["unity"],
    summary: "A top-down exploration game in the style of Stardew Valley, built around Indonesian culture through folktales, artifacts, and temples. It was developed in Unity and C# with GDLC (planning, production, testing, and release). The authors report an engaging and educational game, and they position it as a way for young people to engage with local heritage.",
    article: "https://jurnal.polgan.ac.id/index.php/jmp/article/view/15876",
    pdf: "https://jurnal.polgan.ac.id/index.php/jmp/article/download/15876/3834",
    doi: "https://doi.org/10.33395/jmp.v14i2.15876",
    doiText: "10.33395/jmp.v14i2.15876",
    note: ""
  },
  {
    id: "j3",
    title: "Development of an Android-Based Platformer Game “Ayo Lawan Virus” Using the Unity Game Engine",
    original: "Pengembangan Game Platformer “Ayo Lawan Virus” Berbasis Android dengan Menggunakan Game Engine Unity",
    lang: "Indonesian",
    authors: "Yedithia, F., Sulistyowati, & Rosmiati.",
    year: "2022",
    venue: "Jurnal Humaniora Teknologi",
    detail: "8(1), 1 to 9.",
    tags: ["unity"],
    summary: "A game on clean and healthy living behavior (PHBS) for children and teenagers, set against the pandemic. The team ran observations and a literature study on viruses and hygiene practices, then produced the artwork with an illustrator. The finished game, “Ayo Lawan Virus” (Let's Fight the Virus), is distributed free to the public as an educational tool.",
    article: "https://jht.politala.ac.id/index.php/jht/article/view/101",
    pdf: "https://jht.politala.ac.id/index.php/jht/article/download/101/89",
    doi: "https://doi.org/10.34128/jht.v8i1.101",
    doiText: "10.34128/jht.v8i1.101",
    note: ""
  },
  {
    id: "j4",
    title: "Procedural Puzzle Generation: A Survey",
    original: "",
    lang: "English",
    authors: "De Kegel, B., & Haahr, M.",
    year: "2020",
    venue: "IEEE Transactions on Games",
    detail: "12(1), 21 to 40.",
    tags: ["procedural", "surveys"],
    summary: "Procedural content generation (PCG) is used far less for puzzles than for other game elements, and most work stays within pure puzzle games rather than puzzles embedded in other genres. The authors survey 32 methods across eleven puzzle categories and define seven characteristics for comparing them, which also point to promising research areas.",
    article: "https://www.tara.tcd.ie/items/58270d70-f98a-462e-bdf3-5a21672dd3ba",
    pdf: "https://www.tara.tcd.ie/bitstreams/fb01afb7-592a-4d27-aadc-096a7de59345/download",
    doi: "https://doi.org/10.1109/TG.2019.2917792",
    doiText: "10.1109/TG.2019.2917792",
    note: "Open-access PDF, about 20 MB."
  },
  {
    id: "j5",
    title: "Intelligent Generation of Graphical Game Assets: A Conceptual Framework and Systematic Review of the State of the Art",
    original: "",
    lang: "English",
    authors: "Fukaya, K., et al.", /* [CONFIRM] copy the full author list from the article page */
    year: "2025",
    venue: "ACM Computing Surveys",
    detail: "57(5), Article 118.",
    tags: ["procedural", "surveys"],
    summary: "Games contain many graphical assets, such as clouds, buildings, and vegetation, that serve no gameplay function, and PCG is widely used to produce them. The review covers 200 papers on graphical asset generation in and beyond games, spanning 21 asset types, nine techniques, and 28 approaches. The GAGeTx framework consolidates the findings to guide the choice and design of asset generators.",
    article: "https://bura.brunel.ac.uk/handle/2438/28016",
    pdf: "https://arxiv.org/pdf/2311.10129",
    doi: "https://doi.org/10.1145/3708499",
    doiText: "10.1145/3708499",
    note: "The PDF is the arXiv preprint (arXiv:2311.10129)."
  }
];

window.SITE_JOURNAL_FILTERS = [
  { key: "all", label: "All" },
  { key: "unity", label: "Unity and GDLC" },
  { key: "procedural", label: "Procedural generation" },
  { key: "surveys", label: "Surveys" }
];
