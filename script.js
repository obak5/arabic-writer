const editor = document.getElementById("editor");

/* -------------------------------------------------------
   COMPLETE ARABIC TRANSLITERATION MAP
   ------------------------------------------------------- */

const map = {

    // === Your special combinations ===
    "t'": "ث",
    "s'": "ش",
    "d'": "ض",
    "z'": "ظ",
    "g'": "غ",

    "-": "ء",

    "a'": "أ",
    "i'": "إ",
    "e'": "ٱ",

    "a+'": "آ",
    "t+'": "ة",
    "o+": "ؤ",
    "i+": "ئ",

    // === Your new single-letter rules ===
    "g": "ع",
    "H": "ح",

    // === Full Arabic mapping (single English → Arabic) ===
    "a": "ا",
    "b": "ب",
    "t": "ت",
    "j": "ج",
    "h": "ه",
    "k": "ك",
    "d": "د",
    "r": "ر",
    "z": "ز",
    "s": "س",
    "S": "ص",
    "D": "ض",
    "T": "ط",
    "Z": "ظ",
    "3": "ع",
    "G": "غ",
    "f": "ف",
    "q": "ق",
    "l": "ل",
    "m": "م",
    "n": "ن",
    "w": "و",
    "y": "ي",
    "o": "و",
    "u": "و",
    "i": "ي",
    "p": "پ",
    "v": "ڤ",
    "x": "خ",
    "c": "چ",

    // Hamzas + extended
    "'": "ء"
};

/* -------------------------------------------------------
   BLOCK ALL ENGLISH LETTERS AND CONVERT TO ARABIC
   ------------------------------------------------------- */

editor.addEventListener("keydown", function (e) {
    const key = e.key;

    // Allow CTRL shortcuts: copy, cut, paste, select all
    if (e.ctrlKey) return;

    // Detect English letters or transliteration symbols
    if (/^[a-zA-Z0-9\-\+\'\"]$/.test(key)) {
        e.preventDefault(); // BLOCK English

        const last3 = editor.value.slice(-3) + key;
        const last2 = editor.value.slice(-2) + key;
        const last1 = key;

        let arabic =
            map[last3] ||
            map[last2] ||
            map[last1];

        if (arabic) insert(arabic);
    }
});


/* -------------------------------------------------------
   INSERT FUNCTION
   ------------------------------------------------------- */
function insert(char) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const txt = editor.value;

    // Insert normally
    editor.value = txt.slice(0, start) + char + txt.slice(end);

    // Fix cursor disappearing on combining Arabic marks:
    // We briefly reset focus and selection AFTER value update.
    setTimeout(() => {
        editor.focus();
        editor.selectionStart = editor.selectionEnd = start + char.length;

        // Force RTL cursor behavior
        editor.style.direction = "rtl";
        editor.style.textAlign = "right";
    }, 1);
}



/* -------------------------------------------------------
   BUTTONS FOR DIACRITICS, LETTERS, KEYBOARD
   ------------------------------------------------------- */
document.querySelectorAll(".insert").forEach(btn => {
    btn.onclick = () => insert(btn.dataset.char);
});

/* -------------------------------------------------------
   VIRTUAL ARABIC KEYBOARD
   ------------------------------------------------------- */

const arabicKeys = "ض ص ث ق ف غ ع ه خ ح ج د ش س ي ب ل ا ت ن م ك ط ئ ؤ ر لا ى ة و ز ظ".split(" ");
const keyboard = document.getElementById("keyboard");

arabicKeys.forEach(k => {
    let b = document.createElement("button");
    b.className = "key";
    b.textContent = k;
    b.onclick = () => insert(k);
    keyboard.appendChild(b);
});

/* -------------------------------------------------------
   COPY / CLEAR / DOWNLOAD TXT
   ------------------------------------------------------- */
document.getElementById("copyBtn").onclick = () => {
    navigator.clipboard.writeText(editor.value);
    alert("Copied!");
};
document.getElementById("clearBtn").onclick = () => editor.value = "";
document.getElementById("downloadTxt").onclick = () => {
    const blob = new Blob([editor.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "arabic-text.txt";
    a.click();
};

/* -------------------------------------------------------
   DARK MODE TOGGLE
   ------------------------------------------------------- */
document.getElementById("themeToggle").onclick = () =>
    document.body.classList.toggle("dark");
/* -------------------------------------------------------
   MOBILE FIX — Enable English → Arabic conversion on phones
   ------------------------------------------------------- */
editor.addEventListener("input", function () {

    // Detect last characters typed
    let text = editor.value;

    // Apply transliteration rules exactly like the desktop version
    for (const key in map) {
        const regex = new RegExp(key.replace("+", "\\+"), "g");
        text = text.replace(regex, map[key]);
    }

    // Update text without breaking cursor
    const pos = editor.selectionStart;
    editor.value = text;
    editor.selectionStart = editor.selectionEnd = pos;
});

